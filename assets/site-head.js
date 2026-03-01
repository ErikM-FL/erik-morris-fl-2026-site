
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
