(() => {
const config=window.IPA_MODULE_CONFIG||{}, KEY="ipa-interaktif:listrik-dinamis:v1", N=7;
const RESET_PREFIX="ipa-interaktif:listrik-dinamis:";
const resetRequested=new URLSearchParams(location.search).has("_reset");

if(resetRequested){
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith(RESET_PREFIX)) localStorage.removeItem(k);
  });
}

const state=load();
let active=Number.isInteger(state.activeStage)?state.activeStage:0, done=new Set(Array.isArray(state.completed)?state.completed:[]), mode=state.mode||config.defaultMode||"mandiri";
if(!state.sessionId) state.sessionId=id();
const tabs=[...document.querySelectorAll(".u-stage-tab")], panels=[...document.querySelectorAll(".u-stage-panel")], fill=document.getElementById("learningProgressFill"), ptxt=document.getElementById("learningProgressText"), prev=document.getElementById("uPrev"), next=document.getElementById("uNext"), complete=document.getElementById("uComplete"), toast=document.getElementById("uToast");
window.setLearningStage=show;
window.getEngagePrediction=()=>state.engagePrediction||"";
window.getLearningMode=()=>mode;

function keepActiveStageTabVisible(index,behavior="smooth"){
  const nav=document.querySelector(".u-stage-nav");
  const tab=tabs[index];
  if(!nav||!tab) return;
  requestAnimationFrame(()=>{
    const navRect=nav.getBoundingClientRect();
    const tabRect=tab.getBoundingClientRect();
    const currentLeft=nav.scrollLeft;
    const tabCenter=(tabRect.left-navRect.left)+currentLeft+(tabRect.width/2);
    const targetLeft=tabCenter-(nav.clientWidth/2);
    const maxLeft=Math.max(0,nav.scrollWidth-nav.clientWidth);
    nav.scrollTo({
      left:Math.max(0,Math.min(maxLeft,targetLeft)),
      behavior
    });
  });
}

function naturalDocumentTop(el){
  let y=0,node=el;
  while(node){y+=node.offsetTop||0;node=node.offsetParent}
  return y;
}
function scrollToStageMenu(behavior="smooth"){
  const nav=document.querySelector(".u-stage-nav");
  if(!nav) return;
  requestAnimationFrame(()=>{
    const topbar=document.querySelector(".module-topbar");
    const topbarHidden=document.body.classList.contains("phone-topbar-hidden");
    const topbarH=topbar&&!topbarHidden?topbar.getBoundingClientRect().height:0;
    const y=naturalDocumentTop(nav)-topbarH-2;
    window.scrollTo({top:Math.max(0,y),behavior});
  });
}
window.scrollToStageMenu=scrollToStageMenu;

function scrollToLearningContent(target,behavior="smooth"){
  if(!target) return;
  requestAnimationFrame(()=>{
    const topbar=document.querySelector(".module-topbar");
    const stageNav=document.querySelector(".u-stage-nav");
    const topbarHidden=document.body.classList.contains("phone-topbar-hidden");
    const stageNavHidden=document.body.classList.contains("phone-stage-nav-hidden");
    const topbarH=topbar&&!topbarHidden?topbar.getBoundingClientRect().height:0;
    const navH=stageNav&&!stageNavHidden?stageNav.getBoundingClientRect().height:0;
    const offset=topbarH+navH+10;
    const y=window.scrollY+target.getBoundingClientRect().top-offset;
    window.scrollTo({top:Math.max(0,y),behavior});
  });
}
window.scrollToLearningContent=scrollToLearningContent;

initMode();initIdentity();initDiag();initEngage();initReflect();initNav();initTeacherControls();initMobileChrome();initSwipeNavigation();restoreReflect();show(active,false);

if(resetRequested){
  document.querySelectorAll(".selected,.correct,.wrong,.revealed-correct,.complete,.done")
    .forEach(el=>el.classList.remove("selected","correct","wrong","revealed-correct","complete","done"));

  document.querySelectorAll(".diagnostic-feedback").forEach(el=>{
    el.textContent="";
    el.classList.remove("correct","wrong");
  });

  document.querySelectorAll(".engage-option").forEach(el=>el.classList.remove("selected"));

  document.querySelectorAll("[data-confidence]").forEach(el=>el.classList.remove("selected"));
  document.querySelectorAll("[data-difficulty]").forEach(el=>{el.checked=false});

  const cleanUrl=location.pathname+location.hash;
  try{history.replaceState(null,"",cleanUrl)}catch(_){}
}

refreshSend();save();

function initMode(){document.querySelectorAll("[data-learning-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.learningMode==="guru"?"guru":"mandiri";applyMode();changed();save()});applyMode()}
function applyMode(){
  document.body.dataset.learningMode=mode;
  document.querySelectorAll("[data-learning-mode]").forEach(b=>b.classList.toggle("active",b.dataset.learningMode===mode));
  document.getElementById("modeHelp").textContent=mode==="guru"
    ?"Sebagian feedback ditahan agar guru dapat memfasilitasi prediksi, diskusi, dan pembahasan sebelum jawaban dibuka."
    :"Petunjuk dan feedback otomatis diberikan lebih langsung agar kamu dapat belajar tanpa menunggu bantuan guru.";
  if(mode==="guru") document.querySelectorAll(".teacher-reveal-target").forEach(x=>x.classList.remove("teacher-revealed"));
  window.dispatchEvent(new CustomEvent("learningmodechange",{detail:{mode}}));
}
function initIdentity(){const a=document.getElementById("studentName"),b=document.getElementById("studentClass");a.value=state.identity?.name||"";b.value=state.identity?.className||"";[a,b].forEach(f=>f.oninput=()=>{state.identity=state.identity||{};state.identity[f.id==="studentName"?"name":"className"]=f.value.trim();changed();save()})}
function initDiag(){
  document.querySelectorAll("[data-diagnostic]").forEach(g=>{
    const k=g.dataset.diagnostic;
    const item=g.closest(".diagnostic-item")||g.parentElement;
    const fb=item.querySelector(".diagnostic-feedback");
    const reveal=document.createElement("button");
    reveal.type="button";
    reveal.className="diagnostic-reveal mode-only-teacher";
    reveal.textContent="Buka pembahasan";
    reveal.hidden=true;
    fb.insertAdjacentElement("afterend",reveal);
    let chosen=null, revealed=false;

    const paint=(b,force=false)=>{
      g.querySelectorAll("button").forEach(x=>x.classList.remove("selected","correct","wrong"));
      if(!b){reveal.hidden=true;return}
      chosen=b;
      b.classList.add("selected");
      const teacherHold=mode==="guru"&&!force;
      if(teacherHold){
        revealed=false;
        fb.textContent="Jawaban tersimpan. Minta siswa menjelaskan alasannya sebelum membuka pembahasan.";
        fb.classList.remove("correct","wrong");
        reveal.hidden=false;
        return;
      }
      revealed=true;
      b.classList.add(b.dataset.correct==="true"?"correct":"wrong");
      fb.textContent=b.dataset.feedback||"";
      fb.classList.toggle("wrong",b.dataset.correct!=="true");
      fb.classList.toggle("correct",b.dataset.correct==="true");
      reveal.hidden=true;
    };

    g.querySelectorAll("button").forEach(b=>b.onclick=()=>{
      paint(b,false);
      state.diagnostic=state.diagnostic||{};
      state.diagnostic[k]=b.dataset.value;
      save();
    });

    reveal.onclick=()=>chosen&&paint(chosen,true);
    window.addEventListener("learningmodechange",()=>{if(chosen)paint(chosen,mode!=="guru"&&revealed)});

    const v=state.diagnostic?.[k];
    if(v)paint(g.querySelector('[data-value="'+v+'"]'),mode!=="guru");
  });
}
function initEngage(){
  document.querySelectorAll(".engage-option").forEach(b=>b.onclick=()=>{
    document.querySelectorAll(".engage-option").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    state.engagePrediction=b.dataset.prediction;
    document.getElementById("engageFeedback").textContent=mode==="guru"
      ?"Prediksi tersimpan. Jelaskan alasanmu kepada kelompok/guru sebelum membuka Explore."
      :"Prediksi tersimpan. Jangan ubah dulu—uji melalui simulasi pada tahap Explore.";
    save();
    window.dispatchEvent(new CustomEvent("engagepredictionchange",{detail:{prediction:state.engagePrediction}}));
  });
  if(state.engagePrediction)document.querySelector('[data-prediction="'+state.engagePrediction+'"]')?.classList.add("selected");
}
function initReflect(){document.querySelectorAll("[data-reflection]").forEach(f=>f.oninput=()=>{state.reflections=state.reflections||{};state.reflections[f.dataset.reflection]=f.value;changed();save()});const g=document.getElementById("difficultyGrid");(config.difficultyCategories||[]).forEach(c=>{const l=document.createElement("label");l.className="difficulty-option";const i=document.createElement("input");i.type="checkbox";i.dataset.difficulty=c;i.checked=(state.difficulties||[]).includes(c);const s=document.createElement("span");s.textContent=c;l.append(i,s);g.appendChild(l)});g.onchange=()=>{state.difficulties=diffs();changed();save()};document.querySelectorAll("[data-confidence]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-confidence]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.confidence=+b.dataset.confidence;changed();save()});if(state.confidence)document.querySelector('[data-confidence="'+state.confidence+'"]')?.classList.add("selected");document.getElementById("sendFeedback").onclick=send}
function restoreReflect(){const r=state.reflections||{};document.querySelectorAll("[data-reflection]").forEach(f=>f.value=r[f.dataset.reflection]||"")}
function initTeacherControls(){
  document.querySelectorAll(".teacher-reveal-btn[data-reveal-target]").forEach(btn=>{
    const target=document.getElementById(btn.dataset.revealTarget);
    if(!target) return;
    const sync=()=>{
      const open=target.classList.contains("teacher-revealed");
      btn.textContent=open?"Sembunyikan ringkasan":"Buka ringkasan observasi";
    };
    btn.onclick=()=>{target.classList.toggle("teacher-revealed");sync()};
    sync();
  });
  window.addEventListener("learningmodechange",()=>document.querySelectorAll(".teacher-reveal-btn[data-reveal-target]").forEach(btn=>{
    const target=document.getElementById(btn.dataset.revealTarget);
    if(target && mode==="guru") target.classList.remove("teacher-revealed");
    if(target) btn.textContent="Buka ringkasan observasi";
  }));
}
function isPhoneLayout(){
  return window.matchMedia("(max-width:640px), (orientation: landscape) and (max-width:950px) and (max-height:500px)").matches;
}

function initMobileChrome(){
  const body=document.body;
  const nav=document.querySelector(".u-stage-nav");
  const topbar=document.querySelector(".module-topbar");
  if(!nav||!topbar) return;

  let lastY=window.scrollY;
  let hideNavTimer=0;

  const clearNavTimer=()=>{
    clearTimeout(hideNavTimer);
    hideNavTimer=0;
  };

  const scheduleNavHide=()=>{
    clearNavTimer();
    if(!isPhoneLayout()) return;
    const navTop=naturalDocumentTop(nav);
    if(window.scrollY <= Math.max(18,navTop-4)) return;
    hideNavTimer=setTimeout(()=>{
      if(!isPhoneLayout()) return;
      body.classList.add("phone-stage-nav-hidden");
    },1800);
  };

  const revealStageNav=(hold=false)=>{
    if(!isPhoneLayout()) return;
    body.classList.remove("phone-stage-nav-hidden");
    clearNavTimer();
    if(!hold) scheduleNavHide();
  };

  const resetDesktop=()=>{
    if(isPhoneLayout()) return;
    clearNavTimer();
    body.classList.remove("phone-topbar-hidden","phone-stage-nav-hidden");
  };

  const onScroll=()=>{
    if(!isPhoneLayout()){
      resetDesktop();
      lastY=window.scrollY;
      return;
    }
    const y=window.scrollY;
    const dy=y-lastY;

    // Stage menu appears whenever the learner moves the page.
    if(Math.abs(dy)>1) revealStageNav();

    // Topbar behaves like mobile browser chrome: visible upward, hidden downward.
    if(y<24 || dy<-3){
      body.classList.remove("phone-topbar-hidden");
    }else if(dy>3 && y>64){
      body.classList.add("phone-topbar-hidden");
    }
    lastY=y;
  };

  window.revealStageNav=revealStageNav;

  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",()=>{
    resetDesktop();
    if(isPhoneLayout()) revealStageNav();
  },{passive:true});

  document.addEventListener("touchstart",()=>{
    if(isPhoneLayout()) revealStageNav();
  },{passive:true});

  document.addEventListener("click",e=>{
    if(!isPhoneLayout()) return;
    if(e.target.closest(".u-stage-tab,.stage-next,.stage-prev,.u-prev,.u-next,.u-complete")){
      revealStageNav();
    }
  },true);

  revealStageNav(true);
}

function initSwipeNavigation(){
  const root=document.querySelector(".module-main");
  if(!root) return;

  const answerSelector=[
    ".engage-option",
    ".diagnostic-options button",
    "[data-prediction-compare]",
    "[data-prediction-evidence]",
    "[data-elab-answer]",
    "[data-elab-reason]",
    "#quizBox .option",
    "[data-confidence]"
  ].join(",");

  let sx=0,sy=0,startedAt=0,blocked=false;
  let swipeOriginAnswer=null;
  let suppressClickTarget=null;
  let suppressClickUntil=0;

  const answerTarget=target=>target.closest?.(answerSelector)||null;

  const ignoreTarget=target=>{
    // Opsi jawaban adalah pengecualian: tap memilih, swipe berpindah halaman.
    if(answerTarget(target)) return false;

    return !!target.closest(
      "input,textarea,select,a,label,[contenteditable],.u-stage-nav,.u-bottom-nav,.zoom-overlay,button"
    );
  };

  // Browser dapat menghasilkan click setelah touchend. Jika gesture tadi adalah
  // swipe yang dimulai dari opsi jawaban, batalkan click tersebut.
  root.addEventListener("click",e=>{
    if(!e.isTrusted || !suppressClickTarget || Date.now()>suppressClickUntil) return;
    const clicked=answerTarget(e.target);
    if(clicked && clicked===suppressClickTarget){
      e.preventDefault();
      e.stopImmediatePropagation();
      suppressClickTarget=null;
      suppressClickUntil=0;
    }
  },true);

  root.addEventListener("touchstart",e=>{
    if(!isPhoneLayout()||e.touches.length!==1) return;

    swipeOriginAnswer=answerTarget(e.target);
    blocked=ignoreTarget(e.target);

    if(blocked){
      swipeOriginAnswer=null;
      startedAt=0;
      return;
    }

    sx=e.touches[0].clientX;
    sy=e.touches[0].clientY;
    startedAt=Date.now();
  },{passive:true});

  root.addEventListener("touchend",e=>{
    if(!isPhoneLayout()||blocked||!startedAt||!e.changedTouches.length){
      blocked=false;
      startedAt=0;
      swipeOriginAnswer=null;
      return;
    }

    const dx=e.changedTouches[0].clientX-sx;
    const dy=e.changedTouches[0].clientY-sy;
    const ax=Math.abs(dx), ay=Math.abs(dy);
    const dt=Date.now()-startedAt;

    blocked=false;
    startedAt=0;

    // Deliberate horizontal swipe only; ordinary vertical scroll remains intact.
    const isSwipe=dt<=900 && ax>=64 && ax>=ay*1.35;

    if(!isSwipe){
      swipeOriginAnswer=null;
      return;
    }

    // Prevent the option under the finger from also being selected.
    if(swipeOriginAnswer){
      suppressClickTarget=swipeOriginAnswer;
      suppressClickUntil=Date.now()+650;
    }
    swipeOriginAnswer=null;

    const panel=panels[active];
    if(!panel) return;

    const forward=dx<0;
    const internal=panel.querySelector(forward?".stage-nav .stage-next":".stage-nav .stage-prev");

    if(internal && !internal.disabled && internal.offsetParent!==null){
      internal.click();
      window.revealStageNav?.();
      return;
    }

    if(forward && active<N-1){
      show(active+1);
    }else if(!forward && active>0){
      show(active-1);
    }
  },{passive:true});

  root.addEventListener("touchcancel",()=>{
    blocked=false;
    startedAt=0;
    swipeOriginAnswer=null;
  },{passive:true});
}

function initNav(){tabs.forEach(t=>t.onclick=()=>show(+t.dataset.uStage));prev.onclick=()=>active>0&&show(active-1);next.onclick=()=>active<N-1&&show(active+1);complete.onclick=()=>{done.has(active)?done.delete(active):done.add(active);changed();render();save()};document.querySelectorAll("[data-go-stage]").forEach(b=>b.onclick=()=>show(+b.dataset.goStage));document.getElementById("resetLearning").onclick=()=>{
  if(!confirm("Reset seluruh progres, jawaban, identitas, dan refleksi modul ini?")) return;

  // 1) Hapus seluruh penyimpanan lokal yang khusus modul ini.
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith(RESET_PREFIX)) localStorage.removeItem(k);
  });

  // 2) Bersihkan state UI yang sedang hidup sebelum reload.
  try{window.resetListrikDinamisInteractiveState?.()}catch(_){}

  document.querySelectorAll(".selected,.correct,.wrong,.revealed-correct,.complete,.done")
    .forEach(el=>el.classList.remove("selected","correct","wrong","revealed-correct","complete","done"));

  document.querySelectorAll("input,textarea").forEach(el=>{
    if(el.type==="checkbox"||el.type==="radio") el.checked=false;
    else if(el.type!=="range") el.value="";
  });

  document.querySelectorAll(".diagnostic-feedback").forEach(el=>{
    el.textContent="";
    el.classList.remove("correct","wrong");
  });

  const engageFeedback=document.getElementById("engageFeedback");
  if(engageFeedback) engageFeedback.textContent="Pilih prediksi. Jawaban belum dinilai pada tahap ini.";

  // 3) Hard reload dengan URL bersih + cache-buster agar browser tidak memulihkan state form lama.
  const url=new URL(location.href);
  url.searchParams.set("_reset",Date.now().toString());
  location.replace(url.toString());
}}
function show(i,doScroll=true){
  active=Math.max(0,Math.min(N-1,i));
  panels.forEach((p,j)=>p.classList.toggle("active",j===active));
  tabs.forEach((t,j)=>{t.classList.toggle("active",j===active);t.classList.toggle("complete",done.has(j))});
  keepActiveStageTabVisible(active,doScroll?"smooth":"auto");
  if(doScroll) window.revealStageNav?.();
  prev.disabled=active===0;
  next.disabled=active===N-1;
  next.style.opacity=active===N-1?".45":"1";
  complete.classList.toggle("done",done.has(active));
  complete.textContent=done.has(active)?"✓ Sudah selesai":"Tandai selesai";
  render();
  save();
  if(doScroll){
    scrollToStageMenu();
  }
}
function render(){const c=done.size,p=Math.round(c/N*100);fill.style.width=p+"%";ptxt.textContent=c+" dari "+N+" tahap • "+p+"%";tabs.forEach((t,j)=>t.classList.toggle("complete",done.has(j)))}

async function send(){const ep=(config.feedbackEndpoint||"").trim(), snap=snapshot(), fp=JSON.stringify(snap);if(!snap.studentName||!snap.className){msg("Isi nama/nomor absen dan kelas pada tahap Orientasi.");show(0);return}if(!snap.confused&&!snap.difficulties.length&&!snap.confidence){msg("Isi minimal satu bagian refleksi.");return}if(!ep){msg("Koneksi Google Sheets belum aktif.");return}if(state.lastSentFingerprint===fp){msg("Tidak ada perubahan sejak pengiriman terakhir.");refreshSend();return}let sid=state.pendingFingerprint===fp&&state.pendingSubmissionId?state.pendingSubmissionId:id();state.pendingSubmissionId=sid;state.pendingFingerprint=fp;save();sendUI("sending");const payload={timestampClient:new Date().toISOString(),studentName:snap.studentName,className:snap.className,materialId:config.materialId,materialTitle:config.materialTitle,mode:snap.mode,understood:snap.understood,confused:snap.confused,difficulties:snap.difficulties.join(", "),confidence:confLabel(snap.confidence),completedStages:String(snap.completedStages),totalStages:String(N),submissionId:sid,sessionId:state.sessionId,templateVersion:(config.templateVersion||"")+" / modul "+(config.moduleVersion||"")};try{await fetch(ep,{method:"POST",mode:"no-cors",body:new URLSearchParams(payload)});const ok=await verify(ep,sid);if(!ok){sendUI("warn");msg("Sudah dikirim dari browser, tetapi belum terverifikasi. Coba kirim ulang.");return}state.lastSentFingerprint=fp;state.lastSentAt=new Date().toISOString();state.lastSubmissionId=sid;state.pendingSubmissionId="";state.pendingFingerprint="";save();sendUI("ok");msg("Refleksi terverifikasi masuk ke dashboard guru.")}catch(e){sendUI("error");msg("Pengiriman gagal. Refleksi lokal tetap tersimpan.")}}
function snapshot(){return{studentName:document.getElementById("studentName").value.trim(),className:document.getElementById("studentClass").value.trim(),mode,understood:state.reflections?.understood?.trim()||"",confused:state.reflections?.confused?.trim()||"",difficulties:diffs().slice().sort(),confidence:+(state.confidence||0),completedStages:done.size}}
function diffs(){return[...document.querySelectorAll("[data-difficulty]:checked")].map(x=>x.dataset.difficulty)}
function changed(){refreshSend()}
function refreshSend(){const b=document.getElementById("sendFeedback"),s=document.getElementById("sendStatus");if(!b||!s)return;const fp=JSON.stringify(snapshot()),same=!!(state.lastSentFingerprint&&state.lastSentFingerprint===fp);s.className="send-status";if(!(config.feedbackEndpoint||"").trim()){b.disabled=true;s.textContent="Google Sheets belum terhubung."}else if(same){b.disabled=true;s.classList.add("ok");s.textContent="✓ Terkirim "+fmtTime(state.lastSentAt)+" • tidak ada perubahan."}else{b.disabled=false;s.textContent=state.lastSentAt?"Ada perubahan setelah kiriman "+fmtTime(state.lastSentAt)+".":"Belum pernah dikirim."}}
function sendUI(k){const b=document.getElementById("sendFeedback"),s=document.getElementById("sendStatus");s.className="send-status";b.textContent=k==="sending"?"Mengirim...":"Kirim Refleksi";b.disabled=k==="sending";if(k==="sending"){s.classList.add("warn");s.textContent="Mengirim dan memverifikasi..."}else if(k==="ok"){s.classList.add("ok");s.textContent="✓ Terverifikasi "+fmtTime(state.lastSentAt)+".";b.disabled=true}else if(k==="warn"){s.classList.add("warn");s.textContent="Belum terverifikasi. Kirim ulang memakai ID yang sama.";b.disabled=false}else if(k==="error"){s.classList.add("error");s.textContent="Gagal mengirim. Data lokal tetap aman.";b.disabled=false}}
async function verify(ep,sid){for(let i=0;i<3;i++){if(i)await new Promise(r=>setTimeout(r,700));if(await jsonp(ep,sid,5000))return true}return false}
function jsonp(ep,sid,ms){return new Promise(resolve=>{const cb="__ipaAck_"+id().replace(/[^a-zA-Z0-9_$]/g,""),sc=document.createElement("script");let done=false;const fin=v=>{if(done)return;done=true;clearTimeout(timer);delete window[cb];sc.remove();resolve(!!v)};window[cb]=d=>fin(d&&d.ok===true&&d.found===true);sc.src=ep+(ep.includes("?")?"&":"?")+"action=status&submissionId="+encodeURIComponent(sid)+"&callback="+encodeURIComponent(cb)+"&_="+Date.now();sc.onerror=()=>fin(false);document.head.appendChild(sc);const timer=setTimeout(()=>fin(false),ms)})}
function confLabel(v){return v===1?"Perlu bantuan":v===2?"Cukup paham":v===3?"Sudah yakin":""}
function id(){return globalThis.crypto&&typeof crypto.randomUUID==="function"?crypto.randomUUID():Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2)}
function fmtTime(x){if(!x)return"";return new Date(x).toLocaleString("id-ID",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}}
function save(){state.activeStage=active;state.completed=[...done];state.mode=mode;localStorage.setItem(KEY,JSON.stringify(state))}
function msg(m){toast.textContent=m;toast.classList.add("show");clearTimeout(msg.t);msg.t=setTimeout(()=>toast.classList.remove("show"),2400)}
})();