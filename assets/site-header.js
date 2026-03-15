
/* ===============================================
   /assets/site-header.js  — SAFE ROLLBACK + ROW‑2 ADD‑ON
   1) Loads your last known good header script from the BACKUP branch.
   2) After it renders, creates a second row and moves the Languages control there.
   3) Injects small, global CSS for ballot GIF sizing (body) + header row‑2.
   ----------------------------------------------- */
(function(){
  const RAW_ORIGINAL_JS = 'https://raw.githubusercontent.com/ErikM-FL/erik-morris-fl-2026-site/refs/heads/backup/assets/site-header.js';

  // --- tiny CSS injector ---
  function injectCSS(css){
    const style = document.createElement('style');
    style.setAttribute('data-source','header-row2-addon');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Global CSS: header row-2 + ballot size fixes (non-destructive)
  injectCSS([
    'header.site-header .row-2{display:flex;align-items:center;gap:12px;margin-top:6px}',
    'header.site-header #languages-slot{display:inline-flex;align-items:center;position:relative;z-index:2}',
    'header.site-header [data-lang-menu],header.site-header .lang{position:relative;z-index:2;color:#fff}',
    '/* body ballot image frame (smaller like live) */',
    '.ballot-block{max-width:740px;margin:14px auto;padding:6px;border:1px solid var(--stroke);border-radius:6px;background:var(--card,transparent);box-shadow:0 1px 8px rgba(0,0,0,.16);overflow:hidden}',
    '.ballot-block img{display:block;max-width:100%;height:auto}',
    '.ballot-block img[src*="write-in-ballot"]{margin-bottom:-8px}',
    'figure img[src*="write-in-ballot"]{display:block;max-width:100%;height:auto}',
    'figure:has(> img[src*="write-in-ballot"]) {max-width:740px;margin:14px auto;padding:6px;border:1px solid var(--stroke);border-radius:6px;background:var(--card,transparent);box-shadow:0 1px 8px rgba(0,0,0,.16);overflow:hidden}'
  ].join('
'));

  // 1) Load the last working header (from BACKUP branch) and execute it
  function loadOriginalHeader(){
    return fetch(RAW_ORIGINAL_JS, {cache:'no-store', credentials:'omit'})
      .then(r => { if(!r.ok) throw new Error('Failed to fetch original header: '+r.status); return r.text(); })
      .then(code => {
        const s = document.createElement('script');
        s.type='text/javascript';
        s.text = code + '
//# sourceURL=backup-site-header.js';
        document.head.appendChild(s);
      });
  }

  // 2) After header exists, add row‑2 and move Languages
  function ensureRow2AndMoveLanguages(){
    const header = document.querySelector('header.site-header'); if(!header) return;

    // create row‑2 once
    let row2 = header.querySelector('.row-2');
    if(!row2){
      row2 = document.createElement('div');
      row2.className = 'row-2';
      // place after the first header row
      const row1 = header.querySelector('.header-row') || header.firstElementChild;
      if(row1 && row1.parentNode) row1.parentNode.insertBefore(row2, row1.nextSibling); else header.appendChild(row2);
      // slot for Languages
      const slot = document.createElement('div'); slot.id = 'languages-slot'; slot.setAttribute('aria-label','Language selector');
      row2.appendChild(slot);
    }

    // find existing Languages control (keep all working selectors)
    const languages = header.querySelector('#google_translate_element') ||
                      header.querySelector('[data-lang-menu]') ||
                      header.querySelector('.lang') ||
                      document.getElementById('google_translate_element') ||
                      document.querySelector('[data-lang-menu]') ||
                      document.querySelector('.lang') ||
                      document.getElementById('languages');
    if(languages && languages.parentNode !== row2){
      row2.appendChild(languages);
      languages.style.position='relative';
      languages.style.zIndex='2';
      languages.style.color='#fff'; // keep white text
    }
  }

  // 3) Observe in case Languages is injected later (e.g., Google Translate)
  function observeLanguages(){
    const obs = new MutationObserver(()=>{ ensureRow2AndMoveLanguages(); });
    obs.observe(document.documentElement, {childList:true, subtree:true});
    // stop after 6s (enough for GTM/Translate to appear)
    setTimeout(()=>obs.disconnect(), 6000);
  }

  function ready(fn){ if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', fn); } else fn(); }

  // Run
  ready(function(){
    loadOriginalHeader()
      .then(()=>{ ensureRow2AndMoveLanguages(); observeLanguages(); })
      .catch(err=>{ console.warn('[header-rollback] Could not load original header from backup:', err); /* as a fallback, still try to move if header exists */ ensureRow2AndMoveLanguages(); observeLanguages(); });
  });
})();
