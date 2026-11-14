(function(){
const LK=window.LK=window.LK||{};
function rr(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.fill()}
LK.rr=rr;
LK.person={draw(c,x,y,o,t,mv,f,sc){sc=sc||1;const ph=mv?Math.sin(t*9):0,b=mv?Math.abs(Math.cos(t*9)):Math.sin(t*2)*.3,sk=o.skin||'#f0c8a0';
 c.save();c.translate(x,y);c.scale(sc,sc);
 c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(0,0,6.5,2.5,0,0,6.3);c.fill();
 if(o.long)rr(c,-5.4,-25-b,10.8,14,3.5,o.hair);
 rr(c,-3.7,-8-b,3.3,8+ph*1.3,1.5,o.pants);rr(c,.4,-8-b,3.3,8-ph*1.3,1.5,o.pants);
 const sh=o.shoe||'#25252c';rr(c,-4.1,-1.8+ph*1.3,4,2.4,1.1,sh);rr(c,.1,-1.8-ph*1.3,4,2.4,1.1,sh);
 rr(c,-6.6,-16.4-b+ph*1.4,2.7,7.6,1.3,o.top);rr(c,3.9,-16.4-b-ph*1.4,2.7,7.6,1.3,o.top);
 rr(c,-4.7,-17.4-b,9.4,10.2,2.8,o.top);if(o.sk)rr(c,-5.4,-9.6-b,10.8,5.4,2,o.sk);
 c.fillStyle=sk;c.beginPath();c.arc(-5.3,-8.6-b+ph*1.4,1.4,0,6.3);c.arc(5.3,-8.6-b-ph*1.4,1.4,0,6.3);c.fill();
 c.beginPath();c.arc(0,-21.8-b,4.7,0,6.3);c.fill();
 c.fillStyle=o.hair;c.beginPath();c.arc(0,-22.6-b,5,Math.PI,0);c.fill();rr(c,-5,-23-b,10,2.4,1.2,o.hair);
 c.fillStyle='#1a1620';c.beginPath();c.arc(f*1.3-1.5,-21.3-b,.8,0,6.3);c.arc(f*1.3+1.5,-21.3-b,.8,0,6.3);c.fill();
 if(o.hat){rr(c,-5.4,-27.4-b,10.8,4.2,2,o.hat);rr(c,f>0?.5:-6.5,-24.6-b,6,1.6,.8,o.hat)}
 c.restore()}};
const TY=[
{hair:'#1c1c22',top:'#26262e',pants:'#1c1c24',say:['Rapat lagi, rapat lagi...','Kopi dulu, Dik.']},
{hair:'#5a3a30',top:'#f0f0f4',pants:'#1e1e26',sk:'#1e1e26',long:1,say:['Selamat pagi!','Kota ini selalu sibuk ya.']},
{hair:'#1a1a22',top:'#f0f0f4',pants:'#1a1a20',say:['Jaga kesehatan, ya.']},
{hair:'#1a1a22',top:'#dfe8f0',pants:'#e8e8ee',sk:'#e8e8ee',hat:'#f4f4f8',say:['Hati-hati di jalan.']},
{hair:'#1a1a22',top:'#f0f0f4',pants:'#1c1c20',hat:'#f4f4f8',say:['Mampir ke restoran kami!']},
{hair:'#1a1a22',top:'#1e2c5a',pants:'#1a2244',hat:'#1c2a50',say:['Patuhi rambu lalu lintas.']},
{hair:'#1a1a22',top:'#4a5a30',pants:'#4a5a30',hat:'#3a4a28',say:['Siap, selamat siang!']},
{hair:'#1a1a22',top:'#e87818',pants:'#1c2038',hat:'#f0c020',say:['Awas proyek, Dik!']},
{hair:'#1a1a22',top:'#2a2a34',pants:'#1c1c24',hat:'#c82020',say:['Pesanan numpuk hari ini.']},
{hair:'#1a1a22',top:'#e0d030',pants:'#1a1a24',hat:'#e8e8ee',say:['Selamat datang.']},
{hair:'#a8a8b0',top:'#6a4a34',pants:'#1c1c24',skin:'#e8c0a0',say:['Dulu kota ini belum ada jalan layang.']},
{hair:'#a8a8b8',top:'#6a4a98',pants:'#4a3a68',sk:'#4a3a68',skin:'#e8c0a0',say:['Hati-hati, Nak.']},
{hair:'#3a2a2e',top:'#f0f0f4',pants:'#26262e',sk:'#26262e',long:1,say:['PR matematika susah banget!']},
{hair:'#5a3a22',top:'#2a3a64',pants:'#1c1c24',say:['Ada yang punya catatan?']},
{hair:'#3a2a22',top:'#c83030',pants:'#1c1c24',say:['Silakan, mau pesan apa?']}];
let s=5;const rnd=()=>(s=s*16807%2147483647)/2147483647,T=16,list=[];
function place(n){n.x=n.h?n.pos:n.fix;n.y=n.h?n.fix:n.pos}
for(let i=0;i<24;i++){const ox=(rnd()*4|0)*20,oy=(rnd()*3|0)*20,h=rnd()<.5,n={ty:TY[i%TY.length],h,fix:h?(oy+4)*T+4:(ox+19)*T+8,min:h?(ox+5)*T:(oy+5)*T,max:h?(ox+18)*T:(oy+18)*T,a:0,pause:rnd()*4,mv:false,f:1,sp:12+rnd()*8,t:rnd()*9,say:'',st:0,um:['#c0392b','#2a6ac0','#2a9a5a','#8a4ab0'][i%4]};
 n.pos=n.tg=n.min+rnd()*(n.max-n.min);place(n);list.push(n)}
LK.npcs={list,
 update(dt,h,rain){for(const n of list){n.t+=dt;n.st-=dt;n.a+=(((h<5||h>=21.5)?0:1)-n.a)*Math.min(1,dt*2);if(n.a<.02)continue;
  if(n.pause>0){n.pause-=dt;n.mv=false;continue}
  const d=n.tg-n.pos;if(Math.abs(d)<.5){n.pause=(h>12&&h<13?6:2)+Math.random()*5;n.tg=n.min+Math.random()*(n.max-n.min);n.mv=false;continue}
  n.mv=true;n.f=d>0?1:-1;n.pos+=Math.sign(d)*Math.min(Math.abs(d),n.sp*(1+rain*.5)*dt);place(n)}},
 draw(c,n,cx,cy,rain){const x=n.x-cx,y=n.y-cy;c.globalAlpha=n.a;LK.person.draw(c,x,y,n.ty,n.t,n.mv,n.f);
  if(rain>.3){c.fillStyle=n.um;c.beginPath();c.arc(x,y-31,9,Math.PI,0);c.fill();c.fillStyle='#333';c.fillRect(x-.4,y-31,.8,10)}
  if(n.st>0){c.font='4.4px system-ui';const w=c.measureText(n.say).width+8;rr(c,x-w/2,y-46,w,9,3,'rgba(255,255,255,.95)');c.fillStyle='#222';c.textAlign='center';c.fillText(n.say,x,y-39.6)}
  c.globalAlpha=1},
 talk(n){n.say=n.ty.say[Math.random()*n.ty.say.length|0];n.st=3;n.pause=Math.max(n.pause,3)}};
})();
