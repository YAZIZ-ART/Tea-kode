(function(){
const LK=window.LK=window.LK||{};
const T=16,BS=20,NX=4,NY=3,WW=NX*BS*T,WH=NY*BS*T;
let s=11;const rnd=()=>(s=s*16807%2147483647)/2147483647;
const hs=n=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
const objs=[],solids=[],puddles=[];
const PAL=[['#b86f50','#8a4a35'],['#6f9bd1','#46709f'],['#d8b872','#a8884a'],['#8fa070','#62754a'],['#a07ab0','#76558a'],['#c9c2b0','#9a937f']];
const rect=(x,y,w,h)=>solids.push({x,y,w,h});
function bld(tx,ty,w,d){const p=PAL[rnd()*PAL.length|0],o={t:'b',id:objs.length+1,x:tx*T,y:ty*T,w:w*T,d:d*T,h:26,c:p[0],r:p[1],sm:rnd()<.35};o.base=o.y+o.d;objs.push(o);rect(o.x,o.y,o.w,o.d)}
function tree(x,y){objs.push({t:'t',x,y,base:y});rect(x-3,y-3,6,3)}
function lamp(x,y){objs.push({t:'l',x,y,base:y});rect(x-2,y-2,4,2)}
const isRoad=(wx,wy)=>{const tx=wx/T|0,ty=wy/T|0;return tx>=0&&ty>=0&&tx<NX*BS&&ty<NY*BS&&(tx%BS<4||ty%BS<4)};
for(let by=0;by<NY;by++)for(let bx=0;bx<NX;bx++){const ox=bx*BS,oy=by*BS;
 for(let i=0;i<3;i++)lamp((ox+4)*T+8,(oy+7+i*5)*T);
 lamp((ox+10)*T,(oy+4)*T+8);
 if((bx+by)%4===1){for(let i=0;i<14;i++)tree((ox+6+rnd()*12)*T,(oy+6+rnd()*12)*T)}
 else{bld(ox+6,oy+6,6,4);bld(ox+13,oy+6,5,4);bld(ox+6,oy+13,12,4);
  [[ox+5.5,oy+11.5],[ox+12.5,oy+11.5],[ox+18,oy+11.5]].forEach(p=>tree(p[0]*T,p[1]*T))}}
for(let i=0;i<90;i++){const tx=rnd()*NX*BS|0,ty=rnd()*NY*BS|0;if(isRoad(tx*T,ty*T))puddles.push({x:tx*T+rnd()*T,y:ty*T+rnd()*T,w:5+rnd()*7})}
const GL=document.createElement('canvas');GL.width=GL.height=64;
{const g=GL.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,215,140,.8)');r.addColorStop(1,'rgba(255,215,140,0)');g.fillStyle=r;g.fillRect(0,0,64,64)}
function ground(c,cx,cy,vw,vh,wet){
 const x0=Math.max(0,cx/T|0),y0=Math.max(0,cy/T|0),x1=Math.min(NX*BS-1,(cx+vw)/T|0),y1=Math.min(NY*BS-1,(cy+vh)/T|0);
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
  const mx=tx%BS,my=ty%BS,px=tx*T-cx,py=ty*T-cy,k=(tx+ty)&1;let col;
  if(mx<4||my<4)col=wet>.05?(k?'#2f3442':'#2c313e'):(k?'#3d424e':'#3a3f4a');
  else if(mx===4||mx===19||my===4||my===19)col=k?'#a3a3a8':'#9a9aa0';
  else col=hs(tx*7+ty*13)<.5?'#4f8a42':'#58944a';
  c.fillStyle=col;c.fillRect(px,py,T+.5,T+.5);
  c.fillStyle='#d8d0a0';
  if(mx===1&&my>3&&(ty&1))c.fillRect(px+T-1,py+4,2,8);
  if(my===1&&mx>3&&(tx&1))c.fillRect(px+4,py+T-1,8,2);
  c.fillStyle='#6d6d74';
  if(mx===4&&my>3)c.fillRect(px,py,1,T);if(mx===19&&my>3)c.fillRect(px+T-1,py,1,T);
  if(my===4&&mx>3)c.fillRect(px,py,T,1);if(my===19&&mx>3)c.fillRect(px,py+T-1,T,1)}}
function drawPuddles(c,cx,cy,E){if(E.wet<.05)return;
 for(const p of puddles){const x=p.x-cx,y=p.y-cy;if(x<-20||x>440||y<-10||y>260)continue;
  c.fillStyle='rgba(100,130,175,'+E.wet*.55+')';c.beginPath();c.ellipse(x,y,p.w,p.w*.4,0,0,6.3);c.fill();
  c.fillStyle='rgba(255,255,255,'+E.wet*.14+')';c.fillRect(x-p.w*.5|0,y-1|0,p.w*.6|0,1)}}
function visible(cx,cy,vw,vh){return objs.filter(o=>{const w=o.w||0;return o.x+w>cx-30&&o.x<cx+vw+30&&o.base>cy-10&&o.base-(o.h||34)<cy+vh+30})}
function shadow(c,o,cx,cy,E){if(E.sa<.02)return;c.fillStyle='rgba(0,0,0,'+E.sa+')';
 if(o.t==='b'){const x=o.x-cx,y=o.y+o.d-cy;c.beginPath();c.moveTo(x,y);c.lineTo(x+o.w,y);c.lineTo(x+o.w+E.sx,y+7);c.lineTo(x+E.sx,y+7);c.fill()}
 else if(o.t==='t'){c.beginPath();c.ellipse(o.x-cx+E.sx*.6,o.y-cy+1,8,3,0,0,6.3);c.fill()}}
function wins(o,cb){const cols=Math.floor((o.w-6)/10),y0=o.y-o.h+o.d;
 for(let i=0;i<cols;i++)for(let j=0;j<2;j++){const wx=o.x+5+i*((o.w-10)/cols)+1,wy=y0+4+j*9;
  if(j===1&&Math.abs(wx+3-(o.x+o.w/2))<9)continue;cb(wx,wy,hs(o.id*31+i*7+j*3))}}
function drawObj(c,o,cx,cy,E){
 if(o.t==='b'){const x=o.x-cx,y=o.y-cy,y0=y-o.h+o.d;
  c.fillStyle=o.c;c.fillRect(x,y0,o.w,o.h);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(x,y+o.d-3,o.w,3);
  wins(o,(wx,wy,q)=>{c.fillStyle=q<E.dark*1.1?'#ffd27a':'#3a5a7a';c.fillRect(wx-cx,wy-cy,6,6);if(q>=E.dark*1.1){c.fillStyle='#8fb4d6';c.fillRect(wx-cx,wy-cy,6,1)}});
  c.fillStyle='#4a3020';c.fillRect(x+o.w/2-3|0,y+o.d-11,7,11);
  c.fillStyle=o.r;c.fillRect(x-1,y-o.h,o.w+2,o.d);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x-1,y-o.h+o.d-1,o.w+2,1);
  c.fillStyle='#8a8f98';c.fillRect(x+4,y-o.h+4,8,5);
  if(o.sm){const sx=x+o.w-8;c.fillStyle='#55504a';c.fillRect(sx,y-o.h-5,5,6);
   for(let k=0;k<3;k++){const u=(E.t*9+k*8)%24;c.fillStyle='rgba(190,190,195,'+(.5-u/50)+')';c.fillRect(sx+1+Math.sin(E.t+k)*E.wind*5+E.wind*u*.3,y-o.h-8-u,3,3)}}}
 else if(o.t==='t'){const x=o.x-cx,y=o.y-cy,sw=Math.sin(E.t*1.6+o.x)*E.wind*3;
  c.fillStyle='#5a3a22';c.fillRect(x-2,y-10,4,10);
  [[-5,-30,10],[-8,-26,16],[-10,-21,20],[-8,-16,16]].forEach(r=>{c.fillStyle='#2f7a3a';c.fillRect(x+r[0]+sw*(-r[1]/30),y+r[1],r[2],5)});
  c.fillStyle='#4aa04a';c.fillRect(x-5+sw,y-29,6,3);c.fillRect(x-2+sw*.7,y-22,6,3)}
 else{const x=o.x-cx,y=o.y-cy;c.fillStyle='#3a3f48';c.fillRect(x-1,y-20,2,20);c.fillStyle='#2a2e36';c.fillRect(x-3,y-23,6,3);
  c.fillStyle=E.dark>.3?'#fff3c0':'#9aa0a8';c.fillRect(x-2,y-20,4,2)}}
function glow(c,list,cx,cy,E){
 if(E.dark<.05)return;c.globalCompositeOperation='lighter';
 for(const o of list){if(o.t==='l'){const x=o.x-cx,y=o.y-cy;c.globalAlpha=E.dark*.9;c.drawImage(GL,x-32,y-53);
   c.globalAlpha=E.dark*.35;c.drawImage(GL,x-32,y-20,64,24);
   if(E.wet>.05){c.globalAlpha=E.dark*E.wet*.3;c.fillStyle='#ffd88a';c.fillRect(x-1,y+3,3,16);c.fillRect(x,y+8,1,12)}}
  else if(o.t==='b'){c.globalAlpha=E.dark*.07;c.fillStyle='#ffbe64';c.fillRect(o.x-cx,o.y-cy+o.d,o.w,12);
   c.globalAlpha=E.dark*.7;c.fillStyle='#ffc870';wins(o,(wx,wy,q)=>{if(q<E.dark*1.1)c.fillRect(wx-cx,wy-cy,6,6)})}}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}
function hit(x,y){const l=x-3,t=y-3;for(const r of solids)if(l<r.x+r.w&&l+6>r.x&&t<r.y+r.h&&t+3>r.y)return true;return false}
LK.world={T,W:WW,H:WH,puddles,ground,drawPuddles,visible,shadow,drawObj,glow,hit,isRoad,spawn:{x:4*T+8,y:10*T}};
})();
