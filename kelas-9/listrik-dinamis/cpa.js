
const state = {
  type:'series',
  bulbs:2,
  V:6,
  R:10,
  on:true,
  removed:false,
  derivationStep:0
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];


function brightnessText(b){
  if(b <= 0) return 'mati';
  if(b < 0.28) return 'redup';
  if(b < 0.55) return 'sedang';
  if(b < 0.8) return 'terang';
  return 'sangat terang';
}

function fmt(x, unit=''){
  if (!isFinite(x)) return '—';
  const v = Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(2);
  return `${Number(v)} ${unit}`.trim();
}

function metrics(){
  const n = state.bulbs;
  const active = state.removed ? n-1 : n;

  if (!state.on || active <= 0) {
    return {Rt:null, It:0, Vb:0, Pb:0, branchI:0, active};
  }

  if(state.type==='series'){
    if(state.removed) return {Rt:null, It:0, Vb:0, Pb:0, branchI:0, active};
    const Rt = n*state.R;
    const It = state.V/Rt;
    const Vb = It*state.R;
    const Pb = It*It*state.R;
    return {Rt,It,Vb,Pb,branchI:It,active};
  } else {
    if(active<=0) return {Rt:null,It:0,Vb:0,Pb:0,branchI:0,active};
    const Rt = state.R/active;
    const branchI = state.V/state.R;
    const It = branchI*active;
    const Vb = state.V;
    const Pb = state.V*state.V/state.R;
    return {Rt,It,Vb,Pb,branchI,active};
  }
}

function brightnessRatio(){
  const m = metrics();
  if(!state.on || m.Pb === 0) return 0;

  /*
    Ditingkatkan untuk keterbacaan di HP:
    - basisnya tetap daya per lampu
    - dipakai perceptual scaling yang lebih agresif
      agar beda redup-terang lebih mudah terlihat
  */
  const Pmax = (12 * 12) / 4; // 36 W
  return Math.max(0, Math.min(1, Math.pow(m.Pb / Pmax, 0.35)));
}

function drawBulb(x,y,r,brightness,label,off=false){
  const coreAlpha = off ? 0.12 : (0.18 + 0.70*brightness);
  const glowAlpha = off ? 0.03 : (0.10 + 0.34*brightness);
  const ringAlpha = off ? 0.02 : (0.10 + 0.28*brightness);
  const level = brightnessText(brightness);
  const pct = Math.round(brightness*100);
  const barW = 64;
  const fillW = Math.max(0, Math.min(barW, barW*brightness));

  let rays = '';
  if(!off && brightness > 0.28){
    const rayColor = brightness > 0.78 ? '#ff9800' : '#f4b942';
    rays = `
      <g stroke="${rayColor}" stroke-width="3" stroke-linecap="round" opacity="${0.35 + 0.45*brightness}">
        <line x1="${x}" y1="${y-r-8}" x2="${x}" y2="${y-r-18}"/>
        <line x1="${x}" y1="${y+r+8}" x2="${x}" y2="${y+r+18}"/>
        <line x1="${x-r-8}" y1="${y}" x2="${x-r-18}" y2="${y}"/>
        <line x1="${x+r+8}" y1="${y}" x2="${x+r+18}" y2="${y}"/>
        <line x1="${x-r*.9}" y1="${y-r*.9}" x2="${x-r-13}" y2="${y-r-13}"/>
        <line x1="${x+r*.9}" y1="${y-r*.9}" x2="${x+r+13}" y2="${y-r-13}"/>
        <line x1="${x-r*.9}" y1="${y+r*.9}" x2="${x-r-13}" y2="${y+r+13}"/>
        <line x1="${x+r*.9}" y1="${y+r*.9}" x2="${x+r+13}" y2="${y+r+13}"/>
      </g>`;
  }

  return `
    <g>
      <circle cx="${x}" cy="${y}" r="${r+18}" fill="rgba(255,193,7,${glowAlpha})"/>
      <circle cx="${x}" cy="${y}" r="${r+10}" fill="rgba(255,213,79,${ringAlpha})"/>
      ${rays}
      <circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,220,100,${coreAlpha})" stroke="#4a4f5f" stroke-width="3"/>
      <circle cx="${x-6}" cy="${y-6}" r="${Math.max(3, r*0.22)}" fill="rgba(255,255,255,${off?0.08:(0.18+0.38*brightness)})"/>
      <path d="M${x-r*.55} ${y} Q${x} ${y-r*.45} ${x+r*.55} ${y}" fill="none" stroke="#4a4f5f" stroke-width="3"/>
      <line x1="${x-r-26}" y1="${y}" x2="${x-r}" y2="${y}" stroke="#333a4d" stroke-width="5"/>
      <line x1="${x+r}" y1="${y}" x2="${x+r+26}" y2="${y}" stroke="#333a4d" stroke-width="5"/>
      <text x="${x}" y="${y+r+33}" text-anchor="middle" font-size="18" fill="#172033">${label}</text>
      <text x="${x}" y="${y+r+51}" text-anchor="middle" font-size="14" font-weight="700" fill="#b26b00">${level}</text>
      <rect x="${x-barW/2}" y="${y+r+58}" width="${barW}" height="8" rx="5" fill="#e5e7eb" stroke="#cdd5df"/>
      <rect x="${x-barW/2}" y="${y+r+58}" width="${fillW}" height="8" rx="5" fill="${brightness>0.78 ? '#ff9800' : brightness>0.45 ? '#f4b942' : '#b8c1cc'}"/>
      <text x="${x}" y="${y+r+81}" text-anchor="middle" font-size="12" fill="#667085">${pct}% indikator terang</text>
    </g>`;
}

function batteryOnVerticalWire(x,y){
  // Dipakai pada jalur vertikal: pelat baterai harus horizontal.
  return `
  <g aria-label="baterai">
    <line x1="${x-25}" y1="${y-7}" x2="${x+25}" y2="${y-7}" stroke="#333a4d" stroke-width="5"/>
    <line x1="${x-16}" y1="${y+7}" x2="${x+16}" y2="${y+7}" stroke="#333a4d" stroke-width="5"/>
    <text x="${x+42}" y="${y+6}" text-anchor="start" font-size="16" fill="#172033">${state.V} V</text>
  </g>`;
}

function batteryOnHorizontalWire(x,y){
  // Dipakai pada jalur horizontal: pelat baterai harus vertikal dan rapat.
  return `
  <g aria-label="baterai">
    <line x1="${x-7}" y1="${y-31}" x2="${x-7}" y2="${y+31}" stroke="#333a4d" stroke-width="5"/>
    <line x1="${x+7}" y1="${y-19}" x2="${x+7}" y2="${y+19}" stroke="#333a4d" stroke-width="5"/>
    <text x="${x}" y="${y+55}" text-anchor="middle" font-size="16" fill="#172033">${state.V} V</text>
  </g>`;
}

function drawCircuit(){
  const svg=$('#circuit');
  const b=brightnessRatio();
  const n=state.bulbs;
  const open=state.removed;
  let s='';

  if(state.type==='series'){
    s += `<path d="M120 80 H650 V280 H120" fill="none" stroke="#333a4d" stroke-width="5"/>
          <line x1="120" y1="80" x2="120" y2="173" stroke="#333a4d" stroke-width="5"/>
          <line x1="120" y1="187" x2="120" y2="280" stroke="#333a4d" stroke-width="5"/>`;
    s += batteryOnVerticalWire(120,180);
    const xs = n===1?[380]:n===2?[300,500]:[240,380,520];
    xs.forEach((x,i)=>{
      const removed = open && i===0;
      if(removed){
        s += `<rect x="${x-48}" y="56" width="96" height="48" rx="10" fill="#fff0f2" stroke="#cf3f4f" stroke-width="3"/>
              <text x="${x}" y="86" text-anchor="middle" fill="#9f2432" font-weight="700">Lampu dilepas</text>`;
      } else {
        s += drawBulb(x,80,26,b,`Lampu ${i+1}`,false);
      }
    });
    s += `<line x1="220" y1="280" x2="280" y2="280" stroke="#333a4d" stroke-width="5"/>
          <circle cx="280" cy="280" r="6" fill="#333a4d"/>
          <circle cx="350" cy="280" r="6" fill="#333a4d"/>
          <line x1="280" y1="280" x2="${state.on?350:335}" y2="${state.on?280:246}" stroke="${state.on?'#1f9d68':'#cf3f4f'}" stroke-width="6" stroke-linecap="round"/>`;
    if(state.on && !open){
      s += `<path d="M160 80 H620" stroke="#3559e0" stroke-width="4" stroke-dasharray="10 12">
        <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="1.2s" repeatCount="indefinite"/></path>`;
    }
  } else {
    // Parallel: two common nodes + independent horizontal branches.
    // No outer rectangle, so the topology is visually unambiguous.
    const leftRail=190, rightRail=570, bulbX=380;
    const ys = n===1?[120]:n===2?[105,205]:[85,165,245];
    const sourceY=315;
    const railTop=ys[0];

    // Two common node rails.
    s += `<line x1="${leftRail}" y1="${railTop}" x2="${leftRail}" y2="${sourceY}" stroke="#333a4d" stroke-width="6"/>
          <line x1="${rightRail}" y1="${railTop}" x2="${rightRail}" y2="${sourceY}" stroke="#333a4d" stroke-width="6"/>`;

    // Lamp branches.
    ys.forEach((y,i)=>{
      const removed=open && i===0;
      s += `<circle cx="${leftRail}" cy="${y}" r="5.5" fill="#333a4d"/>
            <circle cx="${rightRail}" cy="${y}" r="5.5" fill="#333a4d"/>
            <line x1="${leftRail}" y1="${y}" x2="${bulbX-52}" y2="${y}" stroke="#333a4d" stroke-width="5"/>
            <line x1="${bulbX+52}" y1="${y}" x2="${rightRail}" y2="${y}" stroke="#333a4d" stroke-width="5"/>`;
      if(removed){
        s += `<line x1="${bulbX-45}" y1="${y}" x2="${bulbX-14}" y2="${y}" stroke="#cf3f4f" stroke-width="5"/>
              <line x1="${bulbX+14}" y1="${y}" x2="${bulbX+45}" y2="${y}" stroke="#cf3f4f" stroke-width="5"/>
              <text x="${bulbX}" y="${y-9}" text-anchor="middle" fill="#9f2432" font-size="15" font-weight="700">Lampu 1 dilepas</text>`;
      } else {
        s += drawBulb(bulbX,y,22,b,`Lampu ${i+1}`,false);
      }
    });

    // Source branch: the battery and switch are connected across the same two nodes.
    const batteryX=285;
    s += `<circle cx="${leftRail}" cy="${sourceY}" r="5.5" fill="#333a4d"/>
          <circle cx="${rightRail}" cy="${sourceY}" r="5.5" fill="#333a4d"/>
          <line x1="${leftRail}" y1="${sourceY}" x2="${batteryX-7}" y2="${sourceY}" stroke="#333a4d" stroke-width="5"/>
          ${batteryOnHorizontalWire(batteryX,sourceY)}
          <line x1="${batteryX+7}" y1="${sourceY}" x2="350" y2="${sourceY}" stroke="#333a4d" stroke-width="5"/>
          <circle cx="350" cy="${sourceY}" r="6" fill="#333a4d"/>
          <circle cx="425" cy="${sourceY}" r="6" fill="#333a4d"/>
          <line x1="350" y1="${sourceY}" x2="${state.on?425:408}" y2="${state.on?sourceY:sourceY-34}" stroke="${state.on?'#1f9d68':'#cf3f4f'}" stroke-width="6" stroke-linecap="round"/>
          <line x1="425" y1="${sourceY}" x2="${rightRail}" y2="${sourceY}" stroke="#333a4d" stroke-width="5"/>
          <text x="388" y="${sourceY+50}" text-anchor="middle" font-size="15" fill="#667085">sumber & sakelar</text>`;

    if(state.on && metrics().active>0){
      // Animated flow cues on each active branch, not on an unrelated outer loop.
      ys.forEach((y,i)=>{
        if(!(open && i===0)){
          s += `<path d="M${leftRail+12} ${y} H${rightRail-12}" stroke="#3559e0" stroke-width="3" stroke-dasharray="9 12" opacity=".78">
            <animate attributeName="stroke-dashoffset" from="0" to="-42" dur="1.15s" repeatCount="indefinite"/></path>`;
        }
      });
    }
  }
  svg.innerHTML=s;
}

function updateConcrete(){
  const m=metrics();
  $('#rt').textContent = m.Rt==null ? 'rangkaian terbuka' : fmt(m.Rt,'Ω');
  $('#it').textContent = fmt(m.It,'A');
  $('#vb').textContent = fmt(m.Vb,'V');
  $('#pb').textContent = fmt(m.Pb,'W');

  let text='';
  if(!state.on){
    text='Sakelar terbuka: rangkaian terputus sehingga arus tidak mengalir.';
  } else if(state.type==='series'){
    if(state.removed) text='Lampu 1 dilepas → satu-satunya jalur terputus. Semua lampu padam.';
    else text=`Rangkaian seri memiliki satu jalur. Arus yang sama melewati setiap lampu. Dengan ${state.bulbs} lampu identik, tegangan sumber terbagi pada lampu-lampu tersebut.`;
  } else {
    if(state.removed) text='Lampu 1 dilepas → cabang itu terbuka, tetapi cabang lain masih memiliki jalur lengkap sehingga lampu lain tetap menyala.';
    else text=`Rangkaian paralel memiliki ${state.bulbs} cabang. Setiap lampu terhubung pada dua titik sumber yang sama, sehingga masing-masing mendapat tegangan sumber yang sama.`;
  }
  const brightInfo = !state.on ? 'Semua lampu mati.' : `Indikator terang tiap lampu saat ini: <b>${brightnessText(brightnessRatio())}</b>.`;
  $('#observation').innerHTML=`<b>Amati:</b> ${text}<br>${brightInfo}`;
  drawCircuit();
}

function renderAbstractComparison(){
  const n=state.bulbs;
  const V=state.V;
  const R=state.R;
  const Rs=n*R;
  const Rp=R/n;
  const Is=V/Rs;
  const Ip=V/Rp;
  const Vs=V/n;
  const Vp=V;
  const Ps=Is*Is*R;
  const Pp=V*V/R;

  $('#abstractComparison').innerHTML=`
    <div class="small" style="margin-bottom:6px">${n} lampu identik • ${V} V • ${R} Ω/lampu</div>
    <div class="compare-cards">
      <div class="compare-line compare-head"><b>Besaran</b><span>SERI</span><span>PARALEL</span></div>
      <div class="compare-line"><b>R ekuivalen</b><span>${fmt(Rs,'Ω')}</span><span>${fmt(Rp,'Ω')}</span></div>
      <div class="compare-line"><b>Arus total</b><span>${fmt(Is,'A')}</span><span>${fmt(Ip,'A')}</span></div>
      <div class="compare-line"><b>V tiap lampu</b><span>${fmt(Vs,'V')}</span><span>${fmt(Vp,'V')}</span></div>
      <div class="compare-line"><b>Daya/lampu</b><span>${fmt(Ps,'W')}</span><span>${fmt(Pp,'W')}</span></div>
    </div>
    ${n===1?'<div class="note warning stage-note"><b>Catatan:</b> gunakan 2–3 lampu agar perbedaan seri dan paralel tampak.</div>':''}
  `;
}

let conceptStage=1;
function showConceptStage(){ /* V8 menggunakan slide, bukan penumpukan tahap. */ }

const quizData = [
  {
    q:'Pada rangkaian seri, mengapa arus pada setiap lampu sama?',
    a:['Karena tegangannya selalu sama','Karena hanya ada satu jalur arus','Karena semua lampu pasti identik','Karena hambatan total nol'],
    c:1,
    f:'Pada rangkaian seri tidak ada percabangan, sehingga arus yang sama melewati setiap komponen.'
  },
  {
    q:'Dua lampu identik dipasang paralel. Bagaimana tegangan pada masing-masing lampu?',
    a:['Setengah tegangan sumber','Sama dengan tegangan sumber','Dua kali tegangan sumber','Selalu nol'],
    c:1,
    f:'Setiap cabang paralel terhubung pada dua node yang sama, sehingga beda potensial tiap cabang sama dengan sumber.'
  },
  {
    q:'Jika satu lampu pada rangkaian seri dilepas, apa yang terjadi?',
    a:['Lampu lain makin terang','Lampu lain tetap menyala','Semua lampu padam','Arus total bertambah'],
    c:2,
    f:'Melepas satu lampu memutus satu-satunya jalur arus pada rangkaian seri.'
  },
  {
    q:'Jika satu lampu pada rangkaian paralel dilepas, apa yang terjadi pada lampu di cabang lain?',
    a:['Tetap dapat menyala','Semua ikut padam','Tegangan sumber menjadi nol','Semua menjadi seri'],
    c:0,
    f:'Cabang lain masih mempunyai lintasan tertutup sendiri menuju sumber.'
  },
  {
    q:'Tiga lampu identik dipasang seri. Dibanding satu lampu pada sumber yang sama, setiap lampu cenderung...',
    a:['Lebih terang','Lebih redup','Sama terang','Tidak dapat diprediksi'],
    c:1,
    f:'Pada seri, tegangan sumber terbagi. Untuk lampu identik, daya tiap lampu menjadi lebih kecil sehingga lebih redup.'
  },
  {
    q:'Tiga lampu identik dipasang paralel pada sumber ideal. Tegangan pada tiap lampu adalah...',
    a:['V/3','3V','V','0'],
    c:2,
    f:'Semua cabang paralel berada pada dua node yang sama, sehingga tiap lampu memperoleh tegangan sumber V.'
  },
  {
    q:'Pada titik percabangan rangkaian paralel berlaku hubungan...',
    a:['I = I₁ = I₂','I = I₁ + I₂','V = V₁ + V₂','R = R₁ + R₂'],
    c:1,
    f:'Arus total terbagi ke cabang-cabang, sehingga jumlah arus cabang sama dengan arus total.'
  },
  {
    q:'Pada rangkaian seri berlaku hubungan tegangan...',
    a:['V = V₁ = V₂','V = V₁ + V₂','V = 0','V = I₁ + I₂'],
    c:1,
    f:'Jumlah beda potensial pada komponen seri sama dengan beda potensial sumber.'
  },
  {
    q:'Dua hambatan 4 Ω dan 6 Ω disusun seri. Hambatan ekuivalennya adalah...',
    a:['2 Ω','5 Ω','10 Ω','24 Ω'],
    c:2,
    f:'Untuk seri, hambatan dijumlahkan: Rₜ = 4 + 6 = 10 Ω.'
  },
  {
    q:'Dua hambatan identik 8 Ω disusun paralel. Hambatan ekuivalennya adalah...',
    a:['16 Ω','8 Ω','4 Ω','2 Ω'],
    c:2,
    f:'Dua hambatan identik R yang paralel menghasilkan Rₜ = R/2 = 4 Ω.'
  },
  {
    q:'Sumber 12 V dihubungkan dengan hambatan total 6 Ω. Berapa arus totalnya?',
    a:['0,5 A','2 A','6 A','72 A'],
    c:1,
    f:'Gunakan I = V/R = 12/6 = 2 A.'
  },
  {
    q:'Dua lampu identik masing-masing 6 Ω disusun seri pada sumber 12 V. Berapa arus rangkaian?',
    a:['1 A','2 A','6 A','12 A'],
    c:0,
    f:'Rₜ = 6 + 6 = 12 Ω, sehingga I = 12/12 = 1 A.'
  },
  {
    q:'Dua hambatan 6 Ω disusun paralel pada sumber 12 V. Berapa arus pada setiap cabang?',
    a:['1 A','2 A','4 A','6 A'],
    c:1,
    f:'Tiap cabang mendapat 12 V. Maka I cabang = 12/6 = 2 A.'
  },
  {
    q:'Pada soal sebelumnya, dua hambatan 6 Ω paralel pada 12 V. Berapa arus totalnya?',
    a:['1 A','2 A','4 A','12 A'],
    c:2,
    f:'Masing-masing cabang 2 A, sehingga arus total = 2 + 2 = 4 A.'
  },
  {
    q:'Manakah ciri yang paling tepat untuk mengenali rangkaian paralel dari gambar?',
    a:['Komponen selalu berdekatan','Ada beberapa jalur yang menghubungkan dua node yang sama','Semua lampu harus sama','Tidak menggunakan sakelar'],
    c:1,
    f:'Ciri struktural paralel adalah adanya beberapa cabang yang menghubungkan pasangan node yang sama.'
  },
  {
    q:'Jika jumlah lampu identik dalam rangkaian seri ditambah, hambatan total akan...',
    a:['Berkurang','Tetap','Bertambah','Menjadi nol'],
    c:2,
    f:'Pada seri, Rₜ = R₁ + R₂ + ..., sehingga penambahan hambatan menambah hambatan total.'
  },
  {
    q:'Jika jumlah lampu identik dalam rangkaian paralel ditambah, hambatan ekuivalen akan...',
    a:['Bertambah','Berkurang','Tetap','Selalu nol'],
    c:1,
    f:'Menambah cabang paralel menyediakan lebih banyak jalur arus sehingga hambatan ekuivalen mengecil.'
  },
  {
    q:'Pada sumber tegangan ideal, menambah cabang paralel menyebabkan arus total sumber...',
    a:['Berkurang','Tetap selalu sama','Bertambah','Menjadi nol'],
    c:2,
    f:'Hambatan ekuivalen turun. Dengan V tetap, I = V/Rₜ sehingga arus total meningkat.'
  },
  {
    q:'Satu lampu 4 Ω mendapat tegangan 8 V. Daya lampu menurut model hambatan tetap adalah...',
    a:['2 W','8 W','16 W','32 W'],
    c:2,
    f:'P = V²/R = 8²/4 = 64/4 = 16 W.'
  },
  {
    q:'Pernyataan yang paling tepat merangkum perbedaan seri dan paralel adalah...',
    a:['Seri: V sama; paralel: I sama','Seri: satu jalur; paralel: beberapa cabang','Seri selalu lebih terang; paralel selalu redup','Keduanya memiliki hambatan total yang sama'],
    c:1,
    f:'Perbedaan struktur paling mendasar adalah seri memiliki satu jalur, sedangkan paralel memiliki beberapa cabang.'
  }
];

let answered = Array(quizData.length).fill(false);
let score=0;

let quizSlide=0;

function renderQuiz(){
  const q=quizData[quizSlide];
  const box=$('#quizBox');
  box.innerHTML=`
    <div class="quiz-single">
      <div class="quiz-index">Soal ${quizSlide+1} dari ${quizData.length}</div>
      <div class="question" data-q="${quizSlide}">
        <b>${q.q}</b>
        ${q.a.map((a,j)=>`<button class="option" data-i="${quizSlide}" data-j="${j}">${a}</button>`).join('')}
        <div class="feedback" id="fb${quizSlide}"></div>
      </div>
    </div>`;
  $('#score').textContent=score;
  $('#quizCount').textContent=`${quizSlide+1}/${quizData.length}`;

  const nav=document.querySelector('[data-nav-for="quiz"]');
  if(nav){
    nav.querySelector('.stage-prev').disabled=quizSlide===0;
    nav.querySelector('.stage-next').disabled=quizSlide===quizData.length-1;
    renderDots(nav,quizData.length,quizSlide);
  }

  $$('.option').forEach(btn=>btn.addEventListener('click',()=>{
    const i=+btn.dataset.i, j=+btn.dataset.j;
    if(answered[i]) return;
    answered[i]=true;
    const qq=quizData[i];
    const parent=btn.closest('.question');
    parent.querySelectorAll('.option').forEach((b,k)=>{
      if(k===qq.c) b.classList.add('correct');
      else if(k===j) b.classList.add('wrong');
      b.disabled=true;
    });
    if(j===qq.c) score++;
    $('#score').textContent=score;
    $('#fb'+i).textContent=(j===qq.c?'Benar. ':'Belum tepat. ')+qq.f;
  }));

  if(answered[quizSlide]){
    const parent=box.querySelector('.question');
    const qq=quizData[quizSlide];
    parent.querySelectorAll('.option').forEach((b,k)=>{
      if(k===qq.c) b.classList.add('correct');
      b.disabled=true;
    });
    $('#fb'+quizSlide).textContent='Soal ini sudah dijawab. Jawaban benar ditandai hijau.';
  }
}

function refreshAll(){
  $('#seriesBtn').classList.toggle('active',state.type==='series');
  $('#parallelBtn').classList.toggle('active',state.type==='parallel');
  $('#bulbCount').textContent=state.bulbs;
  $('#voltageVal').textContent=state.V;
  $('#resistanceVal').textContent=state.R;
  $('#switchBtn').textContent=`Sakelar: ${state.on?'ON':'OFF'}`;
  $('#removeBtn').textContent=state.removed?'Pasang kembali Lampu 1':'Lepaskan Lampu 1';

  updateConcrete();
  renderAbstractComparison();
}

const stageIndex={concrete:0,explain:0,elaborate:0};

function renderDots(nav,total,current){
  const dots=nav.querySelector('.stage-dots');
  if(!dots) return;
  if(total>8){
    dots.innerHTML='';
    dots.classList.add('progress-mode');
    dots.style.setProperty('--progress', `${((current+1)/total)*100}%`);
  }else{
    dots.classList.remove('progress-mode');
    dots.style.removeProperty('--progress');
    dots.innerHTML=Array.from({length:total},(_,i)=>`<i class="${i===current?'active':''}"></i>`).join('');
  }
}

function showStage(group,index){
  const holder=document.querySelector(`[data-stage-group="${group}"]`);
  if(!holder) return;
  const slides=[...holder.querySelectorAll('.stage-slide')];
  index=Math.max(0,Math.min(index,slides.length-1));
  stageIndex[group]=index;
  slides.forEach((s,i)=>s.classList.toggle('active',i===index));

  const count=document.getElementById(group+'Count');
  if(count) count.textContent=`${index+1}/${slides.length}`;

  const nav=document.querySelector(`[data-nav-for="${group}"]`);
  if(nav){
    nav.querySelector('.stage-prev').disabled=index===0;
    nav.querySelector('.stage-next').disabled=index===slides.length-1;
    renderDots(nav,slides.length,index);
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function openSection(target){
  $$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.target===target));
  $$('.section').forEach(x=>x.classList.toggle('active',x.id===target));
  if(target==='quiz'){
    renderQuiz();
  }else if(stageIndex[target]!==undefined){
    showStage(target,stageIndex[target]);
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

$$('.tab').forEach(t=>t.addEventListener('click',()=>openSection(t.dataset.target)));

$$('.stage-nav').forEach(nav=>{
  const group=nav.dataset.navFor;
  nav.querySelector('.stage-prev').addEventListener('click',()=>{
    if(group==='quiz'){
      quizSlide=Math.max(0,quizSlide-1); renderQuiz(); window.scrollTo({top:0,behavior:'smooth'});
    }else{
      showStage(group,(stageIndex[group]||0)-1);
    }
  });
  nav.querySelector('.stage-next').addEventListener('click',()=>{
    if(group==='quiz'){
      quizSlide=Math.min(quizData.length-1,quizSlide+1); renderQuiz(); window.scrollTo({top:0,behavior:'smooth'});
    }else{
      showStage(group,(stageIndex[group]||0)+1);
    }
  });
});

$('#seriesBtn').onclick=()=>{state.type='series';state.removed=false;refreshAll()};
$('#parallelBtn').onclick=()=>{state.type='parallel';state.removed=false;refreshAll()};
$('#bulbs').oninput=e=>{state.bulbs=+e.target.value;state.removed=false;refreshAll()};
$('#voltage').oninput=e=>{state.V=+e.target.value;refreshAll()};
$('#resistance').oninput=e=>{state.R=+e.target.value;refreshAll()};
$('#switchBtn').onclick=()=>{state.on=!state.on;refreshAll()};
$('#removeBtn').onclick=()=>{state.removed=!state.removed;refreshAll()};
$('#resetBtn').onclick=()=>{
  Object.assign(state,{type:'series',bulbs:2,V:6,R:10,on:true,removed:false});
  $('#bulbs').value=2; $('#voltage').value=6; $('#resistance').value=10;
  refreshAll();
};

$('#compareBtn').onclick=()=>{stageIndex.explain=0;window.setLearningStage?.(3);setTimeout(()=>showStage('explain',0),0)};
$('#goElaborateBtn').onclick=()=>{stageIndex.elaborate=0;window.setLearningStage?.(4);setTimeout(()=>showStage('elaborate',0),0)};
$('#goEvaluateBtn').onclick=()=>{quizSlide=0;renderQuiz();window.setLearningStage?.(5)};
$('#resetQuiz').onclick=()=>{answered=Array(quizData.length).fill(false);score=0;quizSlide=0;renderQuiz()};


function openZoom(targetId,title){
  const src=document.getElementById(targetId);
  if(!src) return;
  const clone=src.cloneNode(true);
  clone.removeAttribute('id');
  $('#zoomContent').innerHTML='';
  $('#zoomContent').appendChild(clone);
  $('#zoomTitle').textContent=title || 'Perbesar gambar';
  $('#zoomOverlay').classList.add('open');
  $('#zoomOverlay').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeZoom(){
  $('#zoomOverlay').classList.remove('open');
  $('#zoomOverlay').setAttribute('aria-hidden','true');
  $('#zoomContent').innerHTML='';
  document.body.style.overflow='';
}
$$('.zoom-btn').forEach(btn=>{
  btn.addEventListener('click',()=>openZoom(btn.dataset.zoomTarget,btn.dataset.zoomTitle));
});
$('#zoomClose').addEventListener('click',closeZoom);
$('#zoomOverlay').addEventListener('click',e=>{if(e.target.id==='zoomOverlay') closeZoom();});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeZoom();});


function initElaborate(){
  document.querySelectorAll('[data-elab-choice]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const group=btn.closest('[data-elab-group]');
      if(!group) return;
      group.querySelectorAll('[data-elab-choice]').forEach(x=>x.classList.remove('correct','wrong','selected'));
      const correct=btn.dataset.correct==='true';
      btn.classList.add('selected',correct?'correct':'wrong');
      const key=group.dataset.elabGroup;
      const fb=document.querySelector('[data-elab-feedback="'+key+'"]');
      if(fb){
        fb.textContent=btn.dataset.feedback||'';
        fb.classList.toggle('correct',correct);
        fb.classList.toggle('wrong',!correct);
      }
    });
  });

  const check=document.getElementById('checkFading');
  if(check){
    check.addEventListener('click',()=>{
      const rt=parseFloat(document.getElementById('fadeRt').value);
      const i=parseFloat(document.getElementById('fadeI').value);
      const okRt=Math.abs(rt-18)<0.11;
      const okI=Math.abs(i-(12/18))<0.03;
      const fb=document.getElementById('fadeFeedback');
      const box=document.getElementById('fadeTask');
      box.classList.remove('correct','wrong');
      if(okRt&&okI){
        box.classList.add('correct');
        fb.className='elab-feedback correct';
        fb.textContent='Benar. Rₜ = 18 Ω dan I ≈ 0,67 A.';
      }else{
        box.classList.add('wrong');
        fb.className='elab-feedback wrong';
        fb.textContent='Belum tepat. Jumlahkan tiga hambatan seri terlebih dahulu, lalu gunakan I = V/Rₜ.';
      }
    });
  }
}

initElaborate();
renderQuiz();
refreshAll();
showStage('concrete',0);
showStage('explain',0);
showStage('elaborate',0);
