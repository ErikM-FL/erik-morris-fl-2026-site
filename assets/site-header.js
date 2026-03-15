
(function(){
  const BRAND_TEXT = 'Erik Morris 2026';
  const TAGLINE_TEXT = 'Write‑in • Floridians First • For Florida Families & Future • Fix the Incentives';
  const NAV_LINKS = [
    { label: 'Home', href: '/index.html' },
    { label: 'Platform', href: '/pages/platform.html' },
    { label: 'Voting a Write-In Candidate', href: '/pages/how-to-write-in.html' }
  ];
  function el(t,a={},h){const e=document.createElement(t);for(const k in a){k==='class'?e.className=a[k]:e.setAttribute(k,a[k])}if(h!=null)e.innerHTML=h;return e;}
  function ensureStyles(){ if(!document.querySelector('link[href*="/assets/site-header.css"]')){ (document.head||document.body).appendChild(el('link',{rel:'stylesheet',href:'/assets/site-header.css?v=final'})); } }
  function rootPrefix(){ return location.pathname.startsWith('/pages/') ? '..' : '.'; }
  function loadGT(cb){ if(window.google && window.google.translate){cb();return;} const s=el('script',{src:'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'}); window.googleTranslateElementInit=function(){ try{ cb(); }catch(e){} }; document.body.appendChild(s); }
  function initGT(){ try{ new window.google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'es,ht,zh-CN,vi,ko,pt',layout:google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element'); }catch(e){} }
  function positionMenu(){ try{ var hdr=document.querySelector('.site-header'); var menu=document.querySelector('.site-header__menu'); if(!hdr||!menu) return; var r=hdr.getBoundingClientRect(); var top=Math.max(56, r.bottom+8); menu.style.top = top + 'px'; }catch(e){} }
  function build(){
    ensureStyles();
    let anchor=document.getElementById('site-header'); if(!anchor){ anchor=document.createElement('div'); anchor.id='site-header'; document.body.insertBefore(anchor, document.body.firstChild); }
    const H=el('header',{class:'site-header'}); const inner=el('div',{class:'site-header__inner'});
    const brandline=el('div',{class:'site-header__brandline'}); brandline.append(el('span',{class:'site-header__brand'}, BRAND_TEXT)); const tg=el('span',{class:'site-header__tagline'}); tg.textContent=TAGLINE_TEXT; brandline.append(tg);
    const images=el('div',{class:'site-header__images'}); const img1=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''}); const img2=el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'}); img1.onerror=()=>img1.style.display='none'; img2.onerror=()=>img2.style.display='none'; images.append(img1,img2);
    const lang=el('div',{class:'site-header__lang'}); const btn=el('button',{class:'site-header__btn',id:'langBtn','aria-expanded':'false','aria-haspopup':'true'},'Languages'); const menu=el('div',{class:'site-header__menu','aria-hidden':'true',role:'menu','aria-label':'Languages'});
    menu.append(el('div',{class:'menu-label'},'Translate this page')); const gtHost=el('div',{id:'google_translate_element'}); menu.append(gtHost);
    const grp=el('div',{class:'menu-group'}); grp.append(el('div',{class:'menu-label'},'Visit localized landing')); const list=el('ul',{class:'menu-list'}); const root=rootPrefix();
    [ {label:'Español',href:root+'/index-es.html'}, {label:'Kreyòl Ayisyen',href:root+'/index-ht.html'}, {label:'中文（简体）',href:root+'/index-zh.html'}, {label:'Tiếng Việt',href:root+'/index-vi.html'}, {label:'한국어',href:root+'/index-ko.html'}, {label:'Português',href:root+'/index-pt.html'} ]
      .forEach(i=> list.appendChild(el('li',{}, `<a href="${i.href}">${i.label}</a>`)) ); grp.append(list); menu.append(grp); lang.append(btn,menu);
    btn.addEventListener('click',()=>{ const open=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded', String(!open)); menu.setAttribute('aria-hidden', String(open)); if(!open){ loadGT(initGT); setTimeout(positionMenu,0); } });
    document.addEventListener('click',(e)=>{ if(!lang.contains(e.target)){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    window.addEventListener('resize', positionMenu);
    const nav=el('nav',{class:'site-header__bottom site-header__nav','aria-label':'Primary'}); NAV_LINKS.forEach(({label,href})=> nav.appendChild(el('a',{href},label)) );
    inner.append(brandline, images, lang, nav); H.appendChild(inner); anchor.replaceWith(H); positionMenu();
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded', build);} else { build(); }
})();
