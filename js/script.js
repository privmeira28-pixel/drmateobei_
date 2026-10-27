(function(){
  var doc=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');

  var top=document.getElementById('top');
  var bar=document.querySelector('.progress');
  var toTop=document.querySelector('.to-top');
  var frame=document.querySelector('.frame img');

  // topo, barra de progresso, botão voltar e paralaxe
  function onScroll(){
    var y=window.scrollY, h=doc.scrollHeight-innerHeight;
    top.classList.toggle('scrolled',y>40);
    bar.style.setProperty('--p',h>0?y/h:0);
    toTop.classList.toggle('show',y>innerHeight);
    if(frame&&!reduce){
      var r=frame.parentElement.getBoundingClientRect();
      frame.style.setProperty('--py',((r.top+r.height/2-innerHeight/2)*-0.08).toFixed(1)+'px');
    }
  }
  addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  // menu do celular
  var burger=document.getElementById('burger'), nav=document.getElementById('nav');
  function setMenu(open){
    nav.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',open);
    burger.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    document.body.style.overflow=open?'hidden':'';
  }
  burger.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // elementos aparecem ao rolar, em sequência dentro do mesmo grupo
  var els=document.querySelectorAll('.reveal');
  els.forEach(function(e){
    var sib=[].filter.call(e.parentElement.children,function(c){return c.classList.contains('reveal')});
    e.style.setProperty('--d',(sib.indexOf(e)*0.09)+'s');
  });
  if(reduce||!('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in')});
  }else{
    var io=new IntersectionObserver(function(en){
      en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}});
    },{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e)});
  }

  // destaca no menu a seção visível
  var links={};
  nav.querySelectorAll('a[href^="#"]').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(en){
      en.forEach(function(x){var a=links[x.target.id]; if(a) a.classList.toggle('active',x.isIntersecting)});
    },{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(links).forEach(function(id){var s=document.getElementById(id); if(s) so.observe(s)});
  }

  // cards de especialidade: inclinação 3D e brilho seguindo o mouse
  if(!reduce&&matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.tilt').forEach(function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
        c.style.transform='perspective(800px) rotateX('+((0.5-y)*8)+'deg) rotateY('+((x-0.5)*10)+'deg) translateY(-6px)';
        c.style.setProperty('--mx',x*100+'%'); c.style.setProperty('--my',y*100+'%');
      });
      c.addEventListener('mouseleave',function(){c.style.transform=''});
    });
  }

  // FAQ: uma resposta aberta por vez
  var ds=document.querySelectorAll('.faq details');
  ds.forEach(function(d){d.addEventListener('toggle',function(){
    if(d.open) ds.forEach(function(o){if(o!==d) o.open=false});
  })});

  var yr=document.getElementById('year'); if(yr) yr.textContent=new Date().getFullYear();
})();
