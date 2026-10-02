(()=>{
  const journey=[
    {
      name:"Mulut",
      icon:"👄",
      observe:"Makanan masuk ke mulut, lalu dikunyah dan bercampur dengan air liur.",
      process:"Makanan dikunyah dan bercampur dengan air liur.",
      result:"Terbentuk bolus yang lebih mudah ditelan.",
      terms:[["Bolus","gumpalan makanan yang sudah dikunyah dan bercampur dengan air liur."]],
      prompt:"Mengapa makanan perlu dikunyah sebelum ditelan?"
    },
    {
      name:"Faring",
      icon:"↘️",
      observe:"Saat ditelan, makanan melewati bagian belakang mulut menuju tenggorokan.",
      process:"Makanan diarahkan menuju kerongkongan dan tidak masuk ke jalan napas.",
      result:"Makanan masuk ke kerongkongan.",
      terms:[
        ["Epiglotis","lipatan kecil yang membantu menutup jalan napas saat kita menelan."]
      ],
      prompt:"Mengapa kita sebaiknya tidak berbicara saat sedang menelan?"
    },
    {
      name:"Kerongkongan",
      icon:"〰️",
      observe:"Makanan bergerak turun melalui kerongkongan.",
      process:"Gerak peristaltik mendorong makanan sepanjang kerongkongan.",
      result:"Makanan berpindah dari kerongkongan ke lambung.",
      terms:[["Peristaltik","gerakan seperti gelombang yang mendorong makanan di dalam saluran pencernaan."]],
      prompt:"Menurutmu, apakah makanan hanya jatuh ke lambung karena gravitasi?"
    },
    {
      name:"Lambung",
      icon:"🥣",
      observe:"Makanan masuk ke lambung, lalu diaduk dan bercampur dengan cairan lambung.",
      process:"Makanan diaduk dan bercampur dengan cairan lambung.",
      result:"Terbentuk campuran semi-cair yang disebut kimus.",
      terms:[["Kimus","campuran makanan berbentuk semi-cair setelah berada di lambung."]],
      prompt:"Apa perubahan yang kamu lihat pada makanan setelah berada di lambung?"
    },
    {
      name:"Usus halus",
      icon:"🧬",
      observe:"Makanan bergerak melalui usus halus yang panjang dan berkelok-kelok.",
      process:"Zat gizi dari makanan diserap melalui dinding usus halus yang memiliki banyak lipatan dan vili.",
      result:"Zat gizi masuk ke tubuh dan sisa makanan bergerak ke usus besar.",
      terms:[["Vili","tonjolan sangat kecil pada dinding usus halus yang membantu penyerapan zat gizi."]],
      prompt:"Mengapa menurutmu usus halus memiliki banyak lipatan dan permukaan yang luas?"
    },
    {
      name:"Usus besar",
      icon:"🔄",
      observe:"Sisa makanan masuk ke usus besar dan bergerak lebih lambat.",
      process:"Air dari sisa makanan diserap kembali oleh tubuh.",
      result:"Sisa makanan menjadi lebih padat dan terbentuk feses.",
      terms:[["Feses","sisa pencernaan yang akan dikeluarkan dari tubuh."]],
      prompt:"Apa yang terjadi pada sisa makanan jika semakin banyak air yang diambil?"
    },
    {
      name:"Rektum",
      icon:"📦",
      observe:"Feses sampai di bagian akhir usus besar.",
      process:"Feses ditampung sementara di rektum.",
      result:"Muncul dorongan untuk buang air besar.",
      terms:[],
      prompt:"Mengapa feses tidak langsung keluar begitu sampai di bagian akhir usus?"
    },
    {
      name:"Anus",
      icon:"🚪",
      observe:"Feses bergerak menuju bagian paling akhir saluran pencernaan.",
      process:"Feses melewati anus dan keluar dari tubuh.",
      result:"Sisa pencernaan keluar dari tubuh.",
      terms:[],
      prompt:"Apa yang sudah berubah dari makanan sejak masuk melalui mulut hingga keluar dari tubuh?"
    }
  ];

  const model=[
    {
      name:"Mulut",
      process:"Mengunyah + mencampur makanan dengan saliva",
      type:"Mekanik + kimiawi",
      mechanical:"Gigi, lidah",
      chemical:"Saliva (air liur)",
      result:"Bolus; pencernaan karbohidrat mulai",
      term:"Bolus = gumpalan makanan yang sudah dikunyah dan bercampur air liur.",
      why:"Penghancuran memperluas permukaan makanan sehingga proses berikutnya lebih efektif."
    },
    {
      name:"Faring",
      process:"Menelan dan mengarahkan bolus",
      type:"Mekanik / transport",
      mechanical:"Otot faring, epiglotis",
      chemical:"—",
      result:"Bolus masuk ke kerongkongan",
      term:"Epiglotis = lipatan yang membantu menutup jalan napas ketika menelan.",
      why:"Arah bolus harus tepat agar makanan tidak masuk ke saluran pernapasan."
    },
    {
      name:"Kerongkongan",
      process:"Gerak peristaltik",
      type:"Mekanik / transport",
      mechanical:"Otot dinding kerongkongan",
      chemical:"—",
      result:"Bolus menuju lambung",
      term:"Peristaltik = gerak kontraksi bergelombang yang mendorong makanan.",
      why:"Gerak peristaltik menjaga makanan tetap bergerak menuju lambung."
    },
    {
      name:"Lambung",
      process:"Mengaduk + mencerna protein",
      type:"Mekanik + kimiawi",
      mechanical:"Otot dinding lambung",
      chemical:"Cairan lambung",
      result:"Kimus; protein mulai dipecah",
      term:"Kimus = campuran makanan semi-cair setelah bercampur cairan lambung.",
      why:"Pengadukan dan kondisi asam membantu kerja pepsin serta membentuk kimus."
    },
    {
      name:"Usus halus",
      process:"Pencernaan lanjutan + penyerapan zat gizi",
      type:"Mekanik + kimiawi + penyerapan",
      mechanical:"Otot dinding usus",
      chemical:"Empedu (bukan enzim), cairan pankreas, cairan usus",
      result:"Zat gizi sederhana diserap melalui permukaan usus halus",
      term:"Vili = tonjolan kecil pada dinding usus halus yang memperluas permukaan penyerapan.",
      why:"Permukaan luas dan banyak vili menjadikan usus halus tempat utama penyerapan zat gizi."
    },
    {
      name:"Usus besar",
      process:"Penyerapan air + pembentukan feses",
      type:"Penyerapan + gerak usus",
      mechanical:"Otot dinding usus",
      chemical:"—",
      result:"Sisa lebih padat membentuk feses",
      term:"Feses = sisa pencernaan yang tidak digunakan tubuh.",
      why:"Penyerapan air membantu menjaga konsistensi feses dan keseimbangan cairan."
    },
    {
      name:"Rektum",
      process:"Penyimpanan sementara feses",
      type:"Penyimpanan",
      mechanical:"Otot dinding rektum",
      chemical:"—",
      result:"Feses menunggu dikeluarkan",
      term:"Rektum = bagian akhir usus besar yang menyimpan feses sementara.",
      why:"Penyimpanan sementara memungkinkan pengeluaran feses berlangsung terkontrol."
    },
    {
      name:"Anus",
      process:"Pengeluaran feses",
      type:"Eliminasi",
      mechanical:"Otot sfingter",
      chemical:"—",
      result:"Feses keluar dari tubuh",
      term:"Sfingter = otot berbentuk cincin yang mengatur buka-tutup anus.",
      why:"Sfingter membantu mengendalikan waktu pengeluaran feses."
    }
  ];

  let prediction="";
  let journeyIndex=0;
  let furthestJourney=0;
  let modelIndex=0;
  const exploreVisited=new Set([0]);
  let predictionChecked=false;
  const modelSeen=new Set([0]);
  const nutrientSeen=new Set([0]);
  const explainPagesSeen=new Set([0]);
  let evalFinished=false;

  // =========================================================
  // KOORDINAT VISUAL FINAL — sumber tunggal untuk semua viewport
  // Desktop, HP portrait, dan HP landscape memakai data yang sama.
  // =========================================================
  const defaultMarkerPositions=[
    {x:27.32,y:21.37},
    {x:56.68,y:22.20},
    {x:41.31,y:39.51},
    {x:69.64,y:57.01},
    {x:71.92,y:74.05},
    {x:27.06,y:79.43},
    {x:57.51,y:88.93},
    {x:57.00,y:96.00}
  ];

  const routeSegmentCounts=[2,4,6,10,6,9,2];
  const organWaypointIndices=[0,2,6,12,22,28,37,39];
  const routeSegments=[
    {id:1,name:"Mulut → Faring",start:0,end:2,count:2},
    {id:2,name:"Faring → Kerongkongan",start:2,end:6,count:4},
    {id:3,name:"Kerongkongan → Lambung",start:6,end:12,count:6},
    {id:4,name:"Lambung → Usus halus",start:12,end:22,count:10},
    {id:5,name:"Usus halus → Usus besar",start:22,end:28,count:6},
    {id:6,name:"Usus besar → Rektum",start:28,end:37,count:9},
    {id:7,name:"Rektum → Anus",start:37,end:39,count:2}
  ];

  const defaultRouteWaypoints=[
    {x:37.49,y:20.72},
    {x:43.22,y:19.16},
    {x:46.70,y:22.27},

    {x:46.35,y:27.20},
    {x:48.61,y:31.09},
    {x:49.48,y:34.85},
    {x:50.00,y:39.00},

    {x:50.17,y:44.95},
    {x:51.22,y:48.71},
    {x:53.82,y:51.95},
    {x:58.34,y:54.67},
    {x:59.04,y:57.91},
    {x:55.73,y:60.64},

    {x:47.22,y:60.12},
    {x:43.40,y:62.32},
    {x:44.61,y:65.17},
    {x:50.00,y:66.08},
    {x:54.00,y:72.69},
    {x:59.21,y:70.74},
    {x:59.56,y:78.13},
    {x:54.34,y:76.97},
    {x:54.00,y:81.24},
    {x:50.00,y:75.28},

    {x:47.22,y:81.24},
    {x:43.40,y:77.87},
    {x:44.79,y:72.43},
    {x:38.71,y:69.19},
    {x:40.27,y:75.28},
    {x:36.62,y:78.78},

    {x:35.23,y:74.76},
    {x:34.54,y:68.41},
    {x:37.14,y:64.14},
    {x:44.96,y:67.51},
    {x:55.73,y:67.12},
    {x:63.55,y:62.84},
    {x:64.60,y:74.89},
    {x:61.64,y:83.83},
    {x:50.00,y:84.87},

    {x:49.83,y:89.15},
    {x:49.83,y:94.85}
  ];

  const clonePositions=list=>list.map(p=>({x:Number(p.x),y:Number(p.y)}));
  let markerPositions=clonePositions(defaultMarkerPositions);
  let routeWaypoints=clonePositions(defaultRouteWaypoints);

  // Tidak lagi membaca/menulis localStorage.
  // Koordinat final di repository adalah satu-satunya sumber posisi.
  function saveCalibration(){}

  const ballTimers=new WeakMap();
  let visualDragSuppressUntil=0;

  function clampPercent(n){return Math.max(1,Math.min(99,n))}

  function segmentForWaypoint(index){
    if(index===0)return null;
    return routeSegments.find(seg=>index>seg.start&&index<=seg.end)||null;
  }

  function waypointLabel(index){
    if(index===0)return "Mulut • titik awal";
    const seg=segmentForWaypoint(index);
    if(!seg)return "Waypoint "+index;
    const order=index-seg.start;
    return "R"+seg.id+"-"+order+" • "+seg.name;
  }

  function visualPayload(){
    return JSON.stringify({
      mode:"repository-final-lock",
      segment_counts:routeSegments.map(s=>({
        ruas:s.id,nama:s.name,jumlah:s.count,
        indeks_awal:s.start,indeks_akhir:s.end
      })),
      label_organ:markerPositions.map((p,i)=>({
        organ:i+1,nama:journey[i]?.name||String(i+1),
        x:+p.x.toFixed(2),y:+p.y.toFixed(2)
      })),
      organ_waypoint_indices:[...organWaypointIndices],
      waypoint_jalur:routeWaypoints.map((p,i)=>{
        const seg=segmentForWaypoint(i);
        const organIndex=organWaypointIndices.indexOf(i);
        return {
          index:i,
          kode:i===0?"START":(seg?"R"+seg.id+"-"+(i-seg.start):"WP"+i),
          ruas:seg?.name||null,
          organ:organIndex>=0?journey[organIndex]?.name:null,
          x:+p.x.toFixed(2),y:+p.y.toFixed(2)
        };
      })
    },null,2);
  }

  window.getDigestiveVisualCalibration=()=>visualPayload();

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
      const existing=[...figure.querySelectorAll(".route-waypoint")];
      if(existing.length!==routeWaypoints.length){
        existing.forEach(el=>el.remove());
        routeWaypoints.forEach((p,i)=>{
          const dot=document.createElement("button");
          dot.type="button";
          dot.className="route-waypoint"+(organWaypointIndices.includes(i)?" is-organ-anchor":"");
          dot.dataset.waypoint=String(i);
          const seg=segmentForWaypoint(i);
          if(seg)dot.dataset.segment=String(seg.id);
          const label=waypointLabel(i);
          dot.setAttribute("aria-label",label);
          dot.title=label;
          figure.appendChild(dot);
        });
      }
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
        const timer=setTimeout(advance,105);
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
      setVisualStatus(stage,
        "Seret label 1–8 atau titik waypoint kuning/oranye. Posisi tersimpan otomatis di browser ini. Setelah selesai, tekan Salin koordinat untuk saya kunci.");
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
        setVisualStatus(stage,"Koordinat 8 label dan 40 titik jalur berhasil disalin. Kirim hasilnya kepada saya untuk dikunci.");
      }catch(_){
        setVisualStatus(stage,"Koordinat tampil di kotak di bawah. Salin manual lalu kirim kepada saya.");
      }
    });
  });

  document.querySelectorAll("[data-reset-visual]").forEach(button=>{
    button.addEventListener("click",()=>{
      markerPositions=clonePositions(defaultMarkerPositions);
      routeWaypoints=clonePositions(defaultRouteWaypoints);
      saveCalibration();
      applyVisualCalibration();
      setVisualStatus(button.dataset.resetVisual,"Semua label dan waypoint kembali ke posisi awal mode kalibrasi.");
    });
  });

  function enableVisualDragging(figure,stage){
    if(!figure)return;
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
        setVisualStatus(stage,"Label "+(drag.index+1)+" ("+(journey[drag.index]?.name||"")+") → x "+x.toFixed(1)+"%, y "+y.toFixed(1)+"%");
      }else if(drag.type==="ball"){
        const wi=organWaypointIndices[drag.index];
        routeWaypoints[wi]={x,y};
        refreshAllBallPositions();
        setVisualStatus(stage,"Anchor "+(journey[drag.index]?.name||"organ")+" → x "+x.toFixed(1)+"%, y "+y.toFixed(1)+"%");
      }else{
        routeWaypoints[drag.index]={x,y};
        updateRoutePaths();
        const organIndex=organWaypointIndices.indexOf(drag.index);
        if(organIndex>=0)refreshAllBallPositions();
        setVisualStatus(stage,waypointLabel(drag.index)+" → x "+x.toFixed(1)+"%, y "+y.toFixed(1)+"%");
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

  // Saat ukuran/orientasi berubah, pertahankan koordinat hasil edit saat ini.
  let visualViewportSyncFrame=0;
  const syncVisualCoordinates=()=>{
    cancelAnimationFrame(visualViewportSyncFrame);
    visualViewportSyncFrame=requestAnimationFrame(()=>{
      applyMarkerPositions();
      updateRoutePaths();
      refreshAllBallPositions();
    });
  };
  window.addEventListener("resize",syncVisualCoordinates,{passive:true});
  window.addEventListener("orientationchange",syncVisualCoordinates,{passive:true});

  const exploreOrder=[0,1,2,3,4,5,6,7];
  const route=document.getElementById("organRoute");
  route.innerHTML=exploreOrder.map((organIndex,displayIndex)=>{
    const o=journey[organIndex];
    return '<button type="button" data-organ="'+organIndex+'"><b>'+(displayIndex+1)+'.</b> '+o.name+'</button>';
  }).join("");

  function renderJourney(animate=true){
    const o=journey[journeyIndex];
    const explorePos=exploreOrder.indexOf(journeyIndex);
    document.getElementById("journeyCounter").textContent=(explorePos+1)+" / "+exploreOrder.length;
    document.getElementById("organNumber").textContent="Bagian "+(explorePos+1);
    document.getElementById("organName").textContent=o.name;
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
    route.querySelectorAll("button").forEach(b=>{
      const organIndex=Number(b.dataset.organ);
      const pos=exploreOrder.indexOf(organIndex);
      const currentPos=exploreOrder.indexOf(journeyIndex);
      b.classList.toggle("is-active",organIndex===journeyIndex);
      b.classList.toggle("is-visited",pos<=currentPos);
    });
    setHotspots("[data-explore-organ]",journeyIndex);
    const ball=document.getElementById("exploreFoodBall");
    animate?animateBall(ball,journeyIndex):placeBall(ball,journeyIndex,true);
    document.getElementById("journeyPrev").disabled=explorePos===0;
    document.getElementById("journeyNext").textContent=explorePos===exploreOrder.length-1?"Kembali ke awal":"Bagian berikutnya →";
  }

  function selectJourney(index){
    if(!exploreOrder.includes(index))return;
    journeyIndex=index;
    furthestJourney=Math.max(furthestJourney,journeyIndex);
    exploreVisited.add(index);
    renderJourney(true);
    window.refreshStageFooter?.();
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
  document.getElementById("journeyPrev").onclick=()=>{
    const pos=exploreOrder.indexOf(journeyIndex);
    if(pos>0)selectJourney(exploreOrder[pos-1]);
  };
  document.getElementById("journeyNext").onclick=()=>{
    const pos=exploreOrder.indexOf(journeyIndex);
    selectJourney(pos===exploreOrder.length-1?exploreOrder[0]:exploreOrder[pos+1]);
  };

  document.getElementById("predictionOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-prediction]"); if(!b)return;
    prediction=b.dataset.prediction;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    window.refreshStageFooter?.();
    document.getElementById("predictionFeedback").textContent="Prediksi tersimpan. Gunakan Explore untuk mengujinya.";
  });
  document.getElementById("checkPrediction").onclick=()=>{
    const box=document.getElementById("predictionCheckResult");
    if(furthestJourney<4){box.className="digest-feedback warn";box.textContent="Jelajahi sampai Usus halus terlebih dahulu.";return}
    if(!prediction){box.className="digest-feedback warn";box.textContent="Kamu belum membuat prediksi pada Engage.";return}
    box.className="digest-feedback good";
    predictionChecked=true;
    window.refreshStageFooter?.();
    box.textContent=prediction==="usus-halus"
      ?"Prediksimu didukung hasil Explore: sebagian besar zat gizi diserap di usus halus melalui permukaan yang luas dan vili."
      :"Hasil Explore menunjukkan bahwa sebagian besar zat gizi diserap di usus halus. Bandingkan kembali fungsi lambung, usus halus, dan usus besar.";
  };

  const nutrientModels=[
    {
      icon:"🍚",
      name:"Karbohidrat",
      final:"Glukosa, fruktosa, dan galaktosa",
      steps:[
        {
          place:"Mulut",
          enzyme:"Amilase saliva",
          producer:"Kelenjar ludah",
          product:"Maltosa + dekstrin"
        },
        {
          place:"Usus halus",
          enzyme:"Amilase pankreas",
          producer:"Pankreas",
          product:"Maltosa + oligosakarida"
        },
        {
          place:"Permukaan usus halus",
          enzyme:"Maltase",
          producer:"Dinding usus halus",
          product:"Glukosa"
        },
        {
          place:"Permukaan usus halus",
          enzyme:"Sukrase",
          producer:"Dinding usus halus",
          product:"Glukosa + fruktosa"
        },
        {
          place:"Permukaan usus halus",
          enzyme:"Laktase",
          producer:"Dinding usus halus",
          product:"Glukosa + galaktosa"
        }
      ],
      helper:"—"
    },
    {
      icon:"🥚",
      name:"Protein",
      final:"Asam amino",
      steps:[
        {
          place:"Lambung",
          enzyme:"Pepsin",
          producer:"Kelenjar lambung, mula-mula sebagai pepsinogen",
          activator:"HCl mengaktifkan pepsinogen menjadi pepsin",
          product:"Peptida"
        },
        {
          place:"Usus halus",
          enzyme:"Tripsin",
          producer:"Pankreas, mula-mula sebagai tripsinogen",
          activator:"Enteropeptidase dari usus halus mengaktifkan tripsinogen menjadi tripsin",
          product:"Peptida yang lebih kecil"
        },
        {
          place:"Permukaan usus halus",
          enzyme:"Peptidase",
          producer:"Dinding usus halus",
          product:"Asam amino"
        }
      ],
      helper:"—"
    },
    {
      icon:"🥑",
      name:"Lemak",
      final:"Asam lemak + monogliserida",
      steps:[
        {
          place:"Usus halus",
          enzyme:"Lipase pankreas",
          producer:"Pankreas",
          product:"Asam lemak + monogliserida"
        }
      ],
      helper:"Empedu bukan enzim. Empedu dibuat oleh hati, disimpan di kantung empedu, lalu membantu mengemulsikan lemak agar lipase pankreas lebih mudah bekerja."
    }
  ];

  function renderNutrientModel(index){
    index=Math.max(0,Math.min(nutrientModels.length-1,index));
    nutrientSeen.add(index);
    const n=nutrientModels[index];
    document.querySelectorAll(".nutrient-tab").forEach((b,i)=>{
      b.classList.toggle("is-active",i===index);
      if(i===index)b.classList.add("is-viewed");
    });
    document.getElementById("nutrientIcon").textContent=n.icon;
    document.getElementById("nutrientName").textContent=n.name;
    document.getElementById("nutrientFinal").textContent=n.final;

    const pathway=document.getElementById("enzymePathway");
    pathway.innerHTML=n.steps.map((step,i)=>`
      <article class="enzyme-step">
        <div class="enzyme-step-number">${i+1}</div>
        <div class="enzyme-step-place">${step.place}</div>
        <div class="enzyme-step-grid${step.activator?' has-activator':''}">
          <div>
            <span>ENZIM</span>
            <strong>${step.enzyme}</strong>
          </div>
          <div>
            <span>PENGHASIL / KELENJAR</span>
            <strong>${step.producer}</strong>
          </div>
          ${step.activator?`<div>
            <span>PENGAKTIF</span>
            <strong>${step.activator}</strong>
          </div>`:''}
          <div class="enzyme-product">
            <span>HASIL ENZIM</span>
            <strong>${step.product}</strong>
          </div>
        </div>
      </article>
      ${i<n.steps.length-1?'<div class="enzyme-step-arrow">↓</div>':''}
    `).join("");

    const helper=document.getElementById("nutrientHelper");
    const helperText=document.getElementById("nutrientHelperText");
    const hasHelper=n.helper&&n.helper!=="—";
    helper.hidden=!hasHelper;
    helperText.textContent=hasHelper?n.helper:"";
    window.refreshStageFooter?.();
  }

  const nutrientTabs=document.getElementById("nutrientTabs");
  if(nutrientTabs){
    nutrientTabs.addEventListener("click",e=>{
      const b=e.target.closest("[data-nutrient]");
      if(b)renderNutrientModel(Number(b.dataset.nutrient));
    });
    renderNutrientModel(0);
  }

  let explainPageIndex=0;
  const explainPageTabs=[...document.querySelectorAll(".explain-page-tab")];
  const explainPages=[...document.querySelectorAll("[data-explain-content]")];

  function showExplainPage(index){
    explainPageIndex=Math.max(0,Math.min(explainPages.length-1,index));
    explainPagesSeen.add(explainPageIndex);
    explainPageTabs.forEach((b,i)=>{
      b.classList.toggle("is-active",i===explainPageIndex);
      if(i===explainPageIndex)b.classList.add("is-viewed");
    });
    explainPages.forEach((p,i)=>p.classList.toggle("is-active",i===explainPageIndex));
    if(explainPageIndex===1){
      requestAnimationFrame(()=>{
        applyVisualCalibration();
        renderModel(modelIndex,false);
      });
    }
    window.refreshStageFooter?.();
  }

  explainPageTabs.forEach((button,i)=>{
    button.addEventListener("click",()=>showExplainPage(i));
  });
  const explainConceptNext=document.getElementById("explainConceptNext");
  if(explainConceptNext)explainConceptNext.addEventListener("click",()=>showExplainPage(1));

  const explainModelNext=document.getElementById("explainModelNext");
  if(explainModelNext)explainModelNext.addEventListener("click",()=>showExplainPage(2));

  const explainExampleBack=document.getElementById("explainExampleBack");
  if(explainExampleBack)explainExampleBack.addEventListener("click",()=>showExplainPage(1));

  const modelTabs=document.getElementById("modelTabs");
  modelTabs.innerHTML=model.map((m,i)=>'<button type="button" data-model="'+i+'"><span>'+(i+1)+'</span>'+m.name+'</button>').join("");

  function renderModel(i,animate=true){
    modelIndex=Math.max(0,Math.min(model.length-1,i));
    modelSeen.add(modelIndex);
    const m=model[modelIndex];
    modelTabs.querySelectorAll("button").forEach((b,j)=>{
      b.classList.toggle("is-active",j===modelIndex);
      if(j===modelIndex)b.classList.add("is-viewed");
    });
    setHotspots("[data-explain-organ]",modelIndex);
    const ball=document.getElementById("explainFoodBall");
    animate?animateBall(ball,modelIndex):placeBall(ball,modelIndex,true);
    document.getElementById("modelNumber").textContent="Organ "+(modelIndex+1);
    document.getElementById("modelName").textContent=m.name;
    document.getElementById("modelProcess").textContent=m.process;
    document.getElementById("modelType").textContent=m.type;
    document.getElementById("modelMechanical").textContent=m.mechanical;
    document.getElementById("modelChemical").textContent=m.chemical;
    document.getElementById("modelResult").textContent=m.result;
    document.getElementById("modelTerm").textContent=m.term;
    document.getElementById("modelWhy").textContent=m.why;
    document.getElementById("modelRouteText").innerHTML=
      '<b>Perjalanan makanan:</b> '+model.map((x,j)=>
        j===modelIndex?'<strong>'+x.name+'</strong>':x.name
      ).join(' → ');
    window.refreshStageFooter?.();
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
  showExplainPage(0);

  document.querySelectorAll(".elab-tab").forEach(btn=>btn.addEventListener("click",()=>{
    const i=btn.dataset.elab;
    document.querySelectorAll(".elab-tab").forEach(b=>b.classList.toggle("is-active",b===btn));
    document.querySelectorAll("[data-elab-page]").forEach(p=>p.classList.toggle("is-active",p.dataset.elabPage===i));
    window.refreshStageFooter?.();
  }));

  // Utilitas percobaan terbatas untuk seluruh Elaborate
  function makeAttemptState(){
    return {attempts:0,firstCorrect:null,finalCorrect:null,finalized:false};
  }

  function registerAttempt(state,isCorrect){
    state.attempts+=1;
    if(state.firstCorrect===null)state.firstCorrect=isCorrect;
    if(isCorrect||state.attempts>=2){
      state.finalized=true;
      state.finalCorrect=isCorrect;
    }
  }

  function attemptLabel(state){
    if(state.finalized)return state.attempts===1?"Terkunci pada jawaban pertama":"Terkunci setelah 1 revisi";
    if(state.attempts===1)return "1 percobaan digunakan • 1 revisi tersisa";
    return "Belum dikunci • maksimal 2 percobaan";
  }

  // 1. Analisis jalur nutrisi — pilih dulu, baru kunci; maksimal dua percobaan
  const pathwayCorrect=[1,2,0];
  const pathwayAnswers={};
  const pathwayAttempt=makeAttemptState();

  document.getElementById("pathwayChallenge").addEventListener("click",e=>{
    if(pathwayAttempt.finalized)return;
    const b=e.target.closest("[data-pathway-opt]");
    if(!b)return;
    const row=b.closest("[data-pathway-row]");
    const r=Number(row.dataset.pathwayRow);
    const o=Number(b.dataset.pathwayOpt);
    pathwayAnswers[r]=o;
    row.querySelectorAll("[data-pathway-opt]").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("pathwayFeedback");
    fb.className="digest-feedback neutral";
    fb.textContent=pathwayAttempt.attempts===1
      ?"Revisi pilihanmu bila perlu, lalu kunci kembali. Jawaban benar belum ditampilkan."
      :"Lengkapi satu pilihan pada setiap jalur, lalu kunci jawaban.";
  });

  function unlockAbsorptionTransfer(){
    const step=document.getElementById("absorptionTransferStep");
    step.classList.remove("locked-step");
    document.getElementById("checkAbsorption").disabled=false;
    document.getElementById("absorptionAttemptLabel").textContent="Belum dikunci • maksimal 2 percobaan";
    document.getElementById("absorptionFeedback").textContent="Pilih satu jawaban, lalu kunci.";
  }

  document.getElementById("checkPathwayChallenge").addEventListener("click",()=>{
    if(pathwayAttempt.finalized)return;
    const fb=document.getElementById("pathwayFeedback");
    if(Object.keys(pathwayAnswers).length<3){
      fb.className="digest-feedback neutral";
      fb.textContent="Lengkapi ketiga jalur sebelum mengunci jawaban.";
      return;
    }
    const good=pathwayCorrect.every((v,i)=>pathwayAnswers[i]===v);
    registerAttempt(pathwayAttempt,good);
    document.getElementById("pathwayAttemptLabel").textContent=attemptLabel(pathwayAttempt);

    if(good){
      fb.className="digest-feedback good";
      fb.textContent="Analisis tepat. Ketiga jalur sudah konsisten dengan enzim, hasil pencernaan, dan lokasi penyerapan.";
    }else if(!pathwayAttempt.finalized){
      fb.className="digest-feedback warn";
      fb.textContent="Belum konsisten. Periksa kembali urutan enzim → hasil → lokasi penyerapan. Satu kesempatan revisi tersisa; jawaban benar belum ditampilkan.";
    }else{
      fb.className="digest-feedback warn";
      fb.innerHTML="<b>Dua percobaan selesai.</b> Pembahasan: karbohidrat perlu pemecahan lanjutan hingga monosakarida; protein dipecah bertahap hingga asam amino; lemak dibantu emulsifikasi empedu lalu dicerna lipase. Ketiganya terutama diserap di usus halus.";
    }

    if(pathwayAttempt.finalized){
      document.querySelectorAll("#pathwayChallenge [data-pathway-opt]").forEach(b=>b.disabled=true);
      document.getElementById("checkPathwayChallenge").disabled=true;
      unlockAbsorptionTransfer();
    }
  });

  let absorptionChoice="";
  const absorptionAttempt=makeAttemptState();

  document.getElementById("absorptionOptions").addEventListener("click",e=>{
    if(document.getElementById("absorptionTransferStep").classList.contains("locked-step")||absorptionAttempt.finalized)return;
    const b=e.target.closest("[data-absorb]");if(!b)return;
    absorptionChoice=b.dataset.absorb;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("absorptionFeedback");
    fb.className="digest-feedback neutral";
    fb.textContent=absorptionAttempt.attempts===1
      ?"Revisi pilihanmu bila perlu, lalu kunci kembali."
      :"Pilihan sudah dibuat. Kunci jawaban untuk memeriksa alasanmu.";
  });

  document.getElementById("checkAbsorption").addEventListener("click",()=>{
    if(absorptionAttempt.finalized||!pathwayAttempt.finalized)return;
    const fb=document.getElementById("absorptionFeedback");
    if(!absorptionChoice){
      fb.className="digest-feedback neutral";
      fb.textContent="Pilih satu jawaban sebelum mengunci.";
      return;
    }
    const good=absorptionChoice==="all";
    registerAttempt(absorptionAttempt,good);
    document.getElementById("absorptionAttemptLabel").textContent=attemptLabel(absorptionAttempt);
    if(good){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Glukosa, asam amino, dan hasil pencernaan lemak terutama diserap melalui permukaan usus halus.";
    }else if(!absorptionAttempt.finalized){
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Hubungkan kembali ketiga hasil pencernaan dengan lokasi utama penyerapannya. Satu revisi tersisa.";
    }else{
      fb.className="digest-feedback warn";
      fb.innerHTML="<b>Dua percobaan selesai.</b> Pembahasan: glukosa, asam amino, dan hasil pencernaan lemak sama-sama terutama diserap di usus halus, sehingga ketiganya dapat terdampak jika permukaan penyerapannya berkurang.";
    }
    if(absorptionAttempt.finalized){
      document.querySelectorAll("#absorptionOptions button").forEach(b=>b.disabled=true);
      document.getElementById("checkAbsorption").disabled=true;
    }
  });

  // 2. Analisis kasus HOTS — tiga konteks, tiga langkah penalaran
  const hotsCases=[
    {
      title:"Mengapa feses Dika menjadi keras?",
      scenario:"Selama beberapa hari Dika hanya minum sedikit air, jarang makan sayur atau buah, aktivitas hariannya tetap seperti biasa, dan frekuensi makannya tidak berubah. Setelah itu fesesnya menjadi keras dan sulit dikeluarkan.",
      evidencePrompt:"Pilih dua bukti yang paling kuat untuk menjelaskan perubahan sifat feses.",
      evidence:[
        {id:"activity",label:"Aktivitas harian Dika tetap seperti biasanya"},
        {id:"water",label:"Dika hanya minum sedikit air setiap hari"},
        {id:"hard",label:"Feses Dika sudah menjadi keras dan sulit dikeluarkan"},
        {id:"fiber",label:"Dika jarang makan sayur atau buah berserat"}
      ],
      evidenceCorrect:["water","fiber"],
      evidenceGood:"Tepat. Kedua informasi itu merupakan faktor awal yang paling langsung untuk membangun penjelasan tentang perubahan konsistensi feses.",
      evidenceWarn:"Belum kuat. Bedakan faktor awal yang dapat menjelaskan perubahan feses dari keadaan yang netral atau akibat yang sudah muncul.",
      mechanismPrompt:"Pilih mekanisme sebab–akibat yang paling konsisten dengan kedua bukti.",
      mechanisms:[
        {id:"1",label:"Kurang air dan serat → usus halus menyerap hampir seluruh air sebelum sisa mencapai usus besar → feses masuk ke usus besar dalam keadaan kering → sulit dikeluarkan",correct:false},
        {id:"0",label:"Kurang air dan serat → massa feses kurang terbantu mempertahankan air dan bergerak melalui usus besar → feses makin kering dan padat → sulit dikeluarkan",correct:true},
        {id:"2",label:"Kurang air dan serat → lambung menahan makanan lebih lama dan menyerap lebih banyak air → kimus menjadi sangat kering sebelum masuk usus halus → feses mengeras",correct:false}
      ],
      mechanismGood:"Tepat. Rantai penjelasan menghubungkan faktor awal, perubahan pada massa feses di usus besar, lalu akibat akhirnya.",
      mechanismWarn:"Belum konsisten. Periksa kembali organ yang paling berperan dalam penyerapan air dan pembentukan feses.",
      transferPrompt:"Perubahan mana yang paling langsung menguji dua faktor penyebab yang telah kamu pilih sekaligus?",
      transfers:[
        {id:"1",label:"Menambah jumlah minum tetapi serat tetap rendah; jika model benar, perbaikannya diperkirakan sama besar seperti saat kedua faktor diperbaiki",correct:false},
        {id:"2",label:"Menambah makanan berserat tetapi minum tetap sedikit; jika model benar, perbaikannya diperkirakan sama besar seperti saat kedua faktor diperbaiki",correct:false},
        {id:"0",label:"Menambah jumlah minum dan makanan berserat secara bersamaan; jika model benar, feses diprediksi lebih lunak dan lebih mudah dikeluarkan",correct:true}
      ],
      transferGood:"Tepat. Perubahan tersebut langsung menguji kedua faktor yang digunakan dalam mekanisme.",
      transferWarn:"Belum tepat. Pilih rancangan yang menguji dua faktor pada penjelasanmu secara langsung, bukan hanya salah satunya."
    },
    {
      title:"Mengapa roti terasa lebih manis setelah dikunyah lebih lama?",
      scenario:"Salsa membandingkan dua potong roti tawar dari jenis dan ukuran yang sama. Potongan A dikunyah lebih lama sehingga lebih lama bercampur dengan saliva, sedangkan potongan B dikunyah sebentar. Potongan A kemudian terasa lebih manis.",
      evidencePrompt:"Pilih dua bukti yang paling langsung mendukung dugaan bahwa saliva ikut mengubah zat makanan.",
      evidence:[
        {id:"same",label:"Kedua potong berasal dari roti dengan jenis dan ukuran yang sama"},
        {id:"contact",label:"Potongan A bercampur dengan saliva dalam waktu lebih lama"},
        {id:"sweet",label:"Potongan A terasa lebih manis setelah dikunyah lebih lama"},
        {id:"teeth",label:"Kedua potong sama-sama dihancurkan secara mekanik oleh gigi"}
      ],
      evidenceCorrect:["contact","sweet"],
      evidenceGood:"Tepat. Satu bukti menunjukkan perbedaan perlakuan dan satu lagi menunjukkan hasil yang berubah.",
      evidenceWarn:"Belum cukup. Cari bukti yang menunjukkan apa yang dibedakan pada perlakuan dan apa yang berubah pada hasil.",
      mechanismPrompt:"Penjelasan mekanisme mana yang paling konsisten dengan kedua bukti tersebut?",
      mechanisms:[
        {id:"2",label:"Kontak lebih lama dengan saliva → amilase menyelesaikan seluruh pencernaan karbohidrat menjadi glukosa di mulut → konsentrasi glukosa meningkat → rasa manis bertambah",correct:false},
        {id:"1",label:"Kontak lebih lama dengan saliva → amilase bekerja pada protein roti dan menghasilkan asam amino → jumlah zat terlarut meningkat → rasa manis bertambah",correct:false},
        {id:"0",label:"Kontak lebih lama dengan saliva → amilase bekerja lebih lama pada karbohidrat dan menghasilkan molekul yang lebih sederhana → rasa manis menjadi lebih terasa",correct:true}
      ],
      mechanismGood:"Tepat. Penjelasan menggunakan enzim, substrat, dan arah perubahan yang sesuai dengan konsep pencernaan di mulut.",
      mechanismWarn:"Belum tepat. Periksa kembali zat yang menjadi substrat amilase dan sejauh mana pencernaan karbohidrat berlangsung di mulut.",
      transferPrompt:"Rancangan mana yang paling kuat membedakan pengaruh enzim saliva dari sekadar pengaruh cairan?",
      transfers:[
        {id:"1",label:"Membandingkan roti yang terkena saliva selama lima menit dengan roti yang terkena saliva selama satu menit, lalu membandingkan rasa manisnya",correct:false},
        {id:"0",label:"Membandingkan roti yang diberi saliva dan roti yang diberi air dalam jumlah, waktu, dan kondisi yang sama, lalu membandingkan perubahan rasa",correct:true},
        {id:"2",label:"Membandingkan roti bersaliva hangat selama lima menit dengan roti berair dingin selama satu menit, lalu membandingkan perubahan rasa",correct:false}
      ],
      transferGood:"Tepat. Perbedaan utama antarperlakuan adalah keberadaan komponen saliva, sementara faktor lain dibuat sama.",
      transferWarn:"Belum tepat. Rancangan yang kuat sebaiknya hanya mengubah faktor yang ingin diuji dan menjaga faktor lain tetap sama."
    },
    {
      title:"Mengapa zat gizi sudah terbentuk tetapi penyerapannya tetap menurun?",
      scenario:"Dalam sebuah model, enzim pencernaan bekerja normal sehingga glukosa dan asam amino tetap terbentuk di usus halus. Namun jumlah vili pada permukaan usus halus dibuat jauh lebih sedikit. Hasil simulasi menunjukkan lebih sedikit glukosa dan asam amino yang masuk ke tubuh.",
      evidencePrompt:"Pilih dua bukti yang paling penting untuk menentukan bagian proses yang terganggu.",
      evidence:[
        {id:"villi",label:"Jumlah vili pada permukaan usus halus jauh berkurang"},
        {id:"colon",label:"Usus besar masih mampu menyerap sebagian air dari sisa makanan"},
        {id:"stomach",label:"Lambung masih mampu mengaduk makanan dan membentuk kimus"},
        {id:"products",label:"Glukosa dan asam amino tetap terbentuk di usus halus"}
      ],
      evidenceCorrect:["products","villi"],
      evidenceGood:"Tepat. Hasil pencernaan tetap tersedia, tetapi struktur utama yang memperluas permukaan penyerapan justru berkurang.",
      evidenceWarn:"Belum tepat. Cari bukti yang membantu membedakan gangguan pencernaan kimiawi dari gangguan penyerapan.",
      mechanismPrompt:"Mekanisme mana yang paling tepat menjelaskan hasil simulasi?",
      mechanisms:[
        {id:"0",label:"Vili berkurang → luas permukaan penyerapan menurun → kontak hasil pencernaan dengan permukaan penyerap berkurang → lebih sedikit glukosa dan asam amino masuk ke tubuh",correct:true},
        {id:"2",label:"Vili berkurang → gerak isi usus melambat → usus besar menyerap lebih banyak air → glukosa dan asam amino tertahan sehingga penyerapannya menurun",correct:false},
        {id:"1",label:"Vili berkurang → kontak makanan dengan enzim pencernaan menurun → glukosa dan asam amino lebih sedikit terbentuk → jumlah yang dapat diserap ikut menurun",correct:false}
      ],
      mechanismGood:"Tepat. Kamu membedakan pembentukan hasil pencernaan dari proses masuknya hasil tersebut melalui permukaan usus.",
      mechanismWarn:"Belum tepat. Pada kasus ini glukosa dan asam amino sudah terbentuk; fokuskan penjelasan pada tahap penyerapan.",
      transferPrompt:"Bagaimana menilai pernyataan: “Jika makanan sudah dicerna menjadi molekul kecil, zat gizinya pasti terserap dengan baik”?",
      transfers:[
        {id:"2",label:"Pernyataan dapat diterima jika enzim bekerja normal, karena fungsi vili terutama menggerakkan isi usus dan tidak menentukan banyaknya zat yang diserap",correct:false},
        {id:"0",label:"Pernyataan terlalu umum, karena molekul kecil memang perlu terbentuk tetapi penyerapan juga bergantung pada luas dan kondisi permukaan usus halus",correct:true},
        {id:"1",label:"Pernyataan dapat diterima, karena setelah molekul menjadi kecil proses masuk ke tubuh berlangsung otomatis tanpa dipengaruhi luas permukaan usus",correct:false}
      ],
      transferGood:"Tepat. Kamu mengevaluasi batas sebuah pernyataan dengan membedakan syarat pencernaan dan syarat penyerapan.",
      transferWarn:"Belum tepat. Bedakan 'sudah dicerna' dari 'sudah diserap' dan gunakan data tentang vili."
    },
    {
      title:"Apakah asam lambung selalu berarti 'maag'?",
      scenario:"Raka mengatakan bahwa asam di lambung pasti berbahaya dan harus dihilangkan agar tidak terjadi 'maag'. Dalam data kasus disebutkan bahwa kondisi asam membantu pepsin bekerja, sedangkan dinding lambung memiliki lapisan pelindung yang membantu mengurangi kontak langsung jaringan dengan isi lambung. Istilah 'maag' di sini digunakan sebagai sebutan umum untuk keluhan lambung, bukan diagnosis tertentu.",
      evidencePrompt:"Pilih dua informasi yang paling penting untuk mengevaluasi pendapat Raka.",
      evidence:[
        {id:"chyme",label:"Lambung mengaduk makanan dan membentuk campuran semi-cair berupa kimus"},
        {id:"acid",label:"Kondisi asam di lambung membantu enzim pepsin bekerja pada protein"},
        {id:"colon",label:"Usus besar menyerap kembali sebagian air dari sisa makanan"},
        {id:"protection",label:"Dinding lambung memiliki lapisan pelindung terhadap isi lambung"}
      ],
      evidenceCorrect:["acid","protection"],
      evidenceGood:"Tepat. Satu bukti menunjukkan fungsi normal kondisi asam dan satu bukti menunjukkan adanya perlindungan pada dinding lambung.",
      evidenceWarn:"Belum tepat. Pilih bukti yang langsung berkaitan dengan fungsi kondisi asam dan perlindungan dinding lambung.",
      mechanismPrompt:"Penjelasan mana yang paling hati-hati dan konsisten dengan kedua bukti itu?",
      mechanisms:[
        {id:"1",label:"Karena lapisan pelindung ada, asam lambung tidak mungkin berkaitan dengan keluhan apa pun; setiap rasa perih pasti berasal dari organ lain",correct:false},
        {id:"0",label:"Kondisi asam merupakan bagian normal pencernaan karena membantu pepsin, sedangkan adanya keluhan tidak dapat dijelaskan hanya dari keberadaan asam di lambung",correct:true},
        {id:"2",label:"Karena kondisi asam membantu pepsin, semakin tinggi keasaman selalu semakin baik untuk pencernaan dan tidak mungkin berkaitan dengan gangguan lambung",correct:false}
      ],
      mechanismGood:"Tepat. Kamu membedakan fungsi normal kondisi asam dari kesimpulan tentang penyebab suatu keluhan.",
      mechanismWarn:"Belum tepat. Hindari kesimpulan yang bersifat mutlak; gunakan kedua bukti secara bersamaan.",
      transferPrompt:"Bagaimana sebaiknya mengevaluasi pernyataan: “Seseorang merasa perih di lambung, berarti penyebabnya pasti terlalu banyak asam lambung”?",
      transfers:[
        {id:"0",label:"Pernyataan belum dapat diterima; satu keluhan saja tidak cukup menentukan penyebab dan diperlukan informasi tambahan tentang kondisi lambung serta faktor lain",correct:true},
        {id:"2",label:"Pernyataan dapat diterima; adanya lapisan pelindung berarti rasa perih hanya mungkin muncul jika jumlah asam lambung sudah melebihi keadaan normal",correct:false},
        {id:"1",label:"Pernyataan dapat diterima; karena lambung memang bersifat asam, setiap rasa perih paling logis dianggap sebagai akibat kelebihan asam",correct:false}
      ],
      transferGood:"Tepat. Kamu mengevaluasi klaim berdasarkan kecukupan bukti dan tidak membuat diagnosis dari satu gejala.",
      transferWarn:"Belum tepat. Pertimbangkan apakah satu gejala saja cukup untuk memastikan satu penyebab."
    },
    {
      title:"Mengapa feses menjadi sangat cair saat diare?",
      scenario:"Pada sebuah simulasi, sisa makanan pada kondisi A bergerak lebih lambat melalui usus besar dan lebih banyak air diserap kembali. Pada kondisi B, isi usus bergerak jauh lebih cepat dan feses yang keluar mengandung lebih banyak air. Kondisi B digunakan sebagai model sederhana untuk memahami diare.",
      evidencePrompt:"Pilih dua hasil simulasi yang paling penting untuk menjelaskan feses cair.",
      evidence:[
        {id:"stomach",label:"Lambung tetap mengaduk makanan dan membentuk kimus pada kondisi B"},
        {id:"fast",label:"Isi usus bergerak lebih cepat melalui usus besar pada kondisi B"},
        {id:"mouth",label:"Makanan tetap mengalami pengunyahan di mulut sebelum ditelan"},
        {id:"watery",label:"Feses pada kondisi B mengandung air lebih banyak daripada kondisi A"}
      ],
      evidenceCorrect:["fast","watery"],
      evidenceGood:"Tepat. Kedua bukti menghubungkan kecepatan perjalanan isi usus dengan jumlah air yang tersisa di feses.",
      evidenceWarn:"Belum tepat. Cari bukti yang langsung menghubungkan perjalanan isi usus dengan kadar air feses.",
      mechanismPrompt:"Mekanisme mana yang paling masuk akal berdasarkan fungsi usus besar yang sudah dipelajari?",
      mechanisms:[
        {id:"2",label:"Isi usus bergerak lebih cepat → usus besar menyerap air lebih cepat sebagai kompensasi → air yang sudah diserap kemudian kembali ke rektum → feses menjadi cair",correct:false},
        {id:"1",label:"Isi usus bergerak lebih cepat → waktu penyerapan air di lambung berkurang → lebih banyak air mencapai usus besar → air tersebut langsung menjadi bagian feses",correct:false},
        {id:"0",label:"Isi usus bergerak lebih cepat → waktu untuk penyerapan kembali air di usus besar berkurang → lebih banyak air tertinggal dalam feses → feses menjadi cair",correct:true}
      ],
      mechanismGood:"Tepat. Penjelasan menggunakan fungsi usus besar dalam penyerapan kembali air untuk menerangkan konsistensi feses.",
      mechanismWarn:"Belum tepat. Fokuskan penjelasan pada lokasi utama pembentukan feses dan penyerapan kembali air yang telah dipelajari.",
      transferPrompt:"Jika feses cair terjadi berulang kali, kesimpulan apa yang paling logis tentang keseimbangan cairan tubuh?",
      transfers:[
        {id:"1",label:"Cairan tubuh tidak banyak berubah, karena air yang keluar bersama feses terutama berasal dari makanan dan tidak berkaitan dengan cairan tubuh",correct:false},
        {id:"0",label:"Tubuh dapat kehilangan lebih banyak air melalui feses, sehingga penggantian cairan menjadi penting untuk membantu menjaga keseimbangan cairan tubuh",correct:true},
        {id:"2",label:"Cairan tubuh cenderung bertambah, karena berkurangnya penyerapan air di usus besar berarti lebih banyak air tetap tersimpan di dalam tubuh",correct:false}
      ],
      transferGood:"Tepat. Kamu mentransfer konsep penyerapan air untuk menjelaskan konsekuensi keluarnya banyak air bersama feses.",
      transferWarn:"Belum tepat. Bedakan air yang tetap berada di lumen usus dan keluar bersama feses dari air yang berhasil diserap ke tubuh."
    }
  ];

  const hotsCaseStates=hotsCases.map(()=>({
    evidence:{selected:new Set(),...makeAttemptState(),feedbackTone:"neutral",feedbackText:"Pilih tepat dua bukti, lalu kunci jawaban."},
    mechanism:{selected:null,...makeAttemptState(),feedbackTone:"neutral",feedbackText:"Selesaikan analisis bukti terlebih dahulu."},
    transfer:{selected:null,...makeAttemptState(),feedbackTone:"neutral",feedbackText:"Bangun mekanisme terlebih dahulu."}
  }));
  let activeHotsCase=0;

  function hotsCaseDone(index){
    const s=hotsCaseStates[index];
    return s.evidence.finalized&&s.mechanism.finalized&&s.transfer.finalized;
  }

  function hotsCaseMastered(index){
    const s=hotsCaseStates[index];
    return hotsCaseDone(index)&&s.evidence.finalCorrect&&s.mechanism.finalCorrect&&s.transfer.finalCorrect;
  }

  function updateHotsSummary(){
    const allSteps=hotsCaseStates.flatMap(s=>[s.evidence,s.mechanism,s.transfer]);
    const firstCorrect=allSteps.filter(s=>s.firstCorrect===true).length;
    const finalCorrect=allSteps.filter(s=>s.finalCorrect===true).length;
    const doneCases=hotsCaseStates.filter((_,i)=>hotsCaseDone(i)).length;
    document.getElementById("hotsCaseProgress").textContent=doneCases+" / "+hotsCases.length+" kasus selesai";
    document.getElementById("hotsFirstScore").textContent="Awal "+firstCorrect+" / "+allSteps.length+" tepat";
    document.getElementById("hotsFinalScore").textContent="Akhir "+finalCorrect+" / "+allSteps.length+" tepat";
  }

  function updateHotsCaseTabs(){
    document.querySelectorAll("[data-hots-case]").forEach((tab,i)=>{
      const active=i===activeHotsCase;
      tab.classList.toggle("is-active",active);
      tab.classList.toggle("is-done",hotsCaseDone(i));
      tab.classList.toggle("is-mastered",hotsCaseMastered(i));
      tab.setAttribute("aria-selected",active?"true":"false");
    });
    updateHotsSummary();
  }

  function stepButtonLabel(step,kind){
    if(step.finalized)return "Jawaban terkunci";
    if(step.attempts===1)return kind==="evidence"?"Kunci revisi bukti":kind==="mechanism"?"Kunci revisi alasan":"Kunci revisi keputusan";
    return kind==="evidence"?"Kunci bukti":kind==="mechanism"?"Kunci alasan":"Kunci keputusan";
  }

  function stepAttemptText(step){
    if(step.finalized)return step.attempts===1?"Selesai pada jawaban pertama":"Selesai setelah 1 revisi";
    if(step.attempts===1)return "1 percobaan digunakan • 1 revisi tersisa";
    return "Belum dikunci • maksimal 2 percobaan";
  }

  function renderHotsCase(){
    const data=hotsCases[activeHotsCase];
    const state=hotsCaseStates[activeHotsCase];
    const evidenceUnlocked=true;
    const mechanismUnlocked=state.evidence.finalized;
    const transferUnlocked=state.mechanism.finalized;
    const panel=document.getElementById("hotsCasePanel");

    panel.innerHTML=
      '<div class="case-card hots-case">'+
        '<span class="hots-case-number">KASUS '+(activeHotsCase+1)+'</span>'+
        '<h3>'+data.title+'</h3>'+
        '<p>'+data.scenario+'</p>'+
      '</div>'+

      '<div class="hots-case-step '+(state.evidence.finalized?'is-finalized':'')+'">'+
        '<p><b>Langkah 1 — Analisis bukti.</b> '+data.evidencePrompt+'</p>'+
        '<div class="evidence-options hots-evidence-options">'+
          data.evidence.map(opt=>'<button type="button" data-hots-evidence="'+opt.id+'" '+(state.evidence.finalized?'disabled ':'')+'class="'+(state.evidence.selected.has(opt.id)?'is-selected':'')+'">'+opt.label+'</button>').join("")+
        '</div>'+
        '<div class="hots-step-submit-row">'+
          '<span>'+stepAttemptText(state.evidence)+'</span>'+
          '<button type="button" class="primary-inline" data-hots-submit="evidence" '+(state.evidence.finalized?'disabled':'')+'>'+stepButtonLabel(state.evidence,"evidence")+'</button>'+
        '</div>'+
        '<div class="digest-feedback '+state.evidence.feedbackTone+'">'+state.evidence.feedbackText+'</div>'+
      '</div>'+

      '<div class="hots-case-step '+(!mechanismUnlocked?'locked-step ':'')+(state.mechanism.finalized?'is-finalized':'')+'">'+
        '<p><b>Langkah 2 — Bangun mekanisme.</b> '+data.mechanismPrompt+'</p>'+
        '<div class="reason-options">'+
          data.mechanisms.map(opt=>'<button type="button" data-hots-mechanism="'+opt.id+'" '+((!mechanismUnlocked||state.mechanism.finalized)?'disabled ':'')+'class="'+(state.mechanism.selected===opt.id?'is-selected':'')+'">'+opt.label+'</button>').join("")+
        '</div>'+
        '<div class="hots-step-submit-row">'+
          '<span>'+(!mechanismUnlocked?'Menunggu langkah 1 selesai':stepAttemptText(state.mechanism))+'</span>'+
          '<button type="button" class="primary-inline" data-hots-submit="mechanism" '+((!mechanismUnlocked||state.mechanism.finalized)?'disabled':'')+'>'+stepButtonLabel(state.mechanism,"mechanism")+'</button>'+
        '</div>'+
        '<div class="digest-feedback '+state.mechanism.feedbackTone+'">'+state.mechanism.feedbackText+'</div>'+
      '</div>'+

      '<div class="hots-case-step '+(!transferUnlocked?'locked-step ':'')+(state.transfer.finalized?'is-finalized':'')+'">'+
        '<p><b>Langkah 3 — Evaluasi dan transfer.</b> '+data.transferPrompt+'</p>'+
        '<div class="reason-options">'+
          data.transfers.map(opt=>'<button type="button" data-hots-transfer="'+opt.id+'" '+((!transferUnlocked||state.transfer.finalized)?'disabled ':'')+'class="'+(state.transfer.selected===opt.id?'is-selected':'')+'">'+opt.label+'</button>').join("")+
        '</div>'+
        '<div class="hots-step-submit-row">'+
          '<span>'+(!transferUnlocked?'Menunggu langkah 2 selesai':stepAttemptText(state.transfer))+'</span>'+
          '<button type="button" class="primary-inline" data-hots-submit="transfer" '+((!transferUnlocked||state.transfer.finalized)?'disabled':'')+'>'+stepButtonLabel(state.transfer,"transfer")+'</button>'+
        '</div>'+
        '<div class="digest-feedback '+state.transfer.feedbackTone+'">'+state.transfer.feedbackText+'</div>'+
      '</div>';

    updateHotsCaseTabs();
  }

  function evidenceIsCorrect(data,step){
    return step.selected.size===data.evidenceCorrect.length&&
      data.evidenceCorrect.every(id=>step.selected.has(id));
  }

  function correctEvidenceText(data){
    return data.evidenceCorrect.map(id=>data.evidence.find(x=>x.id===id)?.label).filter(Boolean).join(" + ");
  }

  function correctOptionText(options){
    return options.find(x=>x.correct)?.label||"";
  }

  document.getElementById("hotsCaseTabs").addEventListener("click",e=>{
    const b=e.target.closest("[data-hots-case]");if(!b)return;
    activeHotsCase=Number(b.dataset.hotsCase);
    renderHotsCase();
  });

  document.getElementById("hotsCasePanel").addEventListener("click",e=>{
    const data=hotsCases[activeHotsCase];
    const state=hotsCaseStates[activeHotsCase];

    const evidenceButton=e.target.closest("[data-hots-evidence]");
    if(evidenceButton&&!state.evidence.finalized){
      const key=evidenceButton.dataset.hotsEvidence;
      if(state.evidence.selected.has(key)){
        state.evidence.selected.delete(key);
      }else{
        if(state.evidence.selected.size>=2){
          const first=[...state.evidence.selected][0];
          state.evidence.selected.delete(first);
        }
        state.evidence.selected.add(key);
      }
      state.evidence.feedbackTone="neutral";
      state.evidence.feedbackText=state.evidence.attempts===1
        ?"Revisi pilihanmu bila perlu, lalu kunci kembali. Jawaban benar belum ditampilkan."
        :"Pilih tepat dua bukti, lalu kunci jawaban.";
      renderHotsCase();
      return;
    }

    const mechanismButton=e.target.closest("[data-hots-mechanism]");
    if(mechanismButton&&state.evidence.finalized&&!state.mechanism.finalized){
      state.mechanism.selected=mechanismButton.dataset.hotsMechanism;
      state.mechanism.feedbackTone="neutral";
      state.mechanism.feedbackText=state.mechanism.attempts===1
        ?"Revisi alasanmu bila perlu, lalu kunci kembali."
        :"Pilihan sudah dibuat. Kunci alasan untuk memeriksanya.";
      renderHotsCase();
      return;
    }

    const transferButton=e.target.closest("[data-hots-transfer]");
    if(transferButton&&state.mechanism.finalized&&!state.transfer.finalized){
      state.transfer.selected=transferButton.dataset.hotsTransfer;
      state.transfer.feedbackTone="neutral";
      state.transfer.feedbackText=state.transfer.attempts===1
        ?"Revisi keputusanmu bila perlu, lalu kunci kembali."
        :"Pilihan sudah dibuat. Kunci keputusan untuk memeriksanya.";
      renderHotsCase();
      return;
    }

    const submit=e.target.closest("[data-hots-submit]");
    if(!submit)return;
    const kind=submit.dataset.hotsSubmit;

    if(kind==="evidence"){
      const step=state.evidence;
      if(step.finalized)return;
      if(step.selected.size!==2){
        step.feedbackTone="neutral";
        step.feedbackText="Pilih tepat dua bukti sebelum mengunci.";
        renderHotsCase();return;
      }
      const good=evidenceIsCorrect(data,step);
      registerAttempt(step,good);
      if(good){
        step.feedbackTone="good";
        step.feedbackText=data.evidenceGood+" Jawaban dikunci.";
      }else if(!step.finalized){
        step.feedbackTone="warn";
        step.feedbackText=data.evidenceWarn+" Satu kesempatan revisi tersisa; jawaban benar belum ditampilkan.";
      }else{
        step.feedbackTone="warn";
        step.feedbackText="<b>Dua percobaan selesai.</b> Bukti yang paling kuat: "+correctEvidenceText(data)+". "+data.evidenceGood;
      }
      if(step.finalized){
        state.mechanism.feedbackTone="neutral";
        state.mechanism.feedbackText="Gunakan hasil analisis bukti di atas untuk memilih mekanisme, lalu kunci alasanmu.";
      }
      renderHotsCase();return;
    }

    if(kind==="mechanism"){
      const step=state.mechanism;
      if(!state.evidence.finalized||step.finalized)return;
      if(step.selected===null){
        step.feedbackTone="neutral";
        step.feedbackText="Pilih satu mekanisme sebelum mengunci.";
        renderHotsCase();return;
      }
      const good=!!data.mechanisms.find(opt=>opt.id===step.selected)?.correct;
      registerAttempt(step,good);
      if(good){
        step.feedbackTone="good";
        step.feedbackText=data.mechanismGood+" Jawaban dikunci.";
      }else if(!step.finalized){
        step.feedbackTone="warn";
        step.feedbackText=data.mechanismWarn+" Satu kesempatan revisi tersisa; jawaban benar belum ditampilkan.";
      }else{
        step.feedbackTone="warn";
        step.feedbackText="<b>Dua percobaan selesai.</b> Mekanisme yang paling konsisten: "+correctOptionText(data.mechanisms)+". "+data.mechanismGood;
      }
      if(step.finalized){
        state.transfer.feedbackTone="neutral";
        state.transfer.feedbackText="Gunakan mekanisme yang sudah diperiksa untuk menilai situasi baru, lalu kunci keputusanmu.";
      }
      renderHotsCase();return;
    }

    if(kind==="transfer"){
      const step=state.transfer;
      if(!state.mechanism.finalized||step.finalized)return;
      if(step.selected===null){
        step.feedbackTone="neutral";
        step.feedbackText="Pilih satu keputusan sebelum mengunci.";
        renderHotsCase();return;
      }
      const good=!!data.transfers.find(opt=>opt.id===step.selected)?.correct;
      registerAttempt(step,good);
      if(good){
        step.feedbackTone="good";
        step.feedbackText=data.transferGood+" Jawaban dikunci.";
      }else if(!step.finalized){
        step.feedbackTone="warn";
        step.feedbackText=data.transferWarn+" Satu kesempatan revisi tersisa; jawaban benar belum ditampilkan.";
      }else{
        step.feedbackTone="warn";
        step.feedbackText="<b>Dua percobaan selesai.</b> Keputusan yang paling kuat: "+correctOptionText(data.transfers)+". "+data.transferGood;
      }
      renderHotsCase();
    }
  });

  renderHotsCase();

  // 3. Evaluasi dan perbaiki model empedu — maksimal dua percobaan per langkah
  let modelErrorChoice="";
  let modelCorrectionChoice="";
  let bileChoice="";
  const modelErrorAttempt=makeAttemptState();
  const modelCorrectionAttempt=makeAttemptState();
  const bileAttempt=makeAttemptState();

  function unlockModelCorrection(){
    const step=document.getElementById("modelCorrectionStep");
    step.classList.remove("locked-step");
    document.getElementById("checkModelCorrection").disabled=false;
    document.getElementById("modelCorrectionAttemptLabel").textContent="Belum dikunci • maksimal 2 percobaan";
    document.getElementById("modelCorrectionFeedback").className="digest-feedback neutral";
    document.getElementById("modelCorrectionFeedback").textContent="Pilih perbaikan model, lalu kunci jawaban.";
  }

  function unlockBilePrediction(){
    const step=document.getElementById("bilePredictionStep");
    step.classList.remove("locked-step");
    document.getElementById("checkBilePrediction").disabled=false;
    document.getElementById("bileAttemptLabel").textContent="Belum dikunci • maksimal 2 percobaan";
    document.getElementById("bileFeedback").className="digest-feedback neutral";
    document.getElementById("bileFeedback").textContent="Gunakan model yang sudah diperiksa untuk membuat prediksi, lalu kunci.";
  }

  document.getElementById("modelErrorOptions").addEventListener("click",e=>{
    if(modelErrorAttempt.finalized)return;
    const b=e.target.closest("[data-model-error]");if(!b)return;
    modelErrorChoice=b.dataset.modelError;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("modelErrorFeedback");
    fb.className="digest-feedback neutral";
    fb.textContent=modelErrorAttempt.attempts===1?"Revisi pilihanmu bila perlu, lalu kunci kembali.":"Pilihan sudah dibuat. Kunci untuk memeriksa.";
  });

  document.getElementById("checkModelError").addEventListener("click",()=>{
    if(modelErrorAttempt.finalized)return;
    const fb=document.getElementById("modelErrorFeedback");
    if(!modelErrorChoice){
      fb.className="digest-feedback neutral";
      fb.textContent="Pilih satu bagian yang salah sebelum mengunci.";
      return;
    }
    const good=modelErrorChoice==="enzyme";
    registerAttempt(modelErrorAttempt,good);
    document.getElementById("modelErrorAttemptLabel").textContent=attemptLabel(modelErrorAttempt);
    if(good){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Masalah utama model adalah menyebut empedu sebagai enzim.";
    }else if(!modelErrorAttempt.finalized){
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Bandingkan setiap bagian pernyataan dengan fungsi empedu yang sudah dipelajari. Satu revisi tersisa.";
    }else{
      fb.className="digest-feedback warn";
      fb.innerHTML="<b>Dua percobaan selesai.</b> Bagian yang salah adalah pernyataan bahwa empedu merupakan enzim. Empedu membantu emulsifikasi, tetapi bukan enzim.";
    }
    if(modelErrorAttempt.finalized){
      document.querySelectorAll("#modelErrorOptions button").forEach(b=>b.disabled=true);
      document.getElementById("checkModelError").disabled=true;
      unlockModelCorrection();
    }
  });

  document.getElementById("modelCorrectionOptions").addEventListener("click",e=>{
    if(!modelErrorAttempt.finalized||modelCorrectionAttempt.finalized)return;
    const b=e.target.closest("[data-correction]");if(!b)return;
    modelCorrectionChoice=b.dataset.correction;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("modelCorrectionFeedback");
    fb.className="digest-feedback neutral";
    fb.textContent=modelCorrectionAttempt.attempts===1?"Revisi pilihanmu bila perlu, lalu kunci kembali.":"Pilihan sudah dibuat. Kunci perbaikan model untuk memeriksa.";
  });

  document.getElementById("checkModelCorrection").addEventListener("click",()=>{
    if(!modelErrorAttempt.finalized||modelCorrectionAttempt.finalized)return;
    const fb=document.getElementById("modelCorrectionFeedback");
    if(!modelCorrectionChoice){
      fb.className="digest-feedback neutral";
      fb.textContent="Pilih satu perbaikan model sebelum mengunci.";
      return;
    }
    const good=modelCorrectionChoice==="1";
    registerAttempt(modelCorrectionAttempt,good);
    document.getElementById("modelCorrectionAttemptLabel").textContent=attemptLabel(modelCorrectionAttempt);
    if(good){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Empedu mengemulsikan lemak, sedangkan lipase melakukan pencernaan kimiawi lemak.";
    }else if(!modelCorrectionAttempt.finalized){
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Bedakan proses fisik emulsifikasi dari pencernaan kimiawi oleh enzim. Satu revisi tersisa.";
    }else{
      fb.className="digest-feedback warn";
      fb.innerHTML="<b>Dua percobaan selesai.</b> Model yang tepat: empedu mengemulsikan lemak menjadi tetesan lebih kecil, kemudian lipase mencerna lemak secara kimiawi.";
    }
    if(modelCorrectionAttempt.finalized){
      document.querySelectorAll("#modelCorrectionOptions button").forEach(b=>b.disabled=true);
      document.getElementById("checkModelCorrection").disabled=true;
      unlockBilePrediction();
    }
  });

  document.getElementById("bileOptions").addEventListener("click",e=>{
    if(!modelCorrectionAttempt.finalized||bileAttempt.finalized)return;
    const b=e.target.closest("[data-bile]");if(!b)return;
    bileChoice=b.dataset.bile;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("bileFeedback");
    fb.className="digest-feedback neutral";
    fb.textContent=bileAttempt.attempts===1?"Revisi prediksimu bila perlu, lalu kunci kembali.":"Prediksi sudah dipilih. Kunci untuk memeriksa.";
  });

  document.getElementById("checkBilePrediction").addEventListener("click",()=>{
    if(!modelCorrectionAttempt.finalized||bileAttempt.finalized)return;
    const fb=document.getElementById("bileFeedback");
    if(!bileChoice){
      fb.className="digest-feedback neutral";
      fb.textContent="Pilih satu prediksi sebelum mengunci.";
      return;
    }
    const good=bileChoice==="fat";
    registerAttempt(bileAttempt,good);
    document.getElementById("bileAttemptLabel").textContent=attemptLabel(bileAttempt);
    if(good){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Emulsifikasi yang berkurang menurunkan luas permukaan kontak lemak sehingga kerja lipase menjadi kurang efektif.";
    }else if(!bileAttempt.finalized){
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Turunkan prediksi langsung dari fungsi empedu yang sudah diperbaiki. Satu revisi tersisa.";
    }else{
      fb.className="digest-feedback warn";
      fb.innerHTML="<b>Dua percobaan selesai.</b> Prediksi yang paling konsisten: emulsifikasi berkurang, luas permukaan kontak lemak menurun, sehingga kerja lipase menjadi kurang efektif.";
    }
    if(bileAttempt.finalized){
      document.querySelectorAll("#bileOptions button").forEach(b=>b.disabled=true);
      document.getElementById("checkBilePrediction").disabled=true;
    }
  });

  // ---------------------------------------------------------
  // Prasyarat: mini game Makanan → Nutrisi → Fungsi
  // ---------------------------------------------------------
  // Pastikan label nutrisi tidak menampilkan ikon/emoji sebagai petunjuk jawaban.
  document.querySelectorAll(".nutrient-fixed-emoji").forEach(el=>el.remove());

  const nutritionRelations=[
    {
      key:"karbohidrat",
      food:{id:"nasi",emoji:"🍚",label:"Nasi"},
      nutrient:{id:"karbohidrat",emoji:"",label:"Karbohidrat"},
      function:{id:"energi",label:"Sumber energi utama"}
    },
    {
      key:"protein",
      food:{id:"telur",emoji:"🥚",label:"Telur"},
      nutrient:{id:"protein",emoji:"",label:"Protein"},
      function:{id:"jaringan",label:"Membangun dan memperbaiki jaringan"}
    },
    {
      key:"lemak",
      food:{id:"minyak",emoji:"🫒",label:"Minyak"},
      nutrient:{id:"lemak",emoji:"",label:"Lemak"},
      function:{id:"cadangan",label:"Cadangan energi dan membantu melindungi organ"}
    },
    {
      key:"vitamin",
      food:{id:"jeruk",emoji:"🍊",label:"Jeruk"},
      nutrient:{id:"vitamin",emoji:"",label:"Vitamin"},
      function:{id:"mengatur",label:"Membantu mengatur berbagai proses tubuh"}
    },
    {
      key:"mineral",
      food:{id:"susu",emoji:"🥛",label:"Susu"},
      nutrient:{id:"mineral",emoji:"",label:"Mineral"},
      function:{id:"tulang-gigi",label:"Membantu membentuk dan menjaga kekuatan tulang dan gigi"}
    },
    {
      key:"serat",
      food:{id:"sayur",emoji:"🥬",label:"Sayur berserat"},
      nutrient:{id:"serat",emoji:"",label:"Serat"},
      function:{id:"pencernaan",label:"Membantu pergerakan isi saluran pencernaan"}
    },
    {
      key:"air",
      food:{id:"airputih",emoji:"💧",label:"Air putih"},
      nutrient:{id:"air",emoji:"",label:"Air"},
      function:{id:"pelarut",label:"Pelarut dan membantu mengangkut zat"}
    }
  ];

  const relationBanks={
    food:document.getElementById("foodCardBank"),
    function:document.getElementById("functionCardBank")
  };
  const nutrientGameFeedback=document.getElementById("nutrientGameFeedback");
  const nutrientGameScore=document.getElementById("nutrientGameScore");
  let selectedRelationCard=null;

  const relationTypeLabel={
    food:"Makanan",
    nutrient:"Nutrisi",
    function:"Fungsi"
  };

  function shuffleArray(list){
    const a=[...list];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function relationItems(type){
    return nutritionRelations.map(r=>{
      const item=r[type];
      return {
        type,
        id:item.id,
        nutrient:r.key,
        emoji:item.emoji||"",
        label:item.label
      };
    });
  }

  function makeRelationCard(item){
    const el=document.createElement("button");
    el.type="button";
    el.className="relation-card "+item.type+"-relation-card";
    el.draggable=true;
    el.dataset.cardType=item.type;
    el.dataset.cardId=item.id;
    el.dataset.correctNutrient=item.nutrient;
    el.innerHTML=(item.emoji?'<span class="relation-card-emoji">'+item.emoji+'</span>':'')+
      '<strong>'+item.label+'</strong>';
    el.setAttribute("aria-label",item.label);
    return el;
  }

  function bindRelationCards(){
    document.querySelectorAll(".relation-card").forEach(card=>{
      card.onclick=e=>{
        e.stopPropagation();
        document.querySelectorAll(".relation-card").forEach(c=>c.classList.remove("is-selected"));
        selectedRelationCard=card;
        card.classList.add("is-selected");
        nutrientGameFeedback.className="digest-feedback neutral";
        nutrientGameFeedback.textContent="Kartu "+relationTypeLabel[card.dataset.cardType].toLowerCase()+" dipilih. Sentuh kotak "+relationTypeLabel[card.dataset.cardType]+" yang dituju.";
      };
      card.ondragstart=e=>{
        e.dataTransfer.setData("text/plain",card.dataset.cardType+":"+card.dataset.cardId);
        e.dataTransfer.effectAllowed="move";
        card.classList.add("is-dragging");
      };
      card.ondragend=()=>{
        card.classList.remove("is-dragging");
        document.querySelectorAll(".relation-slot").forEach(s=>s.classList.remove("is-drop-target"));
      };
    });
  }

  function renderRelationBanks(){
    Object.values(relationBanks).forEach(bank=>bank.innerHTML="");
    ["food","function"].forEach(type=>{
      shuffleArray(relationItems(type)).forEach(item=>relationBanks[type].appendChild(makeRelationCard(item)));
    });
    bindRelationCards();
  }

  function clearRelationMarks(){
    document.querySelectorAll(".relation-card").forEach(c=>c.classList.remove("is-selected","is-correct","is-wrong"));
    document.querySelectorAll(".relation-slot").forEach(s=>s.classList.remove("is-drop-target","has-correct","has-wrong"));
    document.querySelectorAll(".nutrition-chain-row").forEach(r=>r.classList.remove("chain-correct","chain-wrong"));
  }

  function returnCardToBank(card){
    if(!card)return;
    const bank=relationBanks[card.dataset.cardType];
    if(bank)bank.appendChild(card);
  }

  function placeRelationCard(card,slot){
    if(!card||!slot)return;
    if(card.dataset.cardType!==slot.dataset.slotType){
      nutrientGameFeedback.className="digest-feedback warn";
      nutrientGameFeedback.textContent="Kartu "+relationTypeLabel[card.dataset.cardType]+" hanya dapat ditempatkan pada kolom "+relationTypeLabel[card.dataset.cardType]+".";
      return;
    }
    const existing=slot.querySelector(".relation-card");
    if(existing&&existing!==card)returnCardToBank(existing);
    slot.innerHTML="";
    slot.appendChild(card);
    selectedRelationCard=null;
    clearRelationMarks();
    nutrientGameFeedback.className="digest-feedback neutral";
    nutrientGameFeedback.textContent="Lanjutkan sampai setiap nutrisi memiliki pasangan makanan dan fungsi yang sesuai.";
  }

  document.querySelectorAll(".relation-slot:not(.nutrient-slot)").forEach(slot=>{
    slot.addEventListener("click",e=>{
      if(e.target.closest(".relation-card"))return;
      if(selectedRelationCard)placeRelationCard(selectedRelationCard,slot);
    });
    slot.addEventListener("dragover",e=>{
      e.preventDefault();
      slot.classList.add("is-drop-target");
    });
    slot.addEventListener("dragleave",()=>slot.classList.remove("is-drop-target"));
    slot.addEventListener("drop",e=>{
      e.preventDefault();
      slot.classList.remove("is-drop-target");
      const raw=e.dataTransfer.getData("text/plain");
      const [type,id]=raw.split(":");
      const card=document.querySelector('.relation-card[data-card-type="'+type+'"][data-card-id="'+id+'"]');
      placeRelationCard(card,slot);
    });
  });

  Object.entries(relationBanks).forEach(([bankType,bank])=>{
    bank.addEventListener("dragover",e=>e.preventDefault());
    bank.addEventListener("drop",e=>{
      e.preventDefault();
      const raw=e.dataTransfer.getData("text/plain");
      const [type,id]=raw.split(":");
      const card=document.querySelector('.relation-card[data-card-type="'+type+'"][data-card-id="'+id+'"]');
      if(card&&type===bankType){
        bank.appendChild(card);
        selectedRelationCard=null;
        clearRelationMarks();
      }
    });
  });

  document.getElementById("checkNutrientGame").addEventListener("click",()=>{
    const rows=[...document.querySelectorAll(".nutrition-chain-row")];
    const incomplete=rows.filter(row=>
      !row.querySelector(".food-slot .relation-card")||
      !row.querySelector(".function-slot .relation-card")
    );
    if(incomplete.length){
      nutrientGameFeedback.className="digest-feedback warn";
      nutrientGameFeedback.textContent="Masih ada "+incomplete.length+" rantai yang belum lengkap. Setiap nutrisi harus memiliki satu makanan dan satu fungsi.";
      return;
    }

    let correctChains=0;
    rows.forEach(row=>{
      const food=row.querySelector(".food-slot .relation-card");
      const nutrient=row.querySelector(".nutrient-slot");
      const func=row.querySelector(".function-slot .relation-card");
      const chainKey=nutrient.dataset.correctNutrient;
      const chainOK=
        food.dataset.correctNutrient===chainKey&&
        func.dataset.correctNutrient===chainKey;

      [food,func].forEach(card=>{
        card.classList.toggle("is-correct",chainOK);
        card.classList.toggle("is-wrong",!chainOK);
      });
      row.querySelectorAll(".relation-slot").forEach(slot=>{
        slot.classList.toggle("has-correct",chainOK);
        slot.classList.toggle("has-wrong",!chainOK);
      });
      row.classList.toggle("chain-correct",chainOK);
      row.classList.toggle("chain-wrong",!chainOK);
      if(chainOK)correctChains++;
    });

    nutrientGameScore.textContent=correctChains+" / 7 rantai tepat";
    if(correctChains===7){
      nutrientGameFeedback.className="digest-feedback good";
      nutrientGameFeedback.textContent="Semua hubungan tepat. Kamu sudah menghubungkan makanan, jenis nutrisi, dan fungsi utamanya.";
    }else{
      nutrientGameFeedback.className="digest-feedback warn";
      nutrientGameFeedback.textContent=correctChains+" dari 7 rantai sudah tepat. Perbaiki pasangan makanan dan fungsi pada baris yang ditandai.";
    }
  });

  function resetNutritionRelationGame(message){
    document.querySelectorAll(".relation-slot:not(.nutrient-slot)").forEach(slot=>{
      const type=slot.dataset.slotType;
      slot.innerHTML="<span>Tempatkan "+relationTypeLabel[type].toLowerCase()+"</span>";
    });
    renderRelationBanks();
    clearRelationMarks();
    selectedRelationCard=null;
    nutrientGameScore.textContent="0 / 7 rantai tepat";
    nutrientGameFeedback.className="digest-feedback neutral";
    nutrientGameFeedback.textContent=message;
  }

  document.getElementById("shuffleNutrientGame").addEventListener("click",()=>{
    resetNutritionRelationGame("Kartu makanan dan fungsi sudah diacak ulang. Nutrisi tetap berada di tengah.");
  });

  document.getElementById("resetNutrientGame").addEventListener("click",()=>{
    resetNutritionRelationGame("Permainan diulang. Pasangkan makanan dan fungsi dengan nutrisi yang sudah tersedia.");
  });

  renderRelationBanks();

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
    {tier:"Pemahaman",q:"Empedu membantu pencernaan dengan cara...",o:["Memecah protein menjadi asam amino","Mengemulsikan lemak menjadi butiran lebih kecil","Mengubah glukosa menjadi karbohidrat kompleks","Menyerap air dari feses"],a:1,e:"Empedu mengemulsikan lemak. Empedu bukan enzim."},
    {tier:"Pemahaman",q:"Vili pada usus halus terutama berguna untuk...",o:["Memperkecil luas permukaan","Memperluas permukaan penyerapan","Menutup saluran napas","Menyimpan feses"],a:1,e:"Vili meningkatkan luas permukaan sehingga absorpsi lebih efektif."},
    {tier:"Pemahaman",q:"Rektum berfungsi terutama untuk...",o:["Menyimpan feses sementara","Mencerna karbohidrat","Menghasilkan HCl","Mengemulsikan lemak"],a:0,e:"Rektum menyimpan feses sementara sebelum dikeluarkan."},

    {tier:"Aplikasi",q:"Jika gerak peristaltik kerongkongan terganggu, proses yang paling langsung terhambat adalah...",o:["Pemindahan bolus ke lambung","Penyerapan glukosa","Produksi empedu","Pembentukan feses"],a:0,e:"Kerongkongan terutama berfungsi memindahkan bolus melalui peristaltik."},
    {tier:"Aplikasi",q:"Kerusakan vili usus halus paling mungkin menyebabkan...",o:["Penyerapan zat gizi menurun","Pengunyahan terganggu","Produksi saliva meningkat","Feses disimpan lebih lama di rektum"],a:0,e:"Vili merupakan struktur penting untuk memperluas area absorpsi."},
    {tier:"Aplikasi",q:"Nasi terutama mulai mengalami pencernaan kimiawi di...",o:["Mulut","Rektum","Anus","Usus besar"],a:0,e:"Karbohidrat pada nasi mulai dicerna oleh amilase saliva di mulut."},
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
  document.getElementById("evalNext").onclick=()=>{if(!responses[qi])return;if(qi<questions.length-1){qi++;renderEval()}else{evalFinished=true;const fb=document.getElementById("evalFeedback");fb.className="digest-feedback good";fb.textContent="Evaluasi selesai. Skor akhir: "+score+"/20. Gunakan Reflect untuk mencatat bagian yang masih perlu dipelajari.";window.refreshStageFooter?.()}};

  window.IPA_STAGE_COMPLETE_CHECK=(stage)=>{
    switch(Number(stage)){
      case 0:
        return /^7\s*\/\s*7\b/.test(document.getElementById("nutrientGameScore")?.textContent||"");
      case 1:
        return !!prediction;
      case 2:
        return journeyIndex===exploreOrder.length-1
          && exploreVisited.size===exploreOrder.length
          && predictionChecked;
      case 3: {
        const pagesAll=explainPageTabs.length>0&&explainPageTabs.every(b=>b.classList.contains("is-viewed"));
        const modelButtons=[...document.querySelectorAll("#modelTabs [data-model]")];
        const modelsAll=modelButtons.length===model.length&&modelButtons.every(b=>b.classList.contains("is-viewed"));
        const nutrientButtons=[...document.querySelectorAll("#nutrientTabs [data-nutrient]")];
        const nutrientsAll=nutrientButtons.length===nutrientModels.length&&nutrientButtons.every(b=>b.classList.contains("is-viewed"));
        return explainPageIndex===explainPages.length-1&&pagesAll&&modelsAll&&nutrientsAll;
      }
      case 4: {
        const activeElab=document.querySelector(".elab-tab.is-active")?.dataset.elab;
        const casesDone=hotsCaseStates.every((_,i)=>hotsCaseDone(i));
        return activeElab==="2"
          && pathwayAttempt.finalized
          && absorptionAttempt.finalized
          && casesDone
          && modelErrorAttempt.finalized
          && modelCorrectionAttempt.finalized
          && bileAttempt.finalized;
      }
      case 5:
        return evalFinished && qi===questions.length-1 && responses.every(Boolean);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const scheduleDigestFooter=()=>setTimeout(()=>window.refreshStageFooter?.(),0);
  document.addEventListener("click",scheduleDigestFooter,true);
  document.addEventListener("change",scheduleDigestFooter,true);
  document.addEventListener("input",scheduleDigestFooter,true);
  window.refreshStageFooter?.();

  renderEval();
  window.refreshStageFooter?.();
})();