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
      chemical:"Empedu, cairan pankreas, cairan usus",
      result:"Zat gizi sederhana diserap",
      term:"Vili = tonjolan kecil yang memperluas permukaan penyerapan.",
      why:"Permukaan luas dan vili menjadikan usus halus tempat utama penyerapan zat gizi."
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

  // Gunakan hasil kalibrasi terakhir yang tersimpan di browser, bila tersedia.
  // Drag & drop tetap dikunci; ini hanya memulihkan koordinat yang sudah pernah disetujui.
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
    // Dikunci: tidak menyimpan perubahan posisi ke browser.
  }

  window.getDigestiveVisualCalibration=()=>JSON.stringify({
    markers:markerPositions.map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2)})),
    waypoints:routeWaypoints.map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2)}))
  },null,2);

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
    // Dikunci: waypoint tidak ditampilkan sebagai kontrol drag.
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

  function applyVisualCalibration(){
    ensureWaypointEditors();
    applyMarkerPositions();
    refreshAllBallPositions();
  }

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
      helper:"Empedu membantu mengemulsikan lemak agar lipase lebih mudah bekerja. Empedu dibuat oleh hati dan disimpan di kantung empedu. Empedu bukan enzim."
    }
  ];

  function renderNutrientModel(index){
    index=Math.max(0,Math.min(nutrientModels.length-1,index));
    const n=nutrientModels[index];
    document.querySelectorAll(".nutrient-tab").forEach((b,i)=>b.classList.toggle("is-active",i===index));
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
    explainPageTabs.forEach((b,i)=>b.classList.toggle("is-active",i===explainPageIndex));
    explainPages.forEach((p,i)=>p.classList.toggle("is-active",i===explainPageIndex));
    if(explainPageIndex===1){
      requestAnimationFrame(()=>{
        applyVisualCalibration();
        renderModel(modelIndex,false);
      });
    }
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
    document.getElementById("modelMechanical").textContent=m.mechanical;
    document.getElementById("modelChemical").textContent=m.chemical;
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
  showExplainPage(0);

  document.querySelectorAll(".elab-tab").forEach(btn=>btn.addEventListener("click",()=>{
    const i=btn.dataset.elab;
    document.querySelectorAll(".elab-tab").forEach(b=>b.classList.toggle("is-active",b===btn));
    document.querySelectorAll("[data-elab-page]").forEach(p=>p.classList.toggle("is-active",p.dataset.elabPage===i));
  }));

  // 1. Analisis jalur nutrisi
  const pathwayCorrect=[0,1,0];
  const pathwayAnswers={};
  document.getElementById("pathwayChallenge").addEventListener("click",e=>{
    const b=e.target.closest("[data-pathway-opt]");
    if(!b)return;
    const row=b.closest("[data-pathway-row]");
    const r=Number(row.dataset.pathwayRow);
    const o=Number(b.dataset.pathwayOpt);
    pathwayAnswers[r]=o;
    row.querySelectorAll("[data-pathway-opt]").forEach(x=>x.classList.toggle("is-selected",x===b));

    const filled=Object.keys(pathwayAnswers).length;
    const fb=document.getElementById("pathwayFeedback");
    if(filled<3){
      fb.className="digest-feedback neutral";
      fb.textContent="Lengkapi semua jalur. Bandingkan nutrisi, enzim, hasil, dan tempat penyerapannya.";
      return;
    }
    const good=pathwayCorrect.every((v,i)=>pathwayAnswers[i]===v);
    if(good){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Ketiga nutrisi mengikuti jalur berbeda, tetapi hasil pencernaannya terutama diserap di usus halus.";
    }else{
      fb.className="digest-feedback warn";
      fb.textContent="Belum konsisten. Periksa apakah enzim dan hasil akhir sesuai dengan jenis nutrisinya.";
    }
  });

  document.getElementById("absorptionOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-absorb]");if(!b)return;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("absorptionFeedback");
    if(b.dataset.absorb==="all"){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Usus halus merupakan lokasi utama penyerapan hasil pencernaan karbohidrat, protein, dan lemak.";
    }else{
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Hubungkan kembali ketiga hasil pencernaan dengan lokasi utama penyerapannya.";
    }
  });

  // 2. Analisis kasus HOTS — tiga konteks, tiga langkah penalaran
  const hotsCases=[
    {
      title:"Mengapa feses Dika menjadi keras?",
      scenario:"Selama beberapa hari Dika hanya minum sedikit air, jarang makan sayur atau buah, aktivitas hariannya tetap seperti biasa, dan frekuensi makannya tidak berubah. Setelah itu fesesnya menjadi keras dan sulit dikeluarkan.",
      evidencePrompt:"Pilih dua bukti yang paling kuat untuk menjelaskan perubahan sifat feses.",
      evidence:[
        {id:"water",label:"Dika hanya minum sedikit air"},
        {id:"fiber",label:"Dika jarang makan sayur atau buah"},
        {id:"activity",label:"Aktivitas hariannya tetap seperti biasa"},
        {id:"hard",label:"Fesesnya sudah menjadi keras"}
      ],
      evidenceCorrect:["water","fiber"],
      evidenceGood:"Tepat. Kedua informasi itu dapat digunakan sebagai faktor awal untuk menjelaskan mengapa feses menjadi lebih kering dan sulit bergerak.",
      evidenceWarn:"Belum kuat. Bedakan faktor awal yang dapat menjelaskan perubahan feses dari keadaan yang netral atau akibat yang sudah muncul.",
      mechanismPrompt:"Pilih mekanisme sebab–akibat yang paling konsisten dengan bukti tersebut.",
      mechanisms:[
        {id:"0",label:"Kurang air dan serat → isi usus besar cenderung lebih kering dan pergerakan massa feses kurang terbantu → feses mengeras → lebih sulit dikeluarkan",correct:true},
        {id:"1",label:"Kurang air → lambung menyerap seluruh air makanan → feses terbentuk di lambung → feses menjadi keras",correct:false},
        {id:"2",label:"Kurang serat → usus halus berhenti mencerna semua zat makanan → tidak terbentuk hasil pencernaan → feses mengeras",correct:false}
      ],
      mechanismGood:"Tepat. Rantai penjelasan menghubungkan faktor awal, perubahan pada isi saluran pencernaan, sifat feses, lalu akibatnya.",
      mechanismWarn:"Belum konsisten. Periksa kembali organ yang berperan dalam pembentukan feses dan fungsi air serta serat.",
      transferPrompt:"Jika Dika ingin menguji penjelasan tersebut selama beberapa hari, perubahan mana yang paling relevan dan hasil apa yang diprediksi?",
      transfers:[
        {id:"0",label:"Menambah minum dan makanan berserat; feses diprediksi lebih lunak dan lebih mudah bergerak",correct:true},
        {id:"1",label:"Mengurangi frekuensi mengunyah; feses diprediksi menjadi lebih lunak karena kerja gigi berkurang",correct:false},
        {id:"2",label:"Mengurangi makanan berprotein; feses diprediksi langsung lebih lunak karena pepsin bekerja lebih sedikit",correct:false}
      ],
      transferGood:"Tepat. Prediksi tersebut langsung diturunkan dari mekanisme yang sudah kamu bangun.",
      transferWarn:"Belum tepat. Pilih perubahan yang secara langsung menguji faktor penyebab pada penjelasanmu."
    },
    {
      title:"Mengapa roti terasa lebih manis setelah dikunyah lebih lama?",
      scenario:"Salsa membandingkan dua potong roti tawar yang sama. Potongan A dikunyah lebih lama sehingga lebih lama bercampur dengan saliva. Potongan B hanya dikunyah sebentar. Salsa merasakan potongan A menjadi lebih manis.",
      evidencePrompt:"Pilih dua hasil pengamatan yang paling penting untuk mendukung dugaan bahwa saliva ikut mengubah makanan.",
      evidence:[
        {id:"contact",label:"Potongan A lebih lama bercampur dengan saliva"},
        {id:"sweet",label:"Potongan A terasa lebih manis"},
        {id:"same",label:"Kedua potong roti berasal dari jenis yang sama"},
        {id:"plate",label:"Kedua roti diletakkan pada piring yang sama"}
      ],
      evidenceCorrect:["contact","sweet"],
      evidenceGood:"Tepat. Ada perubahan lama kontak dengan saliva dan ada perubahan hasil yang diamati, yaitu rasa yang lebih manis.",
      evidenceWarn:"Belum cukup untuk menjelaskan perubahan. Cari satu bukti tentang perlakuan dan satu bukti tentang hasil yang berubah.",
      mechanismPrompt:"Penjelasan mekanisme mana yang paling sesuai dengan kedua bukti tersebut?",
      mechanisms:[
        {id:"0",label:"Kontak dengan saliva lebih lama → amilase saliva bekerja lebih lama → sebagian karbohidrat mulai dipecah menjadi maltosa dan dekstrin → rasa manis lebih terasa",correct:true},
        {id:"1",label:"Kontak dengan saliva lebih lama → pepsin dalam saliva mengubah protein roti menjadi glukosa → rasa manis meningkat",correct:false},
        {id:"2",label:"Mengunyah lebih lama → empedu masuk ke mulut → lemak diubah menjadi gula → rasa manis meningkat",correct:false}
      ],
      mechanismGood:"Tepat. Penjelasan menggunakan enzim yang benar, substrat yang sesuai, dan perubahan hasil yang dapat menjelaskan pengamatan.",
      mechanismWarn:"Belum tepat. Periksa kembali enzim yang terdapat pada saliva dan zat makanan yang mulai dicerna di mulut.",
      transferPrompt:"Prediksi manakah yang paling baik untuk menguji apakah perubahan rasa itu benar-benar berkaitan dengan enzim dalam saliva?",
      transfers:[
        {id:"0",label:"Jika roti hanya dibasahi air dengan waktu yang sama, peningkatan rasa manis diprediksi lebih kecil karena air tidak mengandung amilase saliva",correct:true},
        {id:"1",label:"Jika roti dibasahi air, rasa manis pasti sama karena air dan saliva memiliki enzim yang sama",correct:false},
        {id:"2",label:"Jika roti dikunyah lebih lama, rasa manis terjadi karena lambung sudah mulai mencerna roti di dalam mulut",correct:false}
      ],
      transferGood:"Tepat. Kamu mengubah satu komponen penting—keberadaan enzim saliva—untuk menguji mekanisme yang diajukan.",
      transferWarn:"Belum tepat. Uji yang baik harus membedakan pengaruh saliva ber-enzim dari sekadar keberadaan cairan."
    },
    {
      title:"Mengapa zat gizi sudah terbentuk tetapi penyerapannya tetap menurun?",
      scenario:"Dalam sebuah model, enzim pencernaan bekerja normal sehingga glukosa dan asam amino tetap terbentuk di usus halus. Namun jumlah vili pada permukaan usus halus dibuat jauh lebih sedikit. Hasil simulasi menunjukkan lebih sedikit glukosa dan asam amino yang masuk ke tubuh.",
      evidencePrompt:"Pilih dua bukti yang paling penting untuk menentukan bagian proses yang terganggu.",
      evidence:[
        {id:"products",label:"Glukosa dan asam amino tetap terbentuk"},
        {id:"villi",label:"Jumlah vili usus halus jauh berkurang"},
        {id:"stomach",label:"Lambung masih dapat mengaduk makanan"},
        {id:"colon",label:"Usus besar masih menyerap sebagian air"}
      ],
      evidenceCorrect:["products","villi"],
      evidenceGood:"Tepat. Hasil pencernaan tetap tersedia, tetapi struktur utama yang memperluas permukaan penyerapan justru berkurang.",
      evidenceWarn:"Belum tepat. Cari bukti yang membedakan apakah masalah terjadi pada pencernaan kimiawi atau pada penyerapan.",
      mechanismPrompt:"Mekanisme mana yang paling tepat menjelaskan hasil simulasi?",
      mechanisms:[
        {id:"0",label:"Vili berkurang → luas permukaan usus halus untuk penyerapan menurun → kontak hasil pencernaan dengan permukaan penyerap berkurang → lebih sedikit zat gizi masuk ke tubuh",correct:true},
        {id:"1",label:"Vili berkurang → amilase dan pepsin tidak dapat dibuat → semua pencernaan berhenti di lambung",correct:false},
        {id:"2",label:"Vili berkurang → usus besar berhenti menyerap air → glukosa dan asam amino tidak lagi terbentuk",correct:false}
      ],
      mechanismGood:"Tepat. Kamu membedakan proses pencernaan dari proses penyerapan dan menghubungkannya dengan struktur vili.",
      mechanismWarn:"Belum tepat. Pada kasus ini hasil pencernaan sudah terbentuk; cari penjelasan yang berfokus pada masuknya zat gizi melalui permukaan usus halus.",
      transferPrompt:"Seorang siswa menyimpulkan: “Jika makanan sudah dicerna menjadi molekul kecil, zat gizinya pasti terserap dengan baik.” Bagaimana kamu mengevaluasi kesimpulan itu?",
      transfers:[
        {id:"0",label:"Tidak selalu benar; hasil pencernaan dapat sudah terbentuk tetapi penyerapan tetap menurun jika luas permukaan usus halus berkurang",correct:true},
        {id:"1",label:"Benar; pembentukan molekul kecil otomatis menjamin seluruh zat gizi masuk ke tubuh",correct:false},
        {id:"2",label:"Benar; vili hanya berfungsi menggerakkan makanan dan tidak berkaitan dengan penyerapan",correct:false}
      ],
      transferGood:"Tepat. Kamu menggunakan kasus baru untuk mengevaluasi batas sebuah pernyataan, bukan sekadar mengulang definisi.",
      transferWarn:"Belum tepat. Bedakan 'sudah dicerna' dari 'sudah diserap'. Keduanya merupakan proses yang berbeda."
    }
  ];

  const hotsCaseStates=hotsCases.map(()=>({
    evidence:new Set(),
    mechanism:null,
    mechanismCorrect:false,
    transfer:null,
    transferCorrect:false
  }));
  let activeHotsCase=0;

  function hotsCaseDone(index){
    return hotsCaseStates[index].transferCorrect;
  }

  function updateHotsCaseTabs(){
    document.querySelectorAll("[data-hots-case]").forEach((tab,i)=>{
      const active=i===activeHotsCase;
      tab.classList.toggle("is-active",active);
      tab.classList.toggle("is-done",hotsCaseDone(i));
      tab.setAttribute("aria-selected",active?"true":"false");
    });
    const done=hotsCaseStates.filter(s=>s.transferCorrect).length;
    document.getElementById("hotsCaseProgress").textContent=done+" / 3 kasus tuntas";
  }

  function renderHotsCase(){
    const data=hotsCases[activeHotsCase];
    const state=hotsCaseStates[activeHotsCase];
    const evidenceGood=state.evidence.size===data.evidenceCorrect.length&&
      data.evidenceCorrect.every(id=>state.evidence.has(id));
    const panel=document.getElementById("hotsCasePanel");

    panel.innerHTML=
      '<div class="case-card hots-case">'+
        '<span class="hots-case-number">KASUS '+(activeHotsCase+1)+'</span>'+
        '<h3>'+data.title+'</h3>'+
        '<p>'+data.scenario+'</p>'+
      '</div>'+
      '<div class="hots-case-step">'+
        '<p><b>Langkah 1 — Analisis bukti.</b> '+data.evidencePrompt+'</p>'+
        '<div class="evidence-options hots-evidence-options">'+
          data.evidence.map(opt=>'<button type="button" data-hots-evidence="'+opt.id+'" class="'+(state.evidence.has(opt.id)?'is-selected':'')+'">'+opt.label+'</button>').join("")+
        '</div>'+
        '<div id="hotsEvidenceFeedback" class="digest-feedback '+(state.evidence.size===2?(evidenceGood?'good':'warn'):'neutral')+'">'+
          (state.evidence.size<2?'Pilih tepat dua bukti.':(evidenceGood?data.evidenceGood:data.evidenceWarn))+
        '</div>'+
      '</div>'+
      '<div id="hotsMechanismStep" class="hots-case-step '+(evidenceGood?'':'locked-step')+'">'+
        '<p><b>Langkah 2 — Bangun mekanisme.</b> '+data.mechanismPrompt+'</p>'+
        '<div class="reason-options">'+
          data.mechanisms.map(opt=>'<button type="button" data-hots-mechanism="'+opt.id+'" class="'+(state.mechanism===opt.id?'is-selected':'')+'">'+opt.label+'</button>').join("")+
        '</div>'+
        '<div class="digest-feedback '+(state.mechanism===null?'neutral':(state.mechanismCorrect?'good':'warn'))+'">'+
          (state.mechanism===null?(evidenceGood?'Pilih penjelasan yang paling konsisten dengan bukti.':'Selesaikan analisis bukti terlebih dahulu.'):(state.mechanismCorrect?data.mechanismGood:data.mechanismWarn))+
        '</div>'+
      '</div>'+
      '<div id="hotsTransferStep" class="hots-case-step '+(state.mechanismCorrect?'':'locked-step')+'">'+
        '<p><b>Langkah 3 — Evaluasi dan transfer.</b> '+data.transferPrompt+'</p>'+
        '<div class="reason-options">'+
          data.transfers.map(opt=>'<button type="button" data-hots-transfer="'+opt.id+'" class="'+(state.transfer===opt.id?'is-selected':'')+'">'+opt.label+'</button>').join("")+
        '</div>'+
        '<div class="digest-feedback '+(state.transfer===null?'neutral':(state.transferCorrect?'good':'warn'))+'">'+
          (state.transfer===null?(state.mechanismCorrect?'Gunakan mekanisme yang sudah benar untuk menilai situasi baru.':'Bangun mekanisme terlebih dahulu.'):(state.transferCorrect?data.transferGood:data.transferWarn))+
        '</div>'+
      '</div>';

    updateHotsCaseTabs();
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
    if(evidenceButton){
      const key=evidenceButton.dataset.hotsEvidence;
      if(state.evidence.has(key)){
        state.evidence.delete(key);
      }else{
        if(state.evidence.size>=2){
          const first=[...state.evidence][0];
          state.evidence.delete(first);
        }
        state.evidence.add(key);
      }
      state.mechanism=null;
      state.mechanismCorrect=false;
      state.transfer=null;
      state.transferCorrect=false;
      renderHotsCase();
      return;
    }

    const mechanismButton=e.target.closest("[data-hots-mechanism]");
    if(mechanismButton){
      const evidenceGood=state.evidence.size===data.evidenceCorrect.length&&
        data.evidenceCorrect.every(id=>state.evidence.has(id));
      if(!evidenceGood)return;
      state.mechanism=mechanismButton.dataset.hotsMechanism;
      state.mechanismCorrect=!!data.mechanisms.find(opt=>opt.id===state.mechanism)?.correct;
      state.transfer=null;
      state.transferCorrect=false;
      renderHotsCase();
      return;
    }

    const transferButton=e.target.closest("[data-hots-transfer]");
    if(transferButton){
      if(!state.mechanismCorrect)return;
      state.transfer=transferButton.dataset.hotsTransfer;
      state.transferCorrect=!!data.transfers.find(opt=>opt.id===state.transfer)?.correct;
      renderHotsCase();
    }
  });

  renderHotsCase();

  // 3. Evaluasi dan perbaiki model empedu
  document.getElementById("modelErrorOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-model-error]");if(!b)return;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("modelErrorFeedback");
    const next=document.getElementById("modelCorrectionStep");
    if(b.dataset.modelError==="enzyme"){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Empedu bukan enzim.";
      next.classList.remove("locked-step");
      document.getElementById("modelCorrectionFeedback").textContent="Sekarang perbaiki model tersebut.";
    }else{
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Hubungan empedu dengan lemak dan usus halus justru benar.";
      next.classList.add("locked-step");
    }
  });

  document.getElementById("modelCorrectionOptions").addEventListener("click",e=>{
    if(document.getElementById("modelCorrectionStep").classList.contains("locked-step"))return;
    const b=e.target.closest("[data-correction]");if(!b)return;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("modelCorrectionFeedback");
    const next=document.getElementById("bilePredictionStep");
    if(b.dataset.correction==="1"){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Empedu membantu secara fisik melalui emulsifikasi; lipase melakukan pencernaan kimiawi lemak.";
      next.classList.remove("locked-step");
      document.getElementById("bileFeedback").textContent="Gunakan model yang sudah benar untuk membuat prediksi.";
    }else{
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Pisahkan fungsi empedu dari fungsi enzim lipase.";
      next.classList.add("locked-step");
    }
  });

  document.getElementById("bileOptions").addEventListener("click",e=>{
    if(document.getElementById("bilePredictionStep").classList.contains("locked-step"))return;
    const b=e.target.closest("[data-bile]");if(!b)return;
    e.currentTarget.querySelectorAll("button").forEach(x=>x.classList.toggle("is-selected",x===b));
    const fb=document.getElementById("bileFeedback");
    if(b.dataset.bile==="fat"){
      fb.className="digest-feedback good";
      fb.textContent="Tepat. Tanpa emulsifikasi yang cukup, luas permukaan lemak untuk kerja lipase berkurang sehingga pencernaan lemak kurang efektif.";
    }else{
      fb.className="digest-feedback warn";
      fb.textContent="Belum tepat. Prediksi harus mengikuti fungsi empedu yang sudah kamu perbaiki pada langkah sebelumnya.";
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
  document.getElementById("evalNext").onclick=()=>{if(!responses[qi])return;if(qi<questions.length-1){qi++;renderEval()}else{const fb=document.getElementById("evalFeedback");fb.className="digest-feedback good";fb.textContent="Evaluasi selesai. Skor akhir: "+score+"/20. Gunakan Reflect untuk mencatat bagian yang masih perlu dipelajari."}};
  renderEval();
})();