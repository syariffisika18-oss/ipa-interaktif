(() => {
  const config = window.IPA_TEMPLATE_CONFIG || {};
  const STORAGE_KEY = "ipa-interaktif:template-universal:v0.2";
  const stageCount = 7;
  const state = loadState();
  let activeStage = Number.isInteger(state.activeStage) ? state.activeStage : 0;
  let completed = Array.isArray(state.completed) ? new Set(state.completed) : new Set();
  let mode = state.mode || config.defaultMode || "mandiri";

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
  restoreReflections();
  setMode(mode);
  showStage(activeStage);

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
  }

  function bindModeButtons() {
    document.querySelectorAll("[data-mode]").forEach(button => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
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
    tabs.forEach(tab => tab.addEventListener("click", () => showStage(Number(tab.dataset.stage))));
    prevButton.addEventListener("click", () => activeStage > 0 && showStage(activeStage - 1));
    nextButton.addEventListener("click", () => activeStage < stageCount - 1 && showStage(activeStage + 1));
    completeButton.addEventListener("click", () => {
      if (completed.has(activeStage)) {
        completed.delete(activeStage);
        showToast("Tanda selesai dibatalkan.");
      } else {
        completed.add(activeStage);
        showToast("Tahap ditandai selesai.");
      }
      renderProgress();
      saveState();
    });
  }

  function showStage(index) {
    activeStage = Math.max(0, Math.min(stageCount - 1, index));
    panels.forEach((panel, i) => panel.classList.toggle("is-active", i === activeStage));
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === activeStage);
      tab.classList.toggle("is-complete", completed.has(i));
    });
    prevButton.disabled = activeStage === 0;
    nextButton.disabled = activeStage === stageCount - 1;
    nextButton.style.opacity = activeStage === stageCount - 1 ? ".45" : "1";
    completeButton.classList.toggle("is-complete", completed.has(activeStage));
    completeButton.textContent = completed.has(activeStage) ? "✓ Sudah selesai" : "Tandai selesai";
    tabs[activeStage]?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});
    window.scrollTo({top:0,behavior:"smooth"});
    renderProgress();
    saveState();
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
        button.parentElement.querySelectorAll(".choice").forEach(item => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        showToast(mode === "guru"
          ? "Prediksi tersimpan. Diskusikan alasannya sebelum membuka penjelasan."
          : "Prediksi tersimpan. Lanjutkan eksplorasi untuk mengujinya.");
      });
    });

    const slider = document.getElementById("demoSlider");
    const output = document.getElementById("demoOutput");
    slider?.addEventListener("input", () => output.textContent = slider.value);

    document.getElementById("strategyGrid").addEventListener("click", event => {
      const chip = event.target.closest(".strategy-chip");
      if (chip) chip.classList.toggle("is-selected");
    });

    document.querySelectorAll("[data-answer]").forEach(button => {
      button.addEventListener("click", () => {
        const feedback = document.getElementById("answerFeedback");
        feedback.hidden = false;
        if (mode === "guru") {
          feedback.textContent = "Respons tercatat. Minta alasan siswa sebelum memberi konsep final.";
        } else if (Number(button.dataset.answer) === 1) {
          feedback.textContent = "Contoh feedback elaboratif: jawaban tepat. Jelaskan juga mengapa pilihan lain tidak sesuai.";
        } else {
          feedback.textContent = "Contoh feedback elaboratif: belum tepat. Arahkan siswa kembali pada hubungan konsep, bukan hanya label benar/salah.";
        }
      });
    });

    document.querySelectorAll("[data-confidence]").forEach(button => {
      button.addEventListener("click", () => {
        button.parentElement.querySelectorAll("button").forEach(item => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        state.confidence = Number(button.dataset.confidence);
        saveState();
      });
    });

    document.querySelectorAll("[data-reflection]").forEach(field => {
      field.addEventListener("input", () => {
        state.reflections = state.reflections || {};
        state.reflections[field.dataset.reflection] = field.value;
        saveState();
      });
    });

    document.getElementById("resetProgress").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      completed = new Set();
      activeStage = 0;
      state.reflections = {};
      document.querySelectorAll("[data-reflection]").forEach(field => field.value = "");
      document.querySelectorAll("[data-confidence]").forEach(button => button.classList.remove("is-selected"));
      setMode(config.defaultMode || "mandiri");
      showStage(0);
      showToast("Progres template direset.");
    });
  }

  function restoreReflections() {
    const saved = state.reflections || {};
    document.querySelectorAll("[data-reflection]").forEach(field => {
      field.value = saved[field.dataset.reflection] || "";
    });
    if (state.confidence) {
      document.querySelector('[data-confidence="' + state.confidence + '"]')?.classList.add("is-selected");
    }
  }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function saveState() {
    state.activeStage = activeStage;
    state.completed = [...completed];
    state.mode = mode;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
})();