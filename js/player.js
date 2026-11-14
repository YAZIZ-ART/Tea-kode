(function(){
const LK=window.LK=window.LK||{};LK.assets={};
{const im=new Image();im.onload=()=>{LK.assets.raka=im};im.src='assets/raka.png'}
const R=LK.RAKA={hair:'#5a3a22',top:'#2f6b34',pants:'#1c1c24',shoe:'#e8e8ee'};
const P=LK.player={x:LK.world.spawn.x,y:LK.world.spawn.y,face:1,walk:0,moving:false};
P.update=(dt,ix,iy)=>{const m=Math.hypot(ix,iy);P.moving=m>.15;P.walk+=dt;if(!P.moving)return;
 const v=62*Math.min(1,m)*dt,dx=ix/m*v,dy=iy/m*v,W=LK.world;
 if(Math.abs(ix)>Math.abs(iy)*.6)P.face=ix>0?1:-1;
 if(!W.hit(P.x+dx,P.y))P.x+=dx;if(!W.hit(P.x,P.y+dy))P.y+=dy;
 P.x=Math.max(8,Math.min(W.W-8,P.x));P.y=Math.max(8,Math.min(W.H-8,P.y))};
P.draw=(c,cx,cy)=>{const x=P.x-cx,y=P.y-cy,im=LK.assets.raka;
 if(im){c.save();c.translate(x,y);c.scale(P.face,1);c.drawImage(im,((P.walk*9)%4|0)*16,0,16,24,-8,-24,16,24);c.restore()}
 else LK.person.draw(c,x,y,R,P.walk,P.moving,P.face)};
})();
