
/* =============================
   /assets/site-header.js  (FULL REPLACEMENT v2)
   Two-row header; moves Languages to row-2; stable links & text
   ============================= */
(function(){
  function el(tag, attrs){ const e=document.createElement(tag); if(attrs){ for(const k in attrs){ if(k==='class') e.className=attrs[k]; else if(k==='html') e.innerHTML=attrs[k]; else e.setAttribute(k, attrs[k]); } } return e; }
  function text(t){ return document.createTextNode(t); }

  function buildHeader(){
    const header = el('header', {class:'site-header'});

    // Containers
    const c1 = el('div',{class:'container'});
    const c2 = el('div',{class:'container'});

    // Row 1: brand | nav | right visuals
    const row1 = el('div',{class:'header-row row-1'});

    const brand = el('div',{class:'brand-wrap'});
    const brandLink = el('a',{class:'brand', href:'/'}); brandLink.appendChild(text('Erik Morris 2026')); brand.appendChild(brandLink);

    const nav = el('nav',{'class':'main-nav','aria-label':'Primary'});
    const aHome = el('a',{href:'/'}); aHome.appendChild(text('Home'));
    const aPlatform = el('a',{href:'/platform.html'}); aPlatform.appendChild(text('Platform'));
    const aVoting = el('a',{href:'/pages/how-to-write-in-en.html'}); aVoting.appendChild(text('Voting & Write-In Candidate'));
    const aAbout = el('a',{href:'/about.html'}); aAbout.appendChild(text('About Erik'));
    [aHome,aPlatform,aVoting,aAbout].forEach(a=>nav.appendChild(a));

    const right = el('div',{class:'header-right'});
    right.appendChild(el('img',{src:'/assets/emtest.png', alt:'emtest'}));
    right.appendChild(el('img',{src:'/assets/write-in-ballot.png', alt:'write-in ballot'}));

    row1.appendChild(brand); row1.appendChild(nav); row1.appendChild(right); c1.appendChild(row1);

    // Row 2: Languages slot under nav
    const row2 = el('div',{class:'header-row row-2'});
    const langSlot = el('div',{id:'languages-slot','aria-label':'Language selector'});
    row2.appendChild(langSlot); row2.appendChild(el('div')); c2.appendChild(row2);

    header.appendChild(c1); header.appendChild(c2);
    return header;
  }

  function mountHeader(){
    let mount = document.getElementById('site-header');
    if(!mount){ mount=el('div',{id:'site-header'}); document.body.insertBefore(mount, document.body.firstChild); }
    mount.innerHTML='';
    mount.appendChild(buildHeader());
  }

  function moveLanguagesOnce(){
    const header=document.querySelector('header.site-header'); if(!header) return true;
    const slot=header.querySelector('#languages-slot'); if(!slot) return true;
    // Attempt to find an existing Languages control rendered elsewhere
    const languages = header.querySelector('[data-lang-menu]') || header.querySelector('.lang') || document.querySelector('[data-lang-menu]') || document.querySelector('.lang') || document.getElementById('languages');
    if(languages){ slot.appendChild(languages); languages.style.position='relative'; languages.style.zIndex='2'; return true; }
    return false;
  }

  function observeLanguages(){
    if(moveLanguagesOnce()) return; // already moved
    const obs=new MutationObserver(()=>{ if(moveLanguagesOnce()){ obs.disconnect(); }});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    // safety: stop after 5s
    setTimeout(()=>obs.disconnect(),5000);
  }

  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function(){
    mountHeader();
    observeLanguages();
  });
})();
