// Nav background on scroll
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>40),{passive:true});

// 3D hero scene: wireframe core, orbiting shards, particles; reacts to mouse
(function(){
  const canvas=document.getElementById('scene');
  if(!window.THREE||!canvas)return;
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(50,1,0.1,100);
  camera.position.z=9;
  const group=new THREE.Group();scene.add(group);

  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(2.2,1),
    new THREE.MeshBasicMaterial({color:0x52e5d2,wireframe:true,transparent:true,opacity:.55}));
  const inner=new THREE.Mesh(new THREE.IcosahedronGeometry(1.3,0),
    new THREE.MeshBasicMaterial({color:0xff6b8b,wireframe:true}));
  group.add(core,inner);

  const shards=[];
  for(let i=0;i<14;i++){
    const m=new THREE.Mesh(new THREE.OctahedronGeometry(.18+Math.random()*.2),
      new THREE.MeshBasicMaterial({color:i%2?0xff6b8b:0xffd36b,wireframe:true}));
    m.userData={r:3.2+Math.random()*1.6,s:.2+Math.random()*.5,a:Math.random()*6.28,y:(Math.random()-.5)*3};
    group.add(m);shards.push(m);
  }

  const N=500,pos=new Float32Array(N*3);
  for(let i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*26;
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xa9acd6,size:.05})));

  let mx=0,my=0;
  addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});

  function resize(){
    const w=canvas.clientWidth,h=canvas.clientHeight;
    renderer.setSize(w,h,false);camera.aspect=w/h;
    camera.updateProjectionMatrix();
    group.position.x=w>860?3.4:0;group.position.y=w>860?0:2.4;
  }
  addEventListener('resize',resize);resize();

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock=new THREE.Clock();
  (function loop(){
    const t=clock.getElapsedTime();
    if(!reduce){
      core.rotation.y=t*.25;core.rotation.x=t*.12;
      inner.rotation.y=-t*.5;inner.rotation.z=t*.3;
      shards.forEach(m=>{const d=m.userData,a=d.a+t*d.s;
        m.position.set(Math.cos(a)*d.r,d.y+Math.sin(t+d.a)*.3,Math.sin(a)*d.r);
        m.rotation.x=t;m.rotation.y=t*.7;});
      group.rotation.y+=(mx*.8-group.rotation.y)*.05;
      group.rotation.x+=(my*.5-group.rotation.x)*.05;
    }
    const sp=window.__scrollP||0;camera.position.z=9+sp*5;group.rotation.z=sp*1.2;
    renderer.render(scene,camera);
    requestAnimationFrame(loop);
  })();
})();

/* ---- Phase 2 ---- */
// Projects (placeholders: replace with real client projects)
const PROJECTS=[
  {t:'UK Security & Solutions',c:'web',k:'Website',l:'https://www.uksecurityandsolutions.com/',img:'assets/uk-security.jpg',pos:'left top',b:'A professional website for a licensed security company in Patna. It presents manned guarding, CCTV, corporate and event security, a 24/7 control room, a four-step process, a careers page and a callback request form.'},
  {t:'Exotica Cafe & Roastery',c:'web',k:'Website',l:'https://exotica-cafe.pratikkulkarni394.workers.dev/',img:'assets/exotica.jpg',pos:'left top',b:'A website for a specialty coffee roastery in Pune, with a full menu, add-to-order cart, photo gallery, free table reservations, opening hours and contact details.'},
  {t:'Health companion app',c:'app',k:'Mobile app',img:'assets/health-app.png',fit:'contain',bg:'#efeaff',b:'A mobile app for patients. It shows a daily health summary with heart rate and steps, medicine reminders with adherence tracking, and secure chat and video-visit booking with a nurse.'},
  {t:'FleetPulse cold-chain tracking',c:'app',k:'Web app',img:'assets/fleetpulse.jpg',b:'A live dashboard for temperature-controlled shipments. It shows cargo temperature against the safe range, a route map, a journey timeline, driver status, cargo details and a trip event log.'},
  {t:'InvoiceFlow',c:'ai',k:'AI automation · Concept project',img:'assets/invoiceflow.svg',b:'Concept project: an automation that reads supplier invoices from email, checks the details with AI, posts them to the accounts and flags the few that need a person. It shows the weekly count and the hours saved.'},
  {t:'ReplyDesk AI',c:'ai',k:'AI agent · Concept project',img:'assets/replydesk.svg',b:'Concept project: a WhatsApp sales agent that answers customers in seconds, shares prices, sends UPI payment links, scores leads and hands tricky chats to a person.'}
];
const grid=document.getElementById('workGrid'),modal=document.getElementById('modal');
const devScreen=document.querySelector('#mDevice .screen');
function openModal(d){
  mTitle.textContent=d.t;mType.textContent=d.k;mBody.textContent=d.b;
  devScreen.style.background=d.img?(d.bg||'#fff')+' url('+d.img+') center/'+(d.fit||'cover')+' no-repeat':'';
  if(d.l){mLink.href=d.l;mLink.hidden=false}else{mLink.hidden=true}
  modal.hidden=false;mClose.focus();
}
function renderWork(f){
  grid.innerHTML='';
  const list=PROJECTS.filter(p=>f==='all'||p.c===f);
  if(!list.length){grid.innerHTML='<p class="empty">AI agent and automation projects are coming soon.</p>';return}
  list.forEach(p=>{
    const b=document.createElement('button');b.className='project';
    b.innerHTML='<div class="thumb"></div><h3></h3><p></p>';
    b.querySelector('h3').textContent=p.t;b.querySelector('p').textContent=p.k;
    const th=b.querySelector('.thumb');
    if(p.img){th.style.background=(p.bg||'#10143f')+' url('+p.img+') '+(p.pos||'top center')+'/'+(p.fit||'cover')+' no-repeat'}
    else{th.classList.add('site');th.textContent=p.t}
    b.onclick=()=>openModal(p);
    grid.appendChild(b);
  });
}
renderWork('all');
document.getElementById('filters').addEventListener('click',e=>{
  const c=e.target.closest('.chip');if(!c)return;
  document.querySelectorAll('#filters .chip').forEach(x=>x.classList.toggle('on',x===c));
  renderWork(c.dataset.f);
});
mClose.onclick=()=>modal.hidden=true;
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true});
addEventListener('keydown',e=>{if(e.key==='Escape')modal.hidden=true});

// Sample AI agent chat (scripted)
const QA=[
  ['What are your opening hours?','We\'re available 24/7. A human teammate steps in during business hours.'],
  ['Where is my order?','Order #1042 shipped yesterday and arrives Friday. Want the tracking link?'],
  ['Can I get a refund?','Yes. Refunds are accepted within 30 days. I\'ve started yours and emailed the steps.']
];
const log=document.getElementById('chatLog'),opts=document.getElementById('chatOpts');
function say(t,cls){const d=document.createElement('div');d.className='msg '+cls;d.textContent=t;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
QA.forEach(([q,a])=>{
  const b=document.createElement('button');b.className='chip';b.textContent=q;
  b.onclick=()=>{
    say(q,'me');const d=say('','bot typing');d.innerHTML='<i></i><i></i><i></i>';
    setTimeout(()=>{d.className='msg bot';d.textContent='';let k=0;(function w(){d.textContent=a.slice(0,++k);log.scrollTop=log.scrollHeight;if(k<a.length)setTimeout(w,18)})()},900);
  };
  opts.appendChild(b);
});

// Automation flow: light nodes one by one on a loop
const nodes=[...document.querySelectorAll('#flow .node')],arrows=[...document.querySelectorAll('#flow .arrow')];
let n=0;
setInterval(()=>{nodes.forEach((x,i)=>x.classList.toggle('lit',i<n));arrows.forEach((x,i)=>x.classList.toggle('lit',i<n-1));n=(n+1)%(nodes.length+2)},1000);

/* ---- Phase 3 ---- */
// Scroll-driven 3D: expose scroll progress to the hero scene
window.__scrollP=0;
addEventListener('scroll',()=>{window.__scrollP=Math.min(1,scrollY/innerHeight)},{passive:true});

// Counting stats
(function(){
  const els=document.querySelectorAll('[data-count]');
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;io.unobserve(e.target);
    const end=+e.target.dataset.count,t0=performance.now();
    (function tick(t){const k=Math.min(1,(t-t0)/1400);e.target.textContent=Math.round(end*k).toLocaleString()+(k===1?'+':'');if(k<1)requestAnimationFrame(tick)})(t0);
  }),{threshold:.6});
  els.forEach(el=>io.observe(el));
})();

// Service detail popups
const SERVICES={
  app:{t:'Applications',k:'Web and mobile',b:'We design and build web platforms, customer portals, internal tools and iOS/Android apps. You get a clickable prototype first, weekly demos while we build, and full ownership of the code.'},
  ai:{t:'AI agents',k:'Agents that act, not just answer',b:'Agents connect to your data and tools to answer customers, qualify leads, process documents and route work. They hand off to your team when a person is needed, and every action is logged.'},
  auto:{t:'Workflow automation',k:'Replace repeated manual steps',b:'We map your process, then automate invoicing, reporting, data entry, approvals and notifications across the tools you already use, with monitoring so failures never go unnoticed.'}
};
document.querySelectorAll('[data-svc]').forEach(b=>b.addEventListener('click',()=>openModal(SERVICES[b.dataset.svc])));

// Tilt the project device mockup with the mouse
const dev=document.querySelector('#mDevice .screen');
modal.addEventListener('mousemove',e=>{
  if(!dev)return;const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
  dev.style.transform='rotateY('+(x*40)+'deg) rotateX('+(-y*30)+'deg)';
});

// Email automation: every form sends a notification email to the owner (via FormSubmit.co)
const ENDPOINT='https://formsubmit.co/ajax/kulkarnik809@gmail.com';
const PHONE='+91 84215 32011';
function notify(data){
  return fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify(Object.assign({_template:'table',_captcha:'false'},data))}).then(r=>{if(!r.ok)throw 0});
}
function check(f,note){
  let ok=true;
  f.querySelectorAll('input[required],textarea[required]').forEach(x=>{
    let bad=!x.value.trim();
    if(x.type==='email')bad=bad||!/^\S+@\S+\.\S+$/.test(x.value);
    if(x.type==='tel')bad=bad||!/^[+\d][\d\s-]{7,}$/.test(x.value.trim());
    x.classList.toggle('bad',bad);if(bad)ok=false;
  });
  if(!ok){note.style.color='var(--coral)';note.textContent='Please fill in every field correctly.'}
  return ok;
}
function wire(f,note,subject,done){
  f.addEventListener('submit',e=>{
    e.preventDefault();if(!check(f,note))return;
    const data=Object.fromEntries(new FormData(f));data._subject=subject;
    note.style.color='var(--aqua)';note.textContent='Sending...';
    notify(data).then(()=>{f.reset();note.textContent=done}).catch(()=>{
      note.style.color='var(--coral)';note.textContent='Could not send right now. Please call or WhatsApp us on '+PHONE+'.';
    });
  });
}
const form=document.getElementById('form'),note=document.getElementById('formNote');
wire(form,note,'New project brief from Nuvora Labs website','Thanks! We have your brief and will reply within one business day.');

// Call back popup
const cb=document.getElementById('cb'),cbForm=document.getElementById('cbForm'),cbNote=document.getElementById('cbNote');
document.querySelectorAll('[data-callback]').forEach(b=>b.addEventListener('click',()=>{cb.hidden=false;cbForm.elements.name.focus()}));
document.getElementById('cbClose').onclick=()=>cb.hidden=true;
cb.addEventListener('click',e=>{if(e.target===cb)cb.hidden=true});
addEventListener('keydown',e=>{if(e.key==='Escape')cb.hidden=true});
wire(cbForm,cbNote,'Call back request from Nuvora Labs website','Thank you! We will call you back shortly.');

/* ---- Animations ---- */
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOVER=matchMedia('(hover: hover)').matches;

// Loader: shows the logo briefly, then reveals the hero
(function(){
  const L=document.getElementById('loader');if(!L)return;
  const hide=()=>{L.classList.add('hide');document.body.classList.remove('loading');setTimeout(()=>L.remove(),700)};
  addEventListener('load',()=>setTimeout(hide,500));setTimeout(hide,3000);
})();

// Scroll progress bar
const bar=document.getElementById('progress');
addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+'%'},{passive:true});

// Typing words in the hero
(function(){
  const el=document.getElementById('typed');if(!el)return;
  const W=['websites','mobile apps','AI agents','automations','dashboards'];
  if(REDUCE){el.textContent=W[0];return}
  let w=0,c=0,del=false;
  (function tick(){
    const word=W[w];el.textContent=word.slice(0,c);
    if(!del&&c===word.length){del=true;return setTimeout(tick,1400)}
    if(del&&c===0){del=false;w=(w+1)%W.length}
    c+=del?-1:1;setTimeout(tick,del?45:90);
  })();
})();

// Reveal on scroll, staggered inside each group
const RV='h2,.lead,.service,.pack,.deal,.person,blockquote,.post,.steps li,.faq details,.table-wrap,.stats>div,.demo-grid>*';
const rvIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;rvIO.unobserve(e.target);e.target.classList.add('in');
  setTimeout(()=>{e.target.style.transitionDelay='0s'},1300);
}),{threshold:.12});
function addRv(el){
  el.classList.add('rv');
  el.style.transitionDelay=([...el.parentNode.children].indexOf(el)%4)*100+'ms';
  rvIO.observe(el);
}
if(!REDUCE){
  document.querySelectorAll(RV).forEach(addRv);
  grid.querySelectorAll('.project').forEach(addRv);
  new MutationObserver(()=>grid.querySelectorAll('.project:not(.rv)').forEach(addRv)).observe(grid,{childList:true});
}

// 3D tilt on project thumbnails
if(HOVER&&!REDUCE){
  grid.addEventListener('mousemove',e=>{
    const p=e.target.closest('.project');if(!p)return;
    const th=p.querySelector('.thumb'),r=p.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    th.style.transform='perspective(700px) rotateY('+x*14+'deg) rotateX('+(-y*14)+'deg) scale(1.04)';
  });
  grid.addEventListener('mouseout',e=>{
    const p=e.target.closest('.project');
    if(p&&!p.contains(e.relatedTarget))p.querySelector('.thumb').style.transform='';
  });

  // Magnetic buttons
  document.addEventListener('mousemove',e=>{
    const b=e.target.closest&&e.target.closest('.btn,.fab');if(!b)return;
    const r=b.getBoundingClientRect();
    b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.2)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)';
  });
  document.addEventListener('mouseout',e=>{
    const b=e.target.closest&&e.target.closest('.btn,.fab');
    if(b&&!b.contains(e.relatedTarget))b.style.transform='';
  });
}

/* ---- Floating animations ---- */
if(!REDUCE){
  const S=p=>'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';
  const IC={
    code:S('<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>'),
    phone:S('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    robot:S('<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V5M9.5 13h.01M14.5 13h.01M9 16.5h6"/><circle cx="12" cy="3.8" r="1"/>'),
    gear:S('<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>'),
    cloud:S('<path d="M7 18a4 4 0 010-8 5.5 5.5 0 0110.6-1.2A4.6 4.6 0 0117 18z"/>'),
    chart:S('<path d="M5 20V11M12 20V4M19 20v-6"/>'),
    chat:S('<path d="M4 5h16v11H9l-5 4z"/>')
  };
  const pool=[];               // elements that react to the mouse
  const mk=(tag,cls,html)=>{const e=document.createElement(tag);e.className=cls;if(html)e.innerHTML=html;return e};
  function layer(host){const l=mk('div','floaters');host.appendChild(l);return l}
  function item(l,kind,left,top,delay,i){
    const f=mk('div','fl'),inner=mk('div','fli '+(kind==='coin'?'':'tile t'+(i%3)),kind==='coin'?'<span class="coin">₹</span>':IC[kind]);
    f.style.left=left+'%';f.style.top=top+'%';f.dataset.d=(.4+(i%3)*.35).toFixed(2);
    inner.style.animationDelay=delay+'s';inner.style.animationDuration=(5+(i%4))+'s';
    f.appendChild(inner);l.appendChild(f);pool.push(f);
  }
  function cube(host,size,left,top,cls){
    const w=mk('div','cubew');w.style.cssText='left:'+left+'%;top:'+top+'%;--s:'+size+'px';
    w.appendChild(mk('div','cube '+cls,'<i></i><i></i><i></i><i></i><i></i><i></i>'));host.appendChild(w);
  }
  function circuit(sec,atTop){
    const s=mk('div','circuit'+(atTop?' top':''),'<svg viewBox="0 0 1200 36" preserveAspectRatio="none"><defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#ff6b8b"/><stop offset="1" stop-color="#52e5d2"/></linearGradient></defs><path class="base" d="M0 18H180l20-12h120l20 12H620l20 12h140l20-12H1200"/><path class="run" d="M0 18H180l20-12h120l20 12H620l20 12h140l20-12H1200"/></svg>');
    sec.appendChild(s);
  }

  // Section floaters (icons, coins, chat bubbles, 3D shapes, circuit lines)
  const SECT={
    services:[['code',3,8],['phone',93,14],['gear',2,72],['cloud',92,78],['robot',50,1]],
    demo:[['chat',47,6],['robot',94,10],['chart',2,82]],
    packages:[['coin',3,10],['coin',95,36],['coin',5,88],['chat',93,90]],
    about:[['code',93,10],['cloud',2,70]],
    voices:[['gear',3,12],['phone',94,84]],
    insights:[['chart',4,14],['chat',93,80]]
  };
  Object.keys(SECT).forEach(id=>{
    const sec=document.getElementById(id);if(!sec)return;
    const l=layer(sec);SECT[id].forEach((a,i)=>item(l,a[0],a[1],a[2],i*.7,i));
  });
  [['services',54,2,45,''],['packages',46,95,20,'pink'],['voices',50,3,55,''],['contact',56,6,22,'pink'],['about',40,45,86,'']].forEach(a=>{
    const sec=document.getElementById(a[0]);if(sec)cube(sec,a[1],a[2],a[3],a[4]);
  });
  ['demo','work','process','insights','about'].forEach(id=>{const s=document.getElementById(id);if(s)circuit(s,true)});

  // Hero: floating cards, code window, scroll cue
  const hero=document.querySelector('.hero');
  if(hero){
    const l=layer(hero);l.classList.add('hero-f');
    [['AI agent replied in 2 sec','#52e5d2','22%','28%'],['Invoice posted ✓','#ffd36b','46%','5%'],['New order ₹1,150','#ff6b8b','64%','34%']].forEach((c,i)=>{
      const f=mk('div','fl hcard-fl');f.style.top=c[2];f.style.right=c[3];f.dataset.d=(.5+i*.3).toFixed(2);
      const h=mk('div','fli hcard','<b></b>'+c[0]);h.style.setProperty('--c',c[1]);h.style.animationDelay=(i*1.1)+'s';
      f.appendChild(h);l.appendChild(f);pool.push(f);
    });
    const w=mk('div','codewin','<div class="cw-bar"><i></i><i></i><i></i><b>agent.js</b></div><pre></pre>');
    l.appendChild(w);const pre=w.querySelector('pre');
    const L=[['const agent = new Agent("support");',''],['agent.connect(["WhatsApp", "Gmail"]);',''],['await agent.deploy();',''],['// Deployed in 2 sec  ✓','ok']];
    let li=0,ci=0,done='';
    (function tick(){
      if(li>=L.length){setTimeout(()=>{li=0;ci=0;done='';tick()},3200);return}
      const txt=L[li][0],cls=L[li][1];
      pre.innerHTML=done+'<span class="'+cls+'">'+txt.slice(0,ci)+'</span><i class="cur"></i>';
      if(ci<txt.length){ci++;setTimeout(tick,30)}
      else{done+='<span class="'+cls+'">'+txt+'</span>\n';li++;ci=0;setTimeout(tick,350)}
    })();
    const cue=mk('div','scroll-cue','<i></i>');hero.appendChild(cue);
    addEventListener('scroll',()=>cue.classList.toggle('gone',scrollY>80),{passive:true});
  }

  // Soft glowing blobs behind everything
  const bl=mk('div','blobs','<i></i><i></i><i></i>');document.body.appendChild(bl);

  // Rising particles (gold sparks near the contact section)
  (function(){
    const c=mk('canvas','');c.id='dust';document.body.appendChild(c);
    const x=c.getContext('2d'),dpr=Math.min(devicePixelRatio,1.5);let W,H;
    function rs(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
    rs();addEventListener('resize',rs);
    const P=Array.from({length:innerWidth<700?24:46},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.6,v:Math.random()*.5+.2,d:Math.random()*6.28,a:Math.random()*.4+.2}));
    let spark=false;const ct=document.getElementById('contact');
    if(ct)new IntersectionObserver(es=>{spark=es[0].isIntersecting}).observe(ct);
    (function f(t){
      x.clearRect(0,0,W,H);
      P.forEach(p=>{
        p.y-=p.v*(spark?2.6:1);p.x+=Math.sin(t/1500+p.d)*.25;
        if(p.y<-5){p.y=H+5;p.x=Math.random()*W}
        x.globalAlpha=p.a;x.fillStyle=spark?'#ffd36b':'#a9acd6';
        x.beginPath();x.arc(p.x,p.y,p.r*(spark?1.5:1),0,7);x.fill();
      });
      requestAnimationFrame(f);
    })(0);
  })();

  // Mouse parallax for floating items + glowing cursor trail (mouse devices only)
  if(HOVER){
    let raf=0;
    addEventListener('mousemove',e=>{
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        raf=0;const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;
        pool.forEach(f=>{const d=+f.dataset.d*40;f.style.transform='translate('+(-nx*d)+'px,'+(-ny*d)+'px)'});
      });
    },{passive:true});

    const dots=Array.from({length:10},(_,i)=>{
      const d=mk('i','trail');d.style.width=d.style.height=(16-i*1.2)+'px';d.style.opacity=1-i*.09;
      document.body.appendChild(d);return {d:d,x:-50,y:-50,s:(16-i*1.2)/2};
    });
    let mx=-50,my=-50,last=0;
    addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;last=performance.now()},{passive:true});
    (function loop(){
      let px=mx,py=my;const idle=performance.now()-last>1800;
      dots.forEach((o,i)=>{
        o.x+=(px-o.x)*(.38-i*.025);o.y+=(py-o.y)*(.38-i*.025);
        o.d.style.transform='translate('+(o.x-o.s)+'px,'+(o.y-o.s)+'px)';
        o.d.style.visibility=idle?'hidden':'visible';px=o.x;py=o.y;
      });
      requestAnimationFrame(loop);
    })();
  }
}


/* ---- v10: first-impression features ---- */
// Savings calculator
(function(){
  const H=document.getElementById('cH'),R=document.getElementById('cR'),P=document.getElementById('cP');
  if(!H)return;
  const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
  let shown=0;
  function countTo(el,to){
    const from=shown,t0=performance.now();shown=to;
    (function f(t){const k=Math.min(1,(t-t0)/500);el.textContent=inr(from+(to-from)*k);if(k<1)requestAnimationFrame(f)})(t0);
  }
  function calc(){
    oH.textContent=H.value;oR.textContent='₹'+(+R.value).toLocaleString('en-IN');oP.textContent=P.value+'%';
    const m=H.value*4.33*R.value*P.value/100;
    countTo(saveM,m);
    saveY.textContent='That is about '+inr(m*12)+' in a year.';
    payback.textContent='A project like Vistar (₹49,999) could pay for itself in about '+Math.max(1,Math.ceil(49999/m))+' month'+(Math.ceil(49999/m)>1?'s':'')+'.';
  }
  [H,R,P].forEach(i=>i.addEventListener('input',calc));calc();
})();

// "Which package fits me?" helper
(function(){
  const box=document.getElementById('helper');if(!box)return;
  const R=[
    ['Pehla Kadam (from ₹699)','a one-page digital visiting card, ready in 1 to 2 days.'],
    ['Aarambh (₹14,999)','a business website of up to 5 pages, or one automation or AI agent, in 3 to 7 days.'],
    ['Vistar (₹49,999)','a custom web or mobile app with AI features and an admin dashboard, in 1 to 2 weeks or as you need.'],
    ['Shikhar (from ₹25,000 per month)','a developer on your side every month for new features and upkeep.']
  ];
  const packs=document.querySelectorAll('.packages .pack');
  box.addEventListener('click',e=>{
    const b=e.target.closest('[data-h]');if(!b)return;
    const i=+b.dataset.h;
    box.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c===b));
    helperRes.innerHTML='We suggest <strong></strong>: '+R[i][1]+' Every price is negotiable, so <a href="#contact"><u>talk to us</u></a>.';
    helperRes.querySelector('strong').textContent=R[i][0];
    packs.forEach((p,k)=>p.classList.toggle('suggest',k===i));
  });
})();

// Back to top
const topBtn=document.getElementById('totop');
addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>700),{passive:true});
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});

// Highlight the current section in the menu
(function(){
  const links=[...document.querySelectorAll('.nav nav a[href^="#"]')];
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
  }),{rootMargin:'-40% 0px -55% 0px'});
  links.forEach(a=>{const sec=document.querySelector(a.getAttribute('href'));if(sec)io.observe(sec)});
})();

// Reveal the new blocks too
if(!REDUCE)document.querySelectorAll('.ti,.calc>*,.helper,.foot-grid>*').forEach(addRv);
