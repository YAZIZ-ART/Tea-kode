(function(){
const LK=window.LK,W=LK.world,C=LK.cfg||{tex:1},old=W.drawObj,og=W.ground;
const hs=n=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
W.drawObj=(c,o,cx,cy,E)=>{const tx=LK.cfg.tex;
 if(o.t==='t'){const x=o.x-cx,y=o.y-cy,sw=Math.sin(E.t*1.6+o.x)*E.wind*2.5;
  LK.rr(c,x-2,y-12,4,12,1.5,'#5a3a22');
  const g=c.createRadialGradient(x+sw-4,y-28,2,x+sw,y-22,16);g.addColorStop(0,'#69bd58');g.addColorStop(1,'#2a6a3a');c.fillStyle=g;
  [[0,-24,10],[-6,-19,8],[6,-19,8],[0,-16,9]].forEach(a=>{c.beginPath();c.arc(x+a[0]+sw*(-a[1]/24),y+a[1],a[2],0,6.3);c.fill()});
  if(tx>.3){c.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<6;i++){c.beginPath();c.arc(x-8+hs(o.x+i)*16+sw,y-31+hs(o.y+i)*14,1.5,0,6.3);c.fill()}}return}
 old(c,o,cx,cy,E);
 if(o.t==='b'){const x=o.x-cx,y=o.y-cy,y0=y-o.h+o.d,g=c.createLinearGradient(0,y0,0,y0+o.h);g.addColorStop(0,'rgba(255,255,255,.14)');g.addColorStop(1,'rgba(0,0,0,.2)');c.fillStyle=g;c.fillRect(x,y0,o.w,o.h);
  c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x-1,y-o.h,o.w+2,1.2);
  if(tx>.05){c.fillStyle='rgba(0,0,0,'+tx*.09+')';for(let r=y0+4;r<y+o.d-3;r+=4)c.fillRect(x,r,o.w,.5);for(let r=y-o.h+3;r<y-o.h+o.d-2;r+=3)c.fillRect(x-1,r,o.w+2,.4)}}};
W.ground=(c,cx,cy,vw,vh,wet)=>{og(c,cx,cy,vw,vh,wet);const tx=LK.cfg.tex;if(tx<.05)return;
 const T=16,x0=Math.max(0,cx/T|0),y0=Math.max(0,cy/T|0),x1=Math.min(79,(cx+vw)/T|0),y1=Math.min(59,(cy+vh)/T|0);
 for(let ty=y0;ty<=y1;ty++)for(let X=x0;X<=x1;X++){const mx=X%20,my=ty%20,px=X*T-cx,py=ty*T-cy,q=hs(X*7+ty*13);
  if(mx<4||my<4){c.fillStyle='rgba(0,0,0,'+tx*.14+')';c.fillRect(px+q*12,py+hs(q*9)*12,2,1);c.fillRect(px+hs(q*5)*12,py+hs(q*3)*12,1.5,1)}
  else if(mx===4||mx===19||my===4||my===19){c.fillStyle='rgba(0,0,0,'+tx*.1+')';c.fillRect(px+q*10,py+hs(q*4)*14,5,.5)}
  else{c.fillStyle='rgba(30,100,30,'+tx*.4+')';for(let i=0;i<3;i++){const a=px+hs(q*(i+2))*14,b=py+hs(q*(i+7))*12;c.fillRect(a,b,.7,3)}
   if(q>.94){c.fillStyle=q>.97?'#f4d03f':'#f08ac8';c.beginPath();c.arc(px+q*9,py+8,1.1,0,6.3);c.fill()}}}};
})();
