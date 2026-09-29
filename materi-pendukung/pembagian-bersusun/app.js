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

// Practice — latihan langkah demi langkah, mengikuti format "Ikuti proses".
const practices=[
  {
    a:156,b:12,answer:"13",
    steps:[
      {phase:"BAGI",type:"divide",title:"Bagi 15 dengan 12",target:15,expected:1,
       instruction:"Pilih kelipatan 12 yang paling besar tetapi tidak melebihi 15.",
       q:"?",rows:[]},
      {phase:"KALI",type:"number",title:"Kalikan 1 × 12",expected:12,
       instruction:"Tulis hasil perkalian 1 × 12.",q:"1",
       rows:[{html:"12",pos:"left",active:true}]},
      {phase:"KURANGI",type:"number",title:"15 − 12",expected:3,
       instruction:"Kurangkan 15 dengan 12.",q:"1",
       rows:[{html:"12",pos:"left"},{line:true,pos:"left",width:2},{html:"3",pos:"left",active:true}]},
      {phase:"TURUNKAN",type:"action",title:"Turunkan angka 6",actionLabel:"Turunkan 6",
       instruction:"Turunkan digit berikutnya agar sisa 3 menjadi 36.",q:"1",
       rows:[{html:"12",pos:"left"},{line:true,pos:"left",width:2},{html:"36",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 36 dengan 12",target:36,expected:3,
       instruction:"Gunakan kelipatan 12 untuk menentukan digit berikutnya.",q:"1<span class=\"ld-red\">3</span>",
       rows:[{html:"12",pos:"left"},{line:true,pos:"left",width:2},{html:"36",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 3 × 12",expected:36,
       instruction:"Tulis hasil perkalian 3 × 12.",q:"13",
       rows:[{html:"12",pos:"left"},{line:true,pos:"left",width:2},{html:"36",pos:"right"},{html:"36",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"36 − 36",expected:0,
       instruction:"Kurangkan untuk mengetahui sisanya.",q:"13",
       rows:[{html:"12",pos:"left"},{line:true,pos:"left",width:2},{html:"36",pos:"right"},{html:"36",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right",active:true}]},
      {phase:"SELESAI",type:"done",title:"156 ÷ 12 = 13",
       instruction:"Sisa sudah 0, sehingga pembagian selesai.",q:"13",
       rows:[{html:"12",pos:"left"},{line:true,pos:"left",width:2},{html:"36",pos:"right"},{html:"36",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right"}]}
    ]
  },
  {
    a:378,b:27,answer:"14",
    steps:[
      {phase:"BAGI",type:"divide",title:"Bagi 37 dengan 27",target:37,expected:1,
       instruction:"Pilih kelipatan 27 yang paling besar tetapi tidak melebihi 37.",q:"?",rows:[]},
      {phase:"KALI",type:"number",title:"Kalikan 1 × 27",expected:27,
       instruction:"Tulis hasil perkalian 1 × 27.",q:"1",
       rows:[{html:"27",pos:"left",active:true}]},
      {phase:"KURANGI",type:"number",title:"37 − 27",expected:10,
       instruction:"Kurangkan 37 dengan 27.",q:"1",
       rows:[{html:"27",pos:"left"},{line:true,pos:"left",width:2},{html:"10",pos:"left",active:true}]},
      {phase:"TURUNKAN",type:"action",title:"Turunkan angka 8",actionLabel:"Turunkan 8",
       instruction:"Turunkan digit berikutnya agar 10 menjadi 108.",q:"1",
       rows:[{html:"27",pos:"left"},{line:true,pos:"left",width:2},{html:"108",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 108 dengan 27",target:108,expected:4,
       instruction:"Gunakan kelipatan 27 untuk menentukan digit berikutnya.",q:"1<span class=\"ld-red\">4</span>",
       rows:[{html:"27",pos:"left"},{line:true,pos:"left",width:2},{html:"108",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 4 × 27",expected:108,
       instruction:"Tulis hasil perkalian 4 × 27.",q:"14",
       rows:[{html:"27",pos:"left"},{line:true,pos:"left",width:2},{html:"108",pos:"right"},{html:"108",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"108 − 108",expected:0,
       instruction:"Kurangkan untuk mengetahui sisanya.",q:"14",
       rows:[{html:"27",pos:"left"},{line:true,pos:"left",width:2},{html:"108",pos:"right"},{html:"108",pos:"right"},{line:true,pos:"right",width:3},{html:"0",pos:"right",active:true}]},
      {phase:"SELESAI",type:"done",title:"378 ÷ 27 = 14",
       instruction:"Sisa sudah 0, sehingga pembagian selesai.",q:"14",
       rows:[{html:"27",pos:"left"},{line:true,pos:"left",width:2},{html:"108",pos:"right"},{html:"108",pos:"right"},{line:true,pos:"right",width:3},{html:"0",pos:"right"}]}
    ]
  },
  {
    a:125,b:8,answer:"15,625",
    steps:[
      {phase:"BAGI",type:"divide",title:"Bagi 12 dengan 8",target:12,expected:1,
       instruction:"Pilih kelipatan 8 yang paling besar tetapi tidak melebihi 12.",q:"?",rows:[]},
      {phase:"KALI",type:"number",title:"Kalikan 1 × 8",expected:8,
       instruction:"Tulis hasil perkalian 1 × 8.",q:"1",rows:[{html:"8",pos:"left",active:true}]},
      {phase:"KURANGI",type:"number",title:"12 − 8",expected:4,
       instruction:"Kurangkan 12 dengan 8.",q:"1",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"4",pos:"left",active:true}]},
      {phase:"TURUNKAN",type:"action",title:"Turunkan angka 5",actionLabel:"Turunkan 5",
       instruction:"Turunkan digit berikutnya agar 4 menjadi 45.",q:"1",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 45 dengan 8",target:45,expected:5,
       instruction:"Gunakan kelipatan 8 untuk menentukan digit berikutnya.",q:"1<span class=\"ld-red\">5</span>",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 5 × 8",expected:40,
       instruction:"Tulis hasil perkalian 5 × 8.",q:"15",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"45 − 40",expected:5,
       instruction:"Kurangkan 45 dengan 40.",q:"15",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"5",pos:"right",active:true}]},
      {phase:"DESIMAL",type:"action",title:"Tambahkan koma dan 0",actionLabel:"Tambahkan koma dan 0",
       instruction:"Tidak ada digit lagi untuk diturunkan. Tambahkan koma pada hasil dan 0 pada sisa agar 5 menjadi 50.",q:'15<span class="ld-red">,</span>',
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 50 dengan 8",target:50,expected:6,
       instruction:"Gunakan kelipatan 8 untuk menentukan digit berikutnya.",q:'15,<span class="ld-red">6</span>',
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 6 × 8",expected:48,
       instruction:"Tulis hasil perkalian 6 × 8.",q:"15,6",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"50 − 48",expected:2,
       instruction:"Kurangkan 50 dengan 48.",q:"15,6",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"2",pos:"right",active:true}]},
      {phase:"LANJUTKAN",type:"action",title:"Tambahkan 0",actionLabel:"Tambahkan 0",
       instruction:"Tambahkan 0 pada sisa 2 sehingga menjadi 20.",q:"15,6",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 20 dengan 8",target:20,expected:2,
       instruction:"Gunakan kelipatan 8 untuk menentukan digit berikutnya.",q:'15,6<span class="ld-red">2</span>',
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 2 × 8",expected:16,
       instruction:"Tulis hasil perkalian 2 × 8.",q:"15,62",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"20 − 16",expected:4,
       instruction:"Kurangkan 20 dengan 16.",q:"15,62",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right"},{line:true,pos:"right",width:2},{html:"4",pos:"right",active:true}]},
      {phase:"LANJUTKAN",type:"action",title:"Tambahkan 0",actionLabel:"Tambahkan 0",
       instruction:"Tambahkan 0 pada sisa 4 sehingga menjadi 40.",q:"15,62",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right"},{line:true,pos:"right",width:2},{html:"40",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 40 dengan 8",target:40,expected:5,
       instruction:"Gunakan kelipatan 8 untuk menentukan digit berikutnya.",q:'15,62<span class="ld-red">5</span>',
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right"},{line:true,pos:"right",width:2},{html:"40",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 5 × 8",expected:40,
       instruction:"Tulis hasil perkalian 5 × 8.",q:"15,625",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right"},{line:true,pos:"right",width:2},{html:"40",pos:"right"},{html:"40",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"40 − 40",expected:0,
       instruction:"Kurangkan untuk mengetahui sisanya.",q:"15,625",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right"},{line:true,pos:"right",width:2},{html:"40",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right",active:true}]},
      {phase:"SELESAI",type:"done",title:"125 ÷ 8 = 15,625",
       instruction:"Sisa sudah 0, sehingga pembagian selesai.",q:"15,625",
       rows:[{html:"8",pos:"left"},{line:true,pos:"left",width:2},{html:"45",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"50",pos:"right"},{html:"48",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"16",pos:"right"},{line:true,pos:"right",width:2},{html:"40",pos:"right"},{html:"40",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right"}]}
    ]
  }
];

let practiceIndex=Math.min(state.practiceIndex||0,practices.length-1);
let practiceStepIndex=0;
let practiceCompleted=new Set(state.practiceCompleted||[]);
let practiceSolvedSteps=new Set(state.practiceSolvedSteps||[]);
let practiceStepSolved=false;

function practiceStepKey(){
  return practiceIndex+":"+practiceStepIndex;
}
function isPracticeStepSolved(){
  const step=practices[practiceIndex].steps[practiceStepIndex];
  return step.type==="done" || practiceSolvedSteps.has(practiceStepKey());
}
function markPracticeStepSolved(){
  practiceSolvedSteps.add(practiceStepKey());
  state.practiceSolvedSteps=[...practiceSolvedSteps];
  save();
}
function highlightLastDigit(value){
  const s=String(value);
  const m=s.match(/^(.*)(\d)([^\d]*)$/);
  return m ? m[1]+'<span class="ld-red">'+m[2]+'</span>'+m[3] : '<span class="ld-red">'+s+'</span>';
}

function renderPracticeDivision(q,step){
  const box=document.getElementById("practiceDivision");
  const solved=isPracticeStepSolved();
  const isMultiplyStep=step.phase==="KALI" && step.type==="number";
  const isSubtractStep=step.phase==="KURANGI" && step.type==="number";
  const isDivideStep=step.type==="divide";
  const isActionStep=step.type==="action";

  let quotientHtml=step.q;

  // Pada langkah BAGI, digit hasil baru tidak ditampilkan sebelum pilihan benar.
  if(isDivideStep){
    if(String(step.q).includes("ld-red")){
      quotientHtml=String(step.q).replace(/(<span class="ld-red">)[\s\S]*?(<\/span>)/,'$1...$2');
    }else{
      quotientHtml='<span class="ld-red">...</span>';
    }
  }

  // Pada langkah KALI, hanya digit hasil yang sedang dipakai yang diberi fokus merah.
  if(isMultiplyStep){
    const plain=String(step.q).replace(/<[^>]*>/g,"");
    quotientHtml=plain.replace(/(\d)([^\d]*)$/,'<span class="ld-red">...</span>$2');
  }

  // Pada langkah DESIMAL, koma baru muncul setelah siswa menekan tindakannya.
  if(isActionStep && step.phase==="DESIMAL"){
    quotientHtml=String(step.q).replace(/<span class="ld-red">,?<\/span>/,'<span class="ld-red">...</span>');
  }

  const divisorHtml=isMultiplyStep
    ? '<span class="ld-red">'+q.b+'</span>'
    : q.b;

  const rows=step.rows.map(row=>{
    if(row.line){
      return '<div class="practice-work-row practice-line '+(row.pos||"right")+'" style="--pw:'+String(row.width||3)+'ch"></div>';
    }

    let rowHtml=row.html;

    // Coba sendiri: hasil KALI dan KURANGI tetap disamarkan pada langkah aktif,
    // bahkan setelah jawaban benar. Nilai sebenarnya baru tampak sebagai konteks
    // pada langkah berikutnya.
    if(row.active && (isMultiplyStep || isSubtractStep || isActionStep)){
      rowHtml='<span class="ld-red">...</span>';
    }

    return '<div class="practice-work-row '+(row.pos||"right")+(row.active?" active":"")+'">'+rowHtml+'</div>';
  }).join("");

  box.innerHTML=
    '<div class="practice-quotient">'+quotientHtml+'</div>'+
    '<div class="practice-divisor">'+divisorHtml+'</div>'+
    '<div class="practice-body">'+
      '<div class="practice-dividend">'+q.a+'</div>'+
      '<div class="practice-work">'+rows+'</div>'+
    '</div>';
}

function renderPracticeResponse(q,step){
  const response=document.getElementById("practiceResponse");
  const multiplePanel=document.getElementById("practiceMultiples");
  const feedback=document.getElementById("practiceFeedback");

  response.innerHTML="";
  multiplePanel.innerHTML="";
  multiplePanel.hidden=true;
  feedback.className="feedback neutral";
  feedback.textContent="Kerjakan langkah ini sendiri.";
  practiceStepSolved=isPracticeStepSolved();
  if(practiceStepSolved && step.type!=="done"){
    feedback.className="feedback good";
    feedback.textContent="Langkah ini sudah benar. Kamu dapat melanjutkan atau meninjaunya kembali.";
  }

  if(step.type==="divide"){
    multiplePanel.hidden=false;
    multiplePanel.innerHTML=
      '<div class="multiple-head"><strong>Kelipatan '+q.b+'</strong><span>Cari hasil terbesar ≤ '+step.target+'</span></div>'+
      '<div class="multiple-grid"></div>';

    buildMultiples(q.b,step.target,multiplePanel.querySelector(".multiple-grid"),{
      interactive:true,
      onPick:({multiplier,value,best})=>{
        const fb=document.getElementById("practiceFeedback");
        if(multiplier===step.expected){
          fb.className="feedback good";
          fb.innerHTML="<b>Tepat.</b> "+q.b+" × "+multiplier+" = "+value+" adalah kelipatan terbesar yang tidak melebihi "+step.target+".";
          practiceStepSolved=true;
          markPracticeStepSolved();
          renderPracticeDivision(q,step);
          document.getElementById("practiceStepNext").disabled=false;
        }else if(value>step.target){
          fb.className="feedback warn";
          fb.textContent=q.b+" × "+multiplier+" = "+value+" sudah melebihi "+step.target+". Pilih kelipatan yang lebih kecil.";
        }else{
          fb.className="feedback warn";
          fb.textContent=q.b+" × "+multiplier+" = "+value+" masih dapat diperbesar. Cari yang paling dekat dengan "+step.target+".";
        }
      }
    });
  }else if(step.type==="number"){
    response.innerHTML=
      '<label class="practice-answer-label">Jawaban'+
        '<div class="practice-answer-row">'+
          '<input id="practiceStepAnswer" inputmode="decimal" placeholder="?">'+
          '<button id="practiceStepCheck" type="button">Periksa</button>'+
        '</div>'+
      '</label>';

    document.getElementById("practiceStepCheck").onclick=()=>{
      const raw=document.getElementById("practiceStepAnswer").value.trim().replace(",",".");
      const value=Number(raw);
      if(!Number.isFinite(value)){
        feedback.className="feedback warn";
        feedback.textContent="Masukkan angka terlebih dahulu.";
        return;
      }
      if(Math.abs(value-step.expected)<1e-9){
        feedback.className="feedback good";
        feedback.textContent="Benar. Lanjutkan ke langkah berikutnya.";
        practiceStepSolved=true;
        markPracticeStepSolved();
        renderPracticeDivision(q,step);
        document.getElementById("practiceStepNext").disabled=false;
      }else{
        feedback.className="feedback warn";
        feedback.textContent="Belum tepat. Periksa kembali operasi pada langkah ini.";
      }
    };
  }else if(step.type==="action"){
    response.innerHTML='<button id="practiceActionBtn" class="practice-action-btn" type="button">'+step.actionLabel+'</button>';
    document.getElementById("practiceActionBtn").onclick=()=>{
      feedback.className="feedback good";
      feedback.textContent="Benar. Perhatikan perubahan pada bentuk pembagian bersusun.";
      practiceStepSolved=true;
      markPracticeStepSolved();
      renderPracticeDivision(q,step);
      document.getElementById("practiceStepNext").disabled=false;
    };
  }else if(step.type==="done"){
    feedback.className="feedback good";
    feedback.textContent=step.instruction;
    response.innerHTML='<div class="practice-result-chip">Hasil: <b>'+q.answer+'</b></div>';
    practiceStepSolved=true;
  }
}

function renderPractice(){
  const q=practices[practiceIndex];
  const step=q.steps[practiceStepIndex];

  document.getElementById("practiceCount").textContent="Soal "+(practiceIndex+1)+" dari "+practices.length;
  document.getElementById("practiceScore").textContent="Selesai "+practiceCompleted.size+"/"+practices.length;
  document.getElementById("practiceProblem").textContent=q.a+" ÷ "+q.b;
  document.getElementById("practicePhase").textContent=step.phase;
  document.getElementById("practiceStepCount").textContent=(practiceStepIndex+1)+"/"+q.steps.length;
  document.getElementById("practiceStepTitle").textContent=step.title;
  document.getElementById("practiceInstruction").textContent=step.instruction;

  practiceStepSolved=isPracticeStepSolved();
  renderPracticeDivision(q,step);
  renderPracticeResponse(q,step);

  document.getElementById("practiceStepPrev").disabled=practiceStepIndex===0;
  document.getElementById("practiceStepNext").disabled=!practiceStepSolved;
  document.getElementById("practiceStepNext").hidden=step.type==="done";

  const nextProblem=document.getElementById("practiceNextProblem");
  nextProblem.hidden=step.type!=="done";
  if(step.type==="done"){
    if(!practiceCompleted.has(practiceIndex)){
      practiceCompleted.add(practiceIndex);
      state.practiceCompleted=[...practiceCompleted];
      save();
      document.getElementById("practiceScore").textContent="Selesai "+practiceCompleted.size+"/"+practices.length;
    }
    nextProblem.textContent=practiceIndex===practices.length-1?"Ulangi latihan dari awal":"Soal berikutnya →";
  }

  state.practiceIndex=practiceIndex;
  save();
}

document.getElementById("practiceStepPrev").onclick=()=>{
  if(practiceStepIndex===0)return;
  practiceStepIndex--;
  renderPractice();
};

document.getElementById("practiceStepNext").onclick=()=>{
  const q=practices[practiceIndex];
  if(!practiceStepSolved || practiceStepIndex>=q.steps.length-1)return;
  practiceStepIndex++;
  renderPractice();
};

document.getElementById("practiceNextProblem").onclick=()=>{
  practiceIndex=practiceIndex===practices.length-1?0:practiceIndex+1;
  practiceStepIndex=0;
  state.practiceIndex=practiceIndex;
  save();
  renderPractice();
};

renderPractice();

// Evaluation — format proses bertahap seperti Coba sendiri.
const evaluations=[
  {
    a:168,b:14,answer:"12",
    steps:[
      {phase:"BAGI",type:"divide",title:"Bagi 16 dengan 14",target:16,expected:1,
       instruction:"Pilih kelipatan 14 yang paling besar tetapi tidak melebihi 16.",q:"?",rows:[]},
      {phase:"KALI",type:"number",title:"Kalikan 1 × 14",expected:14,
       instruction:"Tulis hasil perkalian 1 × 14.",q:"1",rows:[{html:"14",pos:"left",active:true}]},
      {phase:"KURANGI",type:"number",title:"16 − 14",expected:2,
       instruction:"Kurangkan 16 dengan 14.",q:"1",
       rows:[{html:"14",pos:"left"},{line:true,pos:"left",width:2},{html:"2",pos:"left",active:true}]},
      {phase:"TURUNKAN",type:"action",title:"Turunkan angka 8",actionLabel:"Turunkan 8",
       instruction:"Turunkan digit berikutnya agar sisa 2 menjadi 28.",q:"1",
       rows:[{html:"14",pos:"left"},{line:true,pos:"left",width:2},{html:"28",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 28 dengan 14",target:28,expected:2,
       instruction:"Gunakan kelipatan 14 untuk menentukan digit berikutnya.",q:'1<span class="ld-red">2</span>',
       rows:[{html:"14",pos:"left"},{line:true,pos:"left",width:2},{html:"28",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 2 × 14",expected:28,
       instruction:"Tulis hasil perkalian 2 × 14.",q:"12",
       rows:[{html:"14",pos:"left"},{line:true,pos:"left",width:2},{html:"28",pos:"right"},{html:"28",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"28 − 28",expected:0,
       instruction:"Kurangkan untuk mengetahui sisanya.",q:"12",
       rows:[{html:"14",pos:"left"},{line:true,pos:"left",width:2},{html:"28",pos:"right"},{html:"28",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right",active:true}]},
      {phase:"SELESAI",type:"done",title:"168 ÷ 14 = 12",
       instruction:"Sisa sudah 0, sehingga pembagian selesai.",q:"12",
       rows:[{html:"14",pos:"left"},{line:true,pos:"left",width:2},{html:"28",pos:"right"},{html:"28",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right"}]}
    ]
  },
  {
    a:375,b:25,answer:"15",
    steps:[
      {phase:"BAGI",type:"divide",title:"Bagi 37 dengan 25",target:37,expected:1,
       instruction:"Pilih kelipatan 25 yang paling besar tetapi tidak melebihi 37.",q:"?",rows:[]},
      {phase:"KALI",type:"number",title:"Kalikan 1 × 25",expected:25,
       instruction:"Tulis hasil perkalian 1 × 25.",q:"1",rows:[{html:"25",pos:"left",active:true}]},
      {phase:"KURANGI",type:"number",title:"37 − 25",expected:12,
       instruction:"Kurangkan 37 dengan 25.",q:"1",
       rows:[{html:"25",pos:"left"},{line:true,pos:"left",width:2},{html:"12",pos:"left",active:true}]},
      {phase:"TURUNKAN",type:"action",title:"Turunkan angka 5",actionLabel:"Turunkan 5",
       instruction:"Turunkan digit berikutnya agar 12 menjadi 125.",q:"1",
       rows:[{html:"25",pos:"left"},{line:true,pos:"left",width:2},{html:"125",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 125 dengan 25",target:125,expected:5,
       instruction:"Gunakan kelipatan 25 untuk menentukan digit berikutnya.",q:'1<span class="ld-red">5</span>',
       rows:[{html:"25",pos:"left"},{line:true,pos:"left",width:2},{html:"125",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 5 × 25",expected:125,
       instruction:"Tulis hasil perkalian 5 × 25.",q:"15",
       rows:[{html:"25",pos:"left"},{line:true,pos:"left",width:2},{html:"125",pos:"right"},{html:"125",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"125 − 125",expected:0,
       instruction:"Kurangkan untuk mengetahui sisanya.",q:"15",
       rows:[{html:"25",pos:"left"},{line:true,pos:"left",width:2},{html:"125",pos:"right"},{html:"125",pos:"right"},{line:true,pos:"right",width:3},{html:"0",pos:"right",active:true}]},
      {phase:"SELESAI",type:"done",title:"375 ÷ 25 = 15",
       instruction:"Sisa sudah 0, sehingga pembagian selesai.",q:"15",
       rows:[{html:"25",pos:"left"},{line:true,pos:"left",width:2},{html:"125",pos:"right"},{html:"125",pos:"right"},{line:true,pos:"right",width:3},{html:"0",pos:"right"}]}
    ]
  },
  {
    a:25,b:4,answer:"6,25",
    steps:[
      {phase:"BAGI",type:"divide",title:"Bagi 25 dengan 4",target:25,expected:6,
       instruction:"Pilih kelipatan 4 yang paling besar tetapi tidak melebihi 25.",q:"?",rows:[]},
      {phase:"KALI",type:"number",title:"Kalikan 6 × 4",expected:24,
       instruction:"Tulis hasil perkalian 6 × 4.",q:"6",rows:[{html:"24",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"25 − 24",expected:1,
       instruction:"Kurangkan 25 dengan 24.",q:"6",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"1",pos:"right",active:true}]},
      {phase:"DESIMAL",type:"action",title:"Tambahkan koma dan 0",actionLabel:"Tambahkan koma dan 0",
       instruction:"Tidak ada digit lagi untuk diturunkan. Tambahkan koma pada hasil dan 0 pada sisa agar 1 menjadi 10.",q:'6<span class="ld-red">,</span>',
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 10 dengan 4",target:10,expected:2,
       instruction:"Gunakan kelipatan 4 untuk menentukan digit berikutnya.",q:'6,<span class="ld-red">2</span>',
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 2 × 4",expected:8,
       instruction:"Tulis hasil perkalian 2 × 4.",q:"6,2",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"10 − 8",expected:2,
       instruction:"Kurangkan 10 dengan 8.",q:"6,2",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right"},{line:true,pos:"right",width:2},{html:"2",pos:"right",active:true}]},
      {phase:"LANJUTKAN",type:"action",title:"Tambahkan 0",actionLabel:"Tambahkan 0",
       instruction:"Tambahkan 0 pada sisa 2 sehingga menjadi 20.",q:"6,2",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right",active:true}]},
      {phase:"BAGI",type:"divide",title:"Bagi 20 dengan 4",target:20,expected:5,
       instruction:"Gunakan kelipatan 4 untuk menentukan digit berikutnya.",q:'6,2<span class="ld-red">5</span>',
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"}]},
      {phase:"KALI",type:"number",title:"Kalikan 5 × 4",expected:20,
       instruction:"Tulis hasil perkalian 5 × 4.",q:"6,25",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"20",pos:"right",active:true}]},
      {phase:"KURANGI",type:"number",title:"20 − 20",expected:0,
       instruction:"Kurangkan untuk mengetahui sisanya.",q:"6,25",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"20",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right",active:true}]},
      {phase:"SELESAI",type:"done",title:"25 ÷ 4 = 6,25",
       instruction:"Sisa sudah 0, sehingga pembagian selesai.",q:"6,25",
       rows:[{html:"24",pos:"right"},{line:true,pos:"right",width:2},{html:"10",pos:"right"},{html:"8",pos:"right"},{line:true,pos:"right",width:2},{html:"20",pos:"right"},{html:"20",pos:"right"},{line:true,pos:"right",width:2},{html:"0",pos:"right"}]}
    ]
  }
];

let evalIndex=0;
let evalStepIndex=0;
let evalCompleted=new Set(state.evalCompleted||[]);
let evalSolvedSteps=new Set(state.evalSolvedSteps||[]);
let evalAttempts={...(state.evalAttempts||{})};
let evalHelpUsed=new Set(state.evalHelpUsed||[]);
let evalFirstTry=new Set(state.evalFirstTry||[]);
let evalMistakePhases={...(state.evalMistakePhases||{})};
let evalStepSolved=false;

function evalStepKey(){return evalIndex+":"+evalStepIndex}
function isEvalStepSolved(){
  const step=evaluations[evalIndex].steps[evalStepIndex];
  return step.type==="done" || evalSolvedSteps.has(evalStepKey());
}
function saveEvalMetrics(){
  state.evalAttempts=evalAttempts;
  state.evalHelpUsed=[...evalHelpUsed];
  state.evalFirstTry=[...evalFirstTry];
  state.evalMistakePhases=evalMistakePhases;
  save();
}
function recordEvalMistake(step){
  const key=evalStepKey();
  evalAttempts[key]=(evalAttempts[key]||0)+1;
  evalMistakePhases[step.phase]=(evalMistakePhases[step.phase]||0)+1;
  saveEvalMetrics();
}
function markEvalStepSolved(){
  const key=evalStepKey();
  if((evalAttempts[key]||0)===0 && !evalHelpUsed.has(key)){
    evalFirstTry.add(key);
  }
  evalSolvedSteps.add(key);
  state.evalSolvedSteps=[...evalSolvedSteps];
  saveEvalMetrics();
}
function evalScoredStepTotal(){
  return evaluations.reduce((sum,q)=>sum+q.steps.filter(s=>s.type==="divide"||s.type==="number").length,0);
}
function evalWeakPhases(){
  const labels={BAGI:"Bagi",KALI:"Kali",KURANGI:"Kurangi"};
  const entries=Object.entries(evalMistakePhases).filter(([,n])=>n>0);
  if(!entries.length)return "tidak ada yang menonjol";
  const max=Math.max(...entries.map(([,n])=>n));
  return entries.filter(([,n])=>n===max).map(([p])=>labels[p]||p).join(", ");
}

function renderEvalDivision(q,step){
  const box=document.getElementById("evalDivision");
  const solved=isEvalStepSolved();
  const isMultiply=step.phase==="KALI"&&step.type==="number";
  const isSubtract=step.phase==="KURANGI"&&step.type==="number";
  const isDivide=step.type==="divide";
  const isAction=step.type==="action";

  let quotientHtml=step.q;
  if(isDivide){
    if(String(step.q).includes("ld-red")){
      quotientHtml=String(step.q).replace(/(<span class="ld-red">)[\s\S]*?(<\/span>)/,'$1...$2');
    }else{
      quotientHtml='<span class="ld-red">...</span>';
    }
  }
  if(isMultiply){
    const plain=String(step.q).replace(/<[^>]*>/g,"");
    quotientHtml=plain.replace(/(\d)([^\d]*)$/,'<span class="ld-red">...</span>$2');
  }
  if(isAction&&step.phase==="DESIMAL"){
    quotientHtml=String(step.q).replace(/<span class="ld-red">,?<\/span>/,'<span class="ld-red">...</span>');
  }

  const divisorHtml=isMultiply?'<span class="ld-red">'+q.b+'</span>':q.b;

  const rows=step.rows.map(row=>{
    if(row.line){
      return '<div class="practice-work-row practice-line '+(row.pos||"right")+'" style="--pw:'+String(row.width||3)+'ch"></div>';
    }
    let rowHtml=row.html;
    if(row.active&&(isMultiply||isSubtract||isAction)){
      rowHtml='<span class="ld-red">...</span>';
    }
    return '<div class="practice-work-row '+(row.pos||"right")+(row.active?" active":"")+'">'+rowHtml+'</div>';
  }).join("");

  box.innerHTML=
    '<div class="practice-quotient">'+quotientHtml+'</div>'+
    '<div class="practice-divisor">'+divisorHtml+'</div>'+
    '<div class="practice-body">'+
      '<div class="practice-dividend">'+q.a+'</div>'+
      '<div class="practice-work">'+rows+'</div>'+
    '</div>';
}

function renderEvalResponse(q,step){
  const response=document.getElementById("evalResponse");
  const multiples=document.getElementById("evalMultiples");
  const feedback=document.getElementById("evalFeedback");
  const key=evalStepKey();
  const attempts=evalAttempts[key]||0;

  response.innerHTML="";
  multiples.innerHTML="";
  multiples.hidden=true;
  evalStepSolved=isEvalStepSolved();

  feedback.className=evalStepSolved?"feedback good":"feedback neutral";
  feedback.textContent=evalStepSolved&&step.type!=="done"
    ?"Langkah ini sudah benar."
    :"Kerjakan tanpa bantuan terlebih dahulu.";

  if(step.type==="divide"){
    response.innerHTML=
      '<label class="practice-answer-label">Digit hasil bagi'+
        '<div class="practice-answer-row">'+
          '<input id="evalStepAnswer" inputmode="numeric" placeholder="?">'+
          '<button id="evalStepCheck" type="button">Periksa</button>'+
        '</div>'+
      '</label>'+
      '<button id="evalHelpBtn" class="secondary eval-help-btn" type="button" hidden>Tampilkan kelipatan '+q.b+'</button>';

    const helpBtn=document.getElementById("evalHelpBtn");
    const revealHelp=()=>{
      multiples.hidden=false;
      multiples.innerHTML=
        '<div class="multiple-head"><strong>Kelipatan '+q.b+'</strong><span>Gunakan untuk membantu memilih digit</span></div>'+
        '<div class="multiple-grid"></div>';
      buildMultiples(q.b,step.target,multiples.querySelector(".multiple-grid"),{
        interactive:false,
        markBest:false
      });
      evalHelpUsed.add(key);
      saveEvalMetrics();
      helpBtn.hidden=true;
    };

    if(attempts>=2 && !evalStepSolved && !evalHelpUsed.has(key)){
      helpBtn.hidden=false;
    }
    if(evalHelpUsed.has(key) && !evalStepSolved){
      revealHelp();
    }else{
      helpBtn.onclick=revealHelp;
    }

    document.getElementById("evalStepCheck").onclick=()=>{
      const raw=document.getElementById("evalStepAnswer").value.trim();
      const value=Number(raw);
      if(!Number.isFinite(value)){
        feedback.className="feedback warn";
        feedback.textContent="Masukkan digit terlebih dahulu.";
        return;
      }
      if(value===step.expected){
        feedback.className="feedback good";
        feedback.textContent="Benar. Lanjutkan.";
        evalStepSolved=true;
        markEvalStepSolved();
        renderEvalDivision(q,step);
        document.getElementById("evalStepNext").disabled=false;
        helpBtn.hidden=true;
      }else{
        recordEvalMistake(step);
        const n=evalAttempts[key]||0;
        feedback.className="feedback warn";
        feedback.textContent=n===1
          ?"Belum tepat. Cari kelipatan "+q.b+" terbesar yang tidak melebihi "+step.target+"."
          :"Belum tepat. Coba lagi; bantuan kelipatan sekarang tersedia.";
        if(n>=2 && !evalHelpUsed.has(key))helpBtn.hidden=false;
      }
    };
  }else if(step.type==="number"){
    response.innerHTML=
      '<label class="practice-answer-label">Jawaban'+
        '<div class="practice-answer-row">'+
          '<input id="evalStepAnswer" inputmode="decimal" placeholder="?">'+
          '<button id="evalStepCheck" type="button">Periksa</button>'+
        '</div>'+
      '</label>';

    document.getElementById("evalStepCheck").onclick=()=>{
      const raw=document.getElementById("evalStepAnswer").value.trim().replace(",",".");
      const value=Number(raw);
      if(!Number.isFinite(value)){
        feedback.className="feedback warn";
        feedback.textContent="Masukkan angka terlebih dahulu.";
        return;
      }
      if(Math.abs(value-step.expected)<1e-9){
        feedback.className="feedback good";
        feedback.textContent="Benar. Lanjutkan.";
        evalStepSolved=true;
        markEvalStepSolved();
        renderEvalDivision(q,step);
        document.getElementById("evalStepNext").disabled=false;
      }else{
        recordEvalMistake(step);
        const n=evalAttempts[key]||0;
        feedback.className="feedback warn";
        feedback.textContent=n===1
          ?"Belum tepat. Coba lagi."
          :"Belum tepat. Periksa kembali operasi pada langkah ini.";
      }
    };
  }else if(step.type==="action"){
    response.innerHTML='<button id="evalActionBtn" class="practice-action-btn" type="button">'+step.actionLabel+'</button>';
    document.getElementById("evalActionBtn").onclick=()=>{
      feedback.className="feedback good";
      feedback.textContent="Langkah diterapkan. Lanjutkan.";
      evalStepSolved=true;
      markEvalStepSolved();
      renderEvalDivision(q,step);
      document.getElementById("evalStepNext").disabled=false;
    };
  }else if(step.type==="done"){
    response.innerHTML='<div class="practice-result-chip">Hasil: <b>'+q.answer+'</b></div>';
    feedback.className="feedback good";
    feedback.textContent=step.instruction;
    evalStepSolved=true;
  }
}

function renderEvaluation(){
  const q=evaluations[evalIndex];
  const step=q.steps[evalStepIndex];

  document.getElementById("evalCount").textContent="Soal "+(evalIndex+1)+" dari "+evaluations.length;
  document.getElementById("evalScore").textContent="Selesai "+evalCompleted.size+"/"+evaluations.length;
  document.getElementById("evalProblem").textContent=q.a+" ÷ "+q.b;
  document.getElementById("evalPhase").textContent=step.phase;
  document.getElementById("evalStepCount").textContent=(evalStepIndex+1)+"/"+q.steps.length;
  document.getElementById("evalStepTitle").textContent=step.title;
  document.getElementById("evalInstruction").textContent=step.instruction;

  evalStepSolved=isEvalStepSolved();
  renderEvalDivision(q,step);
  renderEvalResponse(q,step);

  document.getElementById("evalStepPrev").disabled=evalStepIndex===0;
  document.getElementById("evalStepNext").disabled=!evalStepSolved;
  document.getElementById("evalStepNext").hidden=step.type==="done";

  const nextProblem=document.getElementById("evalNextProblem");
  nextProblem.hidden=step.type!=="done";

  if(step.type==="done"){
    if(!evalCompleted.has(evalIndex)){
      evalCompleted.add(evalIndex);
      state.evalCompleted=[...evalCompleted];
      save();
    }
    document.getElementById("evalScore").textContent="Selesai "+evalCompleted.size+"/"+evaluations.length;
    nextProblem.textContent=evalIndex===evaluations.length-1?"Selesaikan evaluasi":"Soal berikutnya →";
  }
}

document.getElementById("evalStepPrev").onclick=()=>{
  if(evalStepIndex===0)return;
  evalStepIndex--;
  renderEvaluation();
};

document.getElementById("evalStepNext").onclick=()=>{
  const q=evaluations[evalIndex];
  if(!evalStepSolved||evalStepIndex>=q.steps.length-1)return;
  evalStepIndex++;
  renderEvaluation();
};

document.getElementById("evalNextProblem").onclick=()=>{
  if(evalIndex<evaluations.length-1){
    evalIndex++;
    evalStepIndex=0;
    renderEvaluation();
  }else{
    const card=document.getElementById("masteryCard");
    card.hidden=false;
    document.getElementById("masteryTitle").textContent="Evaluasi selesai";
    const total=evalScoredStepTotal();
    const firstTry=evalFirstTry.size;
    const helpCount=evalHelpUsed.size;
    const weak=evalWeakPhases();
    document.getElementById("masteryText").innerHTML=
      "Soal selesai: <b>"+evalCompleted.size+"/"+evaluations.length+"</b><br>"+
      "Langkah hitung benar pada percobaan pertama: <b>"+firstTry+"/"+total+"</b><br>"+
      "Bantuan kelipatan digunakan: <b>"+helpCount+" kali</b><br>"+
      "Bagian yang perlu lebih banyak latihan: <b>"+weak+"</b>.";
    done.add(5);
    save();
    render();
  }
};

document.getElementById("evalReset").onclick=()=>{
  evalIndex=0;
  evalStepIndex=0;
  evalCompleted.clear();
  evalSolvedSteps.clear();
  evalHelpUsed.clear();
  evalFirstTry.clear();
  evalAttempts={};
  evalMistakePhases={};
  state.evalCompleted=[];
  state.evalSolvedSteps=[];
  state.evalHelpUsed=[];
  state.evalFirstTry=[];
  state.evalAttempts={};
  state.evalMistakePhases={};
  document.getElementById("masteryCard").hidden=true;
  save();
  renderEvaluation();
};

renderEvaluation();


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