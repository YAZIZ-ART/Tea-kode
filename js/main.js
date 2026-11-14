(function(){
const LK=window.LK,W=LK.world,WX=LK.weather,P=LK.player,C=LK.cfg,$=id=>document.getElementById(id);
const cv=$('game'),ctx=cv.getContext('2d');
let VH=180,VW=320,K=1,cam={x:0,y:0},last=performance.now(),acc=0,keys={},sv={x:0,y:0},sid=null,splash=[],sCool=0,nw=45;
LK.stat={e:100,uang:140000,nilai:70};WX.auto=false;WX.setWeather('cerah');
LK.setState=s=>{LK.state=s;document.body.className=s};LK.setState('menu');
LK.resize=()=>{const d=Math.min(devicePixelRatio||1,2)*C.res;cv.width=Math.round(innerWidth*d);cv.height=Math.round(innerHeight*d);K=cv.height/VH;VW=cv.width/K};
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
function draw(dt){
 ctx.setTransform(K,0,0,K,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 const E=WX.env();E.sa*=C.shd;const s=LK.state;
 let tx=Math.min(W.W-VW,Math.max(0,P.x-VW/2)),ty=Math.min(W.H-VH,Math.max(0,P.y-VH*.6));
 if(s==='menu'){tx=W.W/2-VW/2+Math.sin(WX.t*.15)*200;ty=60+Math.cos(WX.t*.1)*40;cam.x=tx;cam.y=ty}
 else if(s==='cine'){const u=Math.min(1,LK.cineT/12),e=u*u*(3-2*u);tx=(W.W/2-VW/2)*(1-e)+tx*e;ty=40*(1-e)+ty*e;cam.x=tx;cam.y=ty}
 else{cam.x+=(tx-cam.x)*Math.min(1,dt*8);cam.y+=(ty-cam.y)*Math.min(1,dt*8)}
 const sk=WX.shake,cx=Math.round((cam.x+(Math.random()-.5)*sk)*K)/K,cy=Math.round((cam.y+(Math.random()-.5)*sk)*K)/K;
 ctx.fillStyle='#10131c';ctx.fillRect(0,0,VW,VH);
 W.ground(ctx,cx,cy,VW,VH,E.wet);W.drawPuddles(ctx,cx,cy,E);
 const vis=W.visible(cx,cy,VW,VH);vis.forEach(o=>W.shadow(ctx,o,cx,cy,E));
 const list=vis.map(o=>({b:o.base,o}));list.push({b:P.y,p:1});
 for(const n of LK.npcs.list)if(n.a>.02&&n.x>cx-20&&n.x<cx+VW+20&&n.y>cy&&n.y<cy+VH+40)list.push({b:n.y,n});
 list.sort((a,c)=>a.b-c.b);
 list.forEach(i=>i.p?P.draw(ctx,cx,cy):i.n?LK.npcs.draw(ctx,i.n,cx,cy,WX.cur.rain):W.drawObj(ctx,i.o,cx,cy,E));
 for(let i=splash.length-1;i>=0;i--){const q=splash[i];q.vy+=300*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.l-=dt;if(q.l<=0){splash.splice(i,1);continue}ctx.fillStyle='rgba(190,215,245,.85)';ctx.beginPath();ctx.arc(q.x-cx,q.y-cy,.6,0,6.3);ctx.fill()}
 WX.drawClouds(ctx,VW,VH);WX.drawLight(ctx,VW,VH);if(C.glow)W.glow(ctx,vis,cx,cy,E);
 WX.drawLeaves(ctx,VW,VH,dt);WX.drawRain(ctx,VW,VH,cx,cy,dt);WX.drawFog(ctx,VW,VH);
 ctx.drawImage(VG,0,0,VW,VH);
 if(s==='cine'){const h=VH*.11*Math.min(1,LK.cineT/1.5);ctx.fillStyle='#000';ctx.fillRect(0,0,VW,h);ctx.fillRect(0,VH-h,VW,h)}}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;const s=LK.state;
 if(s==='cine'){WX.hour=18.6;LK.cineTick(dt)}
 else if(C.real){const d=new Date();WX.hour=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600}
 else if(s==='play')WX.hour=(WX.hour+dt*.08)%24;
 nw-=dt;if(C.rnd&&s!=='cine'&&nw<=0){nw=60+Math.random()*120;const r=Math.random();WX.setWeather(r<.4?'cerah':r<.7?'mendung':r<.92?'hujan':'badai')}
 if(s==='play'){const[ix,iy]=input();P.update(dt,ix,iy);sCool-=dt;
  if(P.moving&&WX.wet>.1&&sCool<=0)for(const p of W.puddles)if(Math.abs(p.x-P.x)<p.w&&Math.abs(p.y-P.y)<p.w*.5){sCool=.25;for(let i=0;i<6;i++)splash.push({x:P.x,y:P.y-1,vx:(Math.random()-.5)*50,vy:-40-Math.random()*40,l:.35});LK.audio.splash();break}}
 if(s!=='dlg')LK.npcs.update(dt,WX.hour,WX.cur.rain);
 WX.update(dt);
 acc+=dt;if(acc>.25){acc=0;LK.audio.update(WX);$('clock').textContent=LK.tod(WX.hour)+' · '+WX.clock();$('stat').textContent='Energi '+LK.stat.e+' · Rp '+LK.stat.uang.toLocaleString('id-ID')+' · Nilai '+LK.stat.nilai}
 LK.audio.tick(dt,WX);draw(dt);requestAnimationFrame(loop)}
LK.openMenu(false);requestAnimationFrame(loop);
})();
