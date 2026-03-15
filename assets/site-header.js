
/* ======================================================
   /assets/site-header.js — EMERGENCY RESTORE (v3)
   Builds a stable two‑row header and integrates Google Translate.
   No external repo fetches, no placeholders.
   ====================================================== */
(function(){
  function el(tag, attrs){ const e=document.createElement(tag); if(attrs){ for(const k in attrs){ if(k==='class') e.className=attrs[k]; else if(k==='html') e.innerHTML=attrs[k]; else e.setAttribute(k, attrs[k]); } } return e; }
  function txt(s){ return document.createTextNode(s); }

  function ensureMount(){
    let mount = document.getElementById('site-header');
    if(!mount){ mount = el('div',{id:'site-header'}); document.body.insertBefore(mount, document.body.firstChild); }
    return mount;
  }

  function buildHeader(){
    const header = el('header',{class:'site-header'});

    // Row 1
    const c1 = el('div',{class:'container'});
    const row1 = el('div',{class:'row-1'});

    const brand = el('div',{class:'brand-wrap'});
    const brandLink = el('a',{class:'brand', href:'/'}); brandLink.appendChild(txt('Erik Morris 2026')); brand.appendChild(brandLink);

    const nav = el('nav',{class:'main-nav','aria-label':'Primary'});
    const aHome = el('a',{href:'/'}); aHome.appendChild(txt('Home'));
    const aPlatform = el('a',{href:'/platform.html'}); aPlatform.appendChild(txt('Platform'));
    const aVoting = el('a',{href:'/pages/how-to-write-in-en.html'}); aVoting.appendChild(txt('Voting & Write-In Candidate'));
    const aAbout = el('a',{href:'/about.html'}); aAbout.appendChild(txt('About Erik'));
    [aHome,aPlatform,aVoting,aAbout].forEach(a=>nav.appendChild(a));

    const right = el('div',{class:'header-right'});
    right.appendChild(el('img',{class:'hdr-emtest', src:'/assets/emtest.png', alt:'profile'}));
    right.appendChild(el('img',{class:'hdr-writein', src:'/assets/write-in.gif', alt:'write-in'}));

    row1.appendChild(brand); row1.appendChild(nav); row1.appendChild(right);
    c1.appendChild(row1);

    // Row 2 — Languages slot
    const c2 = el('div',{class:'container'});
    const row2 = el('div',{class:'row-2'});
    const langSlot = el('div',{id:'google_translate_element', class:'lang', 'data-lang-menu':''});
    row2.appendChild(langSlot);
    c2.appendChild(row2);

    header.appendChild(c1); header.appendChild(c2);
    return header;
  }

  function mountHeader(){
    const mount = ensureMount();
    mount.innerHTML='';
    mount.appendChild(buildHeader());
  }

  // If a ballot image exists without wrapper, tag its figure for styling
  function tagBallotFigure(){
    const img = document.querySelector('img[src*="write-in-ballot"]');
    if(img){ const fig = img.closest('figure'); if(fig) fig.classList.add('ballot-figure'); }
  }

  // Google Translate bootstrap (keeps text white via CSS) — works if allowed by CSP
  function loadGoogleTranslate(){
    // If already present, do nothing
    if(window.google && window.google.translate) return;
    window.googleTranslateElementInit = function(){
      try{ new window.google.translate.TranslateElement({pageLanguage:'en', includedLanguages:'en,es,ht,vi,ko,zh-CN,pt', autoDisplay:false}, 'google_translate_element'); }catch(_e){}
    };
    var s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true; document.head.appendChild(s);
  }

  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function(){
    mountHeader();
    tagBallotFigure();
    loadGoogleTranslate();
  });
})();
