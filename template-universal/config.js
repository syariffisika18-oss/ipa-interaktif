window.IPA_TEMPLATE_CONFIG = {
  // ===== IDENTITAS MODUL: ubah bagian ini saat membuat materi baru =====
  appTitle: "IPA Interaktif",
  templateVersion: "0.5",
  materialId: "template-universal",
  materialTitle: "Template Materi IPA",
  materialMeta: "Kelas VII / VIII / IX • Sesuaikan dengan modul",
  objective: "Setelah pembelajaran, peserta didik diharapkan mampu menjelaskan, menerapkan, dan merefleksikan konsep sesuai tujuan modul.",
  defaultMode: "mandiri",

  // ===== OPSIONAL: koneksi refleksi guru =====
  feedbackEndpoint: "https://script.google.com/macros/s/AKfycbypYONB7Q5VvX-bs0zENegZDCzmTmcAFeyzqhDBd2L1cpdI_4m6NDkQMcXDSBqJlGXi/exec",

  // ===== REFLEKSI: ganti sesuai karakter materi bila diperlukan =====
  difficultyCategories: [
    "Konsep",
    "Gambar / visual",
    "Perhitungan",
    "Praktikum / simulasi",
    "Soal latihan",
    "Istilah",
    "Lainnya"
  ],

  // ===== ELABORATE: pilih hanya strategi yang benar-benar dipakai =====
  strategies: [
    "POE",
    "CPA",
    "Worked Example",
    "Guided Inquiry",
    "PBL",
    "Model-Based Learning",
    "Concept Mapping",
    "Data Investigation"
  ]
};