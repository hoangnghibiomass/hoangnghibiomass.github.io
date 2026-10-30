import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export const SOURCES = [
    { id: 'nang-luong-viet-nam', name: 'Năng lượng Việt Nam', url: 'https://nangluongvietnam.vn/tag/dien-sinh-khoi-629.tag', host: 'nangluongvietnam.vn' },
    { id: 'bao-cong-thuong', name: 'Báo Công Thương', url: 'https://congthuong.vn/chu-de/dien-sinh-khoi.topic', host: 'congthuong.vn' },
    { id: 'bao-chinh-phu', name: 'Báo Điện tử Chính phủ', url: 'https://baochinhphu.vn/tim-kiem.htm?keywords=sinh%20kh%E1%BB%91i', host: 'baochinhphu.vn' },
    { id: 'tuoi-tre', name: 'Tuổi Trẻ', url: 'https://tuoitre.vn/sinh-khoi.html', host: 'tuoitre.vn' },
    { id: 'vietnamplus', name: 'VietnamPlus', url: 'https://www.vietnamplus.vn/tag/nang-luong-sinh-khoi-tag112721.vnp', host: 'vietnamplus.vn' },
    { id: 'thanh-nien', name: 'Thanh Niên', url: 'https://thanhnien.vn/sinh-khoi.html', host: 'thanhnien.vn' },
    { id: 'bao-dau-tu', name: 'Báo Đầu tư', url: 'https://baodautu.vn/tag/dien-sinh-khoi/', host: 'baodautu.vn' },
    { id: 'vnexpress', name: 'VnExpress', url: 'https://vnexpress.net/rss/kinh-doanh.rss', host: 'vnexpress.net', seed: 'https://vnexpress.net/co-hoi-cho-vien-nen-sinh-khoi-tai-thi-truong-viet-nam-4628104.html' },
    { id: 'vov', name: 'VOV', url: 'https://vov.vn/kinh-te', host: 'vov.vn', seed: 'https://vov.vn/kinh-te/quan-ly-rom-ra-huong-toi-nong-nghiep-xanh-o-dbscl-post1249558.vov' },
    { id: 'bo-cong-thuong', name: 'Bộ Công Thương', url: 'https://moit.gov.vn/tin-tuc/phat-trien-nang-luong', host: 'moit.gov.vn', seed: 'https://moit.gov.vn/tin-tuc/phat-trien-nang-luong/chia-se-kinh-nghiem-phat-trien-du-an-dien-sinh-khoi-tai-viet-nam.html' }
];
function text(value) { return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/\s+/g, ' ').trim().slice(0, 240); }
function sameSource(url, host) { try {
    const u = new URL(url);
    return u.protocol === 'https:' && (u.hostname === host || u.hostname.endsWith('.' + host));
}
catch {
    return false;
} }
export function relevant(title) { return /sinh khối|viên nén|vỏ trấu|rơm rạ|gỗ băm|củi băm|dăm gỗ|gỗ dăm|biomass/i.test(title) && !/tuyển sinh|thí sinh|ngô sinh khối|nấm thượng hoàng|probiotic|vi khuẩn/i.test(title); }
export function extractLinks(body, source) {
    const links = new Map();
    // RSS and HTML listing pages are both supported.
    for (const m of body.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
        const title=text(m[1].match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
        const url=text(m[1].match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]||'');
        if(relevant(title)&&sameSource(url,source.host)) links.set(url,{title,url});
    }
    for (const m of body.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
        try {
            const u=new URL(m[1].replace(/&amp;/g,'&'),source.url);
            if(!/\.(?:html?|vov|vnp)$/.test(u.pathname)||!sameSource(u.href,source.host)) continue;
            const title=text(m[2])||text(m[0].match(/title=["']([^"']+)["']/i)?.[1]||'');
            if(title.length<18||!relevant(title)) continue;
            u.hash='';u.search='';
            links.set(u.href,{title,url:u.href});
        } catch {}
    }
    return [...links.values()].slice(0,4);
}
export function extractLink(body,source){return extractLinks(body,source)[0]||null;}
async function readPage(url, host) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
        const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'text/html', 'User-Agent': 'HoangNghiBiomass-LinkMonitor/1.0' } });
        if (!response.ok || !sameSource(response.url, host))
            throw Error('Source unavailable');
        const reader = response.body?.getReader();
        if (!reader)
            throw Error('Empty source');
        const decoder = new TextDecoder();
        let body = '', size = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            size += value.byteLength;
            if (size > 1500000) {
                await reader.cancel();
                throw Error('Source exceeds limit');
            }
            body += decoder.decode(value, { stream: true });
        }
        return body + decoder.decode();
    }
    finally {
        clearTimeout(timer);
    }
}
export function extractMetadata(body) {
    let imageUrl = null, publishedAt = null;
    for (const m of body.matchAll(/<meta\b[^>]*>/gi)) {
        const tag = m[0], key = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1], value = tag.match(/content=["']([^"']*)["']/i)?.[1];
        if (!value)
            continue;
        if (key === 'og:image') {
            try {
                const u = new URL(value.replace(/&amp;/g, '&'));
                if (u.protocol === 'https:')
                    imageUrl = u.href;
            }
            catch { }
        }
        if (['article:published_time','pubdate','pubdate','date','publishdate'].includes(key?.toLowerCase()) && !Number.isNaN(Date.parse(value)) && Date.parse(value) <= Date.now())
            publishedAt = new Date(value).toISOString();
    }
    if(!publishedAt){
        const raw=body.match(/"datePublished"\s*:\s*"([^"<>]+)"/i)?.[1];
        if(raw&&!Number.isNaN(Date.parse(raw))&&Date.parse(raw)<=Date.now())publishedAt=new Date(raw).toISOString();
    }
    return { imageUrl, publishedAt };
}
export function selectLinks(items, limit=5) {
    const ranked=[...items].filter(x=>x?.url&&relevant(x.title)).sort((a,b)=>
        (Date.parse(b.publishedAt||b.discoveredAt)||0)-(Date.parse(a.publishedAt||a.discoveredAt)||0)
        ||a.source.localeCompare(b.source));
    const sources=new Set(),titles=new Set();
    return ranked.filter(x=>{const title=x.title.normalize('NFC').toLowerCase();if(sources.has(x.source)||titles.has(title))return false;sources.add(x.source);titles.add(title);return true;}).slice(0,limit);
}
export async function updateNews(){
    const file=new URL('../news.json',import.meta.url);
    const prior=JSON.parse(await fs.readFile(file,'utf8'));
    const cached=prior.candidates||prior.links||[];
    const now=new Date().toISOString();
    const results=await Promise.all(SOURCES.map(async source=>{
        const old=cached.filter(x=>x.source===source.id);
        let listingOk=false,links=[];
        try{links=extractLinks(await readPage(source.url,source.host),source);listingOk=true;}catch{}
        if(!links.length&&source.seed)links=[{url:source.seed,title:''}];
        const fetched=await Promise.all(links.map(async link=>{
            try{
                const body=await readPage(link.url,source.host),meta=extractMetadata(body);
                const title=link.title||text(body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
                if(!relevant(title))return null;
                const previous=old.find(x=>x.url===link.url);
                return {source:source.id,name:source.name,title,url:link.url,...meta,
                    discoveredAt:previous?.discoveredAt||meta.publishedAt||'2000-01-01T00:00:00.000Z',checkedAt:now};
            }catch{return null;}
        }));
        const merged=new Map(old.map(x=>[x.url,x]));for(const x of fetched.filter(Boolean))merged.set(x.url,x);
        const candidates=selectLinks([...merged.values()].map(x=>({...x,source:x.url})),4).map(x=>({...x,source:source.id}));
        return {candidates,check:{id:source.id,name:source.name,url:source.url,host:source.host,attemptedAt:now,status:listingOk?'ok':'source_unavailable',found:fetched.filter(Boolean).length}};
    }));
    const candidates=results.flatMap(x=>x.candidates),links=selectLinks(candidates);
    if(links.length!==5)throw Error('Need five valid articles from distinct sources; preserving prior news file');
    await fs.writeFile(file,JSON.stringify({timezone:'Asia/Ho_Chi_Minh',policy:'links_only',checkedAt:now,sources:results.map(x=>x.check),candidates,links},null,2)+'\n');
    console.log(JSON.stringify({checked:results.length,selected:links.map(x=>x.name),sources:results.map(x=>x.check)}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await updateNews();
