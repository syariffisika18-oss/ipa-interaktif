(()=>{
  const journey=[
    {name:"Mulut",icon:"👄",observe:"Makanan dipotong dan dikunyah, lalu bercampur dengan air liur.",process:"Pencernaan mekanik oleh gigi dan pencernaan kimiawi karbohidrat mulai berlangsung.",result:"Makanan menjadi bolus yang lebih halus dan mudah ditelan.",terms:[["Bolus","gumpalan makanan yang sudah dikunyah dan bercampur dengan air liur sehingga mudah ditelan."]],prompt:"Apa keuntungan makanan dihancurkan menjadi bagian lebih kecil?"},
    {name:"Faring",icon:"↘️",observe:"Bolus melewati persimpangan saluran makanan dan saluran napas.",process:"Proses menelan mengarahkan bolus menuju kerongkongan. Epiglotis membantu menutup jalan napas saat menelan.",result:"Bolus masuk ke kerongkongan.",terms:[["Faring","bagian tenggorokan yang menjadi jalur bersama sebelum makanan menuju kerongkongan."],["Epiglotis","lipatan seperti katup yang membantu menutup jalan napas ketika menelan."]],prompt:"Mengapa kita tidak dianjurkan berbicara sambil menelan?"},
    {name:"Kerongkongan",icon:"〰️",observe:"Dinding kerongkongan berkontraksi bergelombang.",process:"Gerak peristaltik mendorong bolus menuju lambung.",result:"Makanan berpindah tanpa harus mengandalkan gravitasi.",terms:[["Peristaltik","gerakan kontraksi otot berbentuk gelombang yang mendorong makanan sepanjang saluran pencernaan."]],prompt:"Apakah kerongkongan terutama mencerna makanan atau memindahkannya?"},
    {name:"Lambung",icon:"🥣",observe:"Makanan diaduk dan bercampur dengan cairan lambung.",process:"Otot lambung melakukan pencernaan mekanik. Pepsin membantu mencerna protein dalam suasana asam.",result:"Makanan berubah menjadi campuran semi-cair yang disebut kimus.",terms:[["Pepsin","enzim di lambung yang membantu memecah protein menjadi bagian yang lebih kecil."],["Kimus","campuran makanan semi-cair setelah diaduk dan bercampur dengan cairan lambung."]],prompt:"Mengapa lambung memiliki dinding otot yang kuat?"},
    {name:"Usus halus",icon:"🧬",observe:"Kimus bercampur dengan empedu dan enzim dari pankreas serta dinding usus.",process:"Sebagian besar pencernaan kimiawi diselesaikan. Zat gizi hasil pencernaan diserap melalui permukaan usus.",result:"Glukosa, asam amino, asam lemak, gliserol, vitamin, mineral, dan air dapat diserap.",terms:[["Empedu","cairan dari hati yang membantu memecah lemak menjadi butiran kecil agar lebih mudah dicerna."],["Vili","tonjolan sangat kecil pada dinding usus halus yang memperluas permukaan penyerapan zat gizi."],["Enzim","protein yang membantu mempercepat reaksi kimia, termasuk pemecahan zat makanan."]],prompt:"Apa hubungan banyaknya lipatan dan vili dengan kemampuan menyerap zat gizi?"},
    {name:"Usus besar",icon:"🔄",observe:"Sisa makanan yang tidak tercerna bergerak lebih lambat.",process:"Air dan sebagian elektrolit diserap. Bakteri usus juga berperan pada sisa makanan.",result:"Sisa menjadi lebih padat dan membentuk feses.",terms:[["Elektrolit","mineral bermuatan, misalnya natrium dan kalium, yang membantu keseimbangan cairan tubuh."],["Feses","sisa pencernaan yang tidak digunakan tubuh dan akan dikeluarkan."]],prompt:"Apa yang mungkin terjadi jika terlalu banyak air diserap dari sisa makanan?"},
    {name:"Rektum",icon:"📦",observe:"Feses mencapai bagian akhir usus besar.",process:"Feses disimpan sementara sebelum dikeluarkan.",result:"Tubuh menerima sinyal untuk buang air besar.",terms:[["Rektum","bagian akhir usus besar yang menjadi tempat penyimpanan sementara feses."]],prompt:"Apakah rektum merupakan tempat utama pencernaan zat makanan?"},
    {name:"Anus",icon:"🚪",observe:"Feses meninggalkan saluran pencernaan.",process:"Otot sfingter membantu mengatur pengeluaran feses.",result:"Sisa yang tidak digunakan tubuh dikeluarkan.",terms:[["Sfingter","otot berbentuk cincin yang dapat membuka dan menutup saluran anus."]],prompt:"Ini merupakan proses pencernaan atau pengeluaran sisa? Jelaskan."}
  ];

  const model=[
    {name:"Mulut",process:"Mengunyah + mencampur makanan dengan saliva",type:"Mekanik + kimiawi",agent:"Gigi, lidah, amilase saliva",result:"Bolus; pencernaan pati mulai",term:"Bolus = gumpalan makanan yang sudah dikunyah dan bercampur air liur.",why:"Penghancuran memperluas permukaan makanan sehingga proses berikutnya lebih efektif."},
    {name:"Faring",process:"Menelan dan mengarahkan bolus",type:"Transport",agent:"Otot faring + epiglotis",result:"Bolus masuk ke kerongkongan",term:"Epiglotis = lipatan yang membantu menutup jalan napas ketika menelan.",why:"Arah bolus harus tepat agar makanan tidak masuk ke saluran pernapasan."},
    {name:"Kerongkongan",process:"Peristaltik",type:"Transport",agent:"Kontraksi otot dinding",result:"Bolus menuju lambung",term:"Peristaltik = gerak kontraksi bergelombang yang mendorong makanan.",why:"Gerak peristaltik menjaga makanan tetap bergerak menuju lambung."},
    {name:"Lambung",process:"Mengaduk + mencerna protein",type:"Mekanik + kimiawi",agent:"Otot lambung, HCl, pepsin",result:"Kimus; protein mulai dipecah",term:"Kimus = campuran makanan semi-cair setelah bercampur cairan lambung.",why:"Pengadukan dan kondisi asam membantu kerja pepsin serta membentuk kimus."},
    {name:"Usus halus",process:"Pencernaan lanjutan + absorpsi",type:"Kimiawi + penyerapan",agent:"Enzim pankreas/usus, empedu, vili",result:"Molekul sederhana diserap",term:"Vili = tonjolan kecil yang memperluas permukaan penyerapan.",why:"Permukaan luas dan vili menjadikan usus halus tempat utama penyerapan zat gizi."},
    {name:"Usus besar",process:"Penyerapan air + pembentukan feses",type:"Penyerapan",agent:"Dinding usus + mikrobiota",result:"Sisa lebih padat membentuk feses",term:"Feses = sisa pencernaan yang tidak digunakan tubuh.",why:"Pengaturan air membantu menjaga konsistensi feses dan keseimbangan cairan."},
    {name:"Rektum",process:"Penyimpanan sementara feses",type:"Penyimpanan",agent:"Dinding rektum",result:"Feses menunggu dikeluarkan",term:"Rektum = bagian akhir usus besar tempat feses disimpan sementara.",why:"Penyimpanan sementara memungkinkan pengeluaran feses berlangsung terkontrol."},
    {name:"Anus",process:"Pengeluaran feses",type:"Eliminasi",agent:"Otot sfingter",result:"Feses keluar dari tubuh",term:"Sfingter = otot berbentuk cincin yang mengatur buka-tutup anus.",why:"Sfingter membantu mengendalikan waktu pengeluaran feses."}
  ];

  let prediction="";
  let journeyIndex=0;
  let furthestJourney=0;
  let modelIndex=0;

  const calibrationKey="digestiveVisualCalibration.v2";
  const legacyCalibrationKey="digestiveVisualCalibration.v1";
  const defaultMarkerPositions=[
    {x:32,y:17},{x:43,y:24},{x:51,y:39},{x:69,y:58},
    {x:43,y:73},{x:74,y:72},{x:57,y:89},{x:57,y:96}
  ];

  // Delapan organ tetap menjadi titik tujuan utama, tetapi animasi bergerak
  // melalui banyak waypoint di antaranya agar mengikuti bentuk saluran pencernaan.
  const organWaypointIndices=[0,2,6,11,16,25,34,36];
  const defaultRouteWaypoints=[
    {x:39,y:18}, // 0 Mulut
    {x:41,y:20},
    {x:44,y:24}, // 2 Faring
    {x:45.5,y:27.5},
    {x:47,y:31.5},
    {x:48.5,y:35.5},
    {x:50,y:39}, // 6 Kerongkongan
    {x:50.5,y:43.5},
    {x:51,y:48},
    {x:52,y:52.5},
    {x:55,y:55.5},
    {x:59,y:58}, // 11 Lambung
    {x:58.5,y:61},
    {x:56,y:63.5},
    {x:52.5,y:65.5},
    {x:49,y:69},
    {x:52,y:73}, // 16 Usus halus
    {x:49,y:75.5},
    {x:45,y:76.5},
    {x:41.5,y:74},
    {x:40.5,y:69},
    {x:41.5,y:64.5},
    {x:46,y:62},
    {x:52,y:61.5},
    {x:59,y:63},
    {x:64,y:73}, // 25 Usus besar
    {x:65.5,y:75.5},
    {x:66.5,y:78},
    {x:66,y:80.5},
    {x:64.8,y:82.5},
    {x:63,y:84.2},
    {x:61,y:85.8},
    {x:59.2,y:87.2},
    {x:58,y:88.2},
    {x:57,y:89}, // 34 Rektum
    {x:57,y:93},
    {x:57,y:96}  // 36 Anus
  ];

  const clonePositions=list=>list.map(p=>({x:p.x,y:p.y}));
  let markerPositions=clonePositions(defaultMarkerPositions);
  let routeWaypoints=clonePositions(defaultRouteWaypoints);

  // Muat kalibrasi baru. Jika pengguna sebelumnya sudah mengatur 8 posisi bola,
  // pakai delapan titik itu sebagai anchor organ pada jalur baru.
  try{
    const saved=JSON.parse(localStorage.getItem(calibrationKey)||"null");
    const legacy=JSON.parse(localStorage.getItem(legacyCalibrationKey)||"null");
    const source=saved||legacy;
    if(source&&Array.isArray(source.markers)&&source.markers.length===8){
      markerPositions=source.markers.map(p=>({x:Number(p.x),y:Number(p.y)}));
    }
    if(saved&&Array.isArray(saved.waypoints)&&saved.waypoints.length===defaultRouteWaypoints.length){
      routeWaypoints=saved.waypoints.map(p=>({x:Number(p.x),y:Number(p.y)}));
    }else if(source&&Array.isArray(source.balls)&&source.balls.length===8){
      source.balls.forEach((p,i)=>{
        const wi=organWaypointIndices[i];
        routeWaypoints[wi]={x:Number(p.x),y:Number(p.y)};
      });
    }
  }catch(_){}

  const ballTimers=new WeakMap();
  let visualDragSuppressUntil=0;

  function clampPercent(n){return Math.max(2,Math.min(98,n))}
  function organPosition(index){
    return routeWaypoints[organWaypointIndices[index]];
  }
  function saveCalibration(){
    try{
      localStorage.setItem(calibrationKey,JSON.stringify({
        markers:markerPositions.map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2)})),
        balls:organWaypointIndices.map(i=>routeWaypoints[i]).map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2)})),
        waypoints:routeWaypoints.map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2)}))
      }));
    }catch(_){}
  }

  function hotspotIndex(el){
    if(el.dataset.exploreOrgan!==undefined)return Number(el.dataset.exploreOrgan);
    if(el.dataset.explainOrgan!==undefined)return Number(el.dataset.explainOrgan);
    return -1;
  }

  function applyMarkerPositions(){
    document.querySelectorAll(".anatomy-hotspot").forEach(el=>{
      const i=hotspotIndex(el);
      if(i<0||!markerPositions[i])return;
      el.style.left=markerPositions[i].x+"%";
      el.style.top=markerPositions[i].y+"%";
    });
  }

  function routePathData(){
    return routeWaypoints.map((p,i)=>(i?"L":"M")+p.x.toFixed(2)+" "+p.y.toFixed(2)).join(" ");
  }
  function updateRoutePaths(){
    const d=routePathData();
    document.querySelectorAll(".food-route-svg path").forEach(path=>path.setAttribute("d",d));
    document.querySelectorAll(".route-waypoint").forEach(el=>{
      const i=Number(el.dataset.waypoint);
      const p=routeWaypoints[i];
      if(!p)return;
      el.style.left=p.x+"%";
      el.style.top=p.y+"%";
    });
  }

  function ensureWaypointEditors(){
    document.querySelectorAll(".digestive-anatomy-figure").forEach(figure=>{
      if(figure.querySelector(".route-waypoint"))return;
      routeWaypoints.forEach((p,i)=>{
        const dot=document.createElement("button");
        dot.type="button";
        dot.className="route-waypoint"+(organWaypointIndices.includes(i)?" is-organ-anchor":"");
        dot.dataset.waypoint=String(i);
        const organIndex=organWaypointIndices.indexOf(i);
        dot.setAttribute("aria-label",organIndex>=0
          ?"Titik organ "+(organIndex+1)+" "+journey[organIndex].name
          :"Waypoint animasi "+(i+1));
        dot.title=organIndex>=0
          ?"Titik organ "+(organIndex+1)+" • "+journey[organIndex].name
          :"Waypoint "+(i+1);
        figure.appendChild(dot);
      });
    });
    updateRoutePaths();
  }

  function placeBallAtWaypoint(ball,waypointIndex,instant=false){
    if(!ball)return;
    waypointIndex=Math.max(0,Math.min(routeWaypoints.length-1,waypointIndex));
    const p=routeWaypoints[waypointIndex];
    if(instant)ball.classList.add("no-transition");
    ball.style.left=p.x+"%";
    ball.style.top=p.y+"%";
    ball.dataset.waypointIndex=String(waypointIndex);
    const exactOrgan=organWaypointIndices.indexOf(waypointIndex);
    if(exactOrgan>=0)ball.dataset.index=String(exactOrgan);
    if(instant)requestAnimationFrame(()=>ball.classList.remove("no-transition"));
  }

  function placeBall(ball,organIndex,instant=false){
    if(!ball)return;
    organIndex=Math.max(0,Math.min(organWaypointIndices.length-1,organIndex));
    ball.dataset.index=String(organIndex);
    placeBallAtWaypoint(ball,organWaypointIndices[organIndex],instant);
  }

  function refreshAllBallPositions(){
    const eb=document.getElementById("exploreFoodBall");
    const xb=document.getElementById("explainFoodBall");
    if(eb)placeBall(eb,Number(eb.dataset.index||journeyIndex),true);
    if(xb)placeBall(xb,Number(xb.dataset.index||modelIndex),true);
    updateRoutePaths();
  }

  function applyVisualCalibration(){
    ensureWaypointEditors();
    applyMarkerPositions();
    refreshAllBallPositions();
  }

  function animateBall(ball,targetOrgan){
    if(!ball)return;
    const oldTimer=ballTimers.get(ball);
    if(oldTimer)clearTimeout(oldTimer);

    targetOrgan=Math.max(0,Math.min(organWaypointIndices.length-1,targetOrgan));
    const targetWaypoint=organWaypointIndices[targetOrgan];
    let currentWaypoint=Number(ball.dataset.waypointIndex);
    if(!Number.isFinite(currentWaypoint)){
      const currentOrgan=Number(ball.dataset.index||0);
      currentWaypoint=organWaypointIndices[currentOrgan]||0;
    }

    ball.dataset.index=String(targetOrgan);

    if(currentWaypoint===targetWaypoint){
      placeBallAtWaypoint(ball,targetWaypoint);
      ball.classList.remove("arrived");
      void ball.offsetWidth;
      ball.classList.add("arrived");
      return;
    }

    const dir=targetWaypoint>currentWaypoint?1:-1;
    const advance=()=>{
      currentWaypoint+=dir;
      placeBallAtWaypoint(ball,currentWaypoint);
      if(currentWaypoint!==targetWaypoint){
        const timer=setTimeout(advance,115);
        ballTimers.set(ball,timer);
      }else{
        ball.dataset.index=String(targetOrgan);
        ball.classList.remove("arrived");
        void ball.offsetWidth;
        ball.classList.add("arrived");
      }
    };
    advance();
  }

  function setHotspots(selector,index){
    document.querySelectorAll(selector).forEach((b,i)=>{
      b.classList.toggle("is-active",i===index);
      b.classList.toggle("is-passed",i<index);
    });
  }

  function visualPayload(){
    return JSON.stringify({
      label_1_sampai_8:markerPositions.map((p,i)=>({label:i+1,x:+p.x.toFixed(2),y:+p.y.toFixed(2)})),
      titik_organ_bola_1_sampai_8:organWaypointIndices.map((wi,i)=>{
        const p=routeWaypoints[wi];
        return {animasi:i+1,organ:journey[i]?.name||String(i+1),waypoint:wi+1,x:+p.x.toFixed(2),y:+p.y.toFixed(2)};
      }),
      waypoint_jalur:routeWaypoints.map((p,i)=>({
        waypoint:i+1,
        organ:organWaypointIndices.includes(i)?journey[organWaypointIndices.indexOf(i)]?.name:null,
        x:+p.x.toFixed(2),y:+p.y.toFixed(2)
      }))
    },null,2);
  }

  function setVisualStatus(stage,message){
    const el=document.querySelector('[data-visual-status="'+stage+'"]');
    if(el)el.textContent=message;
  }

  function setEditor(stage,on){
    const figure=document.getElementById(stage+"Anatomy");
    const panel=document.querySelector('[data-visual-panel="'+stage+'"]');
    const button=document.querySelector('[data-visual-editor="'+stage+'"]');
    if(!figure||!panel||!button)return;
    figure.classList.toggle("is-editing",on);
    panel.hidden=!on;
    button.classList.toggle("is-active",on);
    button.textContent=on?"Selesai atur posisi":"Atur posisi visual";
    if(on){
      ensureWaypointEditors();
      setVisualStatus(stage,"Seret label 1–8, bola organ, atau titik-titik kuning kecil untuk membentuk jalur animasi yang mengikuti saluran pencernaan.");
    }
  }

  document.querySelectorAll("[data-visual-editor]").forEach(button=>{
    button.addEventListener("click",()=>{
      const stage=button.dataset.visualEditor;
      const figure=document.getElementById(stage+"Anatomy");
      setEditor(stage,!figure.classList.contains("is-editing"));
    });
  });

  document.querySelectorAll("[data-copy-visual]").forEach(button=>{
    button.addEventListener("click",async()=>{
      const stage=button.dataset.copyVisual;
      const payload=visualPayload();
      const output=document.querySelector('[data-visual-output="'+stage+'"]');
      if(output){
        output.hidden=false;
        output.value=payload;
        output.focus();
        output.select();
      }
      try{
        await navigator.clipboard.writeText(payload);
        setVisualStatus(stage,"Koordinat label, 8 titik organ, dan seluruh waypoint berhasil disalin.");
      }catch(_){
        setVisualStatus(stage,"Koordinat ditampilkan di kotak. Salin manual bila clipboard diblokir browser.");
      }
    });
  });

  document.querySelectorAll("[data-reset-visual]").forEach(button=>{
    button.addEventListener("click",()=>{
      markerPositions=clonePositions(defaultMarkerPositions);
      routeWaypoints=clonePositions(defaultRouteWaypoints);
      saveCalibration();
      applyVisualCalibration();
      setVisualStatus(button.dataset.resetVisual,"Label dan seluruh waypoint jalur dikembalikan ke posisi awal.");
    });
  });

  function enableVisualDragging(figure,stage){
    let drag=null;

    figure.addEventListener("pointerdown",e=>{
      if(!figure.classList.contains("is-editing"))return;
      const marker=e.target.closest(".anatomy-hotspot");
      const ball=e.target.closest(".food-ball");
      const waypoint=e.target.closest(".route-waypoint");
      if(!marker&&!ball&&!waypoint)return;

      e.preventDefault();
      e.stopPropagation();

      const rect=figure.getBoundingClientRect();
      let type="marker";
      let index=marker?hotspotIndex(marker):-1;
      if(ball){
        type="ball";
        index=Number(ball.dataset.index||0);
      }else if(waypoint){
        type="waypoint";
        index=Number(waypoint.dataset.waypoint);
      }

      drag={
        type,index,pointerId:e.pointerId,rect,
        target:marker||ball||waypoint,
        startX:e.clientX,startY:e.clientY,moved:false
      };
      drag.target.classList.add("is-dragging");
      try{figure.setPointerCapture(e.pointerId)}catch(_){}
    });

    figure.addEventListener("pointermove",e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;
      e.preventDefault();
      const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
      if(Math.hypot(dx,dy)>3)drag.moved=true;

      const x=clampPercent((e.clientX-drag.rect.left)/drag.rect.width*100);
      const y=clampPercent((e.clientY-drag.rect.top)/drag.rect.height*100);

      if(drag.type==="marker"){
        markerPositions[drag.index]={x,y};
        applyMarkerPositions();
        setVisualStatus(stage,"Label "+(drag.index+1)+" → x "+x.toFixed(1)+"%, y "+y.toFixed(1)+"%");
      }else if(drag.type==="ball"){
        const wi=organWaypointIndices[drag.index];
        routeWaypoints[wi]={x,y};
        refreshAllBallPositions();
        setVisualStatus(stage,"Titik organ "+(drag.index+1)+" ("+(journey[drag.index]?.name||"")+") → x "+x.toFixed(1)+"%, y "+y.toFixed(1)+"%");
      }else{
        routeWaypoints[drag.index]={x,y};
        updateRoutePaths();
        const organIndex=organWaypointIndices.indexOf(drag.index);
        if(organIndex>=0)refreshAllBallPositions();
        setVisualStatus(stage,(organIndex>=0
          ?"Titik organ "+(organIndex+1)+" ("+(journey[organIndex]?.name||"")+")"
          :"Waypoint "+(drag.index+1))+" → x "+x.toFixed(1)+"%, y "+y.toFixed(1)+"%");
      }
    });

    const endDrag=e=>{
      if(!drag||drag.pointerId!==e.pointerId)return;
      if(drag.moved)visualDragSuppressUntil=Date.now()+350;
      drag.target.classList.remove("is-dragging");
      saveCalibration();
      try{figure.releasePointerCapture(e.pointerId)}catch(_){}
      drag=null;
    };
    figure.addEventListener("pointerup",endDrag);
    figure.addEventListener("pointercancel",endDrag);

    figure.addEventListener("click",e=>{
      if(Date.now()<visualDragSuppressUntil){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },true);
  }

  enableVisualDragging(document.getElementById("exploreAnatomy"),"explore");
  enableVisualDragging(document.getElementById("explainAnatomy"),"explain");

  const route=document.getElementById("organRoute");
  route.innerHTML=journey.map((o,i)=>'<button type="button" data-organ="'+i+'"><b>'+(i+1)+'.</b> '+o.name+'</button>').join("");

  function renderJourney(animate=true){
    const o=journey[journeyIndex];
    document.getElementById("journeyCounter").textContent=(journeyIndex+1)+" / "+journey.length;
    document.getElementById("organNumber").textContent="Organ "+(journeyIndex+1);
    document.getElementById("organName").textContent=o.name;
    document.getElementById("organObserve").textContent=o.observe;
    document.getElementById("organProcess").textContent=o.process;
    document.getElementById("organResult").textContent=o.result;
    const termBox=document.getElementById("organTerms");
    if(termBox){
      termBox.innerHTML=(o.terms||[]).map(([term,meaning])=>
        '<div class="term-item"><strong>'+term+'</strong><span>'+meaning+'</span></div>'
      ).join("");
      termBox.hidden=!o.terms||!o.terms.length;
    }
    document.getElementById("organPrompt").innerHTML="<b>Pertanyaan pengarah:</b> "+o.prompt;
    route.querySelectorAll("button").forEach((b,i)=>{
      b.classList.toggle("is-active",i===journeyIndex);
      b.classList.toggle("is-visited",i<=furthestJourney);
    });
    setHotspots("[data-explore-organ]",journeyIndex);
    const ball=document.getElementById("exploreFoodBall");
    animate?animateBall(ball,journeyIndex):placeBall(ball,journeyIndex,true);
    document.getElementById("journeyPrev").disabled=journeyIndex===0;
    document.getElementById("journeyNext").textContent=journeyIndex===journey.length-1?"Kembali ke awal":"Organ berikutnya →";
  }

  function selectJourney(index){
    journeyIndex=Math.max(0,Math.min(journey.length-1,index));
    furthestJourney=Math.max(furthestJourney,journeyIndex);
    renderJourney(true);
  }

  route.addEventListener("click",e=>{
    const b=e.target.closest("[data-organ]"); if(!b)return;
    selectJourney(Number(b.dataset.organ));
  });
  document.getElementById("exploreAnatomy").addEventListener("click",e=>{
    if(Date.now()<visualDragSuppressUntil)return;
    const b=e.target.closest("[data-explore-organ]");if(!b)return;
    selectJourney(Number(b.dataset.exploreOrgan));
  });
  document.getElementById("journeyPrev").onclick=()=>{if(journeyIndex>0)selectJourney(journeyIndex-1)};
  document.getElementById("journeyNext").onclick=()=>{
    selectJourney(journeyIndex===journey.length-1?0:journeyIndex+1);
  };

  document.getElementById("predictionOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-prediction]"); if(!b)return;
    prediction=b.dataset.prediction;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    document.getElementById("predictionFeedback").textContent="Prediksi tersimpan. Gunakan Explore untuk mengujinya.";
  });
  document.getElementById("checkPrediction").onclick=()=>{
    const box=document.getElementById("predictionCheckResult");
    if(furthestJourney<4){box.className="digest-feedback warn";box.textContent="Jelajahi sampai Usus halus terlebih dahulu.";return}
    if(!prediction){box.className="digest-feedback warn";box.textContent="Kamu belum membuat prediksi pada Engage.";return}
    box.className="digest-feedback good";
    box.textContent=prediction==="usus-halus"
      ?"Prediksimu didukung hasil Explore: sebagian besar zat gizi diserap di usus halus melalui permukaan yang luas dan vili."
      :"Hasil Explore menunjukkan bahwa sebagian besar zat gizi diserap di usus halus. Bandingkan kembali fungsi lambung, usus halus, dan usus besar.";
  };

  const modelTabs=document.getElementById("modelTabs");
  modelTabs.innerHTML=model.map((m,i)=>'<button type="button" data-model="'+i+'><span>'+(i+1)+'</span>'+m.name+'</button>').join("");

  function renderModel(i,animate=true){
    modelIndex=Math.max(0,Math.min(model.length-1,i));
    const m=model[modelIndex];
    modelTabs.querySelectorAll("button").forEach((b,j)=>b.classList.toggle("is-active",j===modelIndex));
    setHotspots("[data-explain-organ]",modelIndex);
    const ball=document.getElementById("explainFoodBall");
    animate?animateBall(ball,modelIndex):placeBall(ball,modelIndex,true);
    document.getElementById("modelNumber").textContent="Organ "+(modelIndex+1);
    document.getElementById("modelName").textContent=m.name;
    document.getElementById("modelProcess").textContent=m.process;
    document.getElementById("modelType").textContent=m.type;
    document.getElementById("modelAgent").textContent=m.agent;
    document.getElementById("modelResult").textContent=m.result;
    document.getElementById("modelTerm").textContent=m.term;
    document.getElementById("modelWhy").textContent=m.why;
    document.getElementById("modelRouteText").innerHTML=
      '<b>Perjalanan makanan:</b> '+model.map((x,j)=>
        j===modelIndex?'<strong>'+x.name+'</strong>':x.name
      ).join(' → ');
  }

  modelTabs.addEventListener("click",e=>{
    const b=e.target.closest("[data-model]");if(b)renderModel(Number(b.dataset.model),true);
  });
  document.getElementById("explainAnatomy").addEventListener("click",e=>{
    if(Date.now()<visualDragSuppressUntil)return;
    const b=e.target.closest("[data-explain-organ]");if(!b)return;
    renderModel(Number(b.dataset.explainOrgan),true);
  });

  applyVisualCalibration();
  renderJourney(false);
  renderModel(0,false);

  document.querySelectorAll(".elab-tab").forEach(btn=>btn.addEventListener("click",()=>{
    const i=btn.dataset.elab;
    document.querySelectorAll(".elab-tab").forEach(b=>b.classList.toggle("is-active",b===btn));
    document.querySelectorAll("[data-elab-page]").forEach(p=>p.classList.toggle("is-active",p.dataset.elabPage===i));
  }));

  const conceptData=[
    {label:"Karbohidrat",correct:"glukosa",options:["Glukosa • diserap di usus halus","Asam amino • lambung","Feses • usus besar"]},
    {label:"Protein",correct:"asam",options:["Glukosa • mulut","Asam amino • diserap di usus halus","Asam lemak • usus besar"]},
    {label:"Lemak",correct:"lemak",options:["Asam lemak + gliserol • diserap di usus halus","Asam amino • lambung","Glukosa • usus besar"]}
  ];
  const cm=document.getElementById("conceptMap");
  cm.innerHTML=conceptData.map((r,i)=>'<div class="concept-row"><strong>'+r.label+'</strong><div class="concept-choices">'+r.options.map((o,j)=>'<button type="button" data-row="'+i+'" data-opt="'+j+'">'+o+'</button>').join("")+'</div></div>').join("");
  const conceptAnswers={};
  cm.addEventListener("click",e=>{
    const b=e.target.closest("[data-row]");if(!b)return;
    const r=Number(b.dataset.row),o=Number(b.dataset.opt);
    conceptAnswers[r]=o;
    b.parentElement.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const correct=[0,1,0];
    const filled=Object.keys(conceptAnswers).length;
    const good=filled===3&&correct.every((v,i)=>conceptAnswers[i]===v);
    const fb=document.getElementById("conceptFeedback");
    if(filled<3){fb.className="digest-feedback neutral";fb.textContent="Lengkapi semua hubungan."}
    else if(good){fb.className="digest-feedback good";fb.textContent="Tepat. Hasil akhir karbohidrat, protein, dan lemak diserap terutama di usus halus."}
    else{fb.className="digest-feedback warn";fb.textContent="Belum semuanya tepat. Gunakan model pada Explain untuk meninjau kembali."}
  });

  document.getElementById("caseOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-case]");if(!b)return;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("caseFeedback");
    if(b.dataset.case==="0"){fb.className="digest-feedback good";fb.textContent="Tepat. Air dan serat membantu menjaga konsistensi isi usus dan mendukung pergerakan feses."}
    else{fb.className="digest-feedback warn";fb.textContent="Belum tepat. Tinjau kembali fungsi lambung dan usus besar."}
  });
  document.getElementById("bileOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-bile]");if(!b)return;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("bileFeedback");
    if(b.dataset.bile==="fat"){fb.className="digest-feedback good";fb.textContent="Tepat. Empedu membantu mengemulsikan lemak sehingga luas permukaannya meningkat untuk kerja lipase."}
    else{fb.className="digest-feedback warn";fb.textContent="Belum tepat. Ingat: empedu masuk ke usus halus dan terutama membantu pemrosesan lemak."}
  });

  document.querySelectorAll(".mini-question").forEach((q,idx)=>{
    q.querySelector(".mini-options").addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      const correct=idx===0?"karbohidrat":"dipecah";
      q.querySelectorAll("button").forEach(x=>x.classList.remove("is-selected","is-correct","is-wrong"));
      b.classList.add("is-selected",b.dataset.value===correct?"is-correct":"is-wrong");
      const fb=q.querySelector(".mini-feedback");
      fb.textContent=b.dataset.value===correct?"Benar.":"Belum tepat. Coba ingat kembali konsep nutrisi dan fungsi pencernaan.";
    });
  });

  const bank=[
    {tier:"Dasar",q:"Organ pertama tempat makanan mengalami pencernaan adalah...",o:["Mulut","Lambung","Usus halus","Usus besar"],a:0,e:"Pencernaan dimulai di mulut melalui pengunyahan dan kerja saliva."},
    {tier:"Dasar",q:"Gerak yang mendorong makanan di kerongkongan disebut...",o:["Difusi","Peristaltik","Filtrasi","Inspirasi"],a:1,e:"Peristaltik adalah kontraksi bergelombang dinding saluran pencernaan."},
    {tier:"Dasar",q:"Organ yang mengaduk makanan dan menghasilkan kimus adalah...",o:["Mulut","Kerongkongan","Lambung","Rektum"],a:2,e:"Lambung mengaduk makanan dan mencampurnya dengan cairan lambung."},
    {tier:"Dasar",q:"Sebagian besar zat gizi hasil pencernaan diserap di...",o:["Lambung","Usus halus","Usus besar","Rektum"],a:1,e:"Usus halus memiliki permukaan luas dan vili untuk absorpsi."},
    {tier:"Dasar",q:"Fungsi utama usus besar yang paling terkait dengan pembentukan feses adalah...",o:["Menyerap air","Mencerna protein dengan pepsin","Mengunyah makanan","Menghasilkan empedu"],a:0,e:"Usus besar menyerap air sehingga sisa makanan menjadi lebih padat."},

    {tier:"Pemahaman",q:"Contoh pencernaan mekanik di mulut adalah...",o:["Kerja amilase","Mengunyah dengan gigi","Pemecahan protein oleh pepsin","Emulsifikasi oleh empedu"],a:1,e:"Mengunyah mengubah ukuran fisik makanan tanpa mengubah molekulnya secara kimia."},
    {tier:"Pemahaman",q:"Enzim pepsin terutama membantu mencerna...",o:["Protein","Lemak","Vitamin","Mineral"],a:0,e:"Pepsin berperan dalam pencernaan protein di lambung."},
    {tier:"Pemahaman",q:"Empedu membantu pencernaan dengan cara...",o:["Memecah protein menjadi asam amino","Mengemulsikan lemak menjadi butiran lebih kecil","Mengubah glukosa menjadi pati","Menyerap air dari feses"],a:1,e:"Empedu mengemulsikan lemak. Empedu bukan enzim."},
    {tier:"Pemahaman",q:"Vili pada usus halus terutama berguna untuk...",o:["Memperkecil luas permukaan","Memperluas permukaan penyerapan","Menutup saluran napas","Menyimpan feses"],a:1,e:"Vili meningkatkan luas permukaan sehingga absorpsi lebih efektif."},
    {tier:"Pemahaman",q:"Rektum berfungsi terutama untuk...",o:["Menyimpan feses sementara","Mencerna pati","Menghasilkan HCl","Mengemulsikan lemak"],a:0,e:"Rektum menyimpan feses sementara sebelum dikeluarkan."},

    {tier:"Aplikasi",q:"Jika gerak peristaltik kerongkongan terganggu, proses yang paling langsung terhambat adalah...",o:["Pemindahan bolus ke lambung","Penyerapan glukosa","Produksi empedu","Pembentukan feses"],a:0,e:"Kerongkongan terutama berfungsi memindahkan bolus melalui peristaltik."},
    {tier:"Aplikasi",q:"Kerusakan vili usus halus paling mungkin menyebabkan...",o:["Penyerapan zat gizi menurun","Pengunyahan terganggu","Produksi saliva meningkat","Feses disimpan lebih lama di rektum"],a:0,e:"Vili merupakan struktur penting untuk memperluas area absorpsi."},
    {tier:"Aplikasi",q:"Nasi terutama mulai mengalami pencernaan kimiawi di...",o:["Mulut","Rektum","Anus","Usus besar"],a:0,e:"Pati pada nasi mulai dicerna oleh amilase saliva di mulut."},
    {tier:"Aplikasi",q:"Protein pada telur mulai banyak mengalami pencernaan kimiawi di...",o:["Mulut","Lambung","Usus besar","Rektum"],a:1,e:"Pepsin di lambung memulai pencernaan protein secara bermakna."},
    {tier:"Aplikasi",q:"Setelah keluar dari lambung, kimus pertama kali masuk ke...",o:["Usus halus","Usus besar","Rektum","Kerongkongan"],a:0,e:"Kimus bergerak dari lambung menuju bagian awal usus halus."},

    {tier:"Penalaran",q:"Jika aliran empedu ke usus halus berkurang, proses yang paling langsung terganggu adalah...",o:["Emulsifikasi lemak","Pencernaan protein oleh pepsin","Gerak peristaltik kerongkongan","Penyimpanan feses"],a:0,e:"Empedu membantu memecah lemak secara fisik menjadi butiran lebih kecil."},
    {tier:"Penalaran",q:"Mengapa makanan dikunyah sebelum ditelan?",o:["Agar luas permukaan bertambah dan lebih mudah diproses","Agar semua zat gizi langsung diserap di mulut","Agar tidak memerlukan enzim","Agar air tidak diserap usus besar"],a:0,e:"Ukuran lebih kecil memperluas permukaan kontak dan memudahkan proses berikutnya."},
    {tier:"Penalaran",q:"Seseorang jarang minum dan mengonsumsi sedikit serat. Kondisi yang paling mungkin terjadi adalah...",o:["Feses lebih keras dan sulit dikeluarkan","Semua protein tidak dapat dicerna","Empedu berhenti diproduksi","Makanan tidak dapat masuk ke lambung"],a:0,e:"Asupan cairan dan serat berkaitan dengan konsistensi dan pergerakan feses."},
    {tier:"Penalaran",q:"Pernyataan yang paling tepat tentang lambung dan usus halus adalah...",o:["Lambung terutama mengolah makanan, usus halus menyelesaikan pencernaan dan banyak menyerap zat gizi","Keduanya hanya menyimpan makanan","Usus halus hanya menyerap air sedangkan lambung menyerap semua zat gizi","Lambung menghasilkan empedu dan usus halus menghasilkan saliva"],a:0,e:"Fungsi kedua organ berbeda tetapi saling berlanjut dalam satu sistem."},
    {tier:"Penalaran",q:"Urutan penjelasan yang paling tepat untuk perjalanan makanan adalah...",o:["Mulut → kerongkongan → lambung → usus halus → usus besar → rektum → anus","Mulut → lambung → kerongkongan → usus besar → usus halus → anus","Mulut → usus halus → lambung → kerongkongan → rektum","Lambung → mulut → usus besar → usus halus → anus"],a:0,e:"Urutan saluran pencernaan harus mengikuti jalur yang benar dari masuk hingga dikeluarkan."}
  ];

  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
  const tierOrder=["Dasar","Pemahaman","Aplikasi","Penalaran"];
  const questions=tierOrder.flatMap(t=>shuffle(bank.filter(q=>q.tier===t)));
  let qi=0,score=0;
  const responses=Array(questions.length).fill(null);

  function renderEval(){
    const q=questions[qi];
    document.getElementById("evalTier").textContent=q.tier;
    document.getElementById("evalProgress").textContent="Soal "+(qi+1)+" dari "+questions.length;
    document.getElementById("evalScore").textContent=score;
    document.getElementById("evalProgressFill").style.width=((qi+1)/questions.length*100)+"%";
    document.getElementById("evalQuestion").textContent=q.q;
    document.getElementById("evalOptions").innerHTML=q.o.map((o,i)=>'<button type="button" data-opt="'+i+'">'+o+'</button>').join("");
    const fb=document.getElementById("evalFeedback");
    if(responses[qi]){
      const r=responses[qi];
      document.querySelectorAll("#evalOptions button").forEach((b,i)=>{
        b.disabled=true;
        b.classList.toggle("is-correct",i===q.a);
        b.classList.toggle("is-wrong",i===r.choice&&i!==q.a);
      });
      fb.className="digest-feedback "+(r.correct?"good":"warn");fb.textContent=(r.correct?"Benar. ":"Belum tepat. ")+q.e;
    }else{fb.className="digest-feedback neutral";fb.textContent="Pilih satu jawaban."}
    document.getElementById("evalPrev").disabled=qi===0;
    document.getElementById("evalNext").disabled=!responses[qi];
    document.getElementById("evalNext").textContent=qi===questions.length-1?"Selesai":"Berikutnya →";
  }
  document.getElementById("evalOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-opt]");if(!b||responses[qi])return;
    const choice=Number(b.dataset.opt),correct=choice===questions[qi].a;
    responses[qi]={choice,correct};if(correct)score++;
    renderEval();
  });
  document.getElementById("evalPrev").onclick=()=>{if(qi>0){qi--;renderEval()}};
  document.getElementById("evalNext").onclick=()=>{if(!responses[qi])return;if(qi<questions.length-1){qi++;renderEval()}else{const fb=document.getElementById("evalFeedback");fb.className="digest-feedback good";fb.textContent="Evaluasi selesai. Skor akhir: "+score+"/20. Gunakan Reflect untuk mencatat bagian yang masih perlu dipelajari."}};
  renderEval();
})();