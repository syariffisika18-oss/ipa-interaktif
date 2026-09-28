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

// Multiples helper
function buildMultiples(divisor,target,container,markBest=true){
  container.innerHTML="";
  let best=0;
  for(let i=1;i<=10;i++)if(i*divisor<=target)best=i;
  for(let i=1;i<=10;i++){
    const value=i*divisor;
    const d=document.createElement("div");
    d.className="multiple-item"+(value>target?" too-high":"")+(markBest&&i===best?" best":"");
    d.innerHTML="<b>"+divisor+" × "+i+"</b><br>"+value;
    container.appendChild(d);
  }
}
const multPanel=document.getElementById("multiplePanel");
buildMultiples(35,240,document.getElementById("multipleGrid"));
document.getElementById("toggleMultiples").onclick=()=>{
  multPanel.hidden=!multPanel.hidden;
  document.getElementById("toggleMultiples").textContent=multPanel.hidden?"Tampilkan kelipatan 35":"Sembunyikan bantuan";
};
document.getElementById("checkFirstDigit").onclick=()=>{
  const v=Number(document.getElementById("firstDigit").value);
  const fb=document.getElementById("firstDigitFeedback");
  if(v===6){fb.className="feedback good";fb.innerHTML="<b>Benar.</b> 6 × 35 = 210, sedangkan 7 × 35 = 245 sudah melewati 240.";state.firstDigit=true}
  else{fb.className="feedback warn";fb.innerHTML="Belum tepat. Cari hasil perkalian 35 yang paling besar tetapi masih ≤ 240. Buka bantuan kelipatan jika perlu.";state.firstDigit=false}
  save();
};

// Process
const processSteps=[
  ["Bagi","35 masuk ke 240 sebanyak 6 kali karena 6 × 35 = 210 dan 7 × 35 = 245 terlalu besar.","240 ÷ 35 → pilih 6"],
  ["Kali","Kalikan angka hasil bagi dengan pembagi: 6 × 35 = 210.","6 × 35 = 210"],
  ["Kurang","Kurangkan 240 − 210 sehingga tersisa 30.","240 − 210 = 30"],
  ["Tambahkan desimal","Karena masih bersisa dan tidak ada angka lagi untuk diturunkan, tulis koma pada hasil lalu tambahkan 0 pada sisa: 30 menjadi 300.","6, ... dan 30 → 300"],
  ["Ulangi pola","35 masuk ke 300 sebanyak 8 kali. 8 × 35 = 280, sisanya 20. Lanjutkan pola yang sama.","300 ÷ 35 → 8, sisa 20"],
  ["Hasil sementara","Proses dapat diteruskan. Beberapa angka pertama hasilnya adalah 6,8571...","240 ÷ 35 = 6,8571..."]
];
let processIndex=state.processIndex||0;
function renderProcess(){
  const s=processSteps[processIndex];
  document.getElementById("processIndex").textContent=processIndex+1;
  document.getElementById("processTitle").textContent=s[0];
  document.getElementById("processText").textContent=s[1];
  document.getElementById("processEquation").textContent=s[2];
  document.getElementById("processNext").textContent=processIndex===processSteps.length-1?"Ulangi proses":"Langkah berikutnya →";
  const strip=document.getElementById("processStrip");strip.innerHTML="";
  processSteps.forEach((_,i)=>{const d=document.createElement("div");d.className="process-dot "+(i<processIndex?"done":i===processIndex?"active":"");strip.appendChild(d)});
}
document.getElementById("processNext").onclick=()=>{processIndex=processIndex===processSteps.length-1?0:processIndex+1;state.processIndex=processIndex;save();renderProcess()};
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
    buildMultiples(q.b,q.a,panel.querySelector(".multiple-grid"),true);
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