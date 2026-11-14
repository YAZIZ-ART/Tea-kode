(function(){
const LK=window.LK,$=id=>document.getElementById(id),P=LK.player,M=$('menu'),cap=$('cap');
M.innerHTML='<h1>Lampu Kota</h1><p>Kota punya seribu lampu</p><button class="big main" id="bPlay">Play Game</button><button class="big" id="bCont">Lanjutkan</button><button class="big" id="bSet">Pengaturan</button>';
LK.openMenu=p=>{LK.paused=p;LK.setState('menu');M.classList.add('on');$('bCont').disabled=!p&&!LK.hasSave()};
function boot(){LK.audio.start();LK.applyCfg();M.classList.remove('on');
 try{const e=document.documentElement;if(e.requestFullscreen&&!document.fullscreenElement)e.requestFullscreen().then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})).catch(()=>{})}catch(e){}}
$('bPlay').onclick=()=>{boot();LK.paused=false;LK.startCine()};
$('bCont').onclick=()=>{boot();if(!LK.paused)LK.load();LK.paused=false;LK.setState('play')};
$('bSet').onclick=()=>LK.openSet();
$('pause').onclick=()=>LK.openMenu(true);
const CAP=[[0,4,'Kota ini punya seribu lampu.'],[4,8,'Tapi tidak satu pun menyala untuk kami.'],[8,13,'<b>RAKA</b>, 16 tahun.<br>Siswa kelas 11 SMA Nusa Bangsa.'],[13,18,'Pendiam. Keras kepala. Cekatan.'],[18,23,'Ibunya buruh pabrik shift malam.<br>Sewa kontrakan hampir tak terbayar.'],[23,27,'Isi dompet: <b>Rp 140.000</b>.<br>Sewa jatuh tempo 25 hari lagi.'],[27,30,'Hari ini, semuanya dimulai.']];
let ci=-1;const toast=t=>{cap.innerHTML=t;cap.classList.add('on');setTimeout(()=>cap.classList.remove('on'),4500)};
LK.startCine=()=>{LK.setState('cine');LK.cineT=0;P.x=70;P.y=68;P.face=1;ci=-1;LK.weather.setWeather('mendung')};
LK.cineTick=dt=>{const t=LK.cineT+=dt;P.x+=14*dt;P.moving=true;P.walk+=dt;if(t>14&&LK.weather.name==='mendung')LK.weather.setWeather('hujan');
 const i=CAP.findIndex(c=>t>=c[0]&&t<c[1]-.6);
 if(i!==ci){ci=i;cap.classList.remove('on');if(i>=0)setTimeout(()=>{if(ci===i){cap.innerHTML=CAP[i][2];cap.classList.add('on')}},300)}
 if(t>=30)LK.endCine()};
LK.endCine=()=>{if(LK.state!=='cine')return;cap.classList.remove('on');P.moving=false;P.x=LK.world.spawn.x;P.y=LK.world.spawn.y;
 LK.vn(BAB1,()=>{LK.setState('play');toast('<b>Bab 1: Pindah Kota</b><br>Jelajahi kota. Ketuk warga untuk berbicara.');LK.save()})};
const PAL={Raka:LK.RAKA,'Bu Sari':{hair:'#3a2a2e',top:'#6a4a98',pants:'#4a3a68',sk:'#4a3a68',long:1},'Pak Heru':{hair:'#2a2226',top:'#6a5a44',pants:'#1c1c24'}};
const BAB1=[['Raka','Kota ini punya seribu lampu. Tapi tidak satu pun menyala untuk kami.'],['Bu Sari','Jangan manyun begitu. Kontrakannya dekat sekolah, Ibu sudah cek.'],['Raka','Bu, uang kita...'],['Bu Sari','Itu urusan Ibu. Urusan kamu cuma satu: sekolah.'],['Pak Heru','Deposit bisa dicicil, tapi sewa tanggal lima harus lunas. Di kota ini tidak ada yang gratis, Bu.'],['Raka','(Dompet Ibu tersisa Rp 140.000. Sewa jatuh tempo 25 hari lagi.)']];
LK.vn=(lines,done)=>{let i=0;const d=$('dlg');d.classList.add('on');LK.setState('dlg');
 const show=()=>{const L=lines[i];d.innerHTML='<canvas id="pt" width="180" height="230"></canvas><div class="box"><b>'+L[0]+'</b>'+L[1]+'<small>ketuk untuk lanjut</small></div>';
  LK.person.draw($('pt').getContext('2d'),90,215,PAL[L[0]]||PAL.Raka,0,false,1,7.2)};
 d.onclick=()=>{if(++i>=lines.length){d.classList.remove('on');d.onclick=null;done&&done()}else show()};show()};
})();
