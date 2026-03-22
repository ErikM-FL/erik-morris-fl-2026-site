
(function(){
  // ============ Header controller — v12 (based on v7 that worked) ============
  // • Solid COLOR background cycle (no visible gradient): blue→purple→red→purple→blue (125s)
  // • Languages (Google Translate) works and preloads lazily
  // • Adds “About Erik” to the nav
  // • On /pages/platform.html: injects carousel layout & button styles and initializes the slider

  const BRAND_TEXT='Erik Morris 2026';
  const TAGLINE='Write\u2011in \u2022 Floridians First \u2022 For Florida Families & Future \u2022 Fix the Incentives';
  const NAV=[
 {label:'Home',href:'/index.html'},
 {label:'Platform',href:'/pages/platform.html'},
 {label:'Voting a Write-In Candidate',href:'/pages/how-to-write-in.html'},
 {label:'About Erik',href:'/pages/about-erik.html'},
 {label:'Volunteer',href:'/pages/volunteer.html'},
 {label:'AMA',href:'/pages/ama.html'}
];

  function el(t,a={},h){const e=document.createElement(t);for(const k in a){k==='class'?e.className=a[k]:e.setAttribute(k,a[k])}if(h!=null)e.innerHTML=h;return e;}
  function ensureStyle(id, css){ if(document.getElementById(id)) return; const s=el('style',{id}); s.textContent=css; (document.head||document.body).appendChild(s); }
  function onReady(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn);} else { fn(); } }
  function isPlatform(){ return /\/pages\/platform\.html(?:$|[?#])/.test(location.pathname+location.search+location.hash); }

  // ---------- Google Translate lazy loader ----------
  let gtLoading=false, gtLoaded=false;
  function loadGoogleTranslate(cb){
    if(gtLoaded){ cb&&cb(); return; }
    if(gtLoading){ return; }
    gtLoading=true;
    window.googleTranslateElementInit=function(){
      try{
        new window.google.translate.TranslateElement({
          pageLanguage:'en',
          includedLanguages:'es,ht,zh-CN,vi,ko,pt',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
        gtLoaded=true; cb&&cb();
      }catch(e){}
    };
    const s=el('script',{src:'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',async:'',defer:''});
    s.onerror=function(){ gtLoading=false; };
    (document.head||document.body).appendChild(s);
  }

  // ---------- SOLID color animation (that worked in v7) ----------
  const SOLID_BG_CSS = `
    html, body{min-height:100%;}
    body{ background-color:#0b2a6f; animation: solid-bg-cycle 25s linear infinite; }
    .hero{ background-color:transparent !important; background-image:none !important; }
    @keyframes solid-bg-cycle{
      0%   { background-color:#0b2a6f; }
      25%  { background-color:#3a1d6e; }
      50%  { background-color:#7a0b0b; }
      75%  { background-color:#3a1d6e; }
      100% { background-color:#0b2a6f; }
    }
  `;

  // ---------- Platform page CSS: layout & controls ----------
  const PLATFORM_LAYOUT_CSS = `
    .platform-wrap{max-width:var(--container);margin:20px auto;padding:0 16px}
    .slider{position:relative;overflow:hidden;border-radius:14px;border:1px solid var(--stroke);background:var(--card)}
    .track{display:grid;grid-auto-flow:column;grid-auto-columns:100%;transition:transform .4s ease;will-change:transform}
    .slide{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;align-items:center;padding:18px;min-height:280px}
    .slide .img img{width:100%;max-width:380px;height:auto;border-radius:10px;border:1px solid var(--stroke);box-shadow:0 6px 18px rgba(0,0,0,.25)}
    .ctrl{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.35);color:#fff;border:1px solid rgba(255,255,255,.25);width:40px;height:40px;border-radius:50%;display:grid;place-items:center;cursor:pointer}
    .ctrl:hover{background:rgba(0,0,0,.55)}
    .prev{left:10px}
    .next{right:10px}
    .dots{display:flex;gap:6px;justify-content:center;padding:12px}
    .dot{width:9px;height:9px;border-radius:50%;background:#52607c;border:1px solid #8391ae;opacity:.6}
    .dot[aria-current="true"]{background:#dbeafe;border-color:#ffffff;opacity:1}
    @media(max-width:780px){.slide{grid-template-columns:1fr}.slide .img img{max-width:520px}}
  `;

  // ---------- Platform page CSS: buttons & quick-link chips ----------
  const PLATFORM_BUTTON_CSS = `
    :root{--btn-bg:#14345c;--btn-bg-hover:#173b6a;--btn-border:#2b4772;--btn-border-hover:#35598a;--btn-fg:#e6f2ff}
    .slide .btn{display:inline-flex;align-items:center;gap:6px;padding:10px 14px;border-radius:10px;background:var(--btn-bg);
      color:var(--btn-fg);text-decoration:none;border:1px solid var(--btn-border);font-weight:700;box-shadow:0 1px 0 rgba(255,255,255,.06) inset}
    .slide .btn:hover,.slide .btn:focus-visible{background:var(--btn-bg-hover);color:#fff;border-color:var(--btn-border-hover);outline:none}
    .platform-wrap .slide .txt .btn{margin-top:10px}
    .quick-links .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
    .quick-links .grid a{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 12px;border-radius:10px;background:#0f1a38;color:#e2e8f0;text-decoration:none;border:1px solid var(--btn-border);font-weight:700}
    .quick-links .grid a:hover,.quick-links .grid a:focus-visible{background:#132042;color:#fff;outline:none}
  `;

  function runPlatformCarousel(){
    const track=document.getElementById('track'); if(!track) return; const slides=Array.from(track.children);
    const prev=document.getElementById('prev'); const next=document.getElementById('next'); const dotsWrap=document.getElementById('dots');
    if(!slides.length) return; let index=0,locked=false; const count=slides.length;
    if(dotsWrap && !dotsWrap.children.length){ slides.forEach((_,i)=>{const d=el('button',{class:'dot',type:'button',role:'tab','aria-label':'Go to slide '+(i+1)}); d.addEventListener('click',()=>go(i)); dotsWrap.appendChild(d);}); }
    function update(){ track.style.transform='translateX(-'+(index*100)+'%)'; if(dotsWrap){ Array.from(dotsWrap.children).forEach((d,i)=>d.setAttribute('aria-current', i===index?'true':'false')); } }
    function go(i){ if(locked) return; index=(i+count)%count; locked=true; update(); setTimeout(()=>locked=false,350); }
    if(prev) prev.addEventListener('click',()=>go(index-1)); if(next) next.addEventListener('click',()=>go(index+1));
    window.addEventListener('keydown',(e)=>{ if(e.key==='ArrowLeft') go(index-1); if(e.key==='ArrowRight') go(index+1); });
    let sx=0,dx=0,touching=false; track.addEventListener('touchstart',(e)=>{touching=true;sx=e.touches[0].clientX;dx=0;},{passive:true});
    track.addEventListener('touchmove',(e)=>{if(!touching)return; dx=e.touches[0].clientX-sx;},{passive:true});
    track.addEventListener('touchend',()=>{touching=false; if(Math.abs(dx)>50){ if(dx<0) go(index+1); else go(index-1);} });
    const auto=setInterval(()=>go(index+1),7000); document.addEventListener('visibilitychange',()=>{ if(document.hidden) clearInterval(auto); });
    update();

    // Ensure About Erik quick-link exists without editing HTML
    try{ const grid=document.querySelector('.quick-links .grid'); if(grid && !grid.querySelector('a[href$="about-erik.html"]')){ grid.appendChild(el('a',{href:'about-erik.html'},'About Erik')); } }catch(e){}
  }

  function build(){
    // Site-wide background color cycle
    ensureStyle('solid-bg-css', SOLID_BG_CSS);

    // Header mount
    let anchor=document.getElementById('site-header'); if(!anchor){anchor=el('div',{id:'site-header'});document.body.insertBefore(anchor,document.body.firstChild);} 
    const H=el('header',{class:'site-header'}); const inner=el('div',{class:'site-header__inner'});

    // Brand + tagline
    const brand=el('div',{class:'site-header__brandline'}); brand.append(el('span',{class:'site-header__brand'},BRAND_TEXT)); const tg=el('span',{class:'site-header__tagline'}); tg.textContent=TAGLINE; brand.append(tg);

    // Images
     const imgs=el('div',{class:'site-header__images'}); const i1=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''}); const i2=el('img',{class:'site-header__img',src:'/assets/write-in.gif',alt:'Write-in ballot'}); i1.onerror=()=>i1.style.display='none'; i2.onerror=()=>i2.style.display='none'; 
    imgs.append(i1,i2);
       // const imgs=el('div',{class:'site-header__images'}); const i1=el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'}); const i2=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''}); i1.onerror=()=>i1.style.display='none'; i2.onerror=()=>i2.style.display='none'; imgs.append(i1,i2);

    // Languages
    const lang=el('div',{class:'site-header__lang'}); const btn=el('button',{class:'site-header__btn',id:'langBtn','aria-expanded':'false','aria-haspopup':'true'},'Languages'); const menu=el('div',{class:'site-header__menu','aria-hidden':'true',role:'menu','aria-label':'Languages'});
    menu.append(el('div',{class:'menu-label'},'Translate this page')); const gt=el('div',{id:'google_translate_element'}); menu.append(gt);
    const grp=el('div',{class:'menu-group'}); grp.append(el('div',{class:'menu-label'},'Visit localized landing'));
    const list=el('ul',{class:'menu-list'}); const rt = location.pathname.startsWith('/pages/') ? '..' : '.';
    [ ['Español',rt+'/index-es.html'], ['Kreyòl Ayisyen',rt+'/index-ht.html'], ['中文（简体）',rt+'/index-zh.html'], ['Tiếng Việt',rt+'/index-vi.html'], ['한국어',rt+'/index-ko.html'], ['Português',rt+'/index-pt.html'] ]
      .forEach(([label,href])=> list.appendChild(el('li',{},`<a href="${href}">${label}</a>`)) );
    grp.append(list); menu.append(grp); lang.append(btn,menu);

    // Toggle + preload
    btn.addEventListener('click',()=>{ const open=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded', String(!open)); menu.setAttribute('aria-hidden', String(open)); if(!open){ loadGoogleTranslate(); } });
    setTimeout(()=>loadGoogleTranslate(),1200);
    document.addEventListener('click',(e)=>{ if(!lang.contains(e.target)){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });

    // Primary nav
    const nav=el('nav',{class:'site-header__bottom site-header__nav','aria-label':'Primary'}); NAV.forEach(({label,href})=> nav.appendChild(el('a',{href},label)) );

    inner.append(brand,imgs,lang,nav); H.appendChild(inner); anchor.replaceWith(H);

    if(isPlatform()){
      ensureStyle('platform-layout-css', PLATFORM_LAYOUT_CSS);
      ensureStyle('platform-button-css', PLATFORM_BUTTON_CSS);
      runPlatformCarousel();
    }
  }

  onReady(build);
})();
/* === OPTION 1B — minimal relocation helper (no placeholders, append-only) === */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.site-header');
  if (!header) return;

  // Find or infer the row container that holds brand/nav/icons
  const row =
    header.querySelector('.header-row') ||
    header.querySelector('.container') ||
    header;

  // Locate the Languages control (supporting GT + common patterns)
  const languages =
    document.getElementById('google_translate_element') ||
    header.querySelector('[data-lang-menu]') ||
    header.querySelector('.lang') ||
    document.querySelector('[data-lang-menu]') ||
    document.querySelector('.lang');

  // If Languages renders outside the header, adopt it into the row
  if (languages && !header.contains(languages)) {
    row.appendChild(languages);
  }

  // Mark it explicitly so CSS can style it if needed
  if (languages) languages.classList.add('header-languages');

  // Ensure the icons block sits on the left (before nav) as requested
  const icons = header.querySelector('.header-right');
  if (row && icons && icons !== row.firstElementChild) {
    row.insertBefore(icons, row.firstChild);
  }
});
/* === Minimal helper: adopt Languages into the header & mark it === */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header.site-header');
  if (!header) return;

  // Find a reasonable container (brand/nav/icons live here)
  const row = header.querySelector('.header-row')
           || header.querySelector('.container')
           || header;

  // Find Languages (supports Google Translate & common patterns)
  const languages =
    document.getElementById('google_translate_element') ||
    header.querySelector('[data-lang-menu]') ||
    header.querySelector('.lang') ||
    document.querySelector('[data-lang-menu]') ||
    document.querySelector('.lang') ||
    document.getElementById('languages');

  // If Languages was rendered OUTSIDE the header, adopt it into our row
  if (languages && !header.contains(languages)) {
    row.appendChild(languages);
  }

  // Mark it so CSS can force the new line reliably
  if (languages) languages.classList.add('header-languages');

  // Keep icons on the left even if DOM order changes
  const icons = header.querySelector('.header-right')
             || header.querySelector(':scope > div:has(> img[src*="emtest"], > img[src*="write-in"])');
  if (row && icons && icons !== row.firstElementChild) {
    row.insertBefore(icons, row.firstChild);
  }
});
// /* === Add-to-bottom: create a row-2 & adopt Languages into it (append-only) === */
// (function () {
//   function ready(fn) {
//     if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
//     else fn();
//   }

//   // Moves / adopts Languages control into a dedicated row-2 under the header
//   function installRow2AndMoveLanguages() {
//     const header = document.querySelector('header.site-header');
//     if (!header) return false;

//     // Ensure a row-2 exists right after the first row-like container
//     let row2 = header.querySelector('.row-2');
//     if (!row2) {
//       row2 = document.createElement('div');
//       row2.className = 'row-2';
//       const firstRow = header.querySelector('.header-row') || header.firstElementChild || header;
//       (firstRow.parentNode || header).insertBefore(row2, firstRow.nextSibling);
//     }

//     // Find Languages (GT and common variants), wherever it lives
//     const candidates = [
//       document.getElementById('google_translate_element'),
//       header.querySelector('[data-lang-menu]'),
//       header.querySelector('.lang'),
//       document.querySelector('[data-lang-menu]'),
//       document.querySelector('.lang'),
//       document.getElementById('languages')
//     ].filter(Boolean);

//     const lang = candidates.find(el => el && el.parentNode);
//     if (!lang) return false;

//     // Move it into row-2, mark it so CSS can style it, and ensure it's on top
//     if (lang !== row2.firstElementChild) {
//       row2.appendChild(lang);
//       if (!lang.id) lang.id = 'google_translate_element';
//       lang.classList.add('lang');
//       lang.style.position = 'relative';
//       lang.style.zIndex = '5';
//       lang.style.color = '#fff';
//     }
//     return true;
//   }

//   ready(function () {
//     // Try immediately; if Languages appears late (e.g., GT), observe briefly
//     if (installRow2AndMoveLanguages()) return;
//     const stopAt = Date.now() + 10000; // 10s window
//     const obs = new MutationObserver(() => {
//       if (installRow2AndMoveLanguages() || Date.now() > stopAt) obs.disconnect();
//     });
//     obs.observe(document.documentElement, { childList: true, subtree: true });
//     setTimeout(() => obs.disconnect(), 12000);
//   });
// })();
// /* === Add to bottom of BOTH files: move icons left, keep nav after, adopt Languages if needed === */
// (function () {
//   function ready(fn) {
//     if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
//     else fn();
//   }

//   ready(function () {
//     const header = document.querySelector('header.site-header');
//     if (!header) return;

//     // Find the primary row/container that holds brand, nav, and images
//     const row = header.querySelector('.header-row')
//              || header.querySelector('.container')
//              || header;

//     // 1) IDENTIFY ICONS GROUP (closest container around emtest/write-in images)
//     const iconImg = header.querySelector('img[src*="emtest"], img[src*="write-in"]');
//     let icons = null;
//     if (iconImg) {
//       // Walk up to a sensible block container for the icons
//       icons = iconImg.closest('div, section, header');
//     }

//     // 2) PLACE ICONS FIRST, THEN NAV
//     const nav = header.querySelector('nav.main-nav');
//     if (row && icons && nav) {
//       // Make sure icons are before nav (left side), regardless of original DOM order
//       if (icons !== row.firstElementChild) row.insertBefore(icons, row.firstChild);
//       if (nav !== icons.nextElementSibling) row.insertBefore(nav, icons.nextSibling);
//     }

//     // 3) ADOPT LANGUAGES INTO THE HEADER (if Translate injected it elsewhere)
//     const languages =
//       document.getElementById('google_translate_element') ||
//       header.querySelector('[data-lang-menu]') ||
//       header.querySelector('.lang') ||
//       document.querySelector('[data-lang-menu]') ||
//       document.querySelector('.lang') ||
//       document.getElementById('languages');

//     if (languages && !header.contains(languages)) {
//       row.appendChild(languages); // bring into the header so CSS can wrap it
//     }
//     if (languages) {
//       languages.classList.add('header-languages');
//       languages.style.position = 'relative';
//       languages.style.zIndex = '1000';
//       languages.style.color = '#fff';
//     }
//   });
// })();
