(() => {
  const config = window.IPA_TEMPLATE_CONFIG || {};
  const STORAGE_KEY = "ipa-interaktif:template-universal:v0.5";
  const STORAGE_PREFIX = "ipa-interaktif:template-universal:";
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
    document.getElementById("appTitle").textContent = config.appTitle || "IPA Interaktif";
    document.getElementById("materialTitle").textContent = config.materialTitle || "Template Materi IPA";
    document.getElementById("materialMeta").textContent = config.materialMeta || "Kelas VII / VIII / IX";

    const objective = document.querySelector('[data-slot="objective"]');
    if (objective && config.objective) objective.textContent = config.objective;

    const grid = document.getElementById("strategyGrid");
    (config.strategies || []).forEach((strategy, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "strategy-chip" + (index === 0 ? " is-selected" : "");
      button.textContent = strategy;
      grid.appendChild(button);
    });

    const difficultyGrid = document.getElementById("difficultyGrid");
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
      if (!confirm("Reset seluruh progres, jawaban, identitas, dan refleksi template ini?")) return;

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