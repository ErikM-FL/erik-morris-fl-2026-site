// Inject a "Read More…" button into FIFA overview page
(function(){
  function add(){
    if(!/\/pages\/fifa\.html(\?|$)/.test(location.pathname)) return;
    var hero = document.querySelector('.hero .hero-content');
    if(!hero) return;
    if(hero.querySelector('.hero-cta[data-id="fifa-readmore"]')) return;
    var h2 = hero.querySelector('h2') || hero;
    var a = document.createElement('a');
    a.className = 'btn primary hero-cta';
    a.setAttribute('data-id','fifa-readmore');
    a.href = '/pages/fifa-details.html';
    a.textContent = 'Read More…';
    h2.insertAdjacentElement('afterend', a);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
