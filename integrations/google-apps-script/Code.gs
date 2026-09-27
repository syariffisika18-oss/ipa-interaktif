const SHEET_ID = "GANTI_DENGAN_ID_GOOGLE_SHEET";
const SHEET_NAME = "REFLEKSI";

const HEADERS = [
  "Timestamp Server",
  "Timestamp Siswa",
  "Nama / Nomor Absen",
  "Kelas",
  "ID Materi",
  "Materi",
  "Mode",
  "Yang Dipahami",
  "Yang Membingungkan",
  "Kategori Kesulitan",
  "Keyakinan",
  "Tahap Selesai",
  "Total Tahap"
];

function doPost(e) {
  try {
    const data = e && e.parameter ? e.parameter : {};
    validate_(data);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    ensureHeader_(sheet);

    sheet.appendRow([
      new Date(),
      clean_(data.timestampClient, 60),
      clean_(data.studentName, 80),
      clean_(data.className, 30),
      clean_(data.materialId, 80),
      clean_(data.materialTitle, 120),
      clean_(data.mode, 20),
      clean_(data.understood, 1000),
      clean_(data.confused, 1000),
      clean_(data.difficulties, 300),
      clean_(data.confidence, 40),
      clean_(data.completedStages, 5),
      clean_(data.totalStages, 5)
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function doGet() {
  return json_({ ok: true, service: "IPA Interaktif Feedback", sheet: SHEET_NAME });
}

function validate_(data) {
  if (!data.studentName) throw new Error("Identitas siswa wajib diisi.");
  if (!data.className) throw new Error("Kelas wajib diisi.");
  if (!data.materialTitle) throw new Error("Materi wajib diisi.");
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    return;
  }

  const current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (current.join("|") !== HEADERS.join("|")) {
    throw new Error("Header sheet REFLEKSI tidak sesuai template.");
  }
}

function clean_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
