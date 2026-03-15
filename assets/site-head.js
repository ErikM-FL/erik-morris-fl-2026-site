
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
