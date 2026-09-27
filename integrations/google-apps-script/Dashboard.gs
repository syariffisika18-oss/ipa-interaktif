const DASHBOARD_SHEET_NAME = "DASHBOARD";
const LATEST_SHEET_NAME = "RESPON_TERBARU";

const DASHBOARD_DIFFICULTY_ORDER = [
  "Konsep",
  "Gambar / visual",
  "Perhitungan",
  "Praktikum / simulasi",
  "Soal latihan",
  "Istilah",
  "Lainnya"
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("IPA Interaktif")
    .addItem("Perbarui Dashboard", "refreshDashboard")
    .addItem("Buka Dashboard", "openDashboard")
    .addToUi();

  try {
    refreshDashboard();
  } catch (error) {
    console.error(error);
  }
}

function onEdit(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== DASHBOARD_SHEET_NAME) return;

  const watched = ["B3", "D3", "F3", "H3", "B4"];
  if (watched.indexOf(e.range.getA1Notation()) === -1) return;

  refreshDashboard();
}

function openDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let dashboard = ss.getSheetByName(DASHBOARD_SHEET_NAME);

  if (!dashboard) {
    refreshDashboard();
    dashboard = ss.getSheetByName(DASHBOARD_SHEET_NAME);
  }

  ss.setActiveSheet(dashboard);
}

function refreshDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const source = ss.getSheetByName(SHEET_NAME);

  const dashboard = getOrCreateDashboard_(ss);
  buildDashboardLayout_(dashboard);

  if (!source || source.getLastRow() < 2) {
    writeEmptyDashboard_(dashboard);
    return;
  }

  ensureHeader_(source);

  const values = source
    .getRange(1, 1, source.getLastRow(), HEADERS.length)
    .getDisplayValues();

  const headerMap = headerMap_(values[0]);
  const latestRows = latestResponses_(values.slice(1), headerMap);

  writeLatestSheet_(ss, latestRows, headerMap);
  updateFilterValidations_(dashboard, latestRows, headerMap);

  const filters = readFilters_(dashboard);
  const filtered = latestRows.filter(row =>
    matchesFilters_(row, headerMap, filters)
  );

  writeDashboardSummary_(dashboard, filtered, headerMap);
  dashboard.getRange("G2").setValue(
    "Diperbarui: " +
    Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    )
  );
}

function getOrCreateDashboard_(ss) {
  let sheet = ss.getSheetByName(DASHBOARD_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(DASHBOARD_SHEET_NAME);
  return sheet;
}

function buildDashboardLayout_(sheet) {
  if (sheet.getRange("A1").getDisplayValue() === "DASHBOARD GURU — IPA INTERAKTIF") {
    return;
  }

  sheet.clear();
  sheet.clearConditionalFormatRules();

  sheet.getRange("A1:I1").merge()
    .setValue("DASHBOARD GURU — IPA INTERAKTIF")
    .setFontSize(18)
    .setFontWeight("bold")
    .setHorizontalAlignment("left");

  sheet.getRange("A2:F2").merge()
    .setValue("Ringkasan menggunakan respons TERBARU setiap siswa pada setiap materi.")
    .setFontColor("#5f7672");

  sheet.getRange("G2:I2").merge()
    .setValue("Belum diperbarui")
    .setHorizontalAlignment("right")
    .setFontColor("#5f7672");

  sheet.getRange("A3").setValue("Kelas").setFontWeight("bold");
  sheet.getRange("C3").setValue("Materi").setFontWeight("bold");
  sheet.getRange("E3").setValue("Mode").setFontWeight("bold");
  sheet.getRange("G3").setValue("Keyakinan").setFontWeight("bold");
  sheet.getRange("A4").setValue("Kategori").setFontWeight("bold");

  sheet.getRange("A6").setValue("Respons siswa unik");
  sheet.getRange("C6").setValue("Perlu bantuan");
  sheet.getRange("E6").setValue("Cukup paham");
  sheet.getRange("G6").setValue("Sudah yakin");

  ["A6","C6","E6","G6"].forEach(a1 => {
    sheet.getRange(a1).setFontWeight("bold").setFontColor("#5f7672");
  });

  ["B6","D6","F6","H6"].forEach(a1 => {
    sheet.getRange(a1)
      .setFontSize(20)
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
  });

  sheet.getRange("A9:B9")
    .setValues([["Kategori Kesulitan", "Jumlah"]])
    .setFontWeight("bold");

  sheet.getRange("D9:I9")
    .setValues([[
      "Nama / Absen",
      "Kelas",
      "Materi",
      "Yang Membingungkan",
      "Kesulitan",
      "Keyakinan"
    ]])
    .setFontWeight("bold");

  sheet.setFrozenRows(4);
  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 145);
  sheet.setColumnWidth(4, 135);
  sheet.setColumnWidth(5, 135);
  sheet.setColumnWidth(6, 145);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 130);
  sheet.setColumnWidth(9, 120);

  sheet.getRange("A1:I35").setVerticalAlignment("middle");
  sheet.getRange("D10:I35").setWrap(true);
  sheet.getRange("A1:I35").setFontFamily("Arial");

  const light = "#eef7f5";
  sheet.getRange("A1:I1").setBackground("#dff2ed");
  sheet.getRange("A3:I4").setBackground(light);
  sheet.getRange("A6:H6").setBackground("#f7fbfa");
  sheet.getRange("A9:B9").setBackground(light);
  sheet.getRange("D9:I9").setBackground(light);
}

function writeEmptyDashboard_(sheet) {
  sheet.getRange("B6").setValue(0);
  sheet.getRange("D6").setValue(0);
  sheet.getRange("F6").setValue(0);
  sheet.getRange("H6").setValue(0);

  sheet.getRange("A10:B35").clearContent();
  sheet.getRange("D10:I35").clearContent();

  setDropdown_(sheet.getRange("B3"), ["Semua"], "Semua");
  setDropdown_(sheet.getRange("D3"), ["Semua"], "Semua");
  setDropdown_(sheet.getRange("F3"), ["Semua"], "Semua");
  setDropdown_(sheet.getRange("H3"), ["Semua"], "Semua");
  setDropdown_(sheet.getRange("B4"), ["Semua"], "Semua");

  sheet.getRange("G2").setValue("Belum ada respons.");
}

function headerMap_(headerRow) {
  const map = {};
  headerRow.forEach((header, index) => {
    map[String(header).trim()] = index;
  });
  return map;
}

function latestResponses_(rows, map) {
  const latest = new Map();

  rows.forEach(row => {
    const name = value_(row, map, "Nama / Nomor Absen");
    const className = value_(row, map, "Kelas");
    const materialId =
      value_(row, map, "ID Materi") ||
      value_(row, map, "Materi");

    if (!name || !className || !materialId) return;

    const key = [
      name.toLowerCase(),
      className.toLowerCase(),
      materialId.toLowerCase()
    ].join("||");

    // REFLEKSI memakai appendRow; baris yang lebih bawah adalah kiriman lebih baru.
    latest.set(key, row);
  });

  return Array.from(latest.values());
}

function writeLatestSheet_(ss, rows, map) {
  let sheet = ss.getSheetByName(LATEST_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(LATEST_SHEET_NAME);

  const outputHeaders = [
    "Timestamp Server",
    "Nama / Nomor Absen",
    "Kelas",
    "Materi",
    "Mode",
    "Yang Dipahami",
    "Yang Membingungkan",
    "Kategori Kesulitan",
    "Keyakinan",
    "Tahap Selesai",
    "Total Tahap",
    "Submission ID",
    "Versi Template"
  ];

  const output = rows.map(row => outputHeaders.map(header =>
    value_(row, map, header)
  ));

  sheet.clearContents();
  sheet.getRange(1, 1, 1, outputHeaders.length)
    .setValues([outputHeaders])
    .setFontWeight("bold")
    .setBackground("#eef7f5");

  if (output.length) {
    sheet.getRange(2, 1, output.length, outputHeaders.length)
      .setValues(output)
      .setWrap(true);
  }

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, outputHeaders.length);
  sheet.setColumnWidth(6, 220);
  sheet.setColumnWidth(7, 260);
  sheet.setColumnWidth(8, 180);
}

function updateFilterValidations_(dashboard, rows, map) {
  const classes = uniqueSorted_(rows.map(row => value_(row, map, "Kelas")));
  const materials = uniqueSorted_(rows.map(row => value_(row, map, "Materi")));
  const modes = uniqueSorted_(rows.map(row => value_(row, map, "Mode")));
  const confidences = uniqueSorted_(rows.map(row => value_(row, map, "Keyakinan")));

  const categoriesSet = new Set();
  rows.forEach(row => {
    splitDifficulties_(value_(row, map, "Kategori Kesulitan"))
      .forEach(item => categoriesSet.add(item));
  });

  const categories = [
    ...DASHBOARD_DIFFICULTY_ORDER.filter(item => categoriesSet.has(item)),
    ...Array.from(categoriesSet)
      .filter(item => DASHBOARD_DIFFICULTY_ORDER.indexOf(item) === -1)
      .sort()
  ];

  setDropdownPreserve_(dashboard.getRange("B3"), classes);
  setDropdownPreserve_(dashboard.getRange("D3"), materials);
  setDropdownPreserve_(dashboard.getRange("F3"), modes);
  setDropdownPreserve_(dashboard.getRange("H3"), confidences);
  setDropdownPreserve_(dashboard.getRange("B4"), categories);
}

function setDropdownPreserve_(range, items) {
  const options = ["Semua"].concat(items.filter(Boolean));
  const current = range.getDisplayValue();
  const value = options.indexOf(current) >= 0 ? current : "Semua";
  setDropdown_(range, options, value);
}

function setDropdown_(range, options, value) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .build();

  range.setDataValidation(rule).setValue(value);
}

function readFilters_(dashboard) {
  return {
    className: dashboard.getRange("B3").getDisplayValue() || "Semua",
    material: dashboard.getRange("D3").getDisplayValue() || "Semua",
    mode: dashboard.getRange("F3").getDisplayValue() || "Semua",
    confidence: dashboard.getRange("H3").getDisplayValue() || "Semua",
    difficulty: dashboard.getRange("B4").getDisplayValue() || "Semua"
  };
}

function matchesFilters_(row, map, filters) {
  if (
    filters.className !== "Semua" &&
    value_(row, map, "Kelas") !== filters.className
  ) return false;

  if (
    filters.material !== "Semua" &&
    value_(row, map, "Materi") !== filters.material
  ) return false;

  if (
    filters.mode !== "Semua" &&
    value_(row, map, "Mode") !== filters.mode
  ) return false;

  if (
    filters.confidence !== "Semua" &&
    value_(row, map, "Keyakinan") !== filters.confidence
  ) return false;

  if (filters.difficulty !== "Semua") {
    const difficulties = splitDifficulties_(
      value_(row, map, "Kategori Kesulitan")
    );

    if (difficulties.indexOf(filters.difficulty) === -1) return false;
  }

  return true;
}

function writeDashboardSummary_(dashboard, rows, map) {
  const confidenceCounts = {
    "Perlu bantuan": 0,
    "Cukup paham": 0,
    "Sudah yakin": 0
  };

  const difficultyCounts = new Map();

  rows.forEach(row => {
    const confidence = value_(row, map, "Keyakinan");
    if (Object.prototype.hasOwnProperty.call(confidenceCounts, confidence)) {
      confidenceCounts[confidence] += 1;
    }

    splitDifficulties_(
      value_(row, map, "Kategori Kesulitan")
    ).forEach(category => {
      difficultyCounts.set(
        category,
        (difficultyCounts.get(category) || 0) + 1
      );
    });
  });

  dashboard.getRange("B6").setValue(rows.length);
  dashboard.getRange("D6").setValue(confidenceCounts["Perlu bantuan"]);
  dashboard.getRange("F6").setValue(confidenceCounts["Cukup paham"]);
  dashboard.getRange("H6").setValue(confidenceCounts["Sudah yakin"]);

  const difficultyRows = Array.from(difficultyCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"));

  dashboard.getRange("A10:B35").clearContent();

  if (difficultyRows.length) {
    dashboard
      .getRange(10, 1, Math.min(difficultyRows.length, 26), 2)
      .setValues(difficultyRows.slice(0, 26));
  } else {
    dashboard.getRange("A10").setValue("Belum ada kategori pada filter ini.");
  }

  const attention = rows
    .filter(row =>
      value_(row, map, "Keyakinan") === "Perlu bantuan" ||
      Boolean(value_(row, map, "Yang Membingungkan"))
    )
    .sort((a, b) => {
      const aHelp = value_(a, map, "Keyakinan") === "Perlu bantuan" ? 0 : 1;
      const bHelp = value_(b, map, "Keyakinan") === "Perlu bantuan" ? 0 : 1;
      return aHelp - bHelp;
    })
    .slice(0, 26)
    .map(row => [
      value_(row, map, "Nama / Nomor Absen"),
      value_(row, map, "Kelas"),
      value_(row, map, "Materi"),
      value_(row, map, "Yang Membingungkan"),
      value_(row, map, "Kategori Kesulitan"),
      value_(row, map, "Keyakinan")
    ]);

  dashboard.getRange("D10:I35").clearContent();

  if (attention.length) {
    dashboard.getRange(10, 4, attention.length, 6)
      .setValues(attention)
      .setWrap(true);
  } else {
    dashboard.getRange("D10").setValue(
      "Tidak ada respons yang memerlukan perhatian pada filter ini."
    );
  }
}

function value_(row, map, header) {
  const index = map[header];
  return index === undefined ? "" : String(row[index] || "").trim();
}

function splitDifficulties_(text) {
  if (!text) return [];

  return String(text)
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function uniqueSorted_(values) {
  return Array.from(
    new Set(values.map(value => String(value || "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "id"));
}
