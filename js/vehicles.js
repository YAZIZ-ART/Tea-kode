(function(){
const LK=window.LK,rr=LK.rr,fl=[],list=[],LEN={h:1280,v:960};
const COL=['#c0392b','#2c6fbb','#e8e8ee','#2f8a4a','#f0b429','#6a4a98','#2a3038'];
let s=3;const rnd=()=>(s=s*16807%2147483647)/2147483647;
const VENT=[[100,30],[420,350],[740,690],[1060,50],[200,350],[600,32]];
LK.fx={l:fl,add(p){if(fl.length<260){p.m=p.t;fl.push(p)}},
 update(dt,wet){for(let i=fl.length-1;i>=0;i--){const p=fl[i];p.t-=dt;if(p.t<=0){fl.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g||0)*dt;p.r+=(p.gr||0)*dt}
  for(const v of VENT)if(Math.random()<dt*(1.5+wet*3))LK.fx.add({x:v[0]+(Math.random()-.5)*3,y:v[1],vx:(Math.random()-.5)*4,vy:-12,t:1.8,r:1.6,gr:2.4,col:'235,240,245',a:.22})},
 draw(c,cx,cy){for(const p of fl){c.fillStyle='rgba('+p.col+','+p.a*p.t/p.m+')';c.beginPath();c.arc(p.x-cx,p.y-cy,p.r,0,6.3);c.fill()}}};
function add(ax,road,dir,type,i){const len=type==='motor'?10:type==='bus'?30:18;
 list.push({ax,dir,type,len,wd:type==='motor'?5:type==='bus'?12:10,lane:road*320+(ax==='h'?(dir>0?20:44):(dir>0?44:20)),s:(i*420+rnd()*160+road*97)%LEN[ax],v:0,vm:(type==='bus'?32:type==='motor'?62:46)+rnd()*14,col:COL[rnd()*COL.length|0],br:0,x:0,y:0,base:0})}
for(let r=0;r<3;r++)for(const d of[1,-1])for(let i=0;i<3;i++)add('h',r,d,i===2?(rnd()<.5?'bus':'motor'):i===1?'motor':'car',i);
for(let r=0;r<4;r++)for(const d of[1,-1])for(let i=0;i<2;i++)add('v',r,d,i?'motor':'car',i);
const ph=t=>{const p=t%24;return{h:p<10?'g':p<12?'y':'r',v:p<12?'r':p<22?'g':'y'}};
LK.veh={list,
 update(dt,t,wet){const g=ph(t);
  for(const v of list){const G=g[v.ax]==='g',Ln=LEN[v.ax];let vt=v.vm;
   if(!G){const front=v.s+v.dir*v.len/2;for(let j=0;j*320<Ln;j++){const line=v.dir>0?j*320-5:j*320+69,d=(line-front)*v.dir;if(d>-.5&&d<26)vt=Math.min(vt,Math.max(0,d)*2.4)}}
   for(const o of list)if(o!==v&&o.ax===v.ax&&o.lane===v.lane&&o.dir===v.dir){const d=(o.s-v.s)*v.dir;if(d>0){const gap=d-(o.len+v.len)/2-3;if(gap<22)vt=Math.min(vt,Math.max(0,o.v*(gap/22)))}}
   v.v+=Math.max(-100*dt,Math.min(45*dt,vt-v.v));v.br=vt<v.v-1?1:0;v.s+=v.dir*v.v*dt;if(v.s>Ln+40)v.s=-40;if(v.s<-40)v.s=Ln+40;
   v.x=v.ax==='h'?v.s:v.lane;v.y=v.ax==='h'?v.lane:v.s;v.base=v.y+(v.ax==='h'?v.wd/2:v.len/2);
   if(v.v>18){const rx=v.x-(v.ax==='h'?v.dir*v.len/2:0),ry=v.y-(v.ax==='v'?v.dir*v.len/2:0);
    if(wet>.15&&Math.random()<dt*12)LK.fx.add({x:rx,y:ry+2,vx:(Math.random()-.5)*30,vy:-25,t:.35,r:.8,g:200,col:'190,215,245',a:.8});
    else if(wet<.1&&v.v>30&&Math.random()<dt*6)LK.fx.add({x:rx,y:ry+1,vx:(Math.random()-.5)*6,vy:-3,t:.9,r:1.2,gr:5,col:'170,160,140',a:.25})}}},
 hit(P){for(const v of list){const hx=(v.ax==='h'?v.len:v.wd)/2+2,hy=(v.ax==='h'?v.wd:v.len)/2+1;if(v.v>6&&Math.abs(P.x-v.x)<hx&&Math.abs(P.y-1.5-v.y)<hy)return v}return null},
 draw(c,v,cx,cy){const l=v.len,w=v.wd;c.save();c.translate(v.x-cx,v.y-cy);if(v.ax==='h'){if(v.dir<0)c.scale(-1,1)}else c.rotate(v.dir>0?1.5708:-1.5708);
  c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(.5,w*.4,l*.55,w*.4,0,0,6.3);c.fill();
  if(v.type==='motor'){rr(c,-l/2,-w/2,l,w,2,'#222');rr(c,-1,-w/2-.3,l*.45,w+.6,2,v.col);c.fillStyle='#f0c8a0';c.beginPath();c.arc(-1,0,2.2,0,6.3);c.fill();c.fillStyle='#d33';c.beginPath();c.arc(-1,0,2.4,Math.PI,0);c.fill()}
  else{c.fillStyle='#111';[-.3,.25].forEach(k=>{c.fillRect(l*k-1.5,-w/2-.8,3,1.2);c.fillRect(l*k-1.5,w/2-.4,3,1.2)});
   rr(c,-l/2,-w/2,l,w,3,v.col);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(-l*.3,-w/2+1.2,l*.5,w-2.4);
   if(v.type==='bus'){c.fillStyle='#1f2d3d';for(let i=0;i<5;i++)c.fillRect(-l/2+3+i*5,-w/2+1.2,3.5,w-2.4)}
   else{c.fillStyle='#1f2d3d';c.fillRect(l*.14,-w/2+1.2,l*.14,w-2.4);c.fillRect(-l*.36,-w/2+1.2,l*.1,w-2.4)}}
  c.fillStyle='#fff7cf';c.fillRect(l/2-1,-w/2+1,1.2,1.6);c.fillRect(l/2-1,w/2-2.6,1.2,1.6);
  c.fillStyle=v.br?'#ff2a2a':'#8a1c1c';c.fillRect(-l/2,-w/2+1,1.2,1.6);c.fillRect(-l/2,w/2-2.6,1.2,1.6);c.restore()},
 glow(c,cx,cy,E){c.globalCompositeOperation='lighter';
  for(const v of list){const x=v.x-cx,y=v.y-cy;if(x<-60||x>440||y<-60||y>260)continue;c.save();c.translate(x,y);if(v.ax==='h'){if(v.dir<0)c.scale(-1,1)}else c.rotate(v.dir>0?1.5708:-1.5708);
   if(E.dark>.15){const g=c.createLinearGradient(v.len/2,0,v.len/2+46,0);g.addColorStop(0,'rgba(255,240,190,'+E.dark*.38+')');g.addColorStop(1,'rgba(255,240,190,0)');c.fillStyle=g;c.beginPath();c.moveTo(v.len/2,-v.wd/3);c.lineTo(v.len/2+46,-14);c.lineTo(v.len/2+46,14);c.lineTo(v.len/2,v.wd/3);c.fill()}
   if(v.br){c.fillStyle='rgba(255,40,40,'+(.12+E.dark*.2)+')';c.beginPath();c.arc(-v.len/2-2,0,v.wd*.7,0,6.3);c.fill()}c.restore()}
  c.globalCompositeOperation='source-over'},
 lights(c,cx,cy,E,t){const g=ph(t),col={g:'#27e07a',y:'#ffc400',r:'#ff3030'};
  for(const v of VENT){const x=v[0]-cx,y=v[1]-cy;if(x>-10&&x<410&&y>-10&&y<190){c.fillStyle='#22262e';c.beginPath();c.ellipse(x,y,3.2,1.6,0,0,6.3);c.fill()}}
  for(let a=0;a<4;a++)for(let b=0;b<3;b++)for(const k of[[-6,-6],[70,-6],[-6,70],[70,70]]){const x=a*320+k[0]-cx,y=b*320+k[1]-cy;if(x<-10||x>410||y<-10||y>200)continue;
   c.fillStyle='#2a2e36';c.fillRect(x-.8,y-12,1.6,12);c.fillRect(x-2.4,y-19,4.8,7.5);
   c.fillStyle=col[g.h];c.beginPath();c.arc(x,y-16.6,1.2,0,6.3);c.fill();c.fillStyle=col[g.v];c.beginPath();c.arc(x,y-13.8,1.2,0,6.3);c.fill();
   if(E.dark>.1){c.globalCompositeOperation='lighter';c.fillStyle=col[g.h].replace(')',',.25)');c.globalAlpha=E.dark*.5;c.beginPath();c.arc(x,y-16.6,4,0,6.3);c.arc(x,y-13.8,4,0,6.3);c.fill();c.globalAlpha=1;c.globalCompositeOperation='source-over'}}}};
})();
