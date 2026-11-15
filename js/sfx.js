(function(){
const LK=window.LK,A=LK.audio,X=()=>A._();
let mus,on=0,nx=0,bar=0;
function noise(f,type,d,g){const x=X();if(!x.C)return;const t=x.C.currentTime,s=x.C.createBufferSource(),fl=x.C.createBiquadFilter(),gn=x.C.createGain();s.buffer=x.nb;fl.type=type;fl.frequency.value=f;gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(gn);gn.connect(x.M);s.start(t,Math.random()*2,d+.05)}
A.step=sf=>noise(sf==='grass'?600:sf==='walk'?1700:sf==='wet'?2400:1200,sf==='wet'||sf==='walk'?'bandpass':'lowpass',.07,sf==='wet'?.09:.05);
A.horn=()=>{const x=X();if(!x.C)return;const C=x.C,t=C.currentTime;[420,530].forEach(f=>{const o=C.createOscillator(),g=C.createGain(),l=C.createBiquadFilter();o.type='square';o.frequency.value=f;l.type='lowpass';l.frequency.value=1800;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.07,t+.02);g.gain.setValueAtTime(.07,t+.3);g.gain.linearRampToValueAtTime(0,t+.38);o.connect(l);l.connect(g);g.connect(x.M);o.start(t);o.stop(t+.4)})};
A.hit=()=>{const x=X();if(!x.C)return;x.tone(95,x.C.currentTime,.3,{to:40,g:.3});noise(500,'lowpass',.25,.4)};
A.click=()=>{const x=X();if(x.C)x.tone(920,x.C.currentTime,.06,{type:'triangle',g:.05})};
const CH=[[0,4,7,11],[0,3,7,10],[0,4,7,11],[0,4,7,10]],RT=[60,57,53,55],PEN=[0,2,4,7,9],mf=m=>440*Math.pow(2,(m-69)/12);
function note(f,t,d,type,v){const C=X().C,o=C.createOscillator(),g=C.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(type==='sine'?.01:d*.4));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mus);o.start(t);o.stop(t+d+.05)}
function play(t){const k=bar++%4,r=RT[k],ch=CH[k],b=.83;
 ch.forEach(i=>{note(mf(r-12+i),t,b*4,'triangle',.018);note(mf(r-12+i)*1.004,t,b*4,'triangle',.014)});note(mf(r-24),t,b*2,'sine',.05);
 for(let i=0;i<8;i++)if(Math.random()<.55*(1-LK.weather.dark*.4))note(mf(r+12+(i%2?PEN[Math.random()*5|0]:ch[i%4])),t+i*b/2,1.1,'sine',.028)}
A.music=()=>{const x=X();if(!x.C||on)return;on=1;const C=x.C;mus=C.createGain();mus.gain.value=LK.cfg.mus;
 const dl=C.createDelay(1),fb=C.createGain();dl.delayTime.value=.375;fb.gain.value=.33;mus.connect(x.M);mus.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(x.M);nx=C.currentTime+.2;
 setInterval(()=>{const c=X().C;while(nx<c.currentTime+.8){play(nx);nx+=3.33}},250)};
A.setMus=v=>{const x=X();if(mus&&x.C)mus.gain.setTargetAtTime(v,x.C.currentTime,.1)};
})();

