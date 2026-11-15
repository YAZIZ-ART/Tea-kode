(function(){
const LK=window.LK,W=LK.world,T=16,BS=20,B=BS*T,old=W.drawObj;
const hs=n=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
const sd=(h,k)=>{const n=parseInt(h.slice(1),16);return 'rgb('+Math.min(255,(n>>16)*k|0)+','+Math.min(255,((n>>8)&255)*k|0)+','+Math.min(255,(n&255)*k|0)+')'};
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c};
let S=2;const chunks=new Map(),TR=[];
LK.setScale=k=>{const s=k>=3?3:2;if(s!==S){S=s;chunks.clear();TR.length=0;for(const o of W.objs)o.spr=null}};
function chunk(bx,by){const key=bx+','+by,tx0=LK.cfg.tex;let ch=chunks.get(key);if(ch&&Math.abs(ch.tex-tx0)<=.04)return ch;
 const dry=mk(B*S,B*S),wet=mk(B,B),c=dry.getContext('2d'),w=wet.getContext('2d');c.scale(S,S);
 for(let j=0;j<BS;j++)for(let i=0;i<BS;i++){const X=bx*BS+i,Y=by*BS+j,px=i*T,py=j*T,k=(X+Y)&1,q=hs(X*7+Y*13),road=i<4||j<4,walk=i===4||i===19||j===4||j===19;
  c.fillStyle=road?(k?'#3d424e':'#3a3f4a'):walk?(k?'#a3a3a8':'#9a9aa0'):(q<.5?'#4f8a42':'#58944a');c.fillRect(px,py,T+.4,T+.4);
  if(road){w.fillStyle=k?'#2f3442':'#2c313e';w.fillRect(px,py,T,T)}
  c.fillStyle='#d8d0a0';if(i===1&&j>3&&(Y&1))c.fillRect(px+T-1,py+4,2,8);if(j===1&&i>3&&(X&1))c.fillRect(px+4,py+T-1,8,2);
  c.fillStyle='#6d6d74';if(i===4&&j>3)c.fillRect(px,py,1,T);if(i===19&&j>3)c.fillRect(px+T-1,py,1,T);if(j===4&&i>3)c.fillRect(px,py,T,1);if(j===19&&i>3)c.fillRect(px,py+T-1,T,1);
  if(tx0>.05){if(road){c.fillStyle='rgba(0,0,0,'+tx0*.14+')';c.fillRect(px+q*12,py+hs(q*9)*12,2,1);c.fillRect(px+hs(q*5)*12,py+hs(q*3)*12,1.5,1)}
   else if(walk){c.fillStyle='rgba(0,0,0,'+tx0*.1+')';c.fillRect(px+q*10,py+hs(q*4)*14,5,.5)}
   else{c.fillStyle='rgba(30,100,30,'+tx0*.4+')';for(let n=0;n<3;n++)c.fillRect(px+hs(q*(n+2))*14,py+hs(q*(n+7))*12,.7,3);
    if(q>.94){c.fillStyle=q>.97?'#f4d03f':'#f08ac8';c.beginPath();c.arc(px+q*9,py+8,1.1,0,6.3);c.fill()}}}}
 ch={dry,wet,tex:tx0};chunks.set(key,ch);return ch}
LK.warm=()=>{for(let by=0;by<3;by++)for(let bx=0;bx<4;bx++)if(!chunks.has(bx+','+by)){chunk(bx,by);return}};
W.ground=(c,cx,cy,vw,vh,wet)=>{const x0=Math.max(0,Math.floor(cx/B)),x1=Math.min(3,Math.floor((cx+vw)/B)),y0=Math.max(0,Math.floor(cy/B)),y1=Math.min(2,Math.floor((cy+vh)/B));
 for(let by=y0;by<=y1;by++)for(let bx=x0;bx<=x1;bx++){const ch=chunk(bx,by),px=bx*B-cx,py=by*B-cy;c.drawImage(ch.dry,px,py,B+.6,B+.6);
  if(wet>.05){c.globalAlpha=Math.min(1,wet*1.6);c.drawImage(ch.wet,px,py,B+.6,B+.6);c.globalAlpha=1}}};
function bSpr(o){const w=o.w+2,h=o.d+o.h+8,cv=mk(w*S,h*S),c=cv.getContext('2d'),tx=LK.cfg.tex,wy=8+o.d;c.scale(S,S);
 let g=c.createLinearGradient(0,wy,0,wy+o.h);g.addColorStop(0,sd(o.c,1.1));g.addColorStop(1,sd(o.c,.8));c.fillStyle=g;c.fillRect(1,wy,o.w,o.h);
 if(tx>.05){c.fillStyle='rgba(0,0,0,'+tx*.1+')';for(let y=wy+4;y<wy+o.h-3;y+=4)c.fillRect(1,y,o.w,.5);c.fillStyle='rgba(255,255,255,'+tx*.06+')';for(let x=3;x<o.w;x+=8)c.fillRect(x,wy+2,.5,o.h-4)}
 c.fillStyle='rgba(0,0,0,.3)';c.fillRect(1,wy+o.h-3,o.w,3);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(1,wy,o.w,2.2);
 const dx=1+o.w/2-3.5;LK.rr(c,dx-.8,wy+o.h-12,8.6,12,1.5,'#3a2a1c');LK.rr(c,dx,wy+o.h-11,7,11,1,'#6a4a2e');c.fillStyle='#e8c870';c.fillRect(dx+5,wy+o.h-6,1,1);
 g=c.createLinearGradient(0,8,0,wy);g.addColorStop(0,sd(o.r,1.2));g.addColorStop(1,sd(o.r,.85));c.fillStyle=g;c.fillRect(0,8,w,o.d);
 if(tx>.05){c.fillStyle='rgba(0,0,0,'+tx*.12+')';for(let y=11;y<8+o.d-1;y+=3)c.fillRect(0,y,w,.5)}
 c.fillStyle='rgba(255,255,255,.3)';c.fillRect(0,8,w,1);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(0,wy-1.2,w,1.2);
 LK.rr(c,5,12,9,5,1,'#8a8f98');c.fillStyle='rgba(255,255,255,.3)';c.fillRect(6,12.5,7,1);
 if(o.sm){c.fillStyle='#55504a';c.fillRect(w-9,3,5,7);c.fillStyle='#3a3630';c.fillRect(w-9.5,2.4,6,1.4)}return cv}
function tSpr(v){const cv=mk(36*S,40*S),c=cv.getContext('2d'),cs=[['#69bd58','#2a6a3a'],['#7ac060','#2f7a3a'],['#8cc050','#3a7a30']][v];c.scale(S,S);
 c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(18,38,9,3,0,0,6.3);c.fill();LK.rr(c,16,24,4,14,1.5,'#5a3a22');c.fillStyle='rgba(0,0,0,.2)';c.fillRect(18,25,2,12);
 [[18,12,10],[11,18,8],[25,18,8],[18,20,9]].forEach(a=>{const g=c.createRadialGradient(a[0]-3,a[1]-4,1,a[0],a[1],a[2]);g.addColorStop(0,cs[0]);g.addColorStop(1,cs[1]);c.fillStyle=g;c.beginPath();c.arc(a[0],a[1],a[2],0,6.3);c.fill()});
 c.fillStyle='rgba(255,255,255,.14)';for(let i=0;i<7;i++){c.beginPath();c.arc(8+hs(i+v*9)*20,5+hs(i*3+v)*20,1.4,0,6.3);c.fill()}return cv}
W.drawObj=(c,o,cx,cy,E)=>{
 if(o.t==='t'){const x=o.x-cx,y=o.y-cy,v=hs(o.x*3+o.y)*3|0,sp=TR[v]||(TR[v]=tSpr(v)),k=Math.sin(E.t*1.6+o.x)*E.wind*.04;c.save();c.translate(x,y);c.transform(1,0,k,1,0,0);c.drawImage(sp,-18,-38,36,40);c.restore();return}
 if(o.t==='b'){if(!o.spr||Math.abs((o.stex||0)-LK.cfg.tex)>.04){o.spr=bSpr(o);o.stex=LK.cfg.tex}
  c.drawImage(o.spr,o.x-1-cx,o.y-o.h-8-cy,o.w+2,o.d+o.h+8);
  W.wins(o,(wx,wy,q)=>{const lit=q<E.dark*1.1,x=wx-cx,y=wy-cy;c.fillStyle='#2a3140';c.fillRect(x-.8,y-.8,7.6,7.6);c.fillStyle=lit?'#ffd88a':'#4f7396';c.fillRect(x,y,6,6);c.fillStyle=lit?'rgba(255,255,255,.35)':'rgba(255,255,255,.22)';c.fillRect(x,y,6,1.8);c.fillStyle='#2a3140';c.fillRect(x+2.8,y,.5,6);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x-1,y+6.8,8,.7)});
  if(o.sm){const sx=o.x-cx+o.w-8;for(let k=0;k<4;k++){const u=(E.t*8+k*7)%28;c.fillStyle='rgba(200,200,205,'+(.45-u/65)+')';c.beginPath();c.arc(sx+2.5+Math.sin(E.t+k)*E.wind*5+E.wind*u*.35,o.y-cy-o.h-6-u,1.6+u*.07,0,6.3);c.fill()}}return}
 old(c,o,cx,cy,E)};
const vb=[];W.visible=(cx,cy,vw,vh)=>{vb.length=0;for(const o of W.objs){const w=o.w||0;if(o.x+w>cx-30&&o.x<cx+vw+30&&o.base>cy-10&&o.base-(o.h||38)<cy+vh+30)vb.push(o)}return vb};
})();
