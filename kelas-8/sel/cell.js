(() => {
  const config = window.IPA_TEMPLATE_CONFIG || {};
  const STORAGE_KEY = "ipa-interaktif:kelas-8-sel:v1";
  const STORAGE_PREFIX = "ipa-interaktif:kelas-8-sel:";
  const stageCount = 7;

  const resetRequested = new URLSearchParams(location.search).has("_reset");
  if (resetRequested) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
    });
  }

  const state = loadState();
  // Bukti aktivitas sebelumnya berbeda dengan audit 5E baru.
  // Simpan identitas/refleksi, tetapi jangan gunakan tanda selesai lama sebagai bukti.
  if (state.learningAuditVersion!=="20261022-5e1"){
    state.activeStage=0;
    state.completed=[];
    state.learningAuditVersion="20261022-5e1";
  }

  let activeStage = Number.isInteger(state.activeStage) ? state.activeStage : 0;
  let completed = Array.isArray(state.completed) ? new Set(state.completed.filter(x=>Number.isInteger(x)&&x>=0&&x<stageCount)) : new Set();
  let mode = state.mode || config.defaultMode || "mandiri";

  if (!state.sessionId) state.sessionId = makeId();

  const panels = [...document.querySelectorAll("[data-panel]")];
  const tabs = [...document.querySelectorAll("[data-stage]")];
  const prevButton = document.getElementById("prevStage");
  const nextButton = document.getElementById("nextStage");
  const completeButton = document.getElementById("completeStage");
  const bottomNav = document.querySelector(".bottom-nav");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const toast = document.getElementById("toast");
  const engageZoomSeen = new Set([0]);
  const explainPageSeen = new Set([0]);

  hydrateConfig();
  bindModeButtons();
  bindStages();
  bindDemos();
  bindFeedbackForm();
  initMobileChrome();
  initSwipeNavigation();
  restoreReflections();
  restoreIdentity();
  restoreDifficulty();
  setMode(mode);
  showStage(activeStage, false);
  updateBottomNavVisibility();

  if (resetRequested) {
    const cleanUrl = location.pathname + location.hash;
    try { history.replaceState(null, "", cleanUrl); } catch {}
  }

  updateFeedbackConnectionState();
  refreshSendState();
  saveState();

  function hydrateConfig() {
    const appTitle = document.getElementById("appTitle");
    const materialTitle = document.getElementById("materialTitle");
    const materialMeta = document.getElementById("materialMeta");
    if (appTitle) appTitle.textContent = config.appTitle || "IPA Interaktif";
    if (materialTitle) materialTitle.textContent = config.materialTitle || "Template Materi IPA";
    if (materialMeta) materialMeta.textContent = config.materialMeta || "Kelas VII / VIII / IX";

    const objective = document.querySelector('[data-slot="objective"]');
    if (objective && config.objective) objective.textContent = config.objective;

    const grid = document.getElementById("strategyGrid");
    if (grid) {
      (config.strategies || []).forEach((strategy, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "strategy-chip" + (index === 0 ? " is-selected" : "");
        button.textContent = strategy;
        grid.appendChild(button);
      });
    }

    const difficultyGrid = document.getElementById("difficultyGrid");
    if (difficultyGrid) {
      (config.difficultyCategories || []).forEach(category => {
        const label = document.createElement("label");
        label.className = "difficulty-option";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.dataset.difficulty = category;

        const span = document.createElement("span");
        span.textContent = category;

        label.append(input, span);
        difficultyGrid.appendChild(label);
      });
    }
  }

  function bindModeButtons() {
    document.querySelectorAll("[data-mode]").forEach(button => {
      button.addEventListener("click", () => {
        setMode(button.dataset.mode);
        markFeedbackChanged();
      });
    });
  }

  function setMode(nextMode) {
    mode = nextMode === "guru" ? "guru" : "mandiri";
    document.body.dataset.mode = mode;

    document.querySelectorAll("[data-mode]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.mode === mode);
    });

    document.getElementById("modeNote").textContent =
      mode === "mandiri"
        ? "Petunjuk, feedback, dan progres membantu siswa belajar secara mandiri."
        : "Gunakan simulasi untuk diskusi bersama guru; progres aktivitas tetap tercatat pada perangkat ini.";

    saveState();
  }

  function bindStages() {
    tabs.forEach(tab => {
      tab.addEventListener("click", () => showStage(Number(tab.dataset.stage)));
    });

    prevButton.addEventListener("click", () => {
      if (activeStage > 0) showStage(activeStage - 1);
    });

    nextButton.addEventListener("click", () => {
      if (activeStage < stageCount - 1) showStage(activeStage + 1);
    });

    completeButton.addEventListener("click", () => {
      if (!completed.has(activeStage) && !window.CELL_MODULE_BRIDGE?.isStageReady?.(activeStage)) {
        showToast("Selesaikan aktivitas tahap ini terlebih dahulu.");
        return;
      }
      if (completed.has(activeStage)) {
        completed.delete(activeStage);
        showToast("Tanda selesai dibatalkan.");
      } else {
        completed.add(activeStage);
        showToast("Tahap ditandai selesai.");
      }
      renderProgress();
      nextButton.disabled = activeStage === stageCount - 1 || !completed.has(activeStage);
      nextButton.style.opacity = nextButton.disabled ? ".45" : "1";
      markFeedbackChanged();
      saveState();
    });
  }

  function naturalDocumentTop(element) {
    let y = 0;
    let node = element;
    while (node) {
      y += node.offsetTop || 0;
      node = node.offsetParent;
    }
    return y;
  }

  function isPhoneLayout() {
    return window.matchMedia(
      "(max-width:640px), (orientation: landscape) and (max-width:950px) and (max-height:500px)"
    ).matches;
  }

  function keepActiveTabVisible(behavior = "smooth") {
    tabs[activeStage]?.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "center"
    });
  }

  function scrollToStageMenu(behavior = "smooth") {
    const nav = document.querySelector(".stage-nav");
    if (!nav) return;

    requestAnimationFrame(() => {
      const header = document.querySelector(".app-header");
      const headerHidden = document.body.classList.contains("phone-topbar-hidden");
      const headerH = header && !headerHidden ? header.getBoundingClientRect().height : 0;
      const y = naturalDocumentTop(nav) - headerH - 2;
      window.scrollTo({ top: Math.max(0, y), behavior });
    });
  }

  function isTerminalInternalView(){
    if (typeof window.CELL_MODULE_BRIDGE?.isStageReady === "function") {
      return window.CELL_MODULE_BRIDGE.isStageReady(activeStage);
    }
    switch(activeStage){
      // Orientasi: seluruh 8 ciri sudah diselesaikan dan tombol internal terakhir sudah ditutup.
      case 0:
        return /✓/.test(document.getElementById("lifeProgress")?.textContent||"");

      // Engage: sudah sampai tingkat terakhir, yaitu Sel.
      case 1:
        return Number(document.querySelector("#zoomTabs [data-zoom].is-active")?.dataset.zoom)===2
          && engageZoomSeen.size===3;

      // Explore: footer baru muncul setelah prediksi dikunci
      // dan hasil pengamatan/pembesaran total sudah dibuka.
      case 2:
        return document.querySelector(".explore-panel")?.dataset.exploreFinished==="true";

      // Explain: harus berada di Bandingkan DAN seluruh struktur sudah ditinjau.
      case 3: {
        const compareButtons=[...document.querySelectorAll("#compareButtons [data-compare]")];
        const allCompared=compareButtons.length>0 && compareButtons.every(b=>b.classList.contains("is-viewed"));
        return Number(document.querySelector("#cellExplainTabs [data-cell-page].is-active")?.dataset.cellPage)===3
          && explainPageSeen.size===4
          && allCompared;
      }

      // Elaborate: harus berada pada kasus terakhir DAN seluruh 5 kasus sudah selesai.
      case 4: {
        const caseTabs=[...document.querySelectorAll("#caseTabs [data-case]")];
        const active=caseTabs.find(b=>b.classList.contains("is-active"));
        const last=caseTabs.at(-1);
        const allDone=caseTabs.length>0 && caseTabs.every(b=>b.classList.contains("is-done"));
        return !!active && active===last && allDone;
      }

      // Evaluate: tampil hanya setelah hasil akhir evaluasi dibuka.
      case 5:
        return document.querySelector(".evaluate-panel")?.dataset.evaluationFinished==="true";

      // Reflect hanya mempunyai satu halaman.
      case 6:
        return true;

      default:
        return false;
    }
  }

  function updateBottomNavVisibility(){
    if(!bottomNav) return;
    const show=isTerminalInternalView();
    bottomNav.classList.toggle("is-context-hidden",!show);
    bottomNav.setAttribute("aria-hidden",show?"false":"true");
  }

  // Shared bridge for the module-specific interaction IIFE below.
  // Keeps the internal-view progress sets and contextual footer in one source of truth.
  window.CELL_MODULE_BRIDGE={
    engageZoomSeen,
    explainPageSeen,
    updateBottomNavVisibility
  };

  // Internal widgets change DOM state dynamically. Observe only stage panels,
  // then recalculate the footer without coupling navigation to every widget.
  const contextualNavObserver=new MutationObserver(()=>{
    updateBottomNavVisibility();
  });
  panels.forEach(panel=>{
    contextualNavObserver.observe(panel,{
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:["class","hidden","data-explore-finished","data-evaluation-finished"]
    });
  });

  function showStage(index, doScroll = true) {
    index = Math.max(0, Math.min(stageCount - 1, index));
    if (index > activeStage) {
      for (let step = activeStage; step < index; step++) {
        if (!completed.has(step)) {
          showToast("Tandai tahap sebelumnya selesai setelah menyelesaikan aktivitasnya.");
          return;
        }
      }
    }
    activeStage = index;

    panels.forEach((panel, i) => {
      panel.classList.toggle("is-active", i === activeStage);
    });

    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === activeStage);
      tab.classList.toggle("is-complete", completed.has(i));
    });

    prevButton.disabled = activeStage === 0;
    nextButton.disabled = activeStage === stageCount - 1 || !completed.has(activeStage);
    nextButton.style.opacity = nextButton.disabled ? ".45" : "1";

    completeButton.classList.toggle("is-complete", completed.has(activeStage));
    completeButton.textContent = completed.has(activeStage) ? "✓ Sudah selesai" : "Tandai selesai";

    keepActiveTabVisible(doScroll ? "smooth" : "auto");
    if (doScroll) {
      window.revealStageNav?.();
      scrollToStageMenu();
    }

    renderProgress();
    updateBottomNavVisibility();
    saveState();
  }

  function initMobileChrome() {
    const body = document.body;
    const nav = document.querySelector(".stage-nav");
    const header = document.querySelector(".app-header");
    if (!nav || !header) return;

    let lastY = window.scrollY;
    let hideTimer = 0;

    const clearTimer = () => {
      clearTimeout(hideTimer);
      hideTimer = 0;
    };

    const scheduleHide = () => {
      clearTimer();
      if (!isPhoneLayout()) return;
      const navTop = naturalDocumentTop(nav);
      if (window.scrollY <= Math.max(18, navTop - 4)) return;

      hideTimer = setTimeout(() => {
        if (isPhoneLayout()) body.classList.add("phone-stage-nav-hidden");
      }, 1800);
    };

    const revealStageNav = (hold = false) => {
      if (!isPhoneLayout()) return;
      body.classList.remove("phone-stage-nav-hidden");
      clearTimer();
      if (!hold) scheduleHide();
    };

    window.revealStageNav = revealStageNav;

    window.addEventListener("scroll", () => {
      if (!isPhoneLayout()) {
        clearTimer();
        body.classList.remove("phone-topbar-hidden", "phone-stage-nav-hidden");
        lastY = window.scrollY;
        return;
      }

      const y = window.scrollY;
      const dy = y - lastY;

      if (Math.abs(dy) > 1) revealStageNav();

      if (y < 24 || dy < -3) {
        body.classList.remove("phone-topbar-hidden");
      } else if (dy > 3 && y > 64) {
        body.classList.add("phone-topbar-hidden");
      }

      lastY = y;
    }, { passive: true });

    window.addEventListener("resize", () => {
      if (!isPhoneLayout()) {
        body.classList.remove("phone-topbar-hidden", "phone-stage-nav-hidden");
      } else {
        revealStageNav();
      }
    }, { passive: true });

    revealStageNav(true);
  }

  function initSwipeNavigation() {
    const root = document.querySelector(".app-shell");
    if (!root) return;

    const answerSelector = [
      ".choice",
      ".answer-list button",
      ".difficulty-option",
      "[data-confidence]"
    ].join(",");

    let sx = 0, sy = 0, startedAt = 0, blocked = false;
    let swipeOriginAnswer = null;
    let suppressClickTarget = null;
    let suppressClickUntil = 0;

    const answerTarget = target => target.closest?.(answerSelector) || null;

    const ignoreTarget = target => {
      if (answerTarget(target)) return false;
      return !!target.closest(
        "input,textarea,select,a,label,[contenteditable],.stage-nav,.bottom-nav,.mode-card,button,[data-swipe-lock],.swipe-lock"
      );
    };

    root.addEventListener("click", event => {
      if (!event.isTrusted || !suppressClickTarget || Date.now() > suppressClickUntil) return;
      const clicked = answerTarget(event.target);
      if (clicked && clicked === suppressClickTarget) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClickTarget = null;
        suppressClickUntil = 0;
      }
    }, true);

    root.addEventListener("touchstart", event => {
      if (!isPhoneLayout() || event.touches.length !== 1) return;

      swipeOriginAnswer = answerTarget(event.target);
      blocked = ignoreTarget(event.target);

      if (blocked) {
        swipeOriginAnswer = null;
        startedAt = 0;
        return;
      }

      sx = event.touches[0].clientX;
      sy = event.touches[0].clientY;
      startedAt = Date.now();
    }, { passive: true });

    root.addEventListener("touchend", event => {
      if (!isPhoneLayout() || blocked || !startedAt || !event.changedTouches.length) {
        blocked = false;
        startedAt = 0;
        swipeOriginAnswer = null;
        return;
      }

      const dx = event.changedTouches[0].clientX - sx;
      const dy = event.changedTouches[0].clientY - sy;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      const dt = Date.now() - startedAt;

      blocked = false;
      startedAt = 0;

      const isSwipe = dt <= 900 && ax >= 64 && ax >= ay * 1.35;
      if (!isSwipe) {
        swipeOriginAnswer = null;
        return;
      }

      if (swipeOriginAnswer) {
        suppressClickTarget = swipeOriginAnswer;
        suppressClickUntil = Date.now() + 650;
      }
      swipeOriginAnswer = null;

      if (dx < 0 && activeStage < stageCount - 1) {
        showStage(activeStage + 1);
      } else if (dx > 0 && activeStage > 0) {
        showStage(activeStage - 1);
      }
    }, { passive: true });

    root.addEventListener("touchcancel", () => {
      blocked = false;
      startedAt = 0;
      swipeOriginAnswer = null;
    }, { passive: true });
  }

  function renderProgress() {
    const count = completed.size;
    const percent = Math.round((count / stageCount) * 100);
    progressFill.style.width = percent + "%";
    progressText.textContent = count + " dari " + stageCount + " tahap • " + percent + "%";
  }

  function bindDemos() {
    document.querySelectorAll("[data-demo-feedback]").forEach(button => {
      button.addEventListener("click", () => {
        const feedback = button.nextElementSibling;
        if (feedback) feedback.hidden = !feedback.hidden;
      });
    });

    document.querySelectorAll(".choice").forEach(button => {
      button.addEventListener("click", () => {
        button.parentElement.querySelectorAll(".choice").forEach(item => {
          item.classList.remove("is-selected");
        });
        button.classList.add("is-selected");
        showToast(
          mode === "guru"
            ? "Prediksi tersimpan. Diskusikan alasannya sebelum membuka penjelasan."
            : "Prediksi tersimpan. Lanjutkan eksplorasi untuk mengujinya."
        );
      });
    });

    const slider = document.getElementById("demoSlider");
    const output = document.getElementById("demoOutput");
    slider?.addEventListener("input", () => {
      output.textContent = slider.value;
    });

    document.getElementById("strategyGrid")?.addEventListener("click", event => {
      const chip = event.target.closest(".strategy-chip");
      if (chip) chip.classList.toggle("is-selected");
    });

    document.querySelectorAll("[data-answer]").forEach(button => {
      button.addEventListener("click", () => {
        const feedback = document.getElementById("answerFeedback");
        feedback.hidden = false;

        if (mode === "guru") {
          feedback.textContent =
            "Respons tercatat. Minta alasan siswa sebelum memberi konsep final.";
        } else if (Number(button.dataset.answer) === 1) {
          feedback.textContent =
            "Contoh feedback elaboratif: jawaban tepat. Jelaskan juga mengapa pilihan lain tidak sesuai.";
        } else {
          feedback.textContent =
            "Contoh feedback elaboratif: belum tepat. Arahkan siswa kembali pada hubungan konsep, bukan hanya label benar/salah.";
        }
      });
    });

    document.querySelectorAll("[data-confidence]").forEach(button => {
      button.addEventListener("click", () => {
        button.parentElement.querySelectorAll("button").forEach(item => {
          item.classList.remove("is-selected");
        });
        button.classList.add("is-selected");
        state.confidence = Number(button.dataset.confidence);
        markFeedbackChanged();
        saveState();
      });
    });

    document.querySelectorAll("[data-reflection]").forEach(field => {
      field.addEventListener("input", () => {
        state.reflections = state.reflections || {};
        state.reflections[field.dataset.reflection] = field.value;
        markFeedbackChanged();
        saveState();
      });
    });

    document.getElementById("resetProgress").addEventListener("click", () => {
      if (!confirm("Reset seluruh progres, jawaban, identitas, dan refleksi modul Sel ini?")) return;

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) localStorage.removeItem(key);
      });

      const url = new URL(location.href);
      url.searchParams.set("_reset", Date.now().toString());
      location.replace(url.toString());
    });
  }

  function bindFeedbackForm() {
    const nameField = document.getElementById("studentName");
    const classField = document.getElementById("studentClass");
    const sendButton = document.getElementById("sendFeedback");

    [nameField, classField].forEach(field => {
      field?.addEventListener("input", () => {
        state.identity = state.identity || {};
        state.identity[field.id === "studentName" ? "name" : "className"] = field.value.trim();
        markFeedbackChanged();
        saveState();
      });
    });

    document.getElementById("difficultyGrid")?.addEventListener("change", () => {
      state.difficulties = getSelectedDifficulties();
      markFeedbackChanged();
      saveState();
    });

    sendButton?.addEventListener("click", sendFeedback);
  }

  async function sendFeedback() {
    const endpoint = (config.feedbackEndpoint || "").trim();
    const snapshot = buildFeedbackSnapshot();
    const fingerprint = JSON.stringify(snapshot);

    if (!snapshot.studentName || !snapshot.className) {
      showToast("Isi nama/nomor absen dan kelas terlebih dahulu.");
      showStage(0);
      return;
    }

    if (!snapshot.confused && snapshot.difficulties.length === 0 && !snapshot.confidence) {
      showToast("Isi minimal satu bagian refleksi sebelum mengirim.");
      return;
    }

    if (!endpoint) {
      showToast("Google Sheets belum terhubung. Refleksi tetap tersimpan di perangkat.");
      return;
    }

    if (state.lastSentFingerprint && state.lastSentFingerprint === fingerprint) {
      showToast("Tidak ada perubahan sejak pengiriman terakhir.");
      refreshSendState();
      return;
    }

    let submissionId;
    if (state.pendingFingerprint === fingerprint && state.pendingSubmissionId) {
      submissionId = state.pendingSubmissionId;
    } else {
      submissionId = makeId();
      state.pendingSubmissionId = submissionId;
      state.pendingFingerprint = fingerprint;
      saveState();
    }

    const payload = {
      timestampClient: new Date().toISOString(),
      studentName: snapshot.studentName,
      className: snapshot.className,
      materialId: config.materialId || "",
      materialTitle: config.materialTitle || "",
      mode: snapshot.mode,
      understood: snapshot.understood,
      confused: snapshot.confused,
      difficulties: snapshot.difficulties.join(", "),
      confidence: confidenceLabel(snapshot.confidence),
      completedStages: String(snapshot.completedStages),
      totalStages: String(stageCount),
      submissionId,
      sessionId: state.sessionId,
      templateVersion: config.templateVersion || ""
    };

    setSendUi("sending");

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(payload)
      });

      const confirmed = await verifySubmission(endpoint, submissionId);

      if (!confirmed) {
        setSendUi("unverified");
        showToast("Data terkirim dari browser, tetapi belum dapat diverifikasi di Sheet. Coba kirim ulang.");
        return;
      }

      state.lastSentFingerprint = fingerprint;
      state.lastSentAt = new Date().toISOString();
      state.lastSubmissionId = submissionId;
      state.pendingSubmissionId = "";
      state.pendingFingerprint = "";
      saveState();

      setSendUi("confirmed");
      showToast("Refleksi terverifikasi masuk ke Google Sheet.");
    } catch (error) {
      setSendUi("error");
      showToast("Pengiriman gagal. Data lokal tetap aman; coba lagi.");
    }
  }

  function buildFeedbackSnapshot() {
    return {
      studentName: document.getElementById("studentName")?.value.trim() || "",
      className: document.getElementById("studentClass")?.value.trim() || "",
      mode,
      understood: state.reflections?.understood?.trim() || "",
      confused: state.reflections?.confused?.trim() || "",
      difficulties: getSelectedDifficulties().slice().sort(),
      confidence: Number(state.confidence || 0),
      completedStages: completed.size
    };
  }

  function markFeedbackChanged() {
    refreshSendState();
  }

  function refreshSendState() {
    const button = document.getElementById("sendFeedback");
    const status = document.getElementById("sendStatus");
    if (!button || !status) return;

    const endpointReady = Boolean((config.feedbackEndpoint || "").trim());
    const fingerprint = JSON.stringify(buildFeedbackSnapshot());
    const unchanged = Boolean(
      state.lastSentFingerprint && state.lastSentFingerprint === fingerprint
    );

    status.className = "send-status";

    if (!endpointReady) {
      button.disabled = true;
      status.textContent = "Google Sheets belum terhubung.";
      return;
    }

    if (unchanged) {
      button.disabled = true;
      status.classList.add("is-confirmed");
      status.textContent = "✓ Terkirim " + formatLocalTime(state.lastSentAt) + " • tidak ada perubahan.";
      return;
    }

    button.disabled = false;

    if (state.lastSentAt) {
      status.textContent = "Ada perubahan setelah pengiriman " + formatLocalTime(state.lastSentAt) + ".";
    } else {
      status.textContent = "Belum pernah dikirim.";
    }
  }

  function setSendUi(statusName) {
    const button = document.getElementById("sendFeedback");
    const status = document.getElementById("sendStatus");
    if (!button || !status) return;

    status.className = "send-status";

    if (statusName === "sending") {
      button.disabled = true;
      button.classList.add("is-sending");
      button.textContent = "Mengirim...";
      status.classList.add("is-pending");
      status.textContent = "Mengirim dan memverifikasi...";
      return;
    }

    button.classList.remove("is-sending");
    button.textContent = "Kirim Refleksi";

    if (statusName === "confirmed") {
      status.classList.add("is-confirmed");
      status.textContent = "✓ Terverifikasi masuk ke Google Sheet " + formatLocalTime(state.lastSentAt) + ".";
      button.disabled = true;
    } else if (statusName === "unverified") {
      status.classList.add("is-pending");
      status.textContent = "Belum terverifikasi. Tekan Kirim Refleksi untuk mencoba ulang.";
      button.disabled = false;
    } else if (statusName === "error") {
      status.classList.add("is-error");
      status.textContent = "Gagal mengirim. Data refleksi tetap tersimpan di perangkat.";
      button.disabled = false;
    } else {
      refreshSendState();
    }
  }

  async function verifySubmission(endpoint, submissionId) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await delay(700);
      const found = await jsonpStatus(endpoint, submissionId, 5000);
      if (found) return true;
    }
    return false;
  }

  function jsonpStatus(endpoint, submissionId, timeoutMs) {
    return new Promise(resolve => {
      const callbackName = "__ipaAck_" + makeId().replace(/[^a-zA-Z0-9_$]/g, "");
      const script = document.createElement("script");
      let done = false;

      const cleanup = result => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        delete window[callbackName];
        script.remove();
        resolve(Boolean(result));
      };

      window[callbackName] = data => {
        cleanup(data && data.ok === true && data.found === true);
      };

      const separator = endpoint.includes("?") ? "&" : "?";
      script.src =
        endpoint +
        separator +
        "action=status&submissionId=" +
        encodeURIComponent(submissionId) +
        "&callback=" +
        encodeURIComponent(callbackName) +
        "&_=" +
        Date.now();

      script.onerror = () => cleanup(false);
      document.head.appendChild(script);

      const timer = setTimeout(() => cleanup(false), timeoutMs);
    });
  }

  function getSelectedDifficulties() {
    return [...document.querySelectorAll("[data-difficulty]:checked")]
      .map(input => input.dataset.difficulty);
  }

  function confidenceLabel(value) {
    if (value === 1) return "Perlu bantuan";
    if (value === 2) return "Cukup paham";
    if (value === 3) return "Sudah yakin";
    return "";
  }

  function restoreIdentity() {
    const identity = state.identity || {};
    const nameField = document.getElementById("studentName");
    const classField = document.getElementById("studentClass");
    if (nameField) nameField.value = identity.name || "";
    if (classField) classField.value = identity.className || "";
  }

  function restoreDifficulty() {
    const selected = new Set(state.difficulties || []);
    document.querySelectorAll("[data-difficulty]").forEach(input => {
      input.checked = selected.has(input.dataset.difficulty);
    });
  }

  function updateFeedbackConnectionState() {
    const note = document.getElementById("feedbackConnectionNote");
    if (!note) return;

    note.textContent = (config.feedbackEndpoint || "").trim()
      ? "Refleksi dikirim ke Google Sheet guru dan diverifikasi dengan Submission ID."
      : "Refleksi masih tersimpan lokal sampai koneksi Google Sheets diaktifkan.";
  }

  function restoreReflections() {
    const saved = state.reflections || {};
    document.querySelectorAll("[data-reflection]").forEach(field => {
      field.value = saved[field.dataset.reflection] || "";
    });

    if (state.confidence) {
      document.querySelector(
        '[data-confidence="' + state.confidence + '"]'
      )?.classList.add("is-selected");
    }
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveState() {
    state.activeStage = activeStage;
    state.completed = [...completed];
    state.mode = mode;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2) +
      "-" +
      Math.random().toString(36).slice(2)
    );
  }

  function formatLocalTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }
})();

/* =========================================================
   INTERAKSI KHUSUS MODUL SEL
   ========================================================= */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const all = (s, root=document) => [...root.querySelectorAll(s)];

  const activityStorageKey="ipa-interaktif:kelas-8-sel:activities:v1";
  let activitySave={};
  try { activitySave=JSON.parse(localStorage.getItem(activityStorageKey)||"{}")||{}; }
  catch { activitySave={}; }
  function rememberActivity(key,value){
    activitySave[key]=value;
    try { localStorage.setItem(activityStorageKey,JSON.stringify(activitySave)); }
    catch (error) { console.warn("Progres aktivitas belum dapat disimpan",error); }
  }

  const moduleBridge=window.CELL_MODULE_BRIDGE||{};
  const engageZoomSeen=moduleBridge.engageZoomSeen||new Set([0]);
  const explainPageSeen=moduleBridge.explainPageSeen||new Set([0]);
  const updateBottomNavVisibility=
    typeof moduleBridge.updateBottomNavVisibility==="function"
      ? moduleBridge.updateBottomNavVisibility
      : ()=>{};

  function setSelected(root, target){
    all("button", root).forEach(b=>b.classList.toggle("is-selected", b===target));
  }

  // ---------- ORIENTASI: cek prasyarat ringkas, tanpa membocorkan fenomena Engage ----------
  const lifeItems=[
    {scenario:"Biji kacang tumbuh menjadi kecambah yang semakin tinggi.",answer:"Tumbuh dan berkembang",distract:["Bergerak","Berkembang biak"]},
    {scenario:"Daun putri malu menutup setelah disentuh.",answer:"Peka terhadap rangsangan",distract:["Bernapas","Mengeluarkan zat sisa"]},
    {scenario:"Seekor burung memakan biji untuk memperoleh zat makanan dan energi.",answer:"Memerlukan nutrisi",distract:["Berkembang biak","Mengeluarkan zat sisa"]}
  ];
  const savedLife=activitySave.life||{};
  let lifeIndex=Number.isInteger(savedLife.index)&&savedLife.index>=0&&savedLife.index<lifeItems.length?savedLife.index:0;
  let lifeChoice="",lifeDone=savedLife.done===true;
  function saveLife(){rememberActivity("life",{index:lifeIndex,done:lifeDone});}
  function renderLife(){
    const item=lifeItems[lifeIndex];
    $("#lifeProgress").textContent=lifeDone?lifeItems.length+" / "+lifeItems.length+" ✓":(lifeIndex+1)+" / "+lifeItems.length;
    $("#lifeScenario").textContent=lifeDone?"Kamu sudah meninjau tiga ciri makhluk hidup. Sekarang, amati penyusun daun pada tahap Engage.":item.scenario;
    const opts=[item.answer,...item.distract].sort((a,b)=>a.localeCompare(b));
    $("#lifeOptions").innerHTML=lifeDone?"":opts.map(x=>'<button type="button" data-life="'+x+'">'+x+'</button>').join("");
    lifeChoice="";
    $("#lifeFeedback").className="module-feedback "+(lifeDone?"good":"neutral");
    $("#lifeFeedback").textContent=lifeDone?"Prasyarat selesai. Lanjutkan dengan mengamati fenomena.":"Pilih satu jawaban, kemudian periksa.";
    $("#lifeAttempt").textContent=lifeDone?"Tiga situasi telah ditinjau.":"Tentukan ciri yang paling sesuai.";
    $("#checkLife").hidden=lifeDone;
    $("#checkLife").disabled=lifeDone;
    $("#nextLife").hidden=true;
    updateBottomNavVisibility();
  }
  $("#lifeOptions")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-life]");
    if(!b||$("#checkLife").disabled)return;
    lifeChoice=b.dataset.life;
    setSelected($("#lifeOptions"),b);
  });
  $("#checkLife")?.addEventListener("click",()=>{
    if(!lifeChoice){$("#lifeFeedback").textContent="Pilih satu jawaban terlebih dahulu.";return;}
    const good=lifeChoice===lifeItems[lifeIndex].answer;
    $("#lifeFeedback").className="module-feedback "+(good?"good":"warn");
    $("#lifeFeedback").textContent=(good?"Sesuai. ":"Periksa kembali cirinya. ")+
      "Jawaban yang tepat: "+lifeItems[lifeIndex].answer+".";
    $("#checkLife").disabled=true;
    all("#lifeOptions button").forEach(b=>b.disabled=true);
    $("#nextLife").hidden=false;
    $("#nextLife").textContent=lifeIndex===lifeItems.length-1?"Selesai mengamati →":"Situasi berikutnya →";
  });
  $("#nextLife")?.addEventListener("click",()=>{
    if(lifeIndex<lifeItems.length-1){lifeIndex++;saveLife();renderLife();}
    else {lifeDone=true;saveLife();renderLife();}
  });
  renderLife();

  // ---------- ENGAGE: amati fenomena, simpan prediksi serta alasan ----------
  const savedEngage=activitySave.engage||{};
  let zoomIndex=Number.isInteger(savedEngage.zoom)&&savedEngage.zoom>=0&&savedEngage.zoom<=2?savedEngage.zoom:0;
  let maxZoomUnlocked=Number.isInteger(savedEngage.max)&&savedEngage.max>=0&&savedEngage.max<=2?savedEngage.max:0;
  let engageChoice=["kosong","bagian","daun"].includes(savedEngage.choice)?savedEngage.choice:"";
  let engageLocked=savedEngage.locked===true&&!!engageChoice&&typeof savedEngage.reason==="string"&&savedEngage.reason.trim().length>=12;
  if(!engageLocked)zoomIndex=Math.min(zoomIndex,1);
  if(zoomIndex>maxZoomUnlocked)maxZoomUnlocked=zoomIndex;
  $("#engageReason").value=typeof savedEngage.reason==="string"?savedEngage.reason.slice(0,300):"";
  function saveEngage(){rememberActivity("engage",{zoom:zoomIndex,max:maxZoomUnlocked,choice:engageChoice,locked:engageLocked,reason:$("#engageReason").value});}
  function renderZoom(){
    engageZoomSeen.add(zoomIndex);
    all("[data-zoom-panel]").forEach(p=>{p.hidden=Number(p.dataset.zoomPanel)!==zoomIndex;});
    all("#zoomTabs [data-zoom]").forEach(btn=>{
      const i=Number(btn.dataset.zoom),unlocked=i<=maxZoomUnlocked;
      btn.disabled=!unlocked;
      btn.classList.toggle("is-unlocked",unlocked);
      btn.classList.toggle("is-active",i===zoomIndex);
    });
    $("#zoomPrev").hidden=zoomIndex===0;
    if(zoomIndex===0){
      $("#zoomGuide").textContent="Apa yang mungkin terlihat jika daun diperbesar?";
      $("#zoomNext").hidden=false;
      $("#zoomNext").textContent="Perbesar daun →";
      $("#engageQuestion").hidden=true;
    }else if(zoomIndex===1){
      $("#zoomGuide").textContent=engageLocked?"Prediksi tersimpan. Buka pengamatan sel.":"Amati unit kecil, lalu tulis dugaan dan alasannya.";
      $("#engageQuestion").hidden=false;
      $("#zoomNext").hidden=!engageLocked;
      $("#zoomNext").textContent="Perbesar salah satu unit →";
    }else{
      $("#zoomGuide").textContent="Bandingkan pengamatan dengan prediksi dan alasan awalmu.";
      $("#zoomNext").hidden=true;
      $("#engageQuestion").hidden=false;
    }
    $("#engageReason").readOnly=engageLocked;
    $("#lockEngage").disabled=engageLocked;
    all("#engageOptions button").forEach(b=>{
      b.disabled=engageLocked;
      b.classList.toggle("is-selected",b.dataset.engage===engageChoice);
    });
    if(engageLocked){
      $("#engageFeedback").className="module-feedback neutral";
      $("#engageFeedback").textContent=zoomIndex===2
        ?"Model sel menunjukkan beberapa bagian di dalamnya. Bandingkan dengan alasan yang kamu tulis."
        :"Prediksi dan alasan tersimpan. Buka hasil pengamatan untuk membandingkannya.";
    }
    saveEngage();
    updateBottomNavVisibility();
  }
  $("#zoomNext")?.addEventListener("click",()=>{
    if(zoomIndex===0){zoomIndex=1;maxZoomUnlocked=Math.max(maxZoomUnlocked,1);renderZoom();}
    else if(zoomIndex===1&&engageLocked){zoomIndex=2;maxZoomUnlocked=2;renderZoom();}
  });
  $("#zoomPrev")?.addEventListener("click",()=>{if(zoomIndex>0){zoomIndex--;renderZoom();}});
  $("#zoomTabs")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-zoom]");if(!b||b.disabled)return;
    const target=Number(b.dataset.zoom);if(target===2&&!engageLocked)return;
    zoomIndex=target;renderZoom();
  });
  $("#engageOptions")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-engage]");if(!b||engageLocked)return;
    engageChoice=b.dataset.engage;setSelected($("#engageOptions"),b);saveEngage();
  });
  $("#engageReason")?.addEventListener("input",saveEngage);
  $("#lockEngage")?.addEventListener("click",()=>{
    if(!engageChoice||$("#engageReason").value.trim().length<12){
      $("#engageFeedback").className="module-feedback warn";
      $("#engageFeedback").textContent="Pilih satu prediksi dan tulis alasan minimal 12 karakter.";
      return;
    }
    engageLocked=true;renderZoom();
  });
  renderZoom();

  // ---------- EXPLORE: POE mikroskop ----------
  const savedMicro=activitySave.microscope||{};
  let objective=[4,10,40].includes(savedMicro.objective)?savedMicro.objective:4;
  let magChoice="", predictionLocked=savedMicro.locked===true;
  const microSeen=new Set(Array.isArray(savedMicro.seen)?savedMicro.seen.filter(v=>[4,10,40].includes(v)):[]);
  let microConclusionSaved=predictionLocked&&microSeen.size===3&&savedMicro.concluded===true
    &&typeof savedMicro.text==="string"&&savedMicro.text.trim().length>=25;
  $("#microConclusion").value=typeof savedMicro.text==="string"?savedMicro.text.slice(0,450):"";
  function saveMicro(){rememberActivity("microscope",{objective,locked:predictionLocked,seen:[...microSeen],concluded:microConclusionSaved,text:$("#microConclusion").value});}
  function refreshMicroInquiry(){
    $("#microscopeView").hidden=!predictionLocked;
    $("#scopeLockedNotice").hidden=predictionLocked;
    $("#observedObjectives").textContent="Sudah diamati: "+microSeen.size+" dari 3 objektif (4×, 10×, 40×).";
    $("#microAnalysis").hidden=!predictionLocked||microSeen.size!==3;
    $("#poeExplain").hidden=!microConclusionSaved;
    $("#saveMicroAnalysis").disabled=microConclusionSaved;
    $("#microConclusion").readOnly=microConclusionSaved;
    if(microConclusionSaved){
      $("#microAnalysisFeedback").className="module-feedback good";
      $("#microAnalysisFeedback").textContent="Kesimpulan tersimpan. Bandingkan penjelasanmu dengan konsep di bawah.";
    }
    if(explorePanel)explorePanel.dataset.exploreFinished=String(microConclusionSaved&&microSeen.size===3);
    saveMicro();
    updateBottomNavVisibility();
  }
  const explorePanel=document.querySelector(".explore-panel");
  if(explorePanel) explorePanel.dataset.exploreFinished="false";
  const ocular=()=>10;
  const total=()=>ocular()*objective;

  const microPhotos={
    4:{
      src:"assets/mikro-40x.webp",
      total:40,
      alt:"Preparat epidermis bawang pada pembesaran total 40 kali",
      note:"Okuler 10× × objektif 4× = 40×. Bidang pandang paling luas; lebih banyak bagian jaringan terlihat.",
      observation:"Objektif 4×: bidang pandang paling luas sehingga banyak bagian jaringan terlihat sekaligus."
    },
    10:{
      src:"assets/mikro-100x.webp",
      total:100,
      alt:"Preparat epidermis bawang pada pembesaran total 100 kali",
      note:"Okuler 10× × objektif 10× = 100×. Sel tampak lebih besar dan bidang pandang lebih sempit.",
      observation:"Objektif 10×: sel tampak lebih besar dan area jaringan yang terlihat lebih sedikit dibanding objektif 4×."
    },
    40:{
      src:"assets/mikro-400x.webp",
      total:400,
      alt:"Preparat epidermis bawang pada pembesaran total 400 kali",
      note:"Okuler 10× × objektif 40× = 400×. Detail tampak lebih besar dengan bidang pandang paling sempit.",
      observation:"Objektif 40×: detail struktur tampak jauh lebih besar, tetapi bidang pandang paling sempit."
    }
  };

  // Preload all three photographs to reduce flashing between objectives.
  Object.values(microPhotos).forEach(item=>{
    const img=new Image();
    img.src=item.src;
  });

  function buildMagOptions(){
    const sets={
      4:[20,40,80,400],
      10:[20,100,110,1000],
      40:[50,100,400,4000]
    };
    const candidates=sets[objective]||[total(),100,400,1000];
    $("#magnificationOptions").innerHTML=candidates
      .map(v=>'<button type="button" data-mag="'+v+'">'+v+'×</button>')
      .join("");
    magChoice="";
  }

  function setScopePhoto(nextObjective, animate=true){
    const item=microPhotos[nextObjective];
    const img=$("#scopeImage");
    if(!item||!img) return;

    $("#scopeField").dataset.level=String(nextObjective);
    if($("#objectiveReadout")) $("#objectiveReadout").textContent="Objektif "+nextObjective+"×";
    if($("#scopePhotoNote")) $("#scopePhotoNote").textContent=item.note;

    document.querySelectorAll(".fov-steps [data-fov]").forEach(el=>{
      el.classList.toggle("is-active",Number(el.dataset.fov)===nextObjective);
    });

    const applyNewPhoto=()=>{
      img.alt=item.alt;
      img.src=item.src;

      const finish=()=>{
        applyPhotoPan();
        img.classList.remove("is-switching");
        img.classList.remove("is-arriving");
        void img.offsetWidth;
        img.classList.add("is-arriving");
        setTimeout(()=>img.classList.remove("is-arriving"),380);
      };

      if(img.complete) finish();
      else img.addEventListener("load",finish,{once:true});
    };

    if(!animate){
      img.src=item.src;
      img.alt=item.alt;
      applyPhotoPan();
      return;
    }

    img.classList.add("is-switching");
    setTimeout(applyNewPhoto,170);
  }

  function syncObjectiveVisual(animate=false){
    $("#objectiveValue").textContent=objective+"×";
    document.querySelectorAll("#objectiveButtons button").forEach(btn=>{
      btn.classList.toggle("is-active",Number(btn.dataset.objective)===objective);
    });
    setScopePhoto(objective,animate);
  }

  function updateLensPreview(animate=false){
    $("#ocularValue").textContent="10×";
    syncObjectiveVisual(animate);

    if(!predictionLocked){
      $("#totalHidden").textContent="?";
      $("#totalMagnification").textContent="Belum dibuka";
      $("#fieldObservation").textContent="Kunci prediksi untuk membuka hasil pembesaran total.";
      buildMagOptions();
    }else{
      revealMicroscope(false);
    }
  }

  function revealMicroscope(animate=false){
    const item=microPhotos[objective];
    if(predictionLocked)microSeen.add(objective);
    syncObjectiveVisual(animate);

    $("#totalHidden").textContent=item.total+"×";
    $("#totalMagnification").textContent=item.total+"×";
    $("#fieldObservation").textContent=item.observation;
    $("#microscopeModeBadge").textContent=microConclusionSaved?"PREDICT → OBSERVE → EXPLAIN":"OBSERVE";
    refreshMicroInquiry();
  }


  // Drag foto preparat di dalam bidang pandang.
  let photoPanX=0, photoPanY=0;
  let photoDragging=false;
  let photoStartX=0, photoStartY=0, photoOriginX=0, photoOriginY=0;

  function photoPanLimits(){
    const field=$("#scopeField");
    if(!field) return {x:0,y:0};
    // Foto diperbesar 1.24x, sehingga sekitar 12% ukuran bidang tersedia
    // untuk digeser ke setiap arah tanpa membuka area kosong.
    return {
      x:Math.max(0,field.clientWidth*0.12),
      y:Math.max(0,field.clientHeight*0.12)
    };
  }

  function applyPhotoPan(){
    const img=$("#scopeImage");
    if(!img) return;
    const lim=photoPanLimits();
    photoPanX=Math.max(-lim.x,Math.min(lim.x,photoPanX));
    photoPanY=Math.max(-lim.y,Math.min(lim.y,photoPanY));
    img.style.setProperty("--pan-x",photoPanX+"px");
    img.style.setProperty("--pan-y",photoPanY+"px");
  }

  function recenterPhotoScope(){
    photoPanX=0;
    photoPanY=0;
    applyPhotoPan();
  }

  $("#scopeField")?.addEventListener("touchstart",e=>{
    e.stopPropagation();
  },{passive:true});

  $("#scopeField")?.addEventListener("touchend",e=>{
    e.stopPropagation();
  },{passive:true});

  $("#scopeField")?.addEventListener("touchcancel",e=>{
    e.stopPropagation();
  },{passive:true});

  $("#scopeField")?.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse" && e.button!==0) return;
    photoDragging=true;
    photoStartX=e.clientX;
    photoStartY=e.clientY;
    photoOriginX=photoPanX;
    photoOriginY=photoPanY;
    $("#scopeField").classList.add("is-dragging");
    $("#scopeField").setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });

  $("#scopeField")?.addEventListener("pointermove",e=>{
    if(!photoDragging) return;
    photoPanX=photoOriginX+(e.clientX-photoStartX);
    photoPanY=photoOriginY+(e.clientY-photoStartY);
    applyPhotoPan();
    e.preventDefault();
  });

  function stopPhotoDrag(e){
    if(!photoDragging) return;
    photoDragging=false;
    $("#scopeField")?.classList.remove("is-dragging");
    try{$("#scopeField")?.releasePointerCapture?.(e.pointerId)}catch(_){}
  }

  $("#scopeField")?.addEventListener("pointerup",stopPhotoDrag);
  $("#scopeField")?.addEventListener("pointercancel",stopPhotoDrag);
  $("#scopeField")?.addEventListener("lostpointercapture",()=>{
    photoDragging=false;
    $("#scopeField")?.classList.remove("is-dragging");
  });
  $("#recenterPhotoScope")?.addEventListener("click",recenterPhotoScope);
  window.addEventListener("resize",applyPhotoPan);

  $("#objectiveButtons")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-objective]");
    if(!b) return;

    const next=Number(b.dataset.objective);
    if(next===objective) return;

    objective=next;
    magChoice="";
    recenterPhotoScope();
    updateLensPreview(true);
  });

  $("#magnificationOptions")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-mag]");
    if(!b||predictionLocked) return;
    magChoice=Number(b.dataset.mag);
    setSelected($("#magnificationOptions"),b);
  });

  $("#lockMagnification")?.addEventListener("click",()=>{
    if(predictionLocked)return;
    if(!magChoice){
      $("#magnificationFeedback").textContent="Pilih hasil pembesaran total terlebih dahulu.";
      return;
    }

    const t=total(), good=magChoice===t;
    predictionLocked=true;

    $("#magnificationFeedback").className="module-feedback "+(good?"good":"warn");
    $("#magnificationFeedback").innerHTML=good
      ? "<b>Prediksi tepat.</b> "+ocular()+"× × "+objective+"× = <b>"+t+"×</b>. Sekarang bandingkan ketiga objektif."
      : "<b>Prediksi belum tepat.</b> Pembesaran totalnya <b>"+ocular()+"× × "+objective+"× = "+t+"×</b>.";

    $("#lockMagnification").disabled=true;
    all("#magnificationOptions button").forEach(b=>b.disabled=true);
    revealMicroscope(false);
    updateBottomNavVisibility();
  });

  $("#microConclusion")?.addEventListener("input",()=>{
    if(microConclusionSaved)return;
    saveMicro();
  });
  $("#saveMicroAnalysis")?.addEventListener("click",()=>{
    if(microSeen.size!==3){return;}
    if($("#microConclusion").value.trim().length<25){
      $("#microAnalysisFeedback").className="module-feedback warn";
      $("#microAnalysisFeedback").textContent="Tuliskan hasil perbandingan dan alasanmu minimal 25 karakter.";
      return;
    }
    microConclusionSaved=true;
    refreshMicroInquiry();
  });
  buildMagOptions();
  updateLensPreview(false);
  $("#lockMagnification").disabled=predictionLocked;
  if(predictionLocked){
    $("#magnificationOptions").innerHTML="";
    $("#magnificationFeedback").className="module-feedback neutral";
    $("#magnificationFeedback").textContent="Prediksi telah dikunci. Bandingkan foto dengan memilih ketiga objektif.";
    revealMicroscope(false);
  }

  // ---------- EXPLAIN tabs ----------
  const savedExplain=activitySave.explain||{};
  if(Array.isArray(savedExplain.pages))savedExplain.pages.filter(i=>Number.isInteger(i)&&i>=0&&i<4).forEach(i=>explainPageSeen.add(i));
  function saveExplain(){
    rememberActivity("explain",{
      pages:[...explainPageSeen],
      animal:[...seenAnimal],
      plant:[...seenPlant],
      compare:[...compareSeen]
    });
  }
  all("#cellExplainTabs [data-cell-page]").forEach(btn=>btn.addEventListener("click",()=>{
    const i=Number(btn.dataset.cellPage);
    explainPageSeen.add(i);
    saveExplain();
    all("#cellExplainTabs button").forEach(b=>b.classList.toggle("is-active",b===btn));
    all("[data-cell-content]").forEach(p=>p.classList.toggle("is-active",Number(p.dataset.cellContent)===i));
    updateBottomNavVisibility();
  }));

  const organelles = {
    nucleus:{
      name:"Nukleus",
      function:"Mengatur kegiatan sel dan menyimpan DNA, yaitu informasi sifat makhluk hidup.",
      impact:"Pengaturan kegiatan sel dan penyimpanan informasi genetik dapat terganggu."
    },
    nucleolus:{
      name:"Nukleolus",
      function:"Membantu membentuk ribosom di dalam nukleus.",
      impact:"Pembentukan ribosom dapat terganggu."
    },
    er:{
      name:"Retikulum endoplasma",
      function:"RE kasar membantu membuat protein; RE halus membantu membuat lemak.",
      impact:"Pembuatan dan pemindahan zat tertentu di dalam sel dapat terganggu."
    },
    golgi:{
      name:"Badan Golgi",
      function:"Mengemas dan mengirim protein ke bagian sel yang membutuhkannya.",
      impact:"Pengemasan dan pengiriman zat di dalam sel dapat terganggu."
    },
    mitochondria:{
      name:"Mitokondria",
      function:"Tempat respirasi seluler yang menyediakan energi bagi kegiatan sel.",
      impact:"Sel dapat kekurangan energi untuk menjalankan kegiatannya."
    },
    lysosome:{
      name:"Lisosom",
      function:"Menguraikan zat dan bagian sel yang rusak dengan bantuan enzim.",
      impact:"Zat dan bagian sel yang seharusnya diuraikan dapat menumpuk."
    },
    ribosome:{
      name:"Ribosom",
      function:"Membuat protein yang dibutuhkan sel.",
      impact:"Pembuatan protein yang dibutuhkan sel dapat terganggu."
    },
    membrane:{
      name:"Membran sel",
      function:"Membatasi sel dan mengatur zat yang masuk serta keluar.",
      impact:"Keluar-masuknya zat antara sel dan lingkungannya dapat terganggu."
    },
    wall:{
      name:"Dinding sel",
      function:"Melindungi sel tumbuhan serta membantu mempertahankan bentuk dan kekuatannya.",
      impact:"Sel tumbuhan lebih mudah kehilangan bentuk dan kekuatannya."
    },
    cytoplasm:{
      name:"Sitoplasma",
      function:"Cairan tempat organel berada dan berbagai reaksi sel berlangsung.",
      impact:"Berbagai proses yang berlangsung di dalam sel dapat terganggu."
    },
    vacuole:{
      name:"Vakuola",
      function:"Menyimpan air dan membantu sel tumbuhan tetap tegang.",
      impact:"Sel tumbuhan dapat kehilangan kekakuannya ketika kandungan air berkurang."
    },
    chloroplast:{
      name:"Kloroplas",
      function:"Tempat fotosintesis, yaitu proses membuat makanan dengan bantuan cahaya.",
      impact:"Kemampuan sel tumbuhan membuat makanan melalui fotosintesis dapat terganggu."
    }
  };

  const savedAnimal=Array.isArray(savedExplain.animal)?savedExplain.animal.filter(k=>["nucleus","nucleolus","er","ribosome","golgi","mitochondria","lysosome","cytoplasm","membrane"].includes(k)):[];
  const savedPlant=Array.isArray(savedExplain.plant)?savedExplain.plant.filter(k=>["nucleus","nucleolus","er","ribosome","golgi","chloroplast","vacuole","cytoplasm","membrane","wall","mitochondria"].includes(k)):[];
  const seenAnimal=new Set(savedAnimal), seenPlant=new Set(savedPlant);
  $("#animalSeen").textContent=seenAnimal.size+" / 9 dikenali";
  $("#plantSeen").textContent=seenPlant.size+" / 11 dikenali";
  all(".animal-hotspots [data-organelle]").forEach(b=>b.classList.toggle("is-viewed",seenAnimal.has(b.dataset.organelle)));
  all(".plant-hotspots [data-organelle]").forEach(b=>b.classList.toggle("is-viewed",seenPlant.has(b.dataset.organelle)));
  function showOrganelle(kind,key,button){
    const data=organelles[key]; if(!data)return;
    const info=kind==="animal"?$("#animalOrganelleInfo"):$("#plantOrganelleInfo");
    const wrap=button.closest(".cell-model-wrap");
    all(".organelle-hotspots button",wrap).forEach(b=>b.classList.toggle("is-active",b===button));
    all(".organelle-shape",wrap).forEach(s=>s.classList.toggle("is-active",s.dataset.orgShape===key));
    const hotspotLabel=button.querySelector(":scope > span:not(.hotspot-coordinate-tag)")?.textContent?.trim()||"";
    info.innerHTML='<span class="organelle-number">'+hotspotLabel+'</span><h3>'+data.name+'</h3><div class="organelle-facts"><div><span>FUNGSI UTAMA</span><strong>'+data.function+'</strong></div><div><span>JIKA TERGANGGU</span><strong>'+data.impact+'</strong></div></div>';
    const seen=kind==="animal"?seenAnimal:seenPlant;
    seen.add(key);
    button.classList.add("is-viewed");
    saveExplain();
    updateBottomNavVisibility();
    (kind==="animal"?$("#animalSeen"):$("#plantSeen")).textContent=seen.size+" / "+(kind==="animal"?9:11)+" dikenali";
  }
  all(".animal-hotspots [data-organelle]").forEach(b=>b.addEventListener("click",()=>showOrganelle("animal",b.dataset.organelle,b)));
  all(".plant-hotspots [data-organelle]").forEach(b=>b.addEventListener("click",()=>showOrganelle("plant",b.dataset.organelle,b)));


  // ---------- Compare ----------
  const compareItems=[
    ["membrane","Membran sel","both"],["nucleus","Nukleus","both"],["mitochondria","Mitokondria","both"],
    ["ribosome","Ribosom","both"],["golgi","Badan Golgi","both"],["wall","Dinding sel","plant"],
    ["chloroplast","Kloroplas","plant"],["vacuole","Vakuola besar","plant"],["lysosome","Lisosom","animal"]
  ];
  const compareSeen=new Set(Array.isArray(savedExplain.compare)?savedExplain.compare.filter(k=>compareItems.some(item=>item[0]===k)):[]);
  $("#compareButtons").innerHTML=compareItems.map(([k,n])=>'<button type="button" data-compare="'+k+'" class="'+(compareSeen.has(k)?"is-viewed":"")+'">'+n+'</button>').join("");
  $("#compareProgress").textContent=compareSeen.size+" / "+compareItems.length+" ditinjau";
  $("#compareButtons").addEventListener("click",e=>{
    const b=e.target.closest("[data-compare]"); if(!b)return;
    all("#compareButtons button").forEach(x=>x.classList.toggle("is-active",x===b));
    compareSeen.add(b.dataset.compare);
    b.classList.add("is-viewed");
    saveExplain();
    $("#compareProgress").textContent=compareSeen.size+" / "+compareItems.length+" ditinjau";
    const item=compareItems.find(x=>x[0]===b.dataset.compare);
    const where=item[2], name=item[1];
    const animal=where==="both"||where==="animal", plant=where==="both"||where==="plant";
    $("#animalCompare").innerHTML='<span>SEL HEWAN</span><strong>'+(animal?"✓ Ada":"— Tidak khas")+'</strong><p>'+name+(animal?" terdapat pada model sel hewan.":" bukan ciri khas model sel hewan pada pembelajaran ini.")+'</p>';
    $("#plantCompare").innerHTML=where==="animal"&&item[0]==="lysosome"
      ? '<span>SEL TUMBUHAN</span><strong>Fungsi serupa</strong><p>Vakuola pada banyak sel tumbuhan membantu menguraikan zat, seperti fungsi lisosom.</p>'
      : '<span>SEL TUMBUHAN</span><strong>'+(plant?"✓ Ada":"— Tidak khas")+'</strong><p>'+name+(plant?" terdapat pada model sel tumbuhan.":" bukan ciri khas model sel tumbuhan pada pembelajaran ini.")+'</p>';
    updateBottomNavVisibility();
  });

  // ---------- ELABORATE ----------
  const cases=[
    {
      title:"Sel otot bekerja sangat aktif",
      text:"Sel otot harus berkontraksi berulang kali sehingga membutuhkan banyak energi.",
      organ:"Mitokondria",
      organs:["Ribosom","Mitokondria","Badan Golgi"],
      hintOrgan:"Pikirkan organel yang menghasilkan energi yang digunakan sel untuk beraktivitas.",
      reason:"Mitokondria menjadi tempat respirasi seluler yang menghasilkan energi untuk berbagai aktivitas sel.",
      reasons:[
        "Mitokondria menjadi tempat respirasi seluler yang menghasilkan energi untuk berbagai aktivitas sel.",
        "Mitokondria mengemas protein agar dapat dikirim ke luar sel.",
        "Mitokondria mengendalikan keluar-masuknya seluruh zat melalui permukaan sel."
      ]
    },
    {
      title:"Fotosintesis pada daun menurun",
      text:"Sel-sel daun masih hidup, tetapi kemampuannya menggunakan energi cahaya untuk membuat glukosa melalui fotosintesis sangat menurun.",
      organ:"Kloroplas",
      organs:["Kloroplas","Vakuola","Nukleus"],
      hintOrgan:"Pikirkan organel tempat fotosintesis berlangsung.",
      reason:"Kloroplas mengandung klorofil dan menjadi tempat berlangsungnya fotosintesis.",
      reasons:[
        "Kloroplas mengandung klorofil dan menjadi tempat berlangsungnya fotosintesis.",
        "Kloroplas mengatur seluruh informasi genetik sel.",
        "Kloroplas menyimpan sebagian besar air untuk mempertahankan tekanan turgor."
      ]
    },
    {
      title:"Sel tidak dapat mengatur zat yang masuk dan keluar",
      text:"Zat dari lingkungan dapat masuk dan keluar sel tanpa pengaturan yang baik.",
      organ:"Membran sel",
      organs:["Membran sel","Dinding sel","Sitoplasma"],
      hintOrgan:"Pikirkan bagian sel yang mengatur zat mana yang boleh masuk dan keluar.",
      reason:"Membran sel membatasi sel dan mengatur zat mana yang dapat masuk atau keluar.",
      reasons:[
        "Membran sel membatasi sel dan mengatur zat mana yang dapat masuk atau keluar.",
        "Membran sel menghasilkan protein yang dibutuhkan seluruh organel.",
        "Membran sel menjadi tempat utama respirasi seluler."
      ]
    },
    {
      title:"Sel tumbuhan menjadi kurang tegang",
      text:"Dinding sel masih utuh, tetapi sel kehilangan banyak air sehingga tekanan dari dalam sel menurun.",
      organ:"Vakuola",
      organs:["Vakuola","Dinding sel","Badan Golgi"],
      hintOrgan:"Pikirkan organel besar pada sel tumbuhan yang banyak menyimpan air.",
      reason:"Vakuola menyimpan banyak air dan membantu mempertahankan tekanan turgor, yaitu tekanan dari dalam sel tumbuhan.",
      reasons:[
        "Vakuola menyimpan banyak air dan membantu mempertahankan tekanan turgor, yaitu tekanan dari dalam sel tumbuhan.",
        "Vakuola mengandung klorofil sehingga menentukan kekakuan sel.",
        "Vakuola membentuk ribosom yang menjaga dinding sel tetap tegang."
      ]
    },
    {
      title:"Pembuatan protein menurun tajam",
      text:"Sel masih memiliki energi dan nukleus berfungsi, tetapi pembuatan protein baru terganggu secara langsung.",
      organ:"Ribosom",
      organs:["Ribosom","Nukleolus","Lisosom"],
      hintOrgan:"Pikirkan organel tempat protein dibuat.",
      reason:"Ribosom merupakan tempat pembuatan protein atau sintesis protein.",
      reasons:[
        "Ribosom merupakan tempat pembuatan protein atau sintesis protein.",
        "Ribosom menguraikan komponen sel yang rusak menggunakan enzim.",
        "Ribosom menyimpan materi genetik dan mengatur seluruh aktivitas sel."
      ]
    }
  ];

  const caseStates=cases.map((_,i)=>({
    organSel:"",organAttempts:0,organFirst:null,organFinal:null,organDone:false,
    reasonSel:"",reasonAttempts:0,reasonFirst:null,reasonFinal:null,reasonDone:false,
    ...(Array.isArray(activitySave.cases)?activitySave.cases[i]||{}:{})
  }));
  let activeCase=Number.isInteger(activitySave.activeCase)&&activitySave.activeCase>=0&&activitySave.activeCase<cases.length?activitySave.activeCase:0;
  function saveCases(){
    rememberActivity("cases",caseStates);
    rememberActivity("activeCase",activeCase);
  }

  function rotateChoices(items,step){
    const k=step%items.length;
    return [...items.slice(k),...items.slice(0,k)];
  }
  function attemptText(attempts,done){
    if(done)return attempts===1?"Tepat pada jawaban pertama":"Selesai setelah diperbaiki";
    if(attempts===1)return "Sudah menjawab 1 kali • 1 kesempatan tersisa";
    return "Belum dikunci • maksimal 2 kali menjawab";
  }
  function caseDone(i){return caseStates[i].reasonDone}
  function updateCaseSummary(){
    const first=caseStates.reduce((n,s)=>n+(s.organFirst===true)+(s.reasonFirst===true),0);
    const final=caseStates.reduce((n,s)=>n+(s.organFinal===true)+(s.reasonFinal===true),0);
    $("#caseProgress").textContent=caseStates.filter((_,i)=>caseDone(i)).length+" / "+cases.length+" selesai";
    $("#caseFirstScore").textContent="Awal "+first+" / 10";
    $("#caseFinalScore").textContent="Akhir "+final+" / 10";
  }
  function renderCaseTabs(){
    $("#caseTabs").innerHTML=cases.map((c,i)=>'<button type="button" data-case="'+i+'" class="'+(i===activeCase?"is-active ":"")+(caseDone(i)?"is-done":"")+'">Kasus '+(i+1)+'</button>').join("");
    updateCaseSummary();
  }
  function renderCase(){
    const c=cases[activeCase], s=caseStates[activeCase];
    $("#casePanel").innerHTML=
      '<article class="case-card-main"><p class="stage-kicker">KASUS '+(activeCase+1)+'</p><h3>'+c.title+'</h3><p>'+c.text+'</p></article>'+
      '<section class="case-step"><p><b>Langkah 1 — Organel mana yang fungsinya paling sesuai dengan kondisi pada kasus ini?</b></p><div class="case-step-options" id="caseOrganOpts">'+
      rotateChoices(c.organs,activeCase+1).map(x=>'<button type="button" data-case-organ="'+x+'" class="'+(s.organSel===x?"is-selected":"")+'" '+(s.organDone?"disabled":"")+'>'+x+'</button>').join("")+
      '</div><div class="case-lock"><span>'+attemptText(s.organAttempts,s.organDone)+'</span><button type="button" id="lockCaseOrgan" '+(s.organDone?"disabled":"")+'>Kunci pilihan organel</button></div><div id="caseOrganFeedback" class="module-feedback neutral">'+(s.organDone?(s.organFinal?"Pilihan organelmu tepat.":"Baca pembahasan, lalu lanjutkan ke langkah 2."):"Pilih satu organel yang menurutmu paling sesuai.")+'</div></section>'+
      '<section class="case-step '+(!s.organDone?"locked-step":"")+'"><p><b>Langkah 2 — Mengapa organel tersebut paling sesuai?</b></p><div class="case-step-options" id="caseReasonOpts">'+
      rotateChoices(c.reasons,activeCase*2+1).map(x=>'<button type="button" data-case-reason="'+x.replace(/"/g,'&quot;')+'" class="'+(s.reasonSel===x?"is-selected":"")+'" '+((!s.organDone||s.reasonDone)?"disabled":"")+'>'+x+'</button>').join("")+
      '</div><div class="case-lock"><span>'+(!s.organDone?"Selesaikan langkah 1 terlebih dahulu":attemptText(s.reasonAttempts,s.reasonDone))+'</span><button type="button" id="lockCaseReason" '+((!s.organDone||s.reasonDone)?"disabled":"")+'>Kunci alasan</button></div><div id="caseReasonFeedback" class="module-feedback neutral">'+(!s.organDone?"Selesaikan langkah 1 terlebih dahulu.":(s.reasonDone?(s.reasonFinal?"Alasanmu tepat.":"Baca pembahasan alasan yang benar."):"Pilih alasan yang paling tepat menjelaskan pilihan organelmu."))+'</div></section>';
    renderCaseTabs();
  }
  $("#caseTabs").addEventListener("click",e=>{const b=e.target.closest("[data-case]");if(!b)return;activeCase=Number(b.dataset.case);saveCases();renderCase()});
  $("#casePanel").addEventListener("click",e=>{
    const c=cases[activeCase], s=caseStates[activeCase];
    let b=e.target.closest("[data-case-organ]");
    if(b&&!s.organDone){s.organSel=b.dataset.caseOrgan;saveCases();renderCase();return}
    b=e.target.closest("[data-case-reason]");
    if(b&&s.organDone&&!s.reasonDone){s.reasonSel=b.dataset.caseReason;saveCases();renderCase();return}
    if(e.target.closest("#lockCaseOrgan")){
      const fbText=()=>{
        if(!s.organSel)return "Pilih satu organel yang menurutmu paling sesuai sebelum mengunci.";
        const good=s.organSel===c.organ;
        s.organAttempts++; if(s.organFirst===null)s.organFirst=good;
        if(good||s.organAttempts>=2){s.organDone=true;s.organFinal=good}
        if(good)return "<b>Tepat.</b> Fungsi "+c.organ+" paling sesuai dengan kondisi pada kasus ini.";
        if(!s.organDone)return "<b>Belum tepat.</b> "+c.hintOrgan+" Kamu masih memiliki satu kesempatan untuk memperbaiki jawaban.";
        return "<b>Dua kali menjawab selesai.</b> Organel yang paling sesuai adalah <b>"+c.organ+"</b>. Perhatikan kembali fungsi organel tersebut sebelum melanjutkan ke langkah 2.";
      };
      const txt=fbText();saveCases();renderCase();const f=$("#caseOrganFeedback");f.className="module-feedback "+(s.organFinal?"good":"warn");f.innerHTML=txt;return;
    }
    if(e.target.closest("#lockCaseReason")){
      if(!s.reasonSel)return;
      const good=s.reasonSel===c.reason;
      s.reasonAttempts++; if(s.reasonFirst===null)s.reasonFirst=good;
      if(good||s.reasonAttempts>=2){s.reasonDone=true;s.reasonFinal=good}
      let txt;
      if(good)txt="<b>Tepat.</b> "+c.reason;
      else if(!s.reasonDone)txt="<b>Belum tepat.</b> Cocokkan kembali alasanmu dengan fungsi utama "+c.organ+". Kamu masih memiliki satu kesempatan untuk memperbaiki jawaban.";
      else txt="<b>Dua kali menjawab selesai.</b> Penjelasan yang paling tepat: "+c.reason;
      saveCases();renderCase();const f=$("#caseReasonFeedback");f.className="module-feedback "+(s.reasonFinal?"good":"warn");f.innerHTML=txt;
      updateBottomNavVisibility();
    }
  });
  renderCase();

  // ---------- EVALUATE: 10 butir, jawaban dan hasil tahan muat ulang ----------
  const evalItems=[
    {domain:"Pengamatan sel",q:"Saat mengamati epidermis bawang, Rani menemukan banyak ruang kecil berbatas jelas yang menyusun jaringan. Ruang-ruang tersebut paling tepat disebut ...",opts:["Organ","Sel","Sistem organ","Molekul"],a:1,why:"Jaringan tersusun atas sel-sel yang memiliki batas dan menjalankan fungsi kehidupan."},
    {domain:"Mikroskop",q:"Mikroskop memakai okuler 10× dan objektif 40×. Pembesaran total yang digunakan adalah ...",opts:["50×","100×","400×","4.000×"],a:2,why:"Pembesaran total = okuler × objektif = 10 × 40 = 400 kali."},
    {domain:"Mikroskop",q:"Jika okuler 15× dipasangkan dengan objektif 10×, berapakah pembesaran totalnya?",opts:["1.500×","150×","25×","5×"],a:1,why:"15 × 10 = 150 kali."},
    {domain:"Penggunaan mikroskop",q:"Objek sulit ditemukan pada objektif 40×. Langkah awal yang paling tepat untuk mencari kembali objek adalah ...",opts:["Langsung memakai minyak imersi","Memutar makrometer pada objektif 40× hingga mentok","Mengganti preparat tanpa pemeriksaan","Kembali ke objektif rendah lalu pusatkan objek"],a:3,why:"Mulailah dengan objektif rendah dan pusatkan objek sebelum menaikkan pembesaran. Hindari memaksa pemutar fokus kasar pada objektif tinggi."},
    {domain:"Struktur dan fungsi",q:"Sel otot bekerja terus-menerus dan membutuhkan lebih banyak energi. Organel yang berkaitan langsung dengan kondisi ini adalah ...",opts:["Mitokondria","Kloroplas","Dinding sel","Vakuola"],a:0,why:"Mitokondria menjadi tempat respirasi seluler yang menyediakan energi bagi aktivitas sel."},
    {domain:"Sel tumbuhan",q:"Sel daun masih hidup, tetapi produksi gula melalui fotosintesis menurun tajam. Organel yang perlu ditinjau terlebih dahulu adalah ...",opts:["Ribosom","Lisosom","Kloroplas","Nukleolus"],a:2,why:"Kloroplas merupakan tempat berlangsungnya fotosintesis pada sel tumbuhan."},
    {domain:"Struktur dan fungsi",q:"Jika sebuah sel gagal mengatur zat yang masuk dan keluar, bagian sel yang paling berkaitan ialah ...",opts:["Badan Golgi","Membran sel","Nukleolus","Kloroplas"],a:1,why:"Membran sel berperan sebagai batas selektif untuk pertukaran zat."},
    {domain:"Sel tumbuhan",q:"Dinding sel tetap utuh, tetapi sel tumbuhan kehilangan air dan menjadi layu. Bagian yang paling terkait dengan penyimpanan air adalah ...",opts:["Ribosom","Badan Golgi","Vakuola","Nukleus"],a:2,why:"Vakuola membantu menyimpan air dan menjaga tekanan turgor pada sel tumbuhan."},
    {domain:"Perbandingan model sel",q:"Sebuah model sel memiliki dinding sel, vakuola besar, dan kloroplas. Model tersebut paling mungkin menunjukkan ...",opts:["Sel otot manusia","Sel darah merah manusia","Sel saraf manusia","Sel tumbuhan hijau"],a:3,why:"Dinding sel, vakuola besar, dan kloroplas merupakan ciri umum model sel tumbuhan hijau."},
    {domain:"Analisis mikroskop",q:"Maya mengganti objektif 10× menjadi 40× tanpa mengganti okuler. Perubahan yang biasanya terjadi adalah ...",opts:["Gambar mengecil dan bidang pandang makin luas","Gambar membesar dan bidang pandang makin sempit","Gambar sama besar dan bidang pandang tetap","Pembesaran total berkurang"],a:1,why:"Objektif lebih kuat memperbesar gambar, sedangkan luas area preparat yang tampak menjadi lebih sempit."}
  ];
  const savedEval=activitySave.evaluationV2||{};
  const evalAnswers=Array.isArray(savedEval.answers)&&savedEval.answers.length===evalItems.length
    ? savedEval.answers.map(x=>Number.isInteger(x)&&x>=0&&x<=3?x:null)
    : Array(evalItems.length).fill(null);
  let evalIndex=Number.isInteger(savedEval.index)&&savedEval.index>=0&&savedEval.index<evalItems.length?savedEval.index:0;
  let evalFinished=savedEval.finished===true&&evalAnswers.every(x=>x!==null);
  let evalScore=evalAnswers.reduce((sum,a,i)=>sum+(a===evalItems[i].a?1:0),0);
  let evalChoice=evalAnswers[evalIndex],evalLocked=evalChoice!==null;
  function saveEvaluation(){
    rememberActivity("evaluationV2",{index:evalIndex,answers:evalAnswers,finished:evalFinished});
  }
  function renderEval(){
    const item=evalItems[evalIndex],answer=evalAnswers[evalIndex];
    evalChoice=answer;evalLocked=answer!==null;
    $("#evalProgress").textContent="Soal "+(evalIndex+1)+" / "+evalItems.length;
    $("#evalScore").textContent="Skor "+evalScore;
    $("#evalBar").style.width=((evalIndex+1)/evalItems.length*100)+"%";
    $("#evalDomain").textContent=item.domain;
    $("#evalQuestion").textContent=item.q;
    $("#evalOptions").innerHTML=item.opts.map((x,i)=>'<button type="button" data-eval="'+i+'">'+x+'</button>').join("");
    $("#lockEval").disabled=evalLocked||evalFinished;
    $("#nextEval").hidden=!evalLocked||evalFinished;
    $("#nextEval").textContent=evalIndex===evalItems.length-1?"Lihat hasil akhir →":"Soal berikutnya →";
    const fb=$("#evalFeedback");
    if(evalLocked){
      const good=answer===item.a;
      all("#evalOptions button").forEach((b,i)=>{
        b.disabled=true;
        b.classList.toggle("correct",i===item.a);
        b.classList.toggle("wrong",i===answer&&!good);
      });
      fb.className="module-feedback "+(good?"good":"warn");
      fb.textContent=(good?"Tepat. ":"Belum tepat. ")+item.why;
    }else{
      fb.className="module-feedback neutral";
      fb.textContent="Pilih satu jawaban.";
    }
    const p=$(".evaluate-panel");
    if(p)p.dataset.evaluationFinished=String(evalFinished);
    if(evalFinished){
      fb.className="module-feedback "+(evalScore>=8?"good":"warn");
      fb.textContent="Evaluasi selesai: "+evalScore+" / "+evalItems.length+". "+
        (evalScore>=8?"Pelajari kembali alasan pada soal yang belum tepat.":"Tinjau kembali hasil pengamatan dan fungsi organel, lalu jelaskan perbaikannya.");
    }
    updateBottomNavVisibility();
  }
  $("#evalOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-eval]");if(!b||evalLocked||evalFinished)return;
    evalChoice=Number(b.dataset.eval);setSelected($("#evalOptions"),b);
  });
  $("#lockEval").addEventListener("click",()=>{
    if(evalLocked||evalFinished)return;
    if(evalChoice===null){$("#evalFeedback").textContent="Pilih satu jawaban sebelum mengunci.";return;}
    evalAnswers[evalIndex]=evalChoice;
    evalScore=evalAnswers.reduce((sum,a,i)=>sum+(a===evalItems[i].a?1:0),0);
    saveEvaluation();renderEval();
  });
  $("#nextEval").addEventListener("click",()=>{
    if(!evalLocked||evalFinished)return;
    if(evalIndex<evalItems.length-1){evalIndex++;saveEvaluation();renderEval();}
    else {evalFinished=true;saveEvaluation();renderEval();}
  });
  renderEval();

  // Bukti ketercapaian setiap tahap. Footer bukan jalan pintas penyelesaian.
  moduleBridge.isStageReady=stage=>{
    switch(Number(stage)){
      case 0:return lifeDone;
      case 1:return zoomIndex===2&&engageLocked&&$("#engageReason").value.trim().length>=12;
      case 2:return predictionLocked&&microSeen.size===3&&microConclusionSaved;
      case 3:return explainPageSeen.size===4&&seenAnimal.size===9&&seenPlant.size===11
        &&compareSeen.size===compareItems.length
        &&Number($("#cellExplainTabs [data-cell-page].is-active")?.dataset.cellPage)===3;
      case 4:return activeCase===cases.length-1&&caseStates.every((_,i)=>caseDone(i));
      case 5:return evalFinished;
      case 6:return Boolean($("#studentName").value.trim()&&$("#studentClass").value.trim()
        &&[...document.querySelectorAll("[data-reflection]")].some(f=>f.value.trim().length>=10)
        &&document.querySelector("[data-confidence].is-selected"));
      default:return false;
    }
  };
  updateBottomNavVisibility();
})();
