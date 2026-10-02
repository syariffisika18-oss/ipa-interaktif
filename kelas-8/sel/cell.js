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

  let activeStage = Number.isInteger(state.activeStage) ? state.activeStage : 0;
  let completed = Array.isArray(state.completed) ? new Set(state.completed) : new Set();
  let mode = state.mode || config.defaultMode || "mandiri";

  if (!state.sessionId) state.sessionId = makeId();

  const panels = [...document.querySelectorAll("[data-panel]")];
  const tabs = [...document.querySelectorAll("[data-stage]")];
  const prevButton = document.getElementById("prevStage");
  const nextButton = document.getElementById("nextStage");
  const completeButton = document.getElementById("completeStage");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const toast = document.getElementById("toast");

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
        : "Jawaban dapat ditahan agar pendidik mengendalikan diskusi dan scaffolding.";

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
      if (completed.has(activeStage)) {
        completed.delete(activeStage);
        showToast("Tanda selesai dibatalkan.");
      } else {
        completed.add(activeStage);
        showToast("Tahap ditandai selesai.");
      }
      renderProgress();
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

  function showStage(index, doScroll = true) {
    activeStage = Math.max(0, Math.min(stageCount - 1, index));

    panels.forEach((panel, i) => {
      panel.classList.toggle("is-active", i === activeStage);
    });

    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === activeStage);
      tab.classList.toggle("is-complete", completed.has(i));
    });

    prevButton.disabled = activeStage === 0;
    nextButton.disabled = activeStage === stageCount - 1;
    nextButton.style.opacity = activeStage === stageCount - 1 ? ".45" : "1";

    completeButton.classList.toggle("is-complete", completed.has(activeStage));
    completeButton.textContent = completed.has(activeStage) ? "✓ Sudah selesai" : "Tandai selesai";

    keepActiveTabVisible(doScroll ? "smooth" : "auto");
    if (doScroll) {
      window.revealStageNav?.();
      scrollToStageMenu();
    }

    renderProgress();
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
        "input,textarea,select,a,label,[contenteditable],.stage-nav,.bottom-nav,.mode-card,button"
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
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  function setSelected(root, target){
    $$("button", root).forEach(b=>b.classList.toggle("is-selected", b===target));
  }

  // ---------- ORIENTASI: 8 ciri makhluk hidup ----------
  const lifeItems = [
  {scenario:"Kecambah bertambah tinggi dan daunnya semakin besar dari hari ke hari.", answer:"Tumbuh dan berkembang", distract:["Bergerak","Berkembang biak"]},
  {scenario:"Putri malu menutup daunnya ketika disentuh.", answer:"Peka terhadap rangsangan", distract:["Bernapas","Mengeluarkan zat sisa"]},
  {scenario:"Manusia menghirup oksigen dan melepaskan karbon dioksida melalui sistem pernapasan.", answer:"Bernapas", distract:["Peka terhadap rangsangan","Memerlukan nutrisi"]},
  {scenario:"Burung mencari biji dan ulat untuk memperoleh bahan dan energi bagi tubuhnya.", answer:"Memerlukan nutrisi", distract:["Berkembang biak","Bergerak"]},
  {scenario:"Ikan berenang mendekati sumber makanan.", answer:"Bergerak", distract:["Tumbuh dan berkembang","Mengeluarkan zat sisa"]},
  {scenario:"Kucing menghasilkan anak yang memiliki ciri menyerupai induknya.", answer:"Berkembang biak", distract:["Peka terhadap rangsangan","Bernapas"]},
  {scenario:"Ginjal membantu membuang zat sisa metabolisme melalui urine.", answer:"Mengeluarkan zat sisa", distract:["Bernapas","Memerlukan nutrisi"]},
  {scenario:"Tubuh makhluk hidup tersusun atas satu atau banyak unit kecil yang disebut sel.", answer:"Tersusun dari sel", distract:["Berkembang biak","Peka terhadap rangsangan"]}
];

  let lifeIndex=0, lifeChoice="";
  function renderLife(){
    const item=lifeItems[lifeIndex];
    $("#lifeProgress").textContent=(lifeIndex+1)+" / "+lifeItems.length;
    $("#lifeScenario").textContent=item.scenario;
    const opts=[item.answer,...item.distract].sort((a,b)=>a.localeCompare(b));
    $("#lifeOptions").innerHTML=opts.map(x=>'<button type="button" data-life="'+x+'">'+x+'</button>').join("");
    lifeChoice="";
    $("#lifeFeedback").className="module-feedback neutral";
    $("#lifeFeedback").textContent="Belum diperiksa.";
    $("#lifeAttempt").textContent="Pilih satu ciri, lalu kunci.";
    $("#checkLife").disabled=false;
    $("#nextLife").hidden=true;
  }
  $("#lifeOptions")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-life]"); if(!b||$("#checkLife").disabled)return;
    lifeChoice=b.dataset.life; setSelected($("#lifeOptions"),b);
  });
  $("#checkLife")?.addEventListener("click",()=>{
    if(!lifeChoice){$("#lifeFeedback").textContent="Pilih satu jawaban terlebih dahulu.";return}
    const item=lifeItems[lifeIndex];
    const good=lifeChoice===item.answer;
    $("#lifeFeedback").className="module-feedback "+(good?"good":"warn");
    if (good) {
  if (lifeIndex === lifeItems.length - 1) {
    $("#lifeFeedback").className = "module-feedback good";
    $("#lifeFeedback").innerHTML =
      "<b>Tepat.</b> Makhluk hidup <b>tersusun dari sel</b>. Karena sel menyusun tubuh sekaligus menjalankan berbagai proses kehidupan, sel menjadi dasar untuk memahami kehidupan. <b>Selanjutnya, kita akan melihat sel lebih dekat.</b>";
  } else {
    $("#lifeFeedback").className = "module-feedback good";
    $("#lifeFeedback").innerHTML =
      "<b>Tepat.</b> Situasi tersebut menunjukkan ciri <b>"+item.answer+"</b>.";
  }
} else {
  if (lifeIndex === lifeItems.length - 1) {
    $("#lifeFeedback").className = "module-feedback warn";
    $("#lifeFeedback").innerHTML =
      "<b>Belum tepat.</b> Ciri yang dimaksud adalah <b>tersusun dari sel</b>. Sel merupakan unit penyusun makhluk hidup dan menjadi jembatan menuju materi yang akan kita pelajari berikutnya.";
  } else {
    $("#lifeFeedback").className = "module-feedback warn";
    $("#lifeFeedback").innerHTML =
      "<b>Belum tepat.</b> Ciri yang paling sesuai adalah <b>"+item.answer+"</b>. Perhatikan perubahan atau respons yang terjadi pada organisme.";
  }
}
    $("#checkLife").disabled=true;
    $$("#lifeOptions button").forEach(b=>b.disabled=true);
    $("#nextLife").hidden=false;
    $("#nextLife").textContent=lifeIndex===lifeItems.length-1?"Lanjut ke sel →":"Situasi berikutnya →";
  });
  $("#nextLife")?.addEventListener("click",()=>{
    if(lifeIndex<lifeItems.length-1){lifeIndex++;renderLife()}
    else{
      $("#nextLife").hidden=true;
      $("#lifeAttempt").textContent="8 ciri selesai. Selanjutnya: melihat sel lebih dekat.";
      $("#lifeProgress").textContent="8 / 8 ✓";
    }
  });
  renderLife();

  // ---------- ENGAGE: progressive zoom Guided Inquiry ----------
  let zoomIndex=0;
  let maxZoomUnlocked=0;
  let engageChoice="";
  let engageLocked=false;

  function renderZoom(){
    $$("[data-zoom-panel]").forEach(p=>{
      p.hidden=Number(p.dataset.zoomPanel)!==zoomIndex;
    });

    $$("#zoomTabs [data-zoom]").forEach(btn=>{
      const i=Number(btn.dataset.zoom);
      const unlocked=i<=maxZoomUnlocked;
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
      $("#zoomGuide").textContent=engageLocked
        ?"Prediksi sudah dikunci. Sekarang buka unit yang diamati."
        :"Amati unit-unit kecil ini, lalu buat dugaan sebelum memperbesar lagi.";
      $("#engageQuestion").hidden=false;
      $("#zoomNext").hidden=!engageLocked;
      $("#zoomNext").textContent="Perbesar salah satu unit →";
    }else{
      $("#zoomGuide").textContent="Bandingkan hasil pengamatan dengan prediksimu.";
      $("#zoomNext").hidden=true;
      $("#engageQuestion").hidden=false;
    }
  }

  $("#zoomNext")?.addEventListener("click",()=>{
    if(zoomIndex===0){
      zoomIndex=1;
      maxZoomUnlocked=Math.max(maxZoomUnlocked,1);
      renderZoom();
      return;
    }
    if(zoomIndex===1&&engageLocked){
      zoomIndex=2;
      maxZoomUnlocked=2;
      renderZoom();

      const good=engageChoice==="sel";
      $("#engageFeedback").className="module-feedback "+(good?"good":"warn");
      $("#engageFeedback").innerHTML=good
        ? "<b>Prediksimu sesuai pengamatan.</b> Unit tersebut adalah sel. Selanjutnya kita akan menyelidiki mengapa sel disebut unit kehidupan."
        : "<b>Bandingkan kembali dengan pengamatan.</b> Unit yang ditunjukkan adalah sel. Pada Explain nanti kita akan membedakan sel dari molekul dan organ.";
    }
  });

  $("#zoomPrev")?.addEventListener("click",()=>{
    if(zoomIndex>0){
      zoomIndex--;
      renderZoom();
    }
  });

  $("#zoomTabs")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-zoom]");
    if(!b||b.disabled)return;
    const target=Number(b.dataset.zoom);
    if(target===2&&!engageLocked)return;
    zoomIndex=target;
    renderZoom();
  });

  $("#engageOptions")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-engage]");
    if(!b||engageLocked)return;
    engageChoice=b.dataset.engage;
    setSelected($("#engageOptions"),b);
  });

  $("#lockEngage")?.addEventListener("click",()=>{
    if(!engageChoice){
      $("#engageFeedback").textContent="Pilih satu dugaan terlebih dahulu.";
      return;
    }

    engageLocked=true;
    $("#lockEngage").disabled=true;
    $("#engageOptions button").forEach(b=>b.disabled=true);

    $("#engageFeedback").className="module-feedback neutral";
    $("#engageFeedback").innerHTML="<b>Prediksi dikunci.</b> Jawaban belum dibuka. Tekan <b>Perbesar salah satu unit</b> untuk menguji dugaanmu.";
    renderZoom();
  });

  renderZoom();

  // ---------- EXPLORE: POE mikroskop ----------
  let objective=4, magChoice="", predictionLocked=false;
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
    syncObjectiveVisual(animate);

    $("#totalHidden").textContent=item.total+"×";
    $("#totalMagnification").textContent=item.total+"×";
    $("#fieldObservation").textContent=item.observation;
    $("#poeExplain").hidden=false;
    $("#microscopeModeBadge").textContent="OBSERVE + EXPLAIN";
  }

  $("#objectiveButtons")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-objective]");
    if(!b) return;

    const next=Number(b.dataset.objective);
    if(next===objective) return;

    objective=next;
    magChoice="";
    updateLensPreview(true);
  });

  $("#magnificationOptions")?.addEventListener("click",e=>{
    const b=e.target.closest("[data-mag]");
    if(!b||predictionLocked) return;
    magChoice=Number(b.dataset.mag);
    setSelected($("#magnificationOptions"),b);
  });

  $("#lockMagnification")?.addEventListener("click",()=>{
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
    $$("#magnificationOptions button").forEach(b=>b.disabled=true);
    revealMicroscope(false);
  });

  buildMagOptions();
  updateLensPreview(false);

  // ---------- EXPLAIN tabs ----------
  $$("#cellExplainTabs [data-cell-page]").forEach(btn=>btn.addEventListener("click",()=>{
    const i=Number(btn.dataset.cellPage);
    $$("#cellExplainTabs button").forEach(b=>b.classList.toggle("is-active",b===btn));
    $$("[data-cell-content]").forEach(p=>p.classList.toggle("is-active",Number(p.dataset.cellContent)===i));
  }));

  const organelles = {
    nucleus:{name:"Nukleus",function:"Mengatur aktivitas sel dan menyimpan sebagian besar materi genetik.",impact:"Pengaturan aktivitas sel dan informasi genetik akan terganggu."},
    nucleolus:{name:"Nukleolus",function:"Berperan dalam pembentukan komponen ribosom di dalam nukleus.",impact:"Pembentukan komponen ribosom dapat terganggu."},
    er:{name:"Retikulum endoplasma",function:"Membantu sintesis dan transport berbagai molekul di dalam sel; RE kasar berhubungan dengan ribosom.",impact:"Pemrosesan dan transport molekul tertentu menjadi kurang efektif."},
    golgi:{name:"Badan Golgi",function:"Memodifikasi, mengemas, dan mengarahkan molekul untuk digunakan atau dikirim oleh sel.",impact:"Pengemasan dan pengiriman molekul sel dapat terganggu."},
    mitochondria:{name:"Mitokondria",function:"Tempat utama respirasi seluler untuk menghasilkan energi yang dapat digunakan sel.",impact:"Ketersediaan energi bagi aktivitas sel dapat menurun."},
    lysosome:{name:"Lisosom",function:"Mengandung enzim yang membantu menguraikan bahan tertentu dan komponen sel yang rusak.",impact:"Bahan yang seharusnya diuraikan dapat menumpuk."},
    ribosome:{name:"Ribosom",function:"Tempat sintesis protein.",impact:"Produksi protein sel akan terganggu."},
    membrane:{name:"Membran sel",function:"Membatasi sel dan mengatur keluar-masuknya zat secara selektif.",impact:"Keseimbangan pertukaran zat antara sel dan lingkungannya dapat terganggu."},
    wall:{name:"Dinding sel",function:"Memberi dukungan, perlindungan, dan membantu mempertahankan bentuk sel tumbuhan.",impact:"Sel tumbuhan lebih mudah kehilangan dukungan bentuk."},
    cytoplasm:{name:"Sitoplasma",function:"Medium tempat organel berada dan banyak reaksi kimia sel berlangsung.",impact:"Lingkungan internal untuk berbagai reaksi sel akan terganggu."},
    vacuole:{name:"Vakuola",function:"Menyimpan air dan berbagai zat; pada sel tumbuhan membantu mempertahankan tekanan turgor.",impact:"Sel tumbuhan dapat kehilangan kekakuan ketika kandungan airnya berkurang."},
    chloroplast:{name:"Kloroplas",function:"Tempat fotosintesis pada sel tumbuhan yang mengandung klorofil.",impact:"Kemampuan sel melakukan fotosintesis akan terganggu."}
  };

  const seenAnimal=new Set(), seenPlant=new Set();
  function showOrganelle(kind,key,button){
    const data=organelles[key]; if(!data)return;
    const info=kind==="animal"?$("#animalOrganelleInfo"):$("#plantOrganelleInfo");
    const wrap=button.closest(".cell-model-wrap");
    $$(".organelle-hotspots button",wrap).forEach(b=>b.classList.toggle("is-active",b===button));
    $$(".organelle-shape",wrap).forEach(s=>s.classList.toggle("is-active",s.dataset.orgShape===key));
    info.innerHTML='<span class="organelle-number">'+button.textContent+'</span><h3>'+data.name+'</h3><div class="organelle-facts"><div><span>FUNGSI UTAMA</span><strong>'+data.function+'</strong></div><div><span>JIKA TERGANGGU</span><strong>'+data.impact+'</strong></div></div>';
    const seen=kind==="animal"?seenAnimal:seenPlant;
    seen.add(key);
    (kind==="animal"?$("#animalSeen"):$("#plantSeen")).textContent=seen.size+" / "+(kind==="animal"?9:11)+" dikenali";
  }
  $$(".animal-hotspots [data-organelle]").forEach(b=>b.addEventListener("click",()=>showOrganelle("animal",b.dataset.organelle,b)));
  $$(".plant-hotspots [data-organelle]").forEach(b=>b.addEventListener("click",()=>showOrganelle("plant",b.dataset.organelle,b)));

  // ---------- Compare ----------
  const compareItems=[
    ["membrane","Membran sel","both"],["nucleus","Nukleus","both"],["mitochondria","Mitokondria","both"],
    ["ribosome","Ribosom","both"],["golgi","Badan Golgi","both"],["wall","Dinding sel","plant"],
    ["chloroplast","Kloroplas","plant"],["vacuole","Vakuola besar","plant"],["lysosome","Lisosom","animal"]
  ];
  $("#compareButtons").innerHTML=compareItems.map(([k,n])=>'<button type="button" data-compare="'+k+'">'+n+'</button>').join("");
  $("#compareButtons").addEventListener("click",e=>{
    const b=e.target.closest("[data-compare]"); if(!b)return;
    $$("#compareButtons button").forEach(x=>x.classList.toggle("is-active",x===b));
    const item=compareItems.find(x=>x[0]===b.dataset.compare);
    const where=item[2], name=item[1];
    const animal=where==="both"||where==="animal", plant=where==="both"||where==="plant";
    $("#animalCompare").innerHTML='<span>SEL HEWAN</span><strong>'+(animal?"✓ Ada":"— Tidak khas")+'</strong><p>'+name+(animal?" terdapat pada model sel hewan.":" bukan ciri khas model sel hewan pada pembelajaran ini.")+'</p>';
    $("#plantCompare").innerHTML='<span>SEL TUMBUHAN</span><strong>'+(plant?"✓ Ada":"— Tidak khas")+'</strong><p>'+name+(plant?" terdapat pada model sel tumbuhan.":" bukan ciri khas model sel tumbuhan pada pembelajaran ini.")+'</p>';
  });

  // ---------- ELABORATE ----------
  const cases=[
    {
      title:"Sel otot bekerja sangat aktif",
      text:"Sebuah sel otot membutuhkan energi dalam jumlah besar untuk berkontraksi berulang kali.",
      organ:"Mitokondria",
      organs:["Ribosom","Mitokondria","Badan Golgi"],
      hintOrgan:"Cari organel yang paling langsung berkaitan dengan penyediaan energi yang dapat digunakan sel.",
      reason:"Mitokondria melakukan respirasi seluler yang menghasilkan energi untuk berbagai aktivitas sel.",
      reasons:[
        "Mitokondria melakukan respirasi seluler yang menghasilkan energi untuk berbagai aktivitas sel.",
        "Mitokondria mengemas protein agar dapat dikirim ke luar sel.",
        "Mitokondria mengendalikan keluar-masuknya seluruh zat melalui permukaan sel."
      ]
    },
    {
      title:"Daun tidak mampu berfotosintesis normal",
      text:"Sel-sel daun masih hidup, tetapi kemampuan menangkap energi cahaya untuk membentuk bahan organik sangat menurun.",
      organ:"Kloroplas",
      organs:["Kloroplas","Vakuola","Nukleus"],
      hintOrgan:"Cari organel tumbuhan yang berkaitan langsung dengan fotosintesis.",
      reason:"Kloroplas mengandung klorofil dan menjadi tempat berlangsungnya fotosintesis.",
      reasons:[
        "Kloroplas mengandung klorofil dan menjadi tempat berlangsungnya fotosintesis.",
        "Kloroplas mengatur seluruh informasi genetik sel.",
        "Kloroplas menyimpan sebagian besar air untuk mempertahankan tekanan turgor."
      ]
    },
    {
      title:"Pertukaran zat tidak terkendali",
      text:"Sebuah sel tidak mampu lagi mengatur zat mana yang masuk dan keluar dari lingkungan sekitarnya.",
      organ:"Membran sel",
      organs:["Membran sel","Dinding sel","Sitoplasma"],
      hintOrgan:"Fokus pada batas sel yang bersifat selektif.",
      reason:"Membran sel membatasi sel dan mengatur pertukaran zat secara selektif.",
      reasons:[
        "Membran sel membatasi sel dan mengatur pertukaran zat secara selektif.",
        "Membran sel menghasilkan protein yang dibutuhkan seluruh organel.",
        "Membran sel menjadi tempat utama respirasi seluler."
      ]
    },
    {
      title:"Sel tumbuhan kehilangan kekakuan",
      text:"Dinding sel masih utuh, tetapi sel tumbuhan kehilangan banyak air sehingga tekanan dari bagian dalam sel menurun.",
      organ:"Vakuola",
      organs:["Vakuola","Dinding sel","Badan Golgi"],
      hintOrgan:"Cari kompartemen besar yang menyimpan air dan membantu tekanan turgor.",
      reason:"Vakuola menyimpan air dan membantu mempertahankan tekanan turgor pada sel tumbuhan.",
      reasons:[
        "Vakuola menyimpan air dan membantu mempertahankan tekanan turgor pada sel tumbuhan.",
        "Vakuola mengandung klorofil sehingga menentukan kekakuan sel.",
        "Vakuola membentuk ribosom yang menjaga dinding sel tetap tegang."
      ]
    },
    {
      title:"Produksi protein menurun tajam",
      text:"Sel masih memiliki energi dan nukleus berfungsi, tetapi pembentukan protein baru terganggu secara langsung.",
      organ:"Ribosom",
      organs:["Ribosom","Nukleolus","Lisosom"],
      hintOrgan:"Cari struktur yang menjadi tempat berlangsungnya sintesis protein.",
      reason:"Ribosom merupakan tempat sintesis protein.",
      reasons:[
        "Ribosom merupakan tempat sintesis protein.",
        "Ribosom menguraikan komponen sel yang rusak menggunakan enzim.",
        "Ribosom menyimpan materi genetik dan mengatur seluruh aktivitas sel."
      ]
    }
  ];

  const caseStates=cases.map(()=>({
    organSel:"",organAttempts:0,organFirst:null,organFinal:null,organDone:false,
    reasonSel:"",reasonAttempts:0,reasonFirst:null,reasonFinal:null,reasonDone:false
  }));
  let activeCase=0;

  function attemptText(attempts,done){
    if(done)return attempts===1?"Selesai pada jawaban pertama":"Selesai setelah 1 revisi";
    if(attempts===1)return "1 percobaan digunakan • 1 revisi tersisa";
    return "Belum dikunci • maksimal 2 percobaan";
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
      '<section class="case-step"><p><b>Langkah 1 — Pilih organel yang paling langsung terkait.</b></p><div class="case-step-options" id="caseOrganOpts">'+
      c.organs.map(x=>'<button type="button" data-case-organ="'+x+'" class="'+(s.organSel===x?"is-selected":"")+'" '+(s.organDone?"disabled":"")+'>'+x+'</button>').join("")+
      '</div><div class="case-lock"><span>'+attemptText(s.organAttempts,s.organDone)+'</span><button type="button" id="lockCaseOrgan" '+(s.organDone?"disabled":"")+'>Kunci organel</button></div><div id="caseOrganFeedback" class="module-feedback neutral">'+(s.organDone?(s.organFinal?"Organel sudah tepat.":"Pembahasan sudah dibuka; lanjutkan ke alasan."):"Pilih satu organel.")+'</div></section>'+
      '<section class="case-step '+(!s.organDone?"locked-step":"")+'"><p><b>Langkah 2 — Pilih alasan yang paling menjelaskan hubungan struktur–fungsi.</b></p><div class="case-step-options" id="caseReasonOpts">'+
      c.reasons.map(x=>'<button type="button" data-case-reason="'+x.replace(/"/g,'&quot;')+'" class="'+(s.reasonSel===x?"is-selected":"")+'" '+((!s.organDone||s.reasonDone)?"disabled":"")+'>'+x+'</button>').join("")+
      '</div><div class="case-lock"><span>'+(!s.organDone?"Menunggu langkah 1":attemptText(s.reasonAttempts,s.reasonDone))+'</span><button type="button" id="lockCaseReason" '+((!s.organDone||s.reasonDone)?"disabled":"")+'>Kunci alasan</button></div><div id="caseReasonFeedback" class="module-feedback neutral">'+(!s.organDone?"Selesaikan langkah 1 terlebih dahulu.":(s.reasonDone?(s.reasonFinal?"Alasan sudah tepat.":"Pembahasan sudah dibuka."):"Pilih satu alasan."))+'</div></section>';
    renderCaseTabs();
  }
  $("#caseTabs").addEventListener("click",e=>{const b=e.target.closest("[data-case]");if(!b)return;activeCase=Number(b.dataset.case);renderCase()});
  $("#casePanel").addEventListener("click",e=>{
    const c=cases[activeCase], s=caseStates[activeCase];
    let b=e.target.closest("[data-case-organ]");
    if(b&&!s.organDone){s.organSel=b.dataset.caseOrgan;renderCase();return}
    b=e.target.closest("[data-case-reason]");
    if(b&&s.organDone&&!s.reasonDone){s.reasonSel=b.dataset.caseReason;renderCase();return}
    if(e.target.closest("#lockCaseOrgan")){
      const fbText=()=>{
        if(!s.organSel)return "Pilih satu organel sebelum mengunci.";
        const good=s.organSel===c.organ;
        s.organAttempts++; if(s.organFirst===null)s.organFirst=good;
        if(good||s.organAttempts>=2){s.organDone=true;s.organFinal=good}
        if(good)return "<b>Tepat.</b> "+c.organ+" paling langsung sesuai dengan data kasus.";
        if(!s.organDone)return "<b>Belum tepat.</b> "+c.hintOrgan+" Satu revisi tersisa.";
        return "<b>Dua percobaan selesai.</b> Organel yang paling tepat adalah <b>"+c.organ+"</b>.";
      };
      const txt=fbText();renderCase();const f=$("#caseOrganFeedback");f.className="module-feedback "+(s.organFinal?"good":"warn");f.innerHTML=txt;return;
    }
    if(e.target.closest("#lockCaseReason")){
      if(!s.reasonSel)return;
      const good=s.reasonSel===c.reason;
      s.reasonAttempts++; if(s.reasonFirst===null)s.reasonFirst=good;
      if(good||s.reasonAttempts>=2){s.reasonDone=true;s.reasonFinal=good}
      let txt;
      if(good)txt="<b>Tepat.</b> "+c.reason;
      else if(!s.reasonDone)txt="<b>Belum tepat.</b> Periksa kembali fungsi utama "+c.organ+". Satu revisi tersisa.";
      else txt="<b>Dua percobaan selesai.</b> Penjelasan yang paling kuat: "+c.reason;
      renderCase();const f=$("#caseReasonFeedback");f.className="module-feedback "+(s.reasonFinal?"good":"warn");f.innerHTML=txt;
    }
  });
  renderCase();

  // ---------- EVALUATE ----------
  const evalItems=[
    {domain:"Konsep sel",q:"Unit struktural dan fungsional terkecil makhluk hidup adalah ...",opts:["Jaringan","Sel","Organ","Sistem organ"],a:1,why:"Sel merupakan unit terkecil yang masih menjalankan fungsi kehidupan."},
    {domain:"Mikroskop",q:"Mikroskop menggunakan okuler 10× dan objektif 40×. Pembesaran totalnya adalah ...",opts:["50×","100×","400×","4.000×"],a:2,why:"Pembesaran total = 10× × 40× = 400×."},
    {domain:"Mikroskop",q:"Okuler 15× dipasangkan dengan objektif 10×. Pembesaran totalnya adalah ...",opts:["25×","150×","1500×","5×"],a:1,why:"15× × 10× = 150×."},
    {domain:"Organel",q:"Organel yang menjadi tempat sintesis protein adalah ...",opts:["Ribosom","Lisosom","Vakuola","Kloroplas"],a:0,why:"Ribosom merupakan tempat sintesis protein."},
    {domain:"Organel",q:"Sel yang membutuhkan banyak energi untuk bekerja diperkirakan memiliki banyak ...",opts:["Mitokondria","Badan Golgi","Dinding sel","Nukleolus"],a:0,why:"Mitokondria berperan utama dalam respirasi seluler dan penyediaan energi."},
    {domain:"Sel tumbuhan",q:"Struktur yang secara langsung berperan dalam fotosintesis adalah ...",opts:["Kloroplas","Vakuola","Membran sel","Lisosom"],a:0,why:"Kloroplas mengandung klorofil dan merupakan tempat fotosintesis."},
    {domain:"Sel hewan & tumbuhan",q:"Struktur yang terdapat pada sel hewan maupun sel tumbuhan adalah ...",opts:["Dinding sel","Kloroplas","Membran sel","Vakuola besar"],a:2,why:"Membran sel dimiliki keduanya; dinding sel dan kloroplas merupakan ciri penting sel tumbuhan."},
    {domain:"Struktur–fungsi",q:"Jika kemampuan mengatur keluar-masuknya zat terganggu, bagian yang paling langsung perlu diperiksa adalah ...",opts:["Membran sel","Ribosom","Nukleolus","Kloroplas"],a:0,why:"Membran sel mengatur pertukaran zat secara selektif."},
    {domain:"Sel tumbuhan",q:"Sel tumbuhan kehilangan banyak air dan menjadi kurang tegang meskipun dinding sel tetap utuh. Struktur yang paling berkaitan adalah ...",opts:["Vakuola","Badan Golgi","Ribosom","Nukleus"],a:0,why:"Vakuola menyimpan air dan membantu mempertahankan tekanan turgor."},
    {domain:"Mikroskop",q:"Ketika pembesaran objektif dinaikkan dari 10× menjadi 40×, pengamatan umumnya menunjukkan bahwa ...",opts:["Objek tampak lebih kecil dan bidang pandang lebih sempit","Objek tampak lebih besar dan bidang pandang lebih sempit","Objek tampak sama besar dan bidang pandang lebih luas","Objek hilang karena pembesaran total selalu berkurang"],a:1,why:"Pembesaran lebih tinggi membuat objek tampak lebih besar, sedangkan area bidang pandang yang terlihat menjadi lebih sempit."}
  ];
  let evalIndex=0, evalScore=0, evalChoice=null, evalLocked=false;
  function renderEval(){
    const item=evalItems[evalIndex];
    $("#evalProgress").textContent="Soal "+(evalIndex+1)+" / "+evalItems.length;
    $("#evalScore").textContent="Skor "+evalScore;
    $("#evalBar").style.width=((evalIndex+1)/evalItems.length*100)+"%";
    $("#evalDomain").textContent=item.domain;
    $("#evalQuestion").textContent=item.q;
    $("#evalOptions").innerHTML=item.opts.map((x,i)=>'<button type="button" data-eval="'+i+'">'+x+'</button>').join("");
    $("#evalFeedback").className="module-feedback neutral";$("#evalFeedback").textContent="Pilih satu jawaban.";
    $("#lockEval").disabled=false;$("#nextEval").hidden=true;evalChoice=null;evalLocked=false;
  }
  $("#evalOptions").addEventListener("click",e=>{
    const b=e.target.closest("[data-eval]");if(!b||evalLocked)return;
    evalChoice=Number(b.dataset.eval);setSelected($("#evalOptions"),b);
  });
  $("#lockEval").addEventListener("click",()=>{
    if(evalChoice===null){$("#evalFeedback").textContent="Pilih satu jawaban sebelum mengunci.";return}
    const item=evalItems[evalIndex],good=evalChoice===item.a;
    evalLocked=true;if(good)evalScore++;
    $$("#evalOptions button").forEach((b,i)=>{b.disabled=true;b.classList.toggle("correct",i===item.a);b.classList.toggle("wrong",i===evalChoice&&!good)});
    $("#evalFeedback").className="module-feedback "+(good?"good":"warn");
    $("#evalFeedback").innerHTML=(good?"<b>Tepat.</b> ":"<b>Belum tepat.</b> ")+item.why;
    $("#evalScore").textContent="Skor "+evalScore;$("#lockEval").disabled=true;$("#nextEval").hidden=false;
    $("#nextEval").textContent=evalIndex===evalItems.length-1?"Lihat hasil akhir →":"Soal berikutnya →";
  });
  $("#nextEval").addEventListener("click",()=>{
    if(evalIndex<evalItems.length-1){evalIndex++;renderEval()}
    else{
      $("#nextEval").hidden=true;
      $("#evalFeedback").className="module-feedback "+(evalScore>=8?"good":"warn");
      $("#evalFeedback").innerHTML="<b>Evaluasi selesai: "+evalScore+" / "+evalItems.length+".</b> "+(evalScore>=8?"Pemahamanmu sudah kuat. Tinjau kembali soal yang masih salah untuk memperkuat alasan.":"Kembali ke Explain dan Elaborate pada konsep yang masih salah, lalu coba jelaskan dengan bahasamu sendiri.");
    }
  });
  renderEval();
})();
