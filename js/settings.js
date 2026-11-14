(function(){
const LK=window.LK,$=id=>document.getElementById(id);
const DEF={res:1,tex:1,shd:1,sharp:.35,con:1.05,sat:1.15,warm:.15,glow:1,vol:.8,amb:1,mute:0,rnd:1,real:1};
const PRE={HD:{res:1,tex:1,shd:1,sharp:.4,glow:1},Standar:{res:.75,tex:.5,shd:.6,sharp:.2,glow:1},Rendah:{res:.5,tex:0,shd:.3,sharp:0,glow:0}};
const cfg=LK.cfg=Object.assign({},DEF);
try{Object.assign(cfg,JSON.parse(localStorage.getItem('lampukota.cfg')||'{}'))}catch(e){}
LK.applyCfg=()=>{const s=cfg.sharp;
 $('game').style.filter='contrast('+cfg.con+') saturate('+cfg.sat+')'+(s>.02?' url(#sh)':'');
 $('shk').setAttribute('kernelMatrix',[0,-s,0,-s,1+4*s,-s,0,-s,0].join(' '));
 if(LK.resize)LK.resize();LK.audio.setVol(cfg.mute?0:cfg.vol,cfg.amb);
 try{localStorage.setItem('lampukota.cfg',JSON.stringify(cfg))}catch(e){}};
LK.audio.mute=m=>{cfg.mute=m?1:0;LK.applyCfg()};LK.audio.isMuted=()=>!!cfg.mute;
LK.weather.drawLight=(c,vw,vh)=>{const t=LK.weather.tint,w=cfg.warm;
 c.globalCompositeOperation='multiply';c.fillStyle='rgb('+t[0]*(w<0?1+w*.2:1)+','+t[1]*(1-Math.abs(w)*.05)+','+t[2]*(w>0?1-w*.2:1)+')';c.fillRect(0,0,vw,vh);c.globalCompositeOperation='source-over'};
function row(k,l,mn,mx,st){const d=document.createElement('label');d.innerHTML='<span>'+l+'</span><input type="range" min="'+mn+'" max="'+mx+'" step="'+st+'" value="'+cfg[k]+'"><output></output>';
 const i=d.querySelector('input'),o=d.querySelector('output'),u=()=>o.textContent=(+i.value).toFixed(2);u();i.oninput=()=>{cfg[k]=+i.value;u();LK.applyCfg()};return d}
function tog(k,l){const d=document.createElement('label');d.innerHTML='<span>'+l+'</span><input type="checkbox" '+(cfg[k]?'checked':'')+'>';d.querySelector('input').onchange=e=>{cfg[k]=e.target.checked?1:0;LK.applyCfg()};return d}
function btns(a,fn){const d=document.createElement('div');d.className='pre';a.forEach(n=>{const b=document.createElement('button');b.textContent=n;b.onclick=()=>fn(n);d.appendChild(b)});return d}
function build(t){const p=$('sp');p.innerHTML='';
 if(t==='Audio')p.append(row('vol','Volume utama',0,1,.01),row('amb','Suasana (hujan, kota)',0,1,.01),tog('mute','Bisukan semua suara'));
 if(t==='Grafik')p.append(btns(Object.keys(PRE),n=>{Object.assign(cfg,PRE[n]);LK.applyCfg();build(t)}),row('res','Resolusi render',.4,1,.05),row('tex','Detail tekstur',0,1,.05),row('sharp','Ketajaman',0,1,.05),row('con','Kontras',.8,1.4,.01),row('sat','Saturasi',.5,1.8,.01));
 if(t==='Pencahayaan')p.append(row('warm','Kehangatan',-1,1,.05),row('shd','Bayangan',0,1.5,.05),tog('glow','Cahaya dinamis (lampu, jendela)'),tog('real','Waktu ikut jam perangkat'),tog('rnd','Cuaca acak otomatis'),
  btns(['cerah','mendung','hujan','badai'],n=>{LK.weather.setWeather(n);cfg.rnd=0;LK.applyCfg();build(t)}),
  btns(['Pagi','Siang','Sore','Malam'],n=>{cfg.real=0;LK.weather.hour={Pagi:7,Siang:12,Sore:16.5,Malam:21}[n];LK.applyCfg();build(t)}));
 document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.textContent===t))}
['Audio','Grafik','Pencahayaan'].forEach(t=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>build(t);document.querySelector('.tabs').appendChild(b)});
LK.openSet=()=>{$('set').classList.add('on');build('Audio')};
$('sBack').onclick=()=>$('set').classList.remove('on');
})();
