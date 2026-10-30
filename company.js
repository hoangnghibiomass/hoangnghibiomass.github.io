'use strict';
const $=selector=>document.querySelector(selector);
const menu=$('#menu-toggle'),navigation=$('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Đóng menu':'Mở menu');navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Mở menu');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');}});
$('#year').textContent=new Date().getFullYear();
const slides=[
 {title:'Trấu rời — nguồn nguyên liệu sinh khối',text:'Chúng tôi kết nối nguồn trấu rời từ các nhà máy xay xát và đơn vị cung ứng. Cùng trao đổi sản lượng, chất lượng thực tế và điều kiện thu mua phù hợp với từng nguồn hàng.',image:'assets/rice-husk-real.webp'},
 {title:'Trấu viên — nhiên liệu sinh khối từ vỏ trấu',text:'Được ép từ phụ phẩm vỏ trấu sau xay xát, trấu viên là một dạng nguyên liệu sử dụng cho nhu cầu nhiên liệu sinh khối. Chúng tôi thu mua và kết nối nguồn trấu viên tại các tỉnh miền Tây.',image:'assets/rice-pellets-alt.webp'},
 {title:'Gỗ băm & củi băm — nguồn nhiên liệu cho sản xuất',text:'Chúng tôi thu mua gỗ băm, củi băm từ các cơ sở chế biến gỗ và đơn vị cung ứng tại miền Tây. Liên hệ để trao đổi lượng hàng, giá thu mua và lịch giao nhận.',image:'assets/wood-chips.webp'},
 {title:'Rơm rạ — giá trị từ phụ phẩm mùa gặt',text:'Rơm sau thu hoạch lúa có thể được thu gom, phơi khô và cuộn để phục vụ trồng nấm, che phủ gốc, ủ phân hoặc làm nguyên liệu sinh khối. Chúng tôi thu mua và kết nối nguồn rơm rạ tại các tỉnh miền Tây.',image:'assets/rice-straw-banner-ai.webp'}
];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const imageCache=new Map();
function readyImage(src){if(!imageCache.has(src)){const img=new Image();img.src=src;imageCache.set(src,img.decode().catch(()=>{}));}return imageCache.get(src);}
function enterAnimation(element,distance=20){element.getAnimations().forEach(a=>a.cancel());if(!reducedMotion.matches)return;element.animate([{opacity:0,transform:'translateY('+distance+'px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)'});}
slides.forEach(item=>readyImage(item.image));
let current=0,paused=reducedMotion.matches,heroRequest=0;
const slideButtons=[...document.querySelectorAll('[data-slide]')];
let frontImage=$('.hero-image');const backImage=frontImage.cloneNode();backImage.style.opacity='0';frontImage.after(backImage);let heroLayers=[frontImage,backImage];
async function showSlide(index){const next=(index+slides.length)%slides.length;if(next===current)return;current=next;const request=++heroRequest;const item=slides[current];slideButtons.forEach((button,i)=>{button.classList.toggle('active',i===current);button.setAttribute('aria-pressed',String(i===current));});await readyImage(item.image);if(request!==heroRequest)return;const old=heroLayers[0],incoming=heroLayers[1];heroLayers.forEach(layer=>layer.getAnimations().forEach(a=>a.cancel()));old.style.opacity='1';incoming.style.backgroundImage="url('"+item.image+"')";incoming.style.opacity='0';incoming.style.zIndex='-2';old.style.zIndex='-3';$('#slide-title').textContent=item.title;$('#slide-copy').textContent=item.text;enterAnimation($('.hero-content'),25);if(reducedMotion.matches){incoming.style.opacity='1';old.style.opacity='0';}else{incoming.animate([{opacity:0,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:1000,easing:'ease-out'});incoming.style.opacity='1';old.animate([{opacity:1},{opacity:0}],{duration:1000,easing:'ease-out'});old.style.opacity='0';}heroLayers=[incoming,old];}
const materialCredits={0:{name:'Thuận Hải',url:'https://thuanhai.com.vn/san-pham-giai-phap/nhien-lieu/biomass-sinh-khoi.html'},1:{name:'Anh Minh',url:'https://anhminhtech.com/vien-nen-trau'},4:{name:'Môi trường và Cuộc sống',url:'https://moitruong.net.vn/hieu-qua-tu-mo-hinh-cuon-rom-sau-thu-hoach-gop-phan-bao-ve-moi-truong-5624.html'}};
function reflectPause(){$('.pause').textContent=paused?'▷':'Ⅱ';$('.pause').setAttribute('aria-pressed',String(paused));$('.pause').setAttribute('aria-label',paused?'Tiếp tục banner':'Tạm dừng banner');}
let heroTimer;function restartHero(){clearInterval(heroTimer);heroTimer=setInterval(()=>{if(!paused&&!document.hidden)showSlide(current+1);},6000);}
slideButtons.forEach((button,index)=>button.addEventListener('click',()=>{showSlide(index);restartHero();}));
$('.prev').addEventListener('click',()=>{showSlide(current-1);restartHero();});$('.next').addEventListener('click',()=>{showSlide(current+1);restartHero();});
$('.pause').addEventListener('click',()=>{paused=!paused;reflectPause();restartHero();});
$('.hero').addEventListener('focusin',event=>{if(event.target!==$('.pause')&&event.target.matches(':focus-visible')){paused=true;reflectPause();}});
restartHero();reflectPause();
const products=[
 {"title": "Trấu rời", "image": "assets/rice-husk-real.webp", "copy": ["Từ những hạt lúa sau xay xát, vỏ trấu trở thành nguồn nguyên liệu sinh khối quen thuộc của miền Tây. Trấu rời được thu gom trực tiếp từ các nhà máy xay xát, phù hợp với nhu cầu sử dụng nhiên liệu tại nhiều cơ sở sản xuất.", "Chúng tôi thu mua trấu rời từ nhà máy và đơn vị cung ứng, với nguồn hàng thường xuyên hoặc theo mùa vụ. Mỗi nguồn trấu được trao đổi dựa trên tình trạng thực tế để lựa chọn phương án phù hợp.", "Bạn có nguồn trấu cần bán? Hãy chia sẻ địa điểm, lượng hàng dự kiến và thời gian có hàng. Chúng tôi sẽ cùng bạn trao đổi việc thu mua, bốc xếp và giao nhận."]},
 {"title": "Trấu viên", "image": "assets/rice-pellets-alt.webp", "copy": ["Được ép từ vỏ trấu, trấu viên giúp nguồn phụ phẩm sau xay xát trở nên gọn hơn, thuận tiện cho việc lưu kho và vận chuyển. Đây là một lựa chọn nhiên liệu sinh khối cho các hệ thống đốt phù hợp.", "Chúng tôi thu mua trấu viên từ cơ sở sản xuất và đơn vị cung ứng tại các tỉnh miền Tây. Quy cách viên, độ khô và tình trạng nguyên liệu được cùng xem xét để phù hợp với nhu cầu sử dụng.", "Chỉ cần gửi hình ảnh thực tế, lượng hàng và địa điểm giao nhận, bạn có thể bắt đầu trao đổi với chúng tôi. Hai bên sẽ thống nhất phương án thu mua phù hợp trước khi thực hiện."]},
 {"title": "Gỗ băm", "image": "assets/wood-chips.webp", "copy": ["Gỗ băm là gỗ được băm thành dăm nhỏ, được sử dụng làm nguyên liệu sản xuất hoặc nhiên liệu cho các hệ thống lò phù hợp.", "Chúng tôi thu mua gỗ băm từ cơ sở chế biến gỗ và đơn vị cung ứng tại các tỉnh miền Tây. Giá thu mua được trao đổi theo loại gỗ, độ ẩm, chất lượng và khối lượng thực tế.", "Bạn có gỗ băm cần bán? Hãy gửi hình ảnh, địa điểm và lượng hàng dự kiến. Chúng tôi sẽ liên hệ để trao đổi giá và lịch giao nhận."]},
 {"title": "Củi băm", "image": "assets/chopped-firewood.webp", "copy": ["Củi băm là củi được băm nhỏ để sử dụng làm chất đốt cho các hệ thống lò phù hợp. Tùy nguồn củi, nguyên liệu có thể khác nhau về kích thước, độ khô và lượng vỏ.", "Chúng tôi thu mua củi băm từ các cơ sở sản xuất và đơn vị cung ứng tại miền Tây. Mỗi lô hàng được trao đổi theo chất lượng thực tế để thống nhất giá và cách giao nhận.", "Bạn chỉ cần gửi hình ảnh củi, địa điểm tập kết và khối lượng dự kiến. Chúng tôi sẽ cùng bạn sắp xếp phương án thu mua phù hợp."]},
 {"title": "Rơm rạ", "image": "assets/rice-straw-bales.webp", "copy": ["Sau mỗi mùa gặt, rơm rạ vẫn còn nhiều giá trị để tiếp tục sử dụng. Rơm được thu gom và làm khô có thể phục vụ trồng nấm, che phủ cây trồng, ủ phân hoặc làm nguyên liệu sinh khối tùy chất lượng và nhu cầu.", "Chúng tôi thu mua và kết nối nguồn rơm rạ tại các tỉnh miền Tây, từ rơm rời đến rơm cuộn. Việc thu gom theo mùa vụ được trao đổi dựa trên tình trạng nguyên liệu và điều kiện tại từng địa phương.", "Bà con và đơn vị thu gom có thể chia sẻ thời điểm thu hoạch, dạng rơm, lượng hàng và địa điểm tập kết. Chúng tôi sẵn sàng cùng bạn trao đổi để tìm cách thu mua, vận chuyển phù hợp."]},
];
const tabs=[...document.querySelectorAll('[data-product]')];
let activeProduct=0,productRequest=0,productsPaused=reducedMotion.matches,productsVisible=false,productTimer;
const productPanel=$('#product-panel');
const productControls=document.createElement('div');productControls.className='product-carousel-controls';productControls.innerHTML='<span>Tự động chuyển mỗi 6 giây</span><button type="button" id="products-pause" aria-pressed="false">Ⅱ Tạm dừng</button>';
$('.product-tabs').after(productControls);
function reflectProductPause(){$('#products-pause').setAttribute('aria-pressed',String(productsPaused));$('#products-pause').textContent=productsPaused?'▷ Tiếp tục':'Ⅱ Tạm dừng';}
function restartProducts(){clearInterval(productTimer);productTimer=setInterval(()=>{if(!productsPaused&&productsVisible&&!document.hidden)selectProduct((activeProduct+1)%tabs.length);},6000);}
async function selectProduct(index,focus=false){if(index===activeProduct){if(focus)tabs[index].focus();return;}activeProduct=index;const request=++productRequest,item=products[index];tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});if(focus){productsPaused=true;reflectProductPause();tabs[index].focus();}await readyImage(item.image);if(request!==productRequest)return;productPanel.getAnimations().forEach(a=>a.cancel());if(!reducedMotion.matches){const leave=productPanel.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-15px)'}],{duration:180,easing:'ease-in',fill:'forwards'});try{await leave.finished;}catch{}if(request!==productRequest)return;leave.cancel();}
productPanel.setAttribute('aria-labelledby',tabs[index].id);$('#product-image').src=item.image;$('#product-image').alt=(materialCredits[index]?'Ảnh tham khảo ':'Hình minh họa ')+item.title.toLowerCase();$('#product-title').textContent=item.title;$('#product-description').replaceChildren(...item.copy.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));if(!reducedMotion.matches)productPanel.animate([{opacity:0,transform:'translateX(22px)'},{opacity:1,transform:'translateX(0)'}],{duration:650,easing:'cubic-bezier(.22,.61,.36,1)'});}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>{selectProduct(index);restartProducts();});tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectProduct(next,true);restartProducts();});});
$('#products-pause').addEventListener('click',()=>{productsPaused=!productsPaused;reflectProductPause();restartProducts();});
new IntersectionObserver(entries=>{productsVisible=entries[0].isIntersecting;if(productsVisible)restartProducts();},{threshold:0.2}).observe(productPanel);
productPanel.addEventListener('focusin',()=>{productsPaused=true;reflectProductPause();});
document.querySelectorAll('[data-product-link]').forEach(link=>link.addEventListener('click',()=>{selectProduct(Number(link.dataset.productLink));restartProducts();}));
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){paused=true;productsPaused=true;reflectPause();reflectProductPause();heroLayers.forEach(layer=>layer.getAnimations().forEach(a=>a.cancel()));productPanel.getAnimations().forEach(a=>a.cancel());}});
reflectProductPause();restartProducts();products.forEach(item=>readyImage(item.image));
for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});}
const searchDialog=$('#search-dialog');const sections=[['Giới thiệu Hoàng Nghi Biomass','#gioi-thieu'],['Trấu rời, trấu viên, gỗ băm, củi băm và rơm rạ','#san-pham'],['Câu chuyện công ty','#cau-chuyen'],['Dịch vụ thu mua nguyên liệu','#san-pham'],['Tầm nhìn và định hướng','#dinh-huong'],['Kết nối nguồn hàng','#ket-noi-nguon-hang'],['Tin tức','#tin-tuc'],['Liên hệ hợp tác','#lien-he']];
function normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();}
function renderSearch(){const q=normalize($('#site-search').value.trim());const results=sections.filter(([text])=>normalize(text).includes(q));const container=$('#search-results');container.replaceChildren();for(const [text,href] of results){const link=document.createElement('a');link.textContent=text;link.href=href;link.addEventListener('click',()=>searchDialog.close());container.append(link);}if(!results.length){const p=document.createElement('p');p.textContent='Chưa có nội dung phù hợp. Bạn có thể tìm “trấu” hoặc “liên hệ”.';container.append(p);}}
$('.search-open').addEventListener('click',()=>{searchDialog.showModal();renderSearch();$('#site-search').focus();});$('#site-search').addEventListener('input',renderSearch);
// Only link metadata is loaded; article text stays on the original news websites.
const newsTopics={"nang-luong-viet-nam": "Điện sinh khối & năng lượng", "bao-cong-thuong": "Thị trường & sản xuất", "bao-chinh-phu": "Sinh khối & nông nghiệp", "tuoi-tre": "Đời sống & môi trường", "vietnamplus": "Kinh tế xanh & phát triển", "thanh-nien": "Môi trường & cộng đồng", "bao-dau-tu": "Đầu tư & doanh nghiệp", "vnexpress": "Thị trường & công nghệ", "vov": "Nông nghiệp & môi trường", "bo-cong-thuong": "Chính sách & năng lượng"};
async function loadNewsLinks(){
 try{
  const response=await fetch('./news.json',{cache:'no-store'});if(!response.ok)throw Error('News unavailable');
  const data=await response.json();if(!Array.isArray(data.links)||data.links.length!==5)return;
  const hosts=['nangluongvietnam.vn','congthuong.vn','baochinhphu.vn','tuoitre.vn','vietnamplus.vn','thanhnien.vn','baodautu.vn','vnexpress.net','vov.vn','moit.gov.vn'];
  const grid=document.querySelector('#tin-tuc .news-grid');const template=grid.querySelector('article');
  const fragment=document.createDocumentFragment();const used=new Set();
  for(const item of data.links){
   const url=new URL(item.url);if(url.protocol!=='https:'||!hosts.some(h=>url.hostname===h||url.hostname.endsWith('.'+h))||used.has(item.source))return;used.add(item.source);
   const card=template.cloneNode(true);card.dataset.newsSource=item.source;
   const title=String(item.title).slice(0,240);card.querySelector('.source-meta h3 a').textContent=String(item.name).slice(0,80);
   for(const link of card.querySelectorAll('a'))link.href=url.href;
   card.querySelector('.source-headline').textContent=title;
   card.querySelector('.source-home').setAttribute('aria-label',title);
   card.querySelector('.source-topic').textContent=newsTopics[item.source]||'Sinh khối & nguyên liệu';
   const img=card.querySelector('img');img.alt=title;img.hidden=true;
   if(item.imageUrl){const image=new URL(item.imageUrl);if(image.protocol==='https:'){img.src=image.href;img.hidden=false;img.referrerPolicy='no-referrer';img.onerror=()=>{img.hidden=true;};}}
   fragment.append(card);
  }
  grid.replaceChildren(fragment);
 }catch{/* Keep the five linked fallback cards when metadata is temporarily unavailable. */}
}
loadNewsLinks();
