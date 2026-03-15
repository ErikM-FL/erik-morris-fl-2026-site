
(function(){
  // 1) Force-load latest CSS LAST with cache-busting so it overrides any earlier inline styles
  try{
    var v = 'v3';
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/site-header.css?' + v;
    (document.head || document.body).appendChild(link);
  }catch(e){}

  // 2) Placeholder scrubber: hide any visible << or >> artifacts (encoded or not) without altering structure
  function scrubPlaceholders(){
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var nodes = []; var n;
    while((n = walker.nextNode())){ nodes.push(n); }
    nodes.forEach(function(t){
      var s = t.nodeValue;
      if(!s) return;
      var s2 = s.replace(/<<|&lt;&lt;|<</g, '')
                .replace(/>>|&gt;&gt;|>>/g, '');
      if(s2 !== s){ t.nodeValue = s2; }
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', scrubPlaceholders);
  }else{ scrubPlaceholders(); }

  // 3) Safety: ensure the Languages dropdown sits above everything by nudging z-index at runtime
  function boostZ(){
    var hdr = document.querySelector('.site-header'); if(hdr){ hdr.style.zIndex = '9999'; hdr.style.position='relative'; }
    var lang = document.querySelector('.site-header__lang'); if(lang){ lang.style.zIndex='10000'; lang.style.position='relative'; }
    var menu = document.querySelector('.site-header__menu'); if(menu){ menu.style.zIndex='10001'; }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boostZ);
  }else{ boostZ(); }
})();
