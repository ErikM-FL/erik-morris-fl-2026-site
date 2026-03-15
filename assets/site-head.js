
(function(){
  try{
    var path = location.pathname;
    // If we are in /pages/, use ../assets/styles.css; else assets/styles.css
    var href = (/\/pages\//.test(path)) ? '../assets/styles.css' : 'assets/styles.css';
    // If already present, skip
    if(!document.querySelector('link[href$="assets/styles.css"], link[href$="../assets/styles.css"')){
      var l=document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l);
    }
  }catch(e){/* noop */}
})();

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
/* === Add-to-bottom: create a row-2 & adopt Languages into it (append-only) === */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // Moves / adopts Languages control into a dedicated row-2 under the header
  function installRow2AndMoveLanguages() {
    const header = document.querySelector('header.site-header');
    if (!header) return false;

    // Ensure a row-2 exists right after the first row-like container
    let row2 = header.querySelector('.row-2');
    if (!row2) {
      row2 = document.createElement('div');
      row2.className = 'row-2';
      const firstRow = header.querySelector('.header-row') || header.firstElementChild || header;
      (firstRow.parentNode || header).insertBefore(row2, firstRow.nextSibling);
    }

    // Find Languages (GT and common variants), wherever it lives
    const candidates = [
      document.getElementById('google_translate_element'),
      header.querySelector('[data-lang-menu]'),
      header.querySelector('.lang'),
      document.querySelector('[data-lang-menu]'),
      document.querySelector('.lang'),
      document.getElementById('languages')
    ].filter(Boolean);

    const lang = candidates.find(el => el && el.parentNode);
    if (!lang) return false;

    // Move it into row-2, mark it so CSS can style it, and ensure it's on top
    if (lang !== row2.firstElementChild) {
      row2.appendChild(lang);
      if (!lang.id) lang.id = 'google_translate_element';
      lang.classList.add('lang');
      lang.style.position = 'relative';
      lang.style.zIndex = '5';
      lang.style.color = '#fff';
    }
    return true;
  }

  ready(function () {
    // Try immediately; if Languages appears late (e.g., GT), observe briefly
    if (installRow2AndMoveLanguages()) return;
    const stopAt = Date.now() + 10000; // 10s window
    const obs = new MutationObserver(() => {
      if (installRow2AndMoveLanguages() || Date.now() > stopAt) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), 12000);
  });
})();
