
(function(){
  function injectFooter(path){
    fetch(path).then(r=>r.text()).then(html=>{
      var mount=document.getElementById('site-footer');
      if(!mount) return; mount.innerHTML=html;
      // fix links based on current depth
      var home = mount.querySelector('[data-link="home"]');
      var platform = mount.querySelector('[data-link="platform"]');
      var inPages = /\/pages\//.test(location.pathname);
      if(home) home.setAttribute('href', inPages ? '../index.html' : 'index.html');
      if(platform) platform.setAttribute('href', inPages ? 'platform.html' : 'pages/platform.html');
    }).catch(()=>{
      var mount=document.getElementById('site-footer');
      if(mount){ mount.innerHTML='<div class="footer"><div class="footer-inner">Created for free by Erik Morris for Florida — 2026.</div></div>'; }
    });
  }
  var footerPath = (/\/pages\//.test(location.pathname)) ? '../assets/footer.html' : 'assets/footer.html';
  injectFooter(footerPath);
})();
