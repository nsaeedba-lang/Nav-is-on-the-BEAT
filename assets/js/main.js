(function(){
'use strict';
/* Text effects: letters/words rise, typewriter, fade in/out word cycle. */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function mk(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function splitChars(el){
 const text=el.textContent.trim();el.textContent='';
 const sr=mk('span','sr',text);el.appendChild(sr);
 let i=0;
 text.split(' ').forEach((word,wi,arr)=>{
  const wrap=mk('span','wd');wrap.setAttribute('aria-hidden','true');
  [...word].forEach(c=>{const o=mk('span','ch'),n=mk('span',null,c);n.style.setProperty('--i',i++);o.appendChild(n);wrap.appendChild(o)});
  el.appendChild(wrap);if(wi<arr.length-1)el.appendChild(document.createTextNode(' '));
 });
}
function splitWords(el){
 const text=el.textContent.trim();el.textContent='';
 el.appendChild(mk('span','sr',text));
 text.split(/\s+/).forEach((word,i,arr)=>{
  const o=mk('span','w'),n=mk('span',null,word);o.setAttribute('aria-hidden','true');n.style.setProperty('--i',i);o.appendChild(n);
  el.appendChild(o);if(i<arr.length-1)el.appendChild(document.createTextNode(' '));
 });
}
document.querySelectorAll('h2').forEach(h=>{h.classList.add('split');splitChars(h)});
document.querySelectorAll('.split.words').forEach(splitWords);
document.querySelectorAll('.group h3').forEach((h,i)=>{h.classList.add('fx');h.style.setProperty('--d',(i%2)*120+'ms')});

/* typewriter for the tagline */
const tw=document.querySelector('[data-type]');
if(tw&&!reduce){
 const t=tw.querySelector('.t'),r=tw.querySelector('.r'),full=t.textContent;
 t.textContent='';r.textContent=full;tw.classList.add('typing');
 let n=0;
 setTimeout(function tick(){
  n++;t.textContent=full.slice(0,n);r.textContent=full.slice(n);
  if(n<full.length)setTimeout(tick,55+Math.random()*55);
  else setTimeout(()=>tw.classList.add('done'),2400);
 },1500);
}

/* cycling words: fade in, hold, fade out */
const cw=document.querySelector('.cycle-word');
if(cw){
 const words=cw.dataset.words.split('|');
 if(reduce){cw.textContent=words.join(' · ')}
 else{
  let k=0;cw.textContent=words[0];cw.classList.add('fx-word');
  setTimeout(()=>cw.classList.add('show'),3300);
  setTimeout(function loop(){
   cw.classList.remove('show');
   setTimeout(()=>{k=(k+1)%words.length;cw.textContent=words[k];cw.classList.add('show');setTimeout(loop,2400)},650);
  },6000);
 }
}
})();
(function(){
'use strict';
const root=document.documentElement,hero=document.querySelector('.hero');
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
const cards=[...document.querySelectorAll('.card')],headings=[...document.querySelectorAll('h2')],cols=[...document.querySelectorAll('.col')];
const links=[...document.querySelectorAll('nav ul a')],sections=[...document.querySelectorAll('section[id]')];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
let frame=0,current=scrollY,target=scrollY;
function draw(){
 frame=0;target=scrollY;current=reduce.matches?target:current+(target-current)*.12;
 if(Math.abs(current-target)<.15)current=target;
 root.style.setProperty('--sp',clamp(target/Math.max(1,root.scrollHeight-innerHeight)));
 if(!reduce.matches){
  root.style.setProperty('--hp',clamp(current/hero.offsetHeight));
  cards.forEach((card,i)=>{const r=card.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=clamp((innerHeight/2-r.top-r.height/2)/innerHeight,-1,1);card.style.setProperty('--drift',(p*(i%2? -14:14))+'px');card.style.setProperty('--inside',p*22+'px')});
  headings.forEach(h=>{const r=h.getBoundingClientRect();h.style.setProperty('--heading',clamp((innerHeight*.55-r.top)*.035,-6,6)+'px')});
 }
 cols.forEach(col=>{const r=col.getBoundingClientRect();col.style.setProperty('--lp',clamp((innerHeight*.7-r.top)/r.height))});
 let active='';sections.forEach(s=>{if(s.getBoundingClientRect().top<=innerHeight*.5)active=s.id});
 links.forEach(a=>{const on=a.hash==='#'+active;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 if(current!==target)schedule();
}
function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
document.querySelectorAll('.chips span').forEach((s,i)=>s.style.setProperty('--chip',i));
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.reveal,.card,.split,.fx').forEach(el=>io.observe(el));
 root.classList.add('motion-ready');
}
cards.forEach(card=>{
 card.addEventListener('pointermove',e=>{if(reduce.matches||!fine.matches)return;const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;card.style.setProperty('--x',x+'px');card.style.setProperty('--y',y+'px');card.style.setProperty('--rx',(-(y/r.height-.5)*5)+'deg');card.style.setProperty('--ry',((x/r.width-.5)*6)+'deg');card.style.setProperty('--gx',x/r.width*100+'%');card.style.setProperty('--gy',y/r.height*100+'%')});
 card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')});
});
document.querySelectorAll('.btn,.logo').forEach(el=>{
 el.addEventListener('pointermove',e=>{if(reduce.matches||!fine.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--mx',clamp((e.clientX-r.left-r.width/2)*.2,-12,12)+'px');el.style.setProperty('--my',clamp((e.clientY-r.top-r.height/2)*.3,-8,8)+'px')});
 el.addEventListener('pointerleave',()=>{el.style.setProperty('--mx','0px');el.style.setProperty('--my','0px')});
});
hero.addEventListener('pointermove',e=>{if(reduce.matches||!fine.matches)return;const x=e.clientX/innerWidth-.5;hero.style.setProperty('--px',x*18+'px');hero.style.setProperty('--py',x*8+'deg')});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--px','0px');hero.style.setProperty('--py','0deg')});
reduce.addEventListener('change',()=>{current=scrollY;schedule()});schedule();
})();

// Pointer: a single small dot. Fine (mouse) pointers only.
(function(){
 const allowed=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 const root=document.documentElement,dot=document.createElement('div');
 dot.className='pointer-dot';dot.setAttribute('aria-hidden','true');dot.appendChild(document.createElement('i'));document.body.appendChild(dot);
 function hide(){dot.classList.remove('visible','pressed','over','on-card');root.classList.remove('dot-active')}
 document.addEventListener('pointermove',e=>{
  if(!allowed.matches||e.pointerType!=='mouse'||e.target.closest('input,textarea,[contenteditable="true"]')){hide();return}
  dot.style.transform='translate3d('+e.clientX+'px,'+e.clientY+'px,0)';
  dot.classList.add('visible');root.classList.add('dot-active');
  dot.classList.toggle('over',!!e.target.closest('a,button,summary,[role="button"]'));
  dot.classList.toggle('on-card',!!e.target.closest('.card'));
 },{passive:true});
 document.addEventListener('pointerdown',()=>dot.classList.add('pressed'));
 document.addEventListener('pointerup',()=>dot.classList.remove('pressed'));
 root.addEventListener('pointerleave',hide);addEventListener('blur',hide);
 document.addEventListener('keydown',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});allowed.addEventListener('change',hide);
})();



document.querySelectorAll('dialog.case[id]').forEach(dlg=>{
const card = [...document.querySelectorAll('.card')].find(link => link.hash === '#' + dlg.id);
if(!card)return;
const scroller=dlg.querySelector('.case-scroll'),count=dlg.querySelector('.case-count'),figs=[...scroller.querySelectorAll('figure')];
let io;
function update(){
 const max=scroller.scrollHeight-scroller.clientHeight;
 dlg.style.setProperty('--cp',max>0?scroller.scrollTop/max:0);
 const mid=scroller.getBoundingClientRect().top+scroller.clientHeight/2;let cur=0;
 figs.forEach((f,i)=>{if(f.getBoundingClientRect().top<=mid)cur=i});
 count.textContent=(cur+1)+' / '+figs.length;
}
scroller.addEventListener('scroll',update,{passive:true});
card.addEventListener('click',e=>{
 if(typeof dlg.showModal!=='function')return;
 e.preventDefault();
 dlg.showModal();
 scroller.querySelectorAll('img[data-src]').forEach((image, index) => {
  if (index === 0) image.loading = 'eager';
  image.src = image.dataset.src;
  image.removeAttribute('data-src');
 });
 document.documentElement.classList.add('case-open');
 scroller.scrollTop=0;update();
 if('IntersectionObserver' in window&&!io){
  io=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{root:scroller,threshold:.06});
  figs.forEach(f=>io.observe(f));
 }
 scroller.focus({preventScroll:true});
});
dlg.addEventListener('close',()=>document.documentElement.classList.remove('case-open'));
dlg.querySelector('.case-close').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
});




// Hero name swaps between "Navid Saeed" and "Portfolio" every 5 seconds.
(function(){
 const h1=document.querySelector('.name'),hero=document.querySelector('.hero');
 if(!h1||!hero||matchMedia('(prefers-reduced-motion: reduce)').matches||!h1.animate)return;
 const words=['Navid Saeed','Portfolio'];let k=0,busy=false,visible=true;
 if('IntersectionObserver' in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting}).observe(hero);
 function build(word){
  h1.textContent='';
  [...word].forEach((c,i)=>{
   if(c===' '){h1.appendChild(document.createTextNode(' '));return}
   const s=document.createElement('span');s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);s.style.animation='none';s.textContent=c;h1.appendChild(s);
  });
 }
 function swap(){
  if(busy||document.hidden||!visible)return;busy=true;
  const outs=[...h1.querySelectorAll('span')].map((s,i)=>s.animate([{transform:'none',opacity:1},{transform:'translateY(-115%) rotate(-10deg)',opacity:0}],{duration:520,delay:i*32,easing:'cubic-bezier(.7,0,.84,0)',fill:'forwards'}));
  Promise.all(outs.map(a=>a.finished)).catch(()=>{}).then(()=>{
   k=(k+1)%words.length;build(words[k]);
   const ins=[...h1.querySelectorAll('span')].map((s,i)=>s.animate([{transform:'translateY(115%) rotate(10deg)',opacity:0},{transform:'none',opacity:1}],{duration:850,delay:i*48,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
   Promise.all(ins.map(a=>a.finished)).catch(()=>{}).then(()=>{busy=false});
  });
 }
 setTimeout(()=>setInterval(swap,5000),4200);
})();
