
(function(){
  const BRAND_TEXT='Erik Morris 2026';
  const TAGLINE='Write\u2011in \u2022 Floridians First \u2022 For Florida Families & Future \u2022 Fix the Incentives';
  const NAV=[{label:'Home',href:'/index.html'},{label:'Platform',href:'/pages/platform.html'},{label:'Voting a Write-In Candidate',href:'/pages/how-to-write-in.html'}];
  function el(t,a={},h){const e=document.createElement(t);for(const k in a){k==='class'?e.className=a[k]:e.setAttribute(k,a[k])}if(h!=null)e.innerHTML=h;return e;}
  function root(){return location.pathname.startsWith('/pages/')?'..':'.';}
  function loadGT(cb){ if(window.google&&window.google.translate){cb();return;} const s=el('script',{src:'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'}); window.googleTranslateElementInit=function(){try{cb();}catch(e){}}; document.body.appendChild(s); }
  function initGT(){ try{ new window.google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'es,ht,zh-CN,vi,ko,pt',layout:google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element'); }catch(e){} }
  /* Fixed Pos Language button */
  /* function positionMenu(){ try{var hdr=document.querySelector('.site-header');var menu=document.querySelector('.site-header__menu');if(!hdr||!menu)return;var r=hdr.getBoundingClientRect();menu.style.top=Math.max(56,r.bottom+8)+'px';}catch(e){} }*/
  function positionMenu(){
  const menu = document.querySelector('.site-header__menu');
  if (!menu) return;

  // Only compute a viewport-based position if the menu is fixed.
  if (getComputedStyle(menu).position === 'fixed') {
    const hdr = document.querySelector('.site-header');
    const r = hdr?.getBoundingClientRect();
    if (r) menu.style.top = Math.max(56, r.bottom + 8) + 'px';
  } else {
    // Absolute mode: let CSS handle it
    menu.style.top = '';
  }
}
  function build(){
    if(!document.querySelector('link[href*="/assets/site-header.css"]')){ (document.head||document.body).appendChild(el('link',{rel:'stylesheet',href:'/assets/site-header.css?v=3'})); }
    let anchor=document.getElementById('site-header'); if(!anchor){anchor=el('div',{id:'site-header'});document.body.insertBefore(anchor,document.body.firstChild);} 
    const H=el('header',{class:'site-header'}); const inner=el('div',{class:'site-header__inner'});
    const brand=el('div',{class:'site-header__brandline'});brand.append(el('span',{class:'site-header__brand'},BRAND_TEXT)); const tg=el('span',{class:'site-header__tagline'}); tg.textContent=TAGLINE; brand.append(tg);
    const imgs=el('div',{class:'site-header__images'}); const i1=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''}); const i2=el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'}); i1.onerror=()=>i1.style.display='none'; i2.onerror=()=>i2.style.display='none'; imgs.append(i1,i2);
    const lang=el('div',{class:'site-header__lang'}); const btn=el('button',{class:'site-header__btn',id:'langBtn','aria-expanded':'false','aria-haspopup':'true'},'Languages'); const menu=el('div',{class:'site-header__menu','aria-hidden':'true',role:'menu','aria-label':'Languages'});
    menu.append(el('div',{class:'menu-label'},'Translate this page')); const gt=el('div',{id:'google_translate_element'}); menu.append(gt);
    const grp=el('div',{class:'menu-group'}); grp.append(el('div',{class:'menu-label'},'Visit localized landing'));
    const list=el('ul',{class:'menu-list'}); const rt=root();
    [ ['Español',rt+'/index-es.html'], ['Kreyòl Ayisyen',rt+'/index-ht.html'], ['中文（简体）',rt+'/index-zh.html'], ['Tiếng Việt',rt+'/index-vi.html'], ['한국어',rt+'/index-ko.html'], ['Português',rt+'/index-pt.html'] ]
      .forEach(([label,href])=> list.appendChild(el('li',{},`<a href="${href}">${label}</a>`)) );
    grp.append(list); menu.append(grp); lang.append(btn,menu);
    btn.addEventListener('click',()=>{ const open=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded', String(!open)); menu.setAttribute('aria-hidden', String(open)); if(!open){ loadGT(initGT); setTimeout(positionMenu,0);} });
    document.addEventListener('click',(e)=>{ if(!lang.contains(e.target)){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    window.addEventListener('resize', positionMenu);
    const nav=el('nav',{class:'site-header__bottom site-header__nav','aria-label':'Primary'}); NAV.forEach(({label,href})=> nav.appendChild(el('a',{href},label)) );
    inner.append(brand,imgs,lang,nav); H.appendChild(inner); anchor.replaceWith(H); positionMenu();
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',build);} else { build(); }
})();
