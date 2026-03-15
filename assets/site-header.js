/* ===== Global Two-Line Header (site-wide) ===== */
(function(){
  const TAGLINE_TEXT = "Write‑in • Floridians First • For Florida Families & Future • Fix the Incentives";
  const NAV_LINKS = [
    { label: "Home", href: "/index.html" },
    { label: "Platform", href: "/pages/platform.html" }
    // Add more nav items as needed
  ];
  const LANG_ITEMS = [
    { type:"gt", label:"Translate this page (Google Translate)…" },
    { type:"sep" },
    { type:"link", label:"English", path:"/pages/how-to-write-in-en.html" },
    { type:"link", label:"Español", path:"/pages/how-to-write-in-es.html" },
    { type:"link", label:"Kreyòl Ayisyen", path:"/pages/how-to-write-in-ht.html" },
    { type:"link", label:"中文", path:"/pages/how-to-write-in-zh.html" },
    { type:"link", label:"Tiếng Việt", path:"/pages/how-to-write-in-vi.html" },
    { type:"link", label:"한국어", path:"/pages/how-to-write-in-ko.html" }
  ];

  function el(tag, attrs={}, html){ const e=document.createElement(tag); for(const k in attrs){ if(k==="class") e.className=attrs[k]; else e.setAttribute(k, attrs[k]); } if(html!=null) e.innerHTML=html; return e; }

  function ensureStyles(){
    if(!document.querySelector('link[href$="/assets/site-header.css"]')){
      const link = el('link',{rel:'stylesheet',href:'/assets/site-header.css'});
      if(document.head){ document.head.appendChild(link); }
      else { document.body.prepend(link); }
    }
  }

  function buildNav(){
    const nav = el('nav',{class:'site-header__nav', 'aria-label':'Primary'});
    NAV_LINKS.forEach(({label,href})=>{ const a=el('a',{href},label); nav.appendChild(a); });
    return nav;
  }

  function buildLang(){
    const wrap = el('div',{class:'site-header__lang'});
    const label = el('span',{class:'site-header__lang-label'},'Languages');
    const sel = el('select',{class:'site-header__lang-select','aria-label':'Languages'});
    const ph = el('option', {value:"", selected:true, hidden:true}, 'Languages'); // white text on control
    sel.appendChild(ph);
    const gt = el('option',{value:'__gt__'}, LANG_ITEMS[0].label); sel.appendChild(gt);
    const sep = el('option',{},'──────────────'); sep.disabled=true; sel.appendChild(sep);
    LANG_ITEMS.filter(i=>i.type==='link').forEach(i=>{ sel.appendChild(el('option',{value:i.path}, i.label)); });
    sel.addEventListener('change', e => {
      const v = e.target.value; if(!v) return;
      if(v==='__gt__'){ openGT(); sel.value=''; return; }
      location.href = v;
    });
    wrap.append(label, sel);
    return wrap;
  }

  function loadGTScript(cb){
    if(window.google && window.google.translate){ cb(); return; }
    const s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    window.googleTranslateElementInit = function(){ cb(); };
    document.body.appendChild(s);
  }

  function openGT(){
    let modal = document.getElementById('gt-modal');
    if(!modal){
      modal = el('div',{id:'gt-modal'});
      const box = el('div',{class:'gt-box'});
      const head = el('div',{class:'gt-head'});
      head.appendChild(el('div',{class:'gt-title'},'Translate this page'));
      const close = el('button',{class:'gt-close','aria-label':'Close'},'×');
      close.addEventListener('click',()=> modal.style.display='none');
      head.appendChild(close);
      const body = el('div',{id:'google_translate_element'});
      box.append(head, body);
      modal.appendChild(box);
      document.body.appendChild(modal);
    }
    modal.style.display='flex';
    loadGTScript(function(){
      if(!modal.dataset.ready){
        try { new window.google.translate.TranslateElement({pageLanguage:'en'}, 'google_translate_element'); } catch(e){}
        modal.dataset.ready='1';
      }
    });
  }

  function buildHeader(){
    ensureStyles();
    const h = el('header',{class:'site-header'});
    const inner = el('div',{class:'site-header__inner'});
    const tagline = el('div',{class:'site-header__tagline'}); tagline.textContent = TAGLINE_TEXT;
    const images = el('div',{class:'site-header__images'});
    const img1 = el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''});
    const img2 = el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'});
    img1.onerror=()=>{img1.style.display='none'}; img2.onerror=()=>{img2.style.display='none'};
    images.append(img1,img2);
    const lang = buildLang();
    const nav = buildNav();
    inner.append(tagline, images, lang, nav);
    h.appendChild(inner);
    const b=document.body; if(b.firstChild){b.insertBefore(h,b.firstChild)} else {b.appendChild(h)}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', buildHeader); else buildHeader();
})();
