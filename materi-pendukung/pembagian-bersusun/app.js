(()=>{
const KEY="materi-pendukung:pembagian-bersusun:v1";
const N=6;
const panels=[...document.querySelectorAll(".stage-panel")];
const tabs=[...document.querySelectorAll(".stage-tab")];
const prev=document.getElementById("prevStage");
const next=document.getElementById("nextStage");
const complete=document.getElementById("completeStage");
const progressFill=document.getElementById("progressFill");
const progressText=document.getElementById("progressText");
const toast=document.getElementById("toast");

let state=load();
let active=Math.max(0,Math.min(N-1,state.active||0));
let done=new Set(state.done||[]);

function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(_){return{}}}
function save(){state.active=active;state.done=[...done];localStorage.setItem(KEY,JSON.stringify(state))}
function flash(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(flash.t);flash.t=setTimeout(()=>toast.classList.remove("show"),1400)}
function stageMenuTop(){
  const nav=document.querySelector(".stage-nav"),top=document.querySelector(".topbar");
  if(!nav)return;
  const y=nav.offsetTop-(top?.getBoundingClientRect().height||0)-2;
  window.scrollTo({top:Math.max(0,y),behavior:"smooth"});
}
function centerTab(i){
  const nav=document.querySelector(".stage-nav"),tab=tabs[i];if(!nav||!tab)return;
  requestAnimationFrame(()=>{
    const nr=nav.getBoundingClientRect(),tr=tab.getBoundingClientRect();
    const left=nav.scrollLeft+(tr.left-nr.left)+(tr.width-nav.clientWidth)/2;
    nav.scrollTo({left:Math.max(0,left),behavior:"smooth"});
  });
}
function render(){
  panels.forEach((p,i)=>p.classList.toggle("active",i===active));
  tabs.forEach((t,i)=>{t.classList.toggle("active",i===active);t.classList.toggle("done",done.has(i))});
  prev.disabled=active===0;next.disabled=active===N-1;
  complete.textContent=done.has(active)?"✓ Sudah selesai":"Tandai selesai";
  const pct=Math.round(done.size/N*100);progressFill.style.width=pct+"%";
  progressText.textContent=done.size+" dari "+N+" langkah • "+pct+"%";
  centerTab(active);save();
}
function show(i,scroll=true){active=Math.max(0,Math.min(N-1,i));render();if(scroll)stageMenuTop()}
tabs.forEach((t,i)=>t.onclick=()=>show(i));
prev.onclick=()=>show(active-1);next.onclick=()=>show(active+1);
complete.onclick=()=>{done.has(active)?done.delete(active):done.add(active);render();flash(done.has(active)?"Langkah ditandai selesai.":"Tanda selesai dibatalkan.")};

document.getElementById("resetProgress").onclick=()=>{
  if(!confirm("Reset seluruh progres dan jawaban modul Pembagian Bersusun?"))return;
  localStorage.removeItem(KEY);location.reload();
};

// Diagnostik
document.querySelectorAll("#diagChoices button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("#diagChoices button").forEach(x=>x.classList.remove("selected","correct","wrong"));
  b.classList.add("selected");state.diag=b.dataset.value;
  const fb=document.getElementById("diagFeedback");
  if(b.dataset.value==="6"){b.classList.add("correct");fb.className="feedback good";fb.textContent="Arahmu sudah tepat. Nanti kita buktikan mengapa 6 yang dipilih."}
  else if(b.dataset.value==="dontknow"){fb.className="feedback neutral";fb.textContent="Tidak apa-apa. Gunakan modul ini dari langkah pertama."}
  else{b.classList.add("wrong");fb.className="feedback warn";fb.textContent="Belum kita nilai sebagai gagal. Kita akan memakai kelipatan 35 untuk menentukannya."}
  save();
});

// Tabel kelipatan interaktif: tidak ada jawaban yang dipilih otomatis.
function buildMultiples(divisor,target,container,{interactive=false,markBest=false,onPick=null}={}){
  container.innerHTML="";
  let best=0;
  for(let i=1;i<=10;i++)if(i*divisor<=target)best=i;

  for(let i=1;i<=10;i++){
    const value=i*divisor;
    const el=document.createElement(interactive?"button":"div");
    el.type=interactive?"button":undefined;
    el.className="multiple-item";
    el.dataset.multiplier=String(i);
    el.dataset.value=String(value);
    el.innerHTML="<b>"+divisor+" × "+i+"</b><br>"+value;

    if(markBest && i===best) el.classList.add("best");

    if(interactive){
      el.addEventListener("click",()=>{
        [...container.children].forEach(x=>x.classList.remove("best","picked-wrong","picked-over"));
        if(i===best){
          el.classList.add("best");
        }else if(value>target){
          el.classList.add("picked-over");
        }else{
          el.classList.add("picked-wrong");
        }
        onPick?.({multiplier:i,value,best,target,divisor,element:el});
      });
    }
    container.appendChild(el);
  }
}

buildMultiples(35,240,document.getElementById("multipleGrid"),{
  interactive:true,
  onPick:({multiplier,value,best,target})=>{
    const fb=document.getElementById("multipleChoiceFeedback");
    if(multiplier===best){
      fb.className="feedback good";
      fb.innerHTML="<b>Tepat.</b> 35 × "+multiplier+" = "+value+" adalah hasil terbesar yang masih tidak melebihi "+target+".";
      state.firstDigit=true;
    }else if(value>target){
      fb.className="feedback warn";
      fb.innerHTML="35 × "+multiplier+" = "+value+" <b>sudah melewati "+target+"</b>. Pilih kelipatan yang lebih kecil.";
      state.firstDigit=false;
    }else{
      fb.className="feedback warn";
      fb.innerHTML="35 × "+multiplier+" = "+value+" masih di bawah "+target+", tetapi <b>belum yang paling dekat</b>. Coba kelipatan yang lebih besar.";
      state.firstDigit=false;
    }
    save();
  }
});

// Proses pembagian bersusun 240 ÷ 35 dengan posisi digit eksplisit.
const processSteps=[
  {
    phase:"BAGI",
    title:"Tentukan bagian pertama yang dibagi",
    text:"35 tidak dapat masuk ke 2 atau 24. Karena itu gunakan 240 sebagai bagian pertama yang dibagi.",
    rule:"Ambil digit dari kiri sampai nilainya sama dengan atau lebih besar daripada pembagi.",
    quotientHTML:"?",
    dividendHTML:"240",
    rows:[]
  },
  {
    phase:"BAGI",
    title:"Bagi 240 dengan 35",
    text:"",
    rule:"Pilih hasil kali terbesar yang tidak melebihi bilangan yang sedang dibagi.",
    compare:[
      {calc:"35 × 6 =",value:"210",status:"mendekati 240",ok:true},
      {calc:"35 × 7 =",value:"245",status:"melebihi 240",ok:false}
    ],
    quotientHTML:'<span class="ld-red">6</span>',
    divisorHTML:'<span class="ld-red">35</span>',
    dividendHTML:'<span class="ld-red">240</span>',
    rows:[]
  },
  {
    phase:"KALI",
    title:"Kalikan 6 × 35 = 210",
    text:"Tulis 210 tepat di bawah 240.",
    rule:"Kalikan digit hasil bagi dengan pembagi.",
    quotientHTML:'<span class="ld-red">6</span>',
    divisorHTML:'<span class="ld-red">35</span>',
    dividendHTML:"240",
    rows:[
      {html:'<span class="ld-red">210</span>',kind:"product"}
    ]
  },
  {
    phase:"KURANGI",
    title:"240 − 210 = 30",
    text:"Sisa pembagiannya 30.",
    rule:"Kurangkan untuk mengetahui sisa pembagian.",
    quotientHTML:"6",
    dividendHTML:'<span class="ld-red">240</span>',
    rows:[
      {html:'<span class="ld-red">210</span>',kind:"product"},
      {kind:"line",width:3},
      {html:'<span class="ld-red">30</span>',kind:"remainder"}
    ]
  },
  {
    phase:"DESIMAL",
    title:"Tambahkan koma dan 0",
    text:"",
    rule:"Jika masih ada sisa, tambahkan koma pada hasil dan 0 pada sisa untuk melanjutkan.",
    quotientHTML:'6<span class="ld-red">,</span>',
    dividendHTML:"240",
    rows:[
      {html:"210",kind:"product"},
      {kind:"line",width:3},
      {html:'<span class="ld-red">300</span>',kind:"remainder"}
    ]
  },
  {
    phase:"BAGI",
    title:"Bagi 300 dengan 35",
    text:"",
    rule:"Pilih lagi hasil kali terbesar yang tidak melebihi bilangan yang sedang dibagi.",
    compare:[
      {calc:"35 × 8 =",value:"280",status:"mendekati 300",ok:true},
      {calc:"35 × 9 =",value:"315",status:"melebihi 300",ok:false}
    ],
    quotientHTML:'6,<span class="ld-red">8</span>',
    divisorHTML:'<span class="ld-red">35</span>',
    dividendHTML:"240",
    rows:[
      {html:"210",kind:"product"},
      {kind:"line",width:3},
      {html:'<span class="ld-red">300</span>',kind:"remainder"}
    ]
  },
  {
    phase:"KALI",
    title:"Kalikan 8 × 35 = 280",
    text:"Tulis 280 tepat di bawah 300.",
    rule:"Kalikan digit hasil bagi yang baru dengan pembagi.",
    quotientHTML:'6,<span class="ld-red">8</span>',
    divisorHTML:'<span class="ld-red">35</span>',
    dividendHTML:"240",
    rows:[
      {html:"210",kind:"product"},
      {kind:"line",width:3},
      {html:"300",kind:"remainder"},
      {html:'<span class="ld-red">280</span>',kind:"product"}
    ]
  },
  {
    phase:"KURANGI",
    title:"300 − 280 = 20",
    text:"Sisa pembagiannya 20.",
    rule:"Jika masih ada sisa, proses belum selesai.",
    quotientHTML:"6,8",
    dividendHTML:"240",
    rows:[
      {html:"210",kind:"product"},
      {kind:"line",width:3},
      {html:'<span class="ld-red">300</span>',kind:"remainder"},
      {html:'<span class="ld-red">280</span>',kind:"product"},
      {kind:"line",width:3},
      {html:'<span class="ld-red">20</span>',kind:"remainder"}
    ]
  },
  {
    phase:"ULANGI",
    title:"",
    text:"20 menjadi 200. Pilih 5 karena 35 × 5 = 175, sedangkan 35 × 6 = 210 sudah melebihi 200.",
    rule:"Ulangi bagi → kali → kurangi. Jika hasil pengurangan menjadi 0, pembagian selesai. Jika belum 0, lanjutkan lagi.",
    compare:[
      {calc:"35 × 5 =",value:"175",status:"mendekati 200",ok:true},
      {calc:"35 × 6 =",value:"210",status:"melebihi 200",ok:false}
    ],
    quotientHTML:'6,8<span class="ld-red">5</span><span class="ld-red">…</span>',
    dividendHTML:"240",
    rows:[
      {html:"210",kind:"product"},
      {kind:"line",width:3},
      {html:"300",kind:"remainder"},
      {html:"280",kind:"product"},
      {kind:"line",width:3},
      {html:"200",kind:"remainder"},
      {html:'<span class="ld-red">175</span>',kind:"product"},
      {kind:"line",width:3},
      {html:'<span class="ld-red">25</span>',kind:"remainder"}
    ]
  },
  {
    phase:"HASIL",
    title:"240 ÷ 35 = 6,857142…",
    text:"",
    rule:"Jika suatu tahap menghasilkan sisa 0, pembagian selesai. Jika sisanya tidak 0, pola dapat diteruskan sesuai ketelitian yang dibutuhkan.",
    quotientHTML:'6,857142<span class="ld-red">…</span>',
    dividendHTML:"240",
    rows:[
      {html:'<span class="ld-red ld-continuation">…</span>',kind:"remainder"}
    ]
  }
];

let processIndex=Math.min(state.processIndex||0,processSteps.length-1);

function renderProcessCompare(step){
  const box=document.getElementById("processCompare");
  if(!box) return;
  if(!step.compare?.length){
    box.hidden=true;
    box.innerHTML="";
    return;
  }
  box.hidden=false;
  box.innerHTML='<div class="compare-label">Bandingkan kelipatan</div>'+
    '<div class="compare-grid">'+step.compare.map(item=>
      '<div class="compare-item '+(item.ok?"is-ok":"is-over")+'">'+
        '<span>'+item.calc+'</span>'+
        '<b>'+item.value+'</b>'+
        '<small>'+item.status+'</small>'+
      '</div>'
    ).join("")+'</div>';
}

function renderLongDivision(step){
  const stack=document.getElementById("divisionStack");
  const rows=step.rows.map(row=>{
    if(row.kind==="line"){
      return '<div class="ld-work-row ld-line" style="--row-ch:'+String(row.width||3)+'"></div>';
    }
    const classes=["ld-work-row"];
    if(row.kind) classes.push(...row.kind.split(" "));
    if(row.emphasis) classes.push("current-line");
    return '<div class="'+classes.join(" ")+'">'+(row.html??"")+'</div>';
  }).join("");

  stack.innerHTML=
    '<div class="ld-quotient">'+step.quotientHTML+'</div>'+
    '<div class="ld-divisor">'+(step.divisorHTML||"35")+'</div>'+
    '<div class="ld-body">'+
      '<div class="ld-dividend">'+step.dividendHTML+'</div>'+
      '<div class="ld-work">'+rows+'</div>'+
    '</div>';
}

function renderProcess(){
  const s=processSteps[processIndex];
  document.getElementById("processIndex").textContent=processIndex+1;
  document.getElementById("processTotal").textContent=processSteps.length;
  document.getElementById("processPhase").textContent=s.phase;
  const processTitle=document.getElementById("processTitle");
  processTitle.hidden=!s.title;
  processTitle.textContent=s.title||"";

  const processText=document.getElementById("processText");
  if(s.text){
    processText.hidden=false;
    processText.textContent=s.text;
  }else{
    processText.hidden=true;
    processText.textContent="";
  }

  document.getElementById("processRule").textContent=s.rule;
  renderProcessCompare(s);
  renderLongDivision(s);

  const processPrev=document.getElementById("processPrev");
  processPrev.disabled=processIndex===0;
  processPrev.setAttribute("aria-disabled",processIndex===0?"true":"false");

  document.getElementById("processNext").textContent=
    processIndex===processSteps.length-1?"Ulangi dari awal":"Langkah berikutnya →";

  const strip=document.getElementById("processStrip");
  strip.innerHTML="";
  processSteps.forEach((_,i)=>{
    const d=document.createElement("div");
    d.className="process-dot "+(i<processIndex?"done":i===processIndex?"active":"");
    strip.appendChild(d);
  });
}

document.getElementById("processPrev").onclick=()=>{
  if(processIndex===0) return;
  processIndex--;
  state.processIndex=processIndex;
  save();
  renderProcess();
};

document.getElementById("processNext").onclick=()=>{
  processIndex=processIndex===processSteps.length-1?0:processIndex+1;
  state.processIndex=processIndex;
  save();
  renderProcess();
};
renderProcess();

// Practice
const practices=[
  {a:156,b:12,ans:13},
  {a:378,b:27,ans:14},
  {a:125,b:8,ans:15.625}
];
let practiceIndex=state.practiceIndex||0,practiceCorrect=state.practiceCorrect||0;
function renderPractice(){
  const q=practices[practiceIndex];
  document.getElementById("practiceCount").textContent="Soal "+(practiceIndex+1)+" dari "+practices.length;
  document.getElementById("practiceScore").textContent="Benar "+practiceCorrect;
  document.getElementById("practiceProblem").textContent=q.a+" ÷ "+q.b;
  document.getElementById("practiceAnswer").value="";
  document.getElementById("practiceFeedback").className="feedback neutral";
  document.getElementById("practiceFeedback").textContent="Kerjakan sendiri. Bantuan tersedia bila diperlukan.";
  document.getElementById("practiceMultiples").hidden=true;
  document.getElementById("practiceNext").hidden=true;
}
document.getElementById("practiceHelper").onclick=()=>{
  const q=practices[practiceIndex],panel=document.getElementById("practiceMultiples");
  panel.hidden=!panel.hidden;
  if(!panel.hidden){
    panel.innerHTML='<div class="multiple-head"><strong>Kelipatan '+q.b+'</strong><span>Cari yang membantu langkah awal</span></div><div class="multiple-grid"></div>';
    buildMultiples(q.b,q.a,panel.querySelector(".multiple-grid"),{markBest:true});
  }
};
document.getElementById("practiceCheck").onclick=()=>{
  const q=practices[practiceIndex],v=Number(String(document.getElementById("practiceAnswer").value).replace(",","."));
  const fb=document.getElementById("practiceFeedback");
  if(Math.abs(v-q.ans)<1e-9){fb.className="feedback good";fb.textContent="Benar. "+q.a+" ÷ "+q.b+" = "+String(q.ans).replace(".",",")+".";if(!state["practiceDone"+practiceIndex]){practiceCorrect++;state["practiceDone"+practiceIndex]=true}}
  else{fb.className="feedback warn";fb.textContent="Belum tepat. Periksa kembali langkah bagi → kali → kurang → turunkan. Gunakan bantuan kelipatan bila perlu."}
  state.practiceCorrect=practiceCorrect;save();
  document.getElementById("practiceScore").textContent="Benar "+practiceCorrect;
  document.getElementById("practiceNext").hidden=false;
};
document.getElementById("practiceNext").onclick=()=>{practiceIndex=(practiceIndex+1)%practices.length;state.practiceIndex=practiceIndex;save();renderPractice()};
renderPractice();

// Evaluation
const evals=[
  {q:"Pada 240 ÷ 35, mengapa angka awalnya 6?",a:["6 × 35 = 210 dan 7 × 35 = 245 terlalu besar","Karena 240 berakhir dengan 0","Karena 35 dibulatkan menjadi 40"],c:0,f:"Kita memilih kelipatan terbesar yang tidak melewati bilangan yang sedang dibagi."},
  {q:"Setelah memilih 6 pada 240 ÷ 35, langkah berikutnya adalah...",a:["Mengalikan 6 × 35","Menambah 35 ke 240","Langsung menulis desimal"],c:0,f:"Urutannya adalah bagi → kali → kurang → turunkan."},
  {q:"240 − 210 menghasilkan sisa...",a:["20","30","35"],c:1,f:"Sisa 30 kemudian dapat dilanjutkan ke desimal."},
  {q:"Jika masih ada sisa tetapi tidak ada angka lagi untuk diturunkan, kita dapat...",a:["Berhenti selalu","Menambahkan koma pada hasil dan 0 pada sisa","Menghapus sisanya"],c:1,f:"Untuk melanjutkan ke desimal, tambahkan koma pada hasil lalu 0 pada sisa."},
  {q:"Kelipatan 27 terbesar yang tidak melebihi 378 adalah...",a:["27 × 12 = 324","27 × 14 = 378","27 × 15 = 405"],c:1,f:"27 × 14 tepat sama dengan 378."}
];
let evalIndex=0,evalScore=0,evalAnswered=false;
function renderEval(){
  const q=evals[evalIndex];evalAnswered=false;
  document.getElementById("evalCount").textContent=(evalIndex+1)+"/"+evals.length;
  document.getElementById("evalScore").textContent="Skor "+evalScore;
  document.getElementById("evalQuestion").textContent=q.q;
  const box=document.getElementById("evalChoices");box.innerHTML="";
  q.a.forEach((a,i)=>{const b=document.createElement("button");b.textContent=a;b.onclick=()=>answerEval(i,b);box.appendChild(b)});
  document.getElementById("evalFeedback").className="feedback neutral";
  document.getElementById("evalFeedback").textContent="Pilih jawaban yang paling tepat.";
  document.getElementById("evalNext").hidden=true;
}
function answerEval(i,btn){
  if(evalAnswered)return;evalAnswered=true;const q=evals[evalIndex];
  [...document.getElementById("evalChoices").children].forEach((b,k)=>{if(k===q.c)b.classList.add("correct");else if(k===i)b.classList.add("wrong");b.disabled=true});
  const fb=document.getElementById("evalFeedback");
  if(i===q.c){evalScore++;fb.className="feedback good";fb.textContent="Benar. "+q.f}else{fb.className="feedback warn";fb.textContent="Belum tepat. "+q.f}
  document.getElementById("evalScore").textContent="Skor "+evalScore;
  document.getElementById("evalNext").hidden=false;
}
document.getElementById("evalNext").onclick=()=>{
  if(evalIndex<evals.length-1){evalIndex++;renderEval()}else{
    const card=document.getElementById("masteryCard");card.hidden=false;
    document.getElementById("masteryTitle").textContent=evalScore>=4?"Penguasaan dasar sudah baik":"Masih perlu latihan";
    document.getElementById("masteryText").textContent=evalScore>=4?"Kamu sudah memahami pola utama pembagian bersusun.":"Ulangi terutama langkah memilih kelipatan, mengalikan, dan mengurangkan.";
    done.add(5);render();
  }
};
document.getElementById("evalReset").onclick=()=>{evalIndex=0;evalScore=0;document.getElementById("masteryCard").hidden=true;renderEval()};
renderEval();

// Swipe stage navigation on empty/content areas; preserve form controls.
let sx=0,sy=0,st=0,blocked=false;
const swipeRoot=document.querySelector(".app-main");
swipeRoot.addEventListener("touchstart",e=>{
  if(e.touches.length!==1)return;
  blocked=!!e.target.closest("input,button,a,.stage-nav,.bottom-nav");
  if(blocked)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();
},{passive:true});
swipeRoot.addEventListener("touchend",e=>{
  if(blocked||!st||!e.changedTouches.length){blocked=false;st=0;return}
  const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
  if(Date.now()-st<=900&&Math.abs(dx)>=64&&Math.abs(dx)>=Math.abs(dy)*1.35){
    if(dx<0&&active<N-1)show(active+1);else if(dx>0&&active>0)show(active-1);
  }
  blocked=false;st=0;
},{passive:true});

render();
})();