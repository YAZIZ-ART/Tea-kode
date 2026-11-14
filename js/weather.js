(function(){
const LK=window.LK=window.LK||{};
const TAU=Math.PI*2,cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const PRE={cerah:{cloud:.05,rain:0,storm:0,fog:0,wind:.25},mendung:{cloud:.95,rain:0,storm:0,fog:.15,wind:.5},hujan:{cloud:1,rain:.7,storm:0,fog:.25,wind:.6},badai:{cloud:1,rain:1,storm:1,fog:.3,wind:1}};
const W=LK.weather={hour:17.5,name:'hujan',cur:Object.assign({},PRE.hujan),wet:.4,flash:0,shake:0,L:1,dark:0,tint:[255,255,255],t:0,auto:true,bolt:[]};
const drops=[],rip=[],leaves=[];
for(let i=0;i<150;i++)drops.push({x:Math.random()*500,y:Math.random()*260,v:.7+Math.random()*.6});
for(let i=0;i<14;i++)leaves.push({x:Math.random()*400,y:Math.random()*220,p:Math.random()*6,c:i%2?'#c9822a':'#6a9a3a'});
W.setWeather=n=>{W.name=n};
W.update=dt=>{const c=W.cur,g=PRE[W.name];W.t+=dt;if(W.auto)W.hour=(W.hour+dt*.05)%24;
 for(const k in g)c[k]+=(g[k]-c[k])*Math.min(1,dt*1.2);
 W.wet+=((c.rain>.05?1:0)-W.wet)*dt*(c.rain>.05?.5:.06);
 const s=Math.sin((W.hour-6)/24*TAU),L=cl(.5+.6*s,.12,1)*(1-.45*c.cloud);W.L=L;W.dark=cl((.62-L)/.45);
 let col=mix([70,82,140],[255,255,255],cl((L-.12)/.7));col=mix(col,[255,170,120],Math.max(0,1-Math.abs(s)*4)*(1-c.cloud*.6)*.5);W.tint=col;
 if(c.storm>.5&&W.flash<.05&&Math.random()<dt*.15){W.flash=1;W.shake=4;W.bolt=[];let y=0,x=Math.random();while(y<.65){W.bolt.push([x,y]);y+=.05+Math.random()*.06;x+=(Math.random()-.5)*.08}
  if(LK.audio)setTimeout(LK.audio.thunder,200+Math.random()*1500)}
 W.flash*=Math.pow(.02,dt*1.2);W.shake*=Math.pow(.01,dt)};
W.clock=()=>{const h=W.hour|0,m=(W.hour-h)*60|0;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+' · '+W.name};
W.env=()=>({dark:W.dark,wet:W.wet,t:W.t,wind:W.cur.wind,sx:cl((W.hour-12)/5,-1,1)*14,sa:(1-W.cur.cloud)*W.L*.28});
W.drawClouds=(c,vw,vh)=>{const a=W.cur.cloud*.16;if(a<.01)return;c.fillStyle='rgba(0,0,0,'+a+')';
 for(let i=0;i<5;i++){const x=((i*130+W.t*W.cur.wind*8)%(vw+240))-120;c.beginPath();c.ellipse(x,(i*37)%vh+20,70,30,0,0,6.3);c.fill()}};
W.drawLight=(c,vw,vh)=>{const t=W.tint;c.globalCompositeOperation='multiply';c.fillStyle='rgb('+(t[0]|0)+','+(t[1]|0)+','+(t[2]|0)+')';c.fillRect(0,0,vw,vh);c.globalCompositeOperation='source-over'};
W.drawRain=(c,vw,vh,cx,cy,dt)=>{const k=W.cur,n=k.rain*drops.length|0,sl=.15+k.wind*.35;
 c.strokeStyle='rgba(200,215,240,.5)';c.lineWidth=1;c.beginPath();
 for(let i=0;i<n;i++){const d=drops[i],l=5*d.v;d.y+=d.v*190*dt;d.x+=d.v*190*dt*sl;
  if(d.y>vh||d.x>vw+40){d.y=-6;d.x=Math.random()*(vw+60)-30}c.moveTo(d.x,d.y);c.lineTo(d.x-sl*l,d.y-l)}
 c.stroke();
 if(k.rain>.05&&Math.random()<dt*k.rain*55){const x=Math.random()*vw,y=vh*.3+Math.random()*vh*.7;if(LK.world.isRoad(cx+x,cy+y))rip.push({x,y,r:1,a:.7})}
 for(let i=rip.length-1;i>=0;i--){const r=rip[i];r.r+=dt*14;r.a-=dt*1.6;if(r.a<=0){rip.splice(i,1);continue}
  c.strokeStyle='rgba(200,215,240,'+r.a+')';c.beginPath();c.ellipse(r.x,r.y,r.r,r.r*.35,0,0,6.3);c.stroke()}};
W.drawLeaves=(c,vw,vh,dt)=>{if(W.cur.rain>.3||W.dark>.6)return;
 for(const l of leaves){l.p+=dt*3;l.x+=(W.cur.wind*38+Math.sin(l.p)*10)*dt;l.y+=(10+Math.cos(l.p)*5)*dt;
  if(l.x>vw+10||l.y>vh+10){l.x=-8;l.y=Math.random()*vh*.6}c.fillStyle=l.c;c.fillRect(l.x|0,l.y|0,2,1)}};
W.drawFog=(c,vw,vh)=>{const a=W.cur.fog*.5+W.cur.rain*.1;if(a>.01){c.fillStyle='rgba(200,205,215,'+a+')';c.fillRect(0,0,vw,vh)}
 if(W.flash>.02){c.fillStyle='rgba(220,230,255,'+W.flash*.45+')';c.fillRect(0,0,vw,vh);
  if(W.flash>.35&&W.bolt.length){c.strokeStyle='rgba(255,255,255,'+W.flash+')';c.lineWidth=2;c.beginPath();W.bolt.forEach((p,i)=>i?c.lineTo(p[0]*vw,p[1]*vh):c.moveTo(p[0]*vw,p[1]*vh));c.stroke()}}};
})();
