
/* =============================
   /assets/site-header.js  (FULL REPLACEMENT)
   Injects a two-row header globally and places the Languages control on row-2
   ============================= */
(function(){
  function h(tag, attrs={}, children=[]) {
    const el = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v; else el.setAttribute(k,v);
    }
    (Array.isArray(children)?children:[children]).forEach(c=>{ if(c) el.appendChild(c); });
    return el;
  }

  function buildHeader(){
    const container1 = h('div',{class:'container'});
    const container2 = h('div',{class:'container'});

    // Row 1
    const brand = h('div',{class:'brand-wrap'},[
      h('a',{class:'brand', href:'/' , html:'Erik Morris 2026'})
    ]);

    const nav = h('nav',{class:'main-nav', 'aria-label':'Primary'},[
      h('a',{href:'/' , html:'Home'}),
      h('a',{href:'/platform.html', html:'Platform'}),
      h('a',{href:'/pages/how-to-write-in-en.html', html:'Voting &amp; Write-In Candidate'}),
      h('a',{href:'/about.html', html:'About Erik'})
    ]);

    const right = h('div',{class:'header-right'},[
      h('img',{src:'/assets/emtest.png', alt:'emtest'}),
      h('img',{src:'/assets/write-in.gif', alt:'write-in header'})
    ]);

    const row1 = h('div',{class:'header-row row-1'},[]);
    row1.appendChild(brand);
    row1.appendChild(nav);
    row1.appendChild(right);
    container1.appendChild(row1);

    // Row 2 (Languages slot)
    const row2 = h('div',{class:'header-row row-2'},[]);
    const slot = h('div',{id:'languages-slot', 'aria-label':'Language selector'});
    row2.appendChild(slot);  // column 1
    row2.appendChild(h('div')); // empty column to keep grid structure
    container2.appendChild(row2);

    const header = h('header',{class:'site-header'},[container1, container2]);
    return header;
  }

  function mountHeader(){
    let mount = document.getElementById('site-header');
    if (!mount) { mount = document.createElement('div'); mount.id='site-header'; document.body.insertBefore(mount, document.body.firstChild); }
    // Clear and inject
    mount.innerHTML='';
    mount.appendChild(buildHeader());
  }

  function moveLanguages(){
    const header = document.querySelector('header.site-header');
    if (!header) return;

    // Support several possible selectors for the Languages control
    const languages = header.querySelector('[data-lang-menu]') ||
                      header.querySelector('.lang') ||
                      document.querySelector('[data-lang-menu]') ||
                      document.querySelector('.lang') ||
                      document.getElementById('languages');

    const slot = header.querySelector('#languages-slot');
    if (languages && slot && languages !== slot.firstElementChild) {
      slot.appendChild(languages);
      // ensure it’s visible and not absolutely positioned by old styles
      languages.style.position='relative';
      languages.style.zIndex='2';
    }

    // Keep predictable order for emtest + write-in.gif (safety)
    const gif    = header.querySelector('img[src*="write-in.gif"]');
    const emtest = header.querySelector('img[src*="emtest.png"]');
    if (gif && emtest && emtest.nextSibling !== gif) {
      emtest.parentNode.insertBefore(gif, emtest.nextSibling);
    }
  }

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }

  ready(function(){
    mountHeader();
    moveLanguages();
  });
})();
