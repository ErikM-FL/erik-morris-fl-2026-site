
(function(){
  // =============================
  // Centralized Header Controller (v11)
  // Purpose: GUARANTEE a uniform, solid background color cycle on ALL pages.
  //  • Applies animation to <html> + <body> and to a fixed #bg-cycle-layer fallback.
  //  • Neutralizes legacy gradients; introduces new style id to bust stale caches.
  //  • Force-restarts on load/visibilitychange/pageshow and sanity-checks progress.
  //  • Keeps Google Translate, About Erik nav, and Platform carousel + button styles.
  // =============================

  const BRAND_TEXT='Erik Morris 2026';
  const TAGLINE='Write\u2011in \u2022 Floridians First \u2022 For Florida Families & Future \u2022 Fix the Incentives';
  const NAV=[
    {label:'Home',href:'/index.html'},
    {label:'Platform',href:'/pages/platform.html'},
    {label:'Voting a Write-In Candidate',href:'/pages/how-to-write-in.html'},
    {label:'About Erik',href:'/pages/about-erik.html'}
  ];

  function el(tag,attrs={},html){const e=document.createElement(tag);for(const k in attrs){k==='class'?e.className=attrs[k]:e.setAttribute(k,attrs[k])}if(html!=null)e.innerHTML=html;return e;}
  function ensureStyle(id, css, replace){
    const prev=document.getElementById(id);
    if(prev && replace){ prev.remove(); }
    if(document.getElementById(id)) return;
    const s=el('style',{id}); s.textContent=css; (document.head||document.body).appendChild(s);
  }
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
          pageLanguage:'en', includedLanguages:'es,ht,zh-CN,vi,ko,pt',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
        gtLoaded=true; cb&&cb();
      }catch(e){}
    };
    const s=el('script',{src:'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',async:'',defer:''});
    s.onerror=function(){ gtLoading=false; };
    (document.head||document.body).appendChild(s);
  }

  // ---------- SOLID color animation — triple-redundant ----------
  const COLORS = ['#0b2a6f','#3a1d6e','#7a0b0b','#3a1d6e','#0b2a6f']; // blue→purple→red→purple→blue
  const DURATION = 125; // seconds; change to 25 for testing if desired

  const SOLID_BG_CSS_V11 = `
    html, body{min-height:100%;}
    /* Neutralize any legacy background */
    html, body{ background-image:none !important; background:none !important; }

    /* Primary: animate background-color on both html and body */
    html, body{
      background-color:${COLORS[0]} !important;
      animation: solid-bg-cycle ${DURATION}s linear infinite !important;
      animation-play-state: running !important;
      will-change: background-color;
    }

    /* Fallback layer (behind everything) */
    #bg-cycle-layer{ position:fixed; inset:0; z-index:-1; pointer-events:none;
      background-color:${COLORS[0]}; animation: solid-bg-cycle ${DURATION}s linear infinite; }

    /* One-frame pause to force-restart */
    html.solid-bg-restart, body.solid-bg-restart, #bg-cycle-layer.solid-bg-restart{ animation:none !important; }

    /* Ensure site sections don't overpaint */
    .hero{ background-color:transparent !important; background-image:none !important; }

    @keyframes solid-bg-cycle{
      0%   { background-color:${COLORS[0]}; }
      25%  { background-color:${COLORS[1]}; }
      50%  { background-color:${COLORS[2]}; }
      75%  { background-color:${COLORS[1]}; }
      100% { background-color:${COLORS[0]}; }
    }
  `;

  function insertFallbackLayer(){
    if(document.getElementById('bg-cycle-layer')) return;
    const layer=el('div',{id:'bg-cycle-layer'});
    document.body.insertBefore(layer, document.body.firstChild);
  }

  function forceRestartAnimation(){
    try{
      const html=document.documentElement, body=document.body, layer=document.getElementById('bg-cycle-layer');
      html.classList.add('solid-bg-restart'); body.classList.add('solid-bg-restart'); if(layer) layer.classList.add('solid-bg-restart');
      // Reflow to ensure pause
      void html.offsetHeight; // eslint-disable-line no-unused-expressions
      requestAnimationFrame(()=>{ html.classList.remove('solid-bg-restart'); body.classList.remove('solid-bg-restart'); if(layer) layer.classList.remove('solid-bg-restart'); });
    }catch(e){}
  }

  function sanityCheckAnimation(){
    try{
      const probe=(node)=> getComputedStyle(node).backgroundColor;
      const a1=probe(document.body);
      const l=document.getElementById('bg-cycle-layer');
      const a1b=l?probe(l):null;
      setTimeout(()=>{
        const a2=probe(document.body);
        const a2b=l?probe(l):null;
        if(a1===a2 && (!l || a1b===a2b)){
          forceRestartAnimation();
        }
      }, 4000);
    }catch(e){}
  }

  // ---------- Platform page CSS ----------
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

    try{ const grid=document.querySelector('.quick-links .grid'); if(grid && !grid.querySelector('a[href$="about-erik.html"]')){ grid.appendChild(el('a',{href:'about-erik.html'},'About Erik')); } }catch(e){}
  }

  function buildHeader(){
    // Inject/refresh solid background CSS, insert fallback layer, and start animation
    ensureStyle('solid-bg-css-v11', SOLID_BG_CSS_V11, /*replace*/ true);
    if(document.body) insertFallbackLayer(); else document.addEventListener('DOMContentLoaded', insertFallbackLayer);
    // Multiple restart hooks for robustness
    forceRestartAnimation();
    sanityCheckAnimation();
    window.addEventListener('pageshow', ()=>{ forceRestartAnimation(); });
    document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) forceRestartAnimation(); });

    // Header mount
    let anchor=document.getElementById('site-header'); if(!anchor){anchor=el('div',{id:'site-header'});document.body.insertBefore(anchor,document.body.firstChild);} 
    const H=el('header',{class:'site-header'}); const inner=el('div',{class:'site-header__inner'});

    // Brand + tagline
    const brand=el('div',{class:'site-header__brandline'}); brand.append(el('span',{class:'site-header__brand'},BRAND_TEXT)); const tg=el('span',{class:'site-header__tagline'}); tg.textContent=TAGLINE; brand.append(tg);

    // Images
    const imgs=el('div',{class:'site-header__images'}); const i1=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''}); const i2=el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'}); i1.onerror=()=>i1.style.display='none'; i2.onerror=()=>i2.style.display='none'; imgs.append(i1,i2);

    // Languages
    const lang=el('div',{class:'site-header__lang'}); const btn=el('button',{class:'site-header__btn',id:'langBtn','aria-expanded':'false','aria-haspopup':'true'},'Languages'); const menu=el('div',{class:'site-header__menu','aria-hidden':'true',role:'menu','aria-label':'Languages'});
    menu.append(el('div',{class:'menu-label'},'Translate this page')); const gt=el('div',{id:'google_translate_element'}); menu.append(gt);
    const grp=el('div',{class:'menu-group'}); grp.append(el('div',{class:'menu-label'},'Visit localized landing'));
    const list=el('ul',{class:'menu-list'}); const rt = location.pathname.startsWith('/pages/') ? '..' : '.';
    [ ['Español',rt+'/index-es.html'], ['Kreyòl Ayisyen',rt+'/index-ht.html'], ['中文（简体）',rt+'/index-zh.html'], ['Tiếng Việt',rt+'/index-vi.html'], ['한국어',rt+'/index-ko.html'], ['Português',rt+'/index-pt.html'] ]
      .forEach(([label,href])=> list.appendChild(el('li',{},`<a href="${href}">${label}</a>`)) );
    grp.append(list); menu.append(grp); lang.append(btn,menu);

    btn.addEventListener('click',()=>{ const open=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded', String(!open)); menu.setAttribute('aria-hidden', String(open)); if(!open){ loadGoogleTranslate(); } });
    setTimeout(()=>loadGoogleTranslate(),1200);
    document.addEventListener('click',(e)=>{ if(!lang.contains(e.target)){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });

    // Primary nav
    const nav=el('nav',{class:'site-header__bottom site-header__nav','aria-label':'Primary'}); NAV.forEach(({label,href})=> nav.appendChild(el('a',{href},label)) );

    inner.append(brand,imgs,lang,nav); H.appendChild(inner); anchor.replaceWith(H);

    // Platform-specific injections
    if(isPlatform()){
      ensureStyle('platform-layout-css', PLATFORM_LAYOUT_CSS);
      ensureStyle('platform-button-css', PLATFORM_BUTTON_CSS);
      runPlatformCarousel();
    }
  }

  onReady(buildHeader);
})();
