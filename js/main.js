(function(){
const LK=window.LK,W=LK.world,WX=LK.weather,P=LK.player,C=LK.cfg,$=id=>document.getElementById(id);
const cv=$('game'),ctx=cv.getContext('2d'),eb=$('err');
let VH=180,VW=320,K=1,cam={x:0,y:0},last=performance.now(),acc=0,keys={},sv={x:0,y:0},sid=null,nw=45,ft=.016,ta=0,stp=0,hc=0;
LK.q=1;LK.stat={e:100,uang:140000,nilai:70};WX.auto=false;WX.setWeather('cerah');
LK.err=e=>{eb.style.display='block';eb.textContent=String(e&&e.stack||e).slice(0,300)};
addEventListener('error',e=>LK.err(e.error||e.message));
LK.setState=s=>{LK.state=s;document.body.className=s};LK.setState('menu');
LK.resize=()=>{const b=Math.min(devicePixelRatio||1,2)*C.res,d=b*LK.q;cv.width=Math.round(innerWidth*d);cv.height=Math.round(innerHeight*d);K=cv.height/VH;VW=cv.width/K;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';LK.setScale(b*innerHeight/VH)};
addEventListener('resize',LK.resize);LK.applyCfg();
const KEY='lampukota.v2';
LK.hasSave=()=>!!localStorage.getItem(KEY);
LK.load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));P.x=s.x;P.y=s.y;Object.assign(LK.stat,s.st)}catch(e){}};
LK.save=()=>{try{localStorage.setItem(KEY,JSON.stringify({x:P.x,y:P.y,st:LK.stat}))}catch(e){}};
setInterval(()=>{if(LK.state==='play')LK.save()},5000);
LK.tod=h=>h<5||h>=19?'Malam':h<10.5?'Pagi':h<15?'Siang':'Sore';
const st=$('stick'),kn=$('knob');
function mv(e){const r=st.getBoundingClientRect(),R=r.width/2;let dx=e.clientX-(r.left+R),dy=e.clientY-(r.top+R),d=Math.hypot(dx,dy);if(d>R){dx*=R/d;dy*=R/d}sv.x=dx/R;sv.y=dy/R;kn.style.transform='translate('+dx+'px,'+dy+'px)'}
st.onpointerdown=e=>{sid=e.pointerId;st.setPointerCapture(sid);mv(e)};
st.onpointermove=e=>{if(e.pointerId===sid)mv(e)};
st.onpointerup=st.onpointercancel=()=>{sid=null;sv.x=sv.y=0;kn.style.transform='translate(0,0)'};
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=1;if(e.key==='Escape'&&LK.state==='play')LK.openMenu(true)});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
const input=()=>{let x=sv.x,y=sv.y;if(keys.a||keys.arrowleft)x-=1;if(keys.d||keys.arrowright)x+=1;if(keys.w||keys.arrowup)y-=1;if(keys.s||keys.arrowdown)y+=1;return[x,y]};
cv.onpointerdown=e=>{if(LK.state==='cine'&&LK.cineT>1){LK.endCine();return}if(LK.state!=='play')return;
 const r=cv.getBoundingClientRect(),wx=cam.x+(e.clientX-r.left)/r.width*VW,wy=cam.y+(e.clientY-r.top)/r.height*VH;
 for(const n of LK.npcs.list)if(n.a>.5&&Math.hypot(n.x-wx,n.y-14-wy)<14&&Math.hypot(n.x-P.x,n.y-P.y)<70){LK.npcs.talk(n);break}};
const VG=document.createElement('canvas');VG.width=VG.height=64;
{const g=VG.getContext('2d'),r=g.createRadialGradient(32,32,18,32,32,46);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,'rgba(0,0,0,.4)');g.fillStyle=r;g.fillRect(0,0,64,64)}
const surf=()=>{const tx=P.x/16|0,ty=P.y/16|0,mx=tx%20,my=ty%20;return(mx<4||my<4)?(WX.wet>.2?'wet':'road'):(mx===4||mx===19||my===4||my===19)?'walk':'grass'};
function rays(c,vw,vh){const h=WX.hour,low=Math.max(0,1-Math.min(Math.abs(h-7.5),Math.abs(h-17))/2.5),a=low*(1-WX.cur.cloud)*(1-WX.dark)*.12;if(a<.01)return;
 c.globalCompositeOperation='lighter';const dx=(h<12?1:-1)*vh*.5;
 for(let i=0;i<4;i++){const x0=vw*(.1+i*.25)+Math.sin(WX.t*.2+i)*10,g=c.createLinearGradient(x0,0,x0+dx,vh);g.addColorStop(0,'rgba(255,225,160,'+a+')');g.addColorStop(1,'rgba(255,225,160,0)');c.fillStyle=g;c.beginPath();c.moveTo(x0,0);c.lineTo(x0+22,0);c.lineTo(x0+22+dx,vh);c.lineTo(x0+dx,vh);c.fill()}
 c.globalCompositeOperation='source-over'}
function draw(dt){
 ctx.setTransform(K,0,0,K,0,0);
 const E=WX.env();E.sa*=C.shd;const s=LK.state;
 let tx=Math.min(W.W-VW,Math.max(0,P.x-VW/2)),ty=Math.min(W.H-VH,Math.max(0,P.y-VH*.6));
 if(s==='menu'){tx=W.W/2-VW/2+Math.sin(WX.t*.15)*200;ty=60+Math.cos(WX.t*.1)*40;cam.x=tx;cam.y=ty}
 else if(s==='cine'){const u=Math.min(1,LK.cineT/12),e=u*u*(3-2*u);tx=(W.W/2-VW/2)*(1-e)+tx*e;ty=40*(1-e)+ty*e;cam.x=tx;cam.y=ty}
 else{cam.x+=(tx-cam.x)*Math.min(1,dt*8);cam.y+=(ty-cam.y)*Math.min(1,dt*8)}
 const sk=WX.shake,cx=Math.round((cam.x+(Math.random()-.5)*sk)*K)/K,cy=Math.round((cam.y+(Math.random()-.5)*sk)*K)/K;
 ctx.fillStyle='#3a3f4a';ctx.fillRect(0,0,VW,VH);
 W.ground(ctx,cx,cy,VW,VH,E.wet);W.drawPuddles(ctx,cx,cy,E);LK.veh.lights(ctx,cx,cy,E,WX.t);
 const vis=W.visible(cx,cy,VW,VH);vis.forEach(o=>W.shadow(ctx,o,cx,cy,E));
 const list=vis.map(o=>({b:o.base,o}));list.push({b:P.y,p:1});
 for(const n of LK.npcs.list)if(n.a>.02&&n.x>cx-20&&n.x<cx+VW+20&&n.y>cy&&n.y<cy+VH+40)list.push({b:n.y,n});
 for(const v of LK.veh.list)if(v.x>cx-40&&v.x<cx+VW+40&&v.y>cy-30&&v.y<cy+VH+40)list.push({b:v.base,v});
 list.sort((a,c)=>a.b-c.b);
 for(const i of list)i.p?P.draw(ctx,cx,cy):i.n?LK.npcs.draw(ctx,i.n,cx,cy,WX.cur.rain):i.v?LK.veh.draw(ctx,i.v,cx,cy):W.drawObj(ctx,i.o,cx,cy,E);
 LK.fx.draw(ctx,cx,cy);
 WX.drawClouds(ctx,VW,VH);WX.drawLight(ctx,VW,VH);if(C.glow){W.glow(ctx,vis,cx,cy,E);LK.veh.glow(ctx,cx,cy,E)}rays(ctx,VW,VH);
 WX.drawLeaves(ctx,VW,VH,dt);WX.drawRain(ctx,VW,VH,cx,cy,dt);WX.drawFog(ctx,VW,VH);
 ctx.drawImage(VG,0,0,VW,VH);
 if(s==='cine'){const h=VH*.11*Math.min(1,LK.cineT/1.5);ctx.fillStyle='#000';ctx.fillRect(0,0,VW,h);ctx.fillRect(0,VH-h,VW,h)}}
function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;const s=LK.state;
 ft+=(dt-ft)*.05;ta+=dt;if(C.auto&&ta>1.5){ta=0;if(ft>.037&&LK.q>.55){LK.q=Math.max(.5,LK.q-.1);LK.resize()}else if(ft<.019&&LK.q<1){LK.q=Math.min(1,LK.q+.05);LK.resize()}}
 if(s==='cine'){WX.hour=18.6;LK.cineTick(dt)}
 else if(C.real){const d=new Date();WX.hour=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600}
 else if(s==='play')WX.hour=(WX.hour+dt*.08)%24;
 nw-=dt;if(C.rnd&&s!=='cine'&&nw<=0){nw=60+Math.random()*120;const r=Math.random();WX.setWeather(r<.4?'cerah':r<.7?'mendung':r<.92?'hujan':'badai')}
 if(s==='play'){const px=P.x,py=P.y,[ix,iy]=input();P.update(dt,ix,iy);
  if(P.moving){stp+=Math.hypot(P.x-px,P.y-py);if(stp>10){stp=0;LK.audio.step(surf())}}
  hc-=dt;const hv=LK.veh.hit(P);
  if(hv&&hc<=0){hc=2;LK.stat.e=Math.max(0,LK.stat.e-8);WX.shake=4;LK.audio.hit();LK.audio.horn();const ox=P.x,oy=P.y;
   if(hv.ax==='h')P.y+=(P.y<hv.y?-1:1)*(hv.wd/2+7);else P.x+=(P.x<hv.x?-1:1)*(hv.wd/2+7);if(W.hit(P.x,P.y)){P.x=ox;P.y=oy}
   for(let i=0;i<8;i++)LK.fx.add({x:P.x,y:P.y-8,vx:(Math.random()-.5)*60,vy:-30-Math.random()*30,t:.4,r:.8,g:200,col:'255,220,120',a:.9})}
  LK.stat.e=Math.min(100,LK.stat.e+dt*.3);
  if(P.moving&&WX.wet>.1)for(const p of W.puddles)if(Math.abs(p.x-P.x)<p.w&&Math.abs(p.y-P.y)<p.w*.5){if(Math.random()<dt*10){for(let i=0;i<5;i++)LK.fx.add({x:P.x,y:P.y-1,vx:(Math.random()-.5)*50,vy:-40-Math.random()*40,t:.35,r:.7,g:300,col:'190,215,245',a:.85});LK.audio.step('wet')}break}}
 if(s!=='dlg'){LK.npcs.update(dt,WX.hour,WX.cur.rain);LK.veh.update(dt,WX.t,WX.wet)}
 LK.fx.update(dt,WX.wet);WX.update(dt);LK.warm();
 acc+=dt;if(acc>.25){acc=0;LK.audio.update(WX);$('clock').textContent=LK.tod(WX.hour)+' · '+WX.clock();$('stat').textContent='Energi '+Math.round(LK.stat.e)+' · Rp '+LK.stat.uang.toLocaleString('id-ID')+' · Nilai '+LK.stat.nilai}
 LK.audio.tick(dt,WX);draw(dt)}
function loop(now){requestAnimationFrame(loop);try{frame(now)}catch(e){LK.err(e)}}
LK.resize();LK.openMenu(false);requestAnimationFrame(loop);
})();
