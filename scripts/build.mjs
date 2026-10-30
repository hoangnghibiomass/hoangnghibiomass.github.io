import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
await fs.mkdir('_site',{recursive:true});
for(const name of ['company.css','company.js','news.json','.nojekyll'])await fs.copyFile(name,'_site/'+name);
const data=JSON.parse(await fs.readFile('news.json','utf8'));
if(data.links.length!==5||new Set(data.links.map(x=>x.source)).size!==5)throw Error('Five distinct news sources required');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const newsTopics={"nang-luong-viet-nam": "Điện sinh khối & năng lượng", "bao-cong-thuong": "Thị trường & sản xuất", "bao-chinh-phu": "Sinh khối & nông nghiệp", "tuoi-tre": "Đời sống & môi trường", "vietnamplus": "Kinh tế xanh & phát triển", "thanh-nien": "Môi trường & cộng đồng", "bao-dau-tu": "Đầu tư & doanh nghiệp", "vnexpress": "Thị trường & công nghệ", "vov": "Nông nghiệp & môi trường", "bo-cong-thuong": "Chính sách & năng lượng"};
const cards=data.links.map(x=>`<article data-news-source="${escape(x.source)}"><a class="source-home article-image" href="${escape(x.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(x.title)}">${x.imageUrl?`<img src="${escape(x.imageUrl)}" width="1200" height="630" alt="${escape(x.title)}" referrerpolicy="no-referrer" loading="lazy">`:''}</a><div class="source-meta"><h3><a href="${escape(x.url)}" target="_blank" rel="noopener noreferrer">${escape(x.name)}</a></h3><p class="source-topic">${escape(newsTopics[x.source]||'Sinh khối & nguyên liệu')}</p><a class="source-headline" href="${escape(x.url)}" target="_blank" rel="noopener noreferrer">${escape(x.title)}</a><a class="more source-read" href="${escape(x.url)}" target="_blank" rel="noopener noreferrer"><span class="plus">+</span><span>Đọc tại trang gốc ↗</span></a></div></article>`).join('');
let html=await fs.readFile('index.html','utf8');
html=html.replace(/(<section[^>]*id="tin-tuc"[\s\S]*?<div class="news-grid"[^>]*>)[\s\S]*?(<\/div><\/div><\/section>)/,(_,start,end)=>start+cards+end);
if((html.match(/data-news-source=/g)||[]).length!==5)throw Error('News layout not rendered');
for(const asset of ['company.js','company.css']){const hash=createHash('sha256').update(await fs.readFile(asset)).digest('hex').slice(0,12);html=html.replaceAll(asset+'"',asset+'?v='+hash+'"');}
await fs.writeFile('_site/index.html',html);
await fs.cp('assets','_site/assets',{recursive:true});
console.log('Static site ready in _site with five news cards');
