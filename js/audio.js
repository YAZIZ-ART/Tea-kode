(function(){
const LK=window.LK=window.LK||{};
let C,M,nb,muted=false,L={},acc=0;
const R=(a,b)=>a+Math.random()*(b-a);
function layer(type,f,q,dest){const s=C.createBufferSource();s.buffer=nb;s.loop=true;const b=C.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q||.7;const g=C.createGain();g.gain.value=0;s.connect(b);b.connect(g);g.connect(dest||A.amb);s.start(0,Math.random()*2);return g}
function tone(f,t,d,o){o=o||{};const os=C.createOscillator(),g=C.createGain(),p=C.createStereoPanner();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+d);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.g||.05,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);p.pan.value=o.pan||0;os.connect(g);g.connect(p);p.connect(M);os.start(t);os.stop(t+d+.05)}
const A=LK.audio={
 start(){if(C){C.resume();return}C=new(window.AudioContext||window.webkitAudioContext)();
  const cp=C.createDynamicsCompressor();M=C.createGain();M.gain.value=.8;M.connect(cp);cp.connect(C.destination);
  const n=C.sampleRate*3;nb=C.createBuffer(1,n,C.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  A.amb=C.createGain();A.amb.connect(M);L.hiss=layer('highpass',1800);L.body=layer('lowpass',800);L.wind=layer('bandpass',420,1.2);L.city=layer('lowpass',220)},
 update(w){if(!C)return;const t=C.currentTime,c=w.cur,day=1-w.dark;
  L.hiss.gain.setTargetAtTime(c.rain*.16,t,.5);L.body.gain.setTargetAtTime(c.rain*.28,t,.5);
  L.wind.gain.setTargetAtTime(c.wind*.2,t,.5);L.city.gain.setTargetAtTime(.35*(.4+day*.6),t,.5)},
 tick(dt,w){if(!C||C.state!=='running')return;const t=C.currentTime,c=w.cur,p=x=>Math.random()<x*dt;
  if(p(.12*(1-c.rain)*(1-w.dark)))for(let i=0,f=R(2500,5000),n=3+Math.random()*3|0;i<n;i++)tone(f*R(.9,1.1),t+i*.12,.08,{to:f*1.4,g:.03,pan:R(-.8,.8)});
  if(p(1.8*w.dark*(1-c.rain)))for(let i=0;i<3;i++)tone(4400,t+i*.05,.03,{g:.012,pan:R(-.7,.7)});
  if(p(.25*(1+c.rain))){const D=R(2.5,4),f=R(60,110),o=C.createOscillator(),g=C.createGain(),l=C.createBiquadFilter(),pn=C.createStereoPanner(),dir=Math.random()<.5?-1:1;
   o.type='sawtooth';o.frequency.value=f;l.type='lowpass';l.frequency.value=700;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+D/2);g.gain.linearRampToValueAtTime(0,t+D);
   pn.pan.setValueAtTime(-dir*.9,t);pn.pan.linearRampToValueAtTime(dir*.9,t+D);o.connect(l);l.connect(g);g.connect(pn);pn.connect(M);o.start(t);o.stop(t+D+.1)}},
 thunder(){if(!C)return;const t=C.currentTime+.05,d=R(3.5,6),s=C.createBufferSource();s.buffer=nb;const l=C.createBiquadFilter();l.type='lowpass';l.frequency.setValueAtTime(600,t);l.frequency.exponentialRampToValueAtTime(50,t+d);
  const g=C.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(1,t+.3);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(l);l.connect(g);g.connect(M);s.start(t,0,d+.1)},
 splash(){if(!C)return;const t=C.currentTime,s=C.createBufferSource();s.buffer=nb;const f=C.createBiquadFilter();f.type='bandpass';f.frequency.value=R(1500,2500);const g=C.createGain();g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+.12);s.connect(f);f.connect(g);g.connect(M);s.start(t,Math.random()*2,.15)},
 setVol(m,a){if(!C)return;M.gain.setTargetAtTime(m,C.currentTime,.05);A.amb.gain.setTargetAtTime(a,C.currentTime,.05)},
 mute(m){muted=m;if(M)M.gain.setTargetAtTime(m?0:.8,C.currentTime,.05)},isMuted:()=>muted};
})();
