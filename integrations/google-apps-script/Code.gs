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
  "Total Tahap",
  "Submission ID",
  "Session ID",
  "Versi Template"
];

const ALLOWED_MODES = ["mandiri", "guru"];
const ALLOWED_CONFIDENCE = ["", "Perlu bantuan", "Cukup paham", "Sudah yakin"];

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = e && e.parameter ? e.parameter : {};
    validate_(data);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    ensureHeader_(sheet);

    const submissionId = clean_(data.submissionId, 100);
    if (submissionExists_(sheet, submissionId)) {
      return json_({ ok: true, duplicate: true, submissionId: submissionId });
    }

    sheet.appendRow([
      new Date(),
      safeCell_(data.timestampClient, 60),
      safeCell_(data.studentName, 80),
      safeCell_(data.className, 30),
      safeCell_(data.materialId, 80),
      safeCell_(data.materialTitle, 120),
      safeCell_(data.mode, 20),
      safeCell_(data.understood, 1000),
      safeCell_(data.confused, 1000),
      safeCell_(data.difficulties, 300),
      safeCell_(data.confidence, 40),
      safeCell_(data.completedStages, 5),
      safeCell_(data.totalStages, 5),
      safeCell_(submissionId, 100),
      safeCell_(data.sessionId, 100),
      safeCell_(data.templateVersion, 20)
    ]);

    return json_({
      ok: true,
      duplicate: false,
      submissionId: submissionId
    });
  } catch (error) {
    return json_({
      ok: false,
      error: String(error && error.message ? error.message : error)
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function doGet(e) {
  try {
    const action = e && e.parameter ? String(e.parameter.action || "") : "";

    if (action === "status") {
      const submissionId = clean_(e.parameter.submissionId, 100);
      const callback = String(e.parameter.callback || "");

      if (!submissionId) {
        return output_(e, { ok: false, found: false, error: "submissionId wajib." });
      }

      const ss = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getSheetByName(SHEET_NAME);

      if (!sheet || sheet.getLastRow() < 2) {
        return output_(e, { ok: true, found: false });
      }

      ensureHeader_(sheet);

      return output_(e, {
        ok: true,
        found: submissionExists_(sheet, submissionId)
      });
    }

    return output_(e, {
      ok: true,
      service: "IPA Interaktif Feedback",
      version: "0.4",
      sheet: SHEET_NAME
    });
  } catch (error) {
    return output_(e, {
      ok: false,
      error: String(error && error.message ? error.message : error)
    });
  }
}

function validate_(data) {
  if (!data.studentName) throw new Error("Identitas siswa wajib diisi.");
  if (!data.className) throw new Error("Kelas wajib diisi.");
  if (!data.materialTitle) throw new Error("Materi wajib diisi.");
  if (!data.submissionId) throw new Error("Submission ID wajib diisi.");
  if (!data.sessionId) throw new Error("Session ID wajib diisi.");

  const mode = String(data.mode || "");
  if (ALLOWED_MODES.indexOf(mode) === -1) {
    throw new Error("Mode pembelajaran tidak valid.");
  }

  const confidence = String(data.confidence || "");
  if (ALLOWED_CONFIDENCE.indexOf(confidence) === -1) {
    throw new Error("Nilai keyakinan tidak valid.");
  }

  const completed = Number(data.completedStages);
  const total = Number(data.totalStages);

  if (!Number.isInteger(completed) || !Number.isInteger(total)) {
    throw new Error("Progres tahap tidak valid.");
  }

  if (completed < 0 || total < 1 || completed > total || total > 50) {
    throw new Error("Rentang progres tahap tidak valid.");
  }
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    styleHeader_(sheet);
    return;
  }

  const currentColumnCount = Math.min(sheet.getLastColumn(), HEADERS.length);
  const current = sheet
    .getRange(1, 1, 1, currentColumnCount)
    .getDisplayValues()[0];

  for (let i = 0; i < current.length; i++) {
    if (current[i] !== HEADERS[i]) {
      throw new Error(
        "Header sheet REFLEKSI tidak sesuai pada kolom " +
        (i + 1) +
        ". Diharapkan: " +
        HEADERS[i]
      );
    }
  }

  if (current.length < HEADERS.length) {
    const missing = HEADERS.slice(current.length);
    sheet
      .getRange(1, current.length + 1, 1, missing.length)
      .setValues([missing]);
  }

  styleHeader_(sheet);
}

function styleHeader_(sheet) {
  sheet.setFrozenRows(1);
  sheet
    .getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setWrap(true);
}

function submissionExists_(sheet, submissionId) {
  if (!submissionId || sheet.getLastRow() < 2) return false;

  const column = HEADERS.indexOf("Submission ID") + 1;
  if (column < 1) return false;

  const range = sheet.getRange(2, column, sheet.getLastRow() - 1, 1);
  const match = range
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();

  return Boolean(match);
}

function safeCell_(value, maxLength) {
  let text = clean_(value, maxLength);

  // Mencegah input siswa dieksekusi sebagai formula Google Sheets.
  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return text;
}

function clean_(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function output_(e, value) {
  const callback =
    e && e.parameter ? String(e.parameter.callback || "") : "";

  if (callback) {
    if (!/^[A-Za-z_$][0-9A-Za-z_$]{0,100}$/.test(callback)) {
      return ContentService
        .createTextOutput("/* callback tidak valid */")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(value) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return json_(value);
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}