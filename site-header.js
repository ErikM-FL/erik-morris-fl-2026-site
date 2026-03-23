
/* ======================================================
   /assets/site-header.js — FULL REPLACEMENT (stable)
   Restores a conventional header, then places Languages on row‑2.
   Keeps links, text and visuals stable; no external fetches.
   ====================================================== */
(function(){
  function el(tag, attrs){ const e=document.createElement(tag); if(attrs){ for(const k in attrs){ if(k==='class') e.className=attrs[k]; else if(k==='html') e.innerHTML = attrs[k]; else e.setAttribute(k,attrs[k]); } } return e; }
  function txt(s){ return document.createTextNode(s); }

  function buildHeader(){
    const header = el('header',{class:'site-header'});

    // ---------- Row 1 ----------
    const c1 = el('div',{class:'container'});
    const row1 = el('div',{class:'row-1'});

    // Brand
    const brand = el('div',{class:'brand-wrap'});
    const brandLink = el('a',{class:'brand', href:'/'}); brandLink.appendChild(txt('Erik Morris 2026')); brand.appendChild(brandLink);

    // Primary nav (absolute paths; text via TextNodes to avoid &amp; artifacts)
    const nav = el('nav',{class:'main-nav','aria-label':'Primary'});
    const aHome = el('a',{href:'/'}); aHome.appendChild(txt('Home'));
    const aPlatform = el('a',{href:'/platform.html'}); aPlatform.appendChild(txt('Platform'));
    const aVoting = el('a',{href:'/pages/how-to-write-in-en.html'}); aVoting.appendChild(txt('Voting & Write-In Candidate'));
    const aAbout = el('a',{href:'/about.html'}); aAbout.appendChild(txt('About Erik'));
    [aHome,aPlatform,aVoting,aAbout].forEach(a=>nav.appendChild(a));

    // Right visuals (stable order)
    const right = el('div',{class:'header-right'});
    right.appendChild(el('img',{class:'hdr-emtest', src:'/assets/emtest.png', alt:'profile'}));
    right.appendChild(el('img',{class:'hdr-writein', src:'/assets/write-in.gif', alt:'write-in'}));

    row1.appendChild(brand); row1.appendChild(nav); row1.appendChild(right); c1.appendChild(row1);

    // ---------- Row 2 (Languages) ----------
    const c2 = el('div',{class:'container'});
    const row2 = el('div',{class:'row-2'});

    // Provide the canonical Google Translate mount (keeps existing integrations working)
    const langHost = el('div',{id:'google_translate_element', class:'lang', 'data-lang-menu':''});
    row2.appendChild(langHost);
    c2.appendChild(row2);

    header.appendChild(c1); header.appendChild(c2);
    return header;
  }

  function mountHeader(){
    let mount = document.getElementById('site-header');
    if(!mount){ mount = el('div',{id:'site-header'}); document.body.insertBefore(mount, document.body.firstChild); }
    mount.innerHTML='';
    mount.appendChild(buildHeader());
  }

  // If another script renders a language menu elsewhere, move it into our row‑2 slot.
  function moveExistingLanguages(){
    const slot = document.getElementById('google_translate_element');
    if(!slot) return;
    const header = document.querySelector('header.site-header'); if(!header) return;

    const existing = header.querySelector('[data-lang-menu]') || header.querySelector('.lang') || document.getElementById('languages');
    if(existing && existing !== slot){ slot.replaceWith(existing); existing.id = 'google_translate_element'; existing.classList.add('lang'); }
  }

  function observeForLateLanguages(){
    const stopAt = Date.now()+7000; // 7s is ample for translate widgets
    const obs = new MutationObserver(()=>{ moveExistingLanguages(); if(Date.now()>stopAt) obs.disconnect(); });
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>obs.disconnect(), 8000);
  }

  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function(){
    mountHeader();
    moveExistingLanguages();
    observeForLateLanguages();
  });
})();

(function () {
  var s = document.createElement('script');
  s.src = '/_vercel/insights/script.js';
  s.defer = true;
  (document.head || document.documentElement).appendChild(s);
})();
