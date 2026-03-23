
(function(){
  const track=document.getElementById('track');
  if(!track) return; // only run on platform page that has a track
  const slides=Array.from(track.children);
  const prev=document.getElementById('prev');
  const next=document.getElementById('next');
  const dotsWrap=document.getElementById('dots');
  if(!slides.length) return; // nothing to do if markup has no slides
  let index=0,locked=false; const count=slides.length;
  // Build dots only if none present
  if(dotsWrap && !dotsWrap.children.length){
    slides.forEach((_,i)=>{const d=document.createElement('button');d.className='dot';d.type='button';d.setAttribute('role','tab');d.setAttribute('aria-label','Go to slide '+(i+1));d.addEventListener('click',()=>go(i));dotsWrap.appendChild(d);});
  }
  function update(){track.style.transform='translateX(-'+(index*100)+'%)'; if(dotsWrap){Array.from(dotsWrap.children).forEach((d,i)=>d.setAttribute('aria-current', i===index?'true':'false'));}}
  function go(i){ if(locked) return; index=(i+count)%count; locked=true; update(); setTimeout(()=>locked=false,350); }
  if(prev) prev.addEventListener('click',()=>go(index-1));
  if(next) next.addEventListener('click',()=>go(index+1));
  window.addEventListener('keydown',(e)=>{ if(e.key==='ArrowLeft') go(index-1); if(e.key==='ArrowRight') go(index+1); });
  // Swipe
  let sx=0,dx=0,touching=false; track.addEventListener('touchstart',(e)=>{touching=true;sx=e.touches[0].clientX;dx=0;},{passive:true});
  track.addEventListener('touchmove',(e)=>{if(!touching)return; dx=e.touches[0].clientX-sx;},{passive:true});
  track.addEventListener('touchend',()=>{touching=false; if(Math.abs(dx)>50){ if(dx<0) go(index+1); else go(index-1);} });
  // Auto-advance
  const auto=setInterval(()=>go(index+1),7000); document.addEventListener('visibilitychange',()=>{ if(document.hidden) clearInterval(auto); });
  update();
})();
