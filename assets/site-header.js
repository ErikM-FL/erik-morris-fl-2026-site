
(function(){
  // =============================
  // Centralized Header Controller
  // Injects global gradient, fixes Languages menu, adds About Erik nav, and
  // (conditionally) restores Platform carousel + button styles — all from one place.
  // =============================

  const BRAND_TEXT='Erik Morris 2026';
  const TAGLINE='Write\u2011in \u2022 Floridians First \u2022 For Florida Families & Future \u2022 Fix the Incentives';
  const NAV=[
    {label:'Home',href:'/index.html'},
    {label:'Platform',href:'/pages/platform.html'},
    {label:'Voting a Write-In Candidate',href:'/pages/how-to-write-in.html'},
    {label:'About Erik',href:'/pages/about-erik.html'} // keep About Erik in header nav
  ];

  // ---------- Helpers ----------
  function el(tag,attrs={},html){const e=document.createElement(tag);for(const k in attrs){k==='class'?e.className=attrs[k]:e.setAttribute(k,attrs[k])}if(html!=null)e.innerHTML=html;return e;}
  function ensureStyle(id, css){ if(document.getElementById(id)) return; const s=el('style',{id}); s.textContent=css; (document.head||document.body).appendChild(s); }
  function ensureOnce(id, cb){ if(document.getElementById(id)) return; const m=el('meta',{id}); (document.head||document.body).appendChild(m); try{cb();}catch(e){} }
  function onReady(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn);} else { fn(); } }

  function isPlatform(){ return /\/pages\/platform\.html(?:$|[?#])/.test(location.pathname+location.search+location.hash); }

  // ---------- Global animated gradient (uniform cross-fade; 125s cycle) ----------
  const GRADIENT_CSS = `
    html, body{min-height:100%;}
    body{
      background-image: linear-gradient(135deg,
        #0b2a6f 0%,     /* blue */
        #3a1d6e 35%,    /* purple */
        #7a0b0b 50%,    /* darker GOP-like red */
        #3a1d6e 65%,    /* purple */
        #0b2a6f 100%    /* blue */
      );
      background-size: 400% 400%;
      background-attachment: fixed;
      animation: bg-pan-cycle 125s ease-in-out infinite; /* 50s * 2.5 */
    }
    .hero{ background-color:transparent !important; background-image:none !important; }
    @keyframes bg-pan-cycle{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  `;

  // ---------- Platform page: button style & carousel (scoped) ----------
  const PLATFORM_BTN_CSS = `
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

    // Ensure "About Erik" appears as the last quick-link without editing HTML
    try{
      const grid=document.querySelector('.quick-links .grid');
      if(grid && !grid.querySelector('a[href$="about-erik.html"]')){
        const a=el('a',{href:'about-erik.html'},'About Erik'); grid.appendChild(a);
      }
    }catch(e){}
  }

  // ---------- Build header ----------
  function buildHeader(){
    // Ensure global gradient
    ensureStyle('animated-gradient-css', GRADIENT_CSS);

    // Create or replace header mount
    let anchor=document.getElementById('site-header'); if(!anchor){anchor=el('div',{id:'site-header'});document.body.insertBefore(anchor,document.body.firstChild);} 
    const H=el('header',{class:'site-header'}); const inner=el('div',{class:'site-header__inner'});

    // Brand + tagline
    const brand=el('div',{class:'site-header__brandline'});
    brand.append(el('span',{class:'site-header__brand'},BRAND_TEXT));
    const tg=el('span',{class:'site-header__tagline'}); tg.textContent=TAGLINE; brand.append(tg);

    // Images
    const imgs=el('div',{class:'site-header__images'});
    const i1=el('img',{class:'site-header__img',src:'/assets/EMtest.png',alt:''});
    const i2=el('img',{class:'site-header__img',src:'/assets/write-in-ballot.gif',alt:'Write-in ballot'});
    i1.onerror=()=>i1.style.display='none'; i2.onerror=()=>i2.style.display='none';
    imgs.append(i1,i2);

    // Language menu (anchored under button with caret)
    const lang=el('div',{class:'site-header__lang'});
    const btn=el('button',{class:'site-header__btn',id:'langBtn','aria-expanded':'false','aria-haspopup':'true'},'Languages');
    const menu=el('div',{class:'site-header__menu','aria-hidden':'true',role:'menu','aria-label':'Languages'});
    menu.append(el('div',{class:'menu-label'},'Translate this page'));
    const gt=el('div',{id:'google_translate_element'}); menu.append(gt);
    const grp=el('div',{class:'menu-group'}); grp.append(el('div',{class:'menu-label'},'Visit localized landing'));
    const list=el('ul',{class:'menu-list'}); const rt = location.pathname.startsWith('/pages/') ? '..' : '.';
    [ ['Español',rt+'/index-es.html'], ['Kreyòl Ayisyen',rt+'/index-ht.html'], ['中文（简体）',rt+'/index-zh.html'], ['Tiếng Việt',rt+'/index-vi.html'], ['한국어',rt+'/index-ko.html'], ['Português',rt+'/index-pt.html'] ]
      .forEach(([label,href])=> list.appendChild(el('li',{},`<a href="${href}">${label}</a>`)) );
    grp.append(list); menu.append(grp); lang.append(btn,menu);

    // Toggle
    btn.addEventListener('click',()=>{ const open=btn.getAttribute('aria-expanded')==='true'; btn.setAttribute('aria-expanded', String(!open)); menu.setAttribute('aria-hidden', String(open)); });
    document.addEventListener('click',(e)=>{ if(!lang.contains(e.target)){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ btn.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); } });

    // Primary nav
    const nav=el('nav',{class:'site-header__bottom site-header__nav','aria-label':'Primary'});
    NAV.forEach(({label,href})=> nav.appendChild(el('a',{href},label)) );

    inner.append(brand,imgs,lang,nav); H.appendChild(inner); anchor.replaceWith(H);

    // If on platform page, inject scoped styles + init carousel
    if(isPlatform()){
      ensureStyle('platform-btn-fix', PLATFORM_BTN_CSS);
      runPlatformCarousel();
    }
  }

  // ---------- Header CSS (kept external to avoid restyling here) ----------
  // Note: These class names expect site-header.css to be included elsewhere as you already do.
  // We only centralize behaviors/overrides and cross-page injections here.

  onReady(buildHeader);
})();
