
/* Optional bootstrap: ensures the header appears even if pages lack the anchor and assets link */
(function(){
  if(!document.querySelector('link[href$="/assets/site-header.css"]')){
    var l=document.createElement('link'); l.rel='stylesheet'; l.href='/assets/site-header.css'; document.head.appendChild(l);
  }
  if(!document.querySelector('script[src$="/assets/site-header.js"]')){
    var s=document.createElement('script'); s.src='/assets/site-header.js'; s.defer=true; document.head.appendChild(s);
  }
  if(!document.getElementById('site-header')){
    var a=document.createElement('div'); a.id='site-header'; document.body.insertBefore(a, document.body.firstChild);
  }
})();
