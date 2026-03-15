
/* ===== Global Two-Line Header Injector (brand left, images 2-row span, languages right) ===== */
(function(){
  const BRAND_TEXT = 'Erik Morris 2026';
  const TAGLINE_TEXT = 'Write\u2011in \u2022 Floridians First \u2022 For Florida Families & Future \u2022 Fix the Incentives';
  const NAV_LINKS = [
    { label: 'Home', href: '/index.html' },
    { label: 'Platform', href: '/pages/platform.html' },
    { label: 'Voting a Write-In Candidate', href: '/pages/how-to-write-in.html' }
  ];
  const LANG_MENU = [
    { type:'gt', label:'Translate this page (Google Translate)…' },
    { type:'sep' },
    { type:'link', label:'English', path:'/pages/how-to-write-in-en.html' },
    { type:'link', label:'Español', path:'/pages/how-to-write-in-es.html' },
    { type:'link', label:'Kreyòl Ayisyen', path:'/pages/how-to-write-in-ht.html' },
    { type:'link', label:'中文', path:'/pages/how-to-write-in-zh.html' },
    { type:'link', label:'Tiếng Việt', path:'/pages/how-to-write-in-vi.html' },
    { type:'link', label:'한국어', path:'/pages/how-to-write-in-ko.html' }
  ];

  function el(t,a={},h){const e=document.createElement(t);for(const k in a){k==='class'?e.className=a[k]:e.setAttribute(k,a[k])}if(h!=null)e.innerHTML=h;return e;}
  function ensureStyles(){ if(!document.querySelector('link[href$="/assets/site-header.css"]')){ (document.head||document.body).appendChild(el('link',{rel:'stylesheet',href:'/assets/site-header.css'})); } }
  function loadGT(cb){ if(window.google && window.google.translate){cb();return;} const s=el('script',{src:'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'}); window.googleTranslateElementInit=function(){cb();}; document.body.appendChild(s); }
  function openGT(){ let modal=document.getElementById('gt-modal'); if(!modal){ modal=el('div',{id:'gt-modal',style:'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:9999'}); const box=el('div',{style:'background:#0b1b2b;color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.35);width:min(640px,92vw);padding:16px'}); const head=el('div',{style:'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px'}); head.append(el('div',{style:'font-weight:800'},'Translate this page')); const close=el('button',{style:'background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer','aria-label':'Close'},'\u00d7'); close.addEventListener('click',()=>modal.remove()); head.append(close); const body=el('div',{id:'google_translate_element',style:'background:#0f243a;border:1px solid #3a516b;border-radius:8px;padding:10px'}); box.append(head,body); modal.appendChild(box); document.body.appendChild(modal);} loadGT(function(){ if(!openGT._ready){ try{ new window.google.translate.TranslateElement({pageLanguage:'en'}, 'google_translate_element'); }catch(e){} openGT._ready=true; } }); }

  function build(){
    ensureStyles(); const anchor = document.getElementById('site-header'); if(!anchor) return;
    const H=el('header',{class:'site-header'}); const inner=el('div',{class:'site-header__inner'});

    // Top-left: Brand + tagline
    const brandline=el('div',{class:'site-header__brandline'});
    const brand=el('span',{class:'site-header__brand'}, BRAND_TEXT);
    const tagline=el('span',{class:'site-header__tagline'}); tagline.textContent=TAGLINE_TEXT;
    brandline.append(brand, tagline);

    // Middle: images spanning both rows, aligned top & bottom via stretch
    const images=el('div',{class:'site-header__images'});
    const img1=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''});
    const img2=el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'});
    img1.onerror=()=>img1.style.display='none'; img2.onerror=()=>img2.style.display='none'; images.append(img1,img2);

    // Top-right: Languages select
    const langWrap=el('div',{class:'site-header__lang'});
    const sel=el('select',{class:'site-header__lang-select','aria-label':'Languages'});
    sel.appendChild(el('option',{value:'',selected:true,hidden:true},'Languages'));
    LANG_MENU.forEach(i=>{ if(i.type==='sep'){ const o=el('option',{},'────────────'); o.disabled=true; sel.appendChild(o);} else if(i.type==='gt'){ sel.appendChild(el('option',{value:'__gt__'}, i.label)); } else { sel.appendChild(el('option',{value:i.path}, i.label)); } });
    sel.addEventListener('change',e=>{ const v=e.target.value; if(!v) return; if(v==='__gt__'){ openGT(); sel.value=''; return; } location.href=v; });
    langWrap.appendChild(sel);

    // Bottom: nav
    const nav=el('nav',{class:'site-header__bottom site-header__nav','aria-label':'Primary'});
    NAV_LINKS.forEach(({label,href})=> nav.appendChild(el('a',{href},label)) );

    inner.append(brandline, images, langWrap, nav); H.appendChild(inner); anchor.replaceWith(H);
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded', build);} else { build(); }
})();
