
(function(){
  function positionMenu(){
    try{
      var hdr = document.querySelector('.site-header');
      var menu = document.querySelector('.site-header__menu');
      if(!hdr || !menu) return;
      var rect = hdr.getBoundingClientRect();
      var top = Math.max(56, rect.bottom + 8);
      menu.style.top = top + 'px';
      // Keep right aligned to viewport (fixed)
    }catch(e){}
  }
  function onOpen(){ positionMenu(); }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', positionMenu);
  }else{ positionMenu(); }
  window.addEventListener('resize', positionMenu);

  // Also hook into the header button if present
  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('#langBtn');
    if(btn){ setTimeout(positionMenu, 0); }
  }, true);
})();
