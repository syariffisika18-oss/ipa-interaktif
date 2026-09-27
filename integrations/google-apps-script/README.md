# Integrasi Google Sheets — Feedback Siswa

Backend ini menerima refleksi siswa dari GitHub Pages lalu menambahkannya ke Google Sheet.

## Data yang disimpan

- waktu kirim
- nama / nomor absen
- kelas
- materi
- mode belajar
- apa yang sudah dipahami
- apa yang masih membingungkan
- kategori kesulitan
- tingkat keyakinan
- progres tahap

Template **tidak** mengirim email, lokasi, alamat IP, atau informasi perangkat secara sengaja.

## Setup

1. Buat Google Sheet baru, misalnya **IPA Interaktif - Feedback Siswa**.
2. Salin ID Sheet dari URL Google Sheet.
3. Buka **Extensions → Apps Script**.
4. Tempel isi `Code.gs`.
5. Ganti:
   `GANTI_DENGAN_ID_GOOGLE_SHEET`
   dengan ID Sheet.
6. Klik **Deploy → New deployment → Web app**.
7. Execute as: **Me**.
8. Who has access: pilih opsi yang memungkinkan siswa mengirim tanpa login sesuai kebijakan akun sekolah Anda.
9. Salin URL Web App.
10. Tempel URL tersebut pada `template-universal/config.js`:
    `feedbackEndpoint: "URL_WEB_APP"`.

## Catatan keamanan

GitHub Pages adalah situs publik dan URL Web App yang ditulis di JavaScript dapat dilihat pengguna. Karena itu endpoint ini cocok untuk pilot/kelas dengan data minimal, bukan untuk data sensitif. Batasi data siswa yang dikumpulkan dan gunakan Google Sheet dengan akses guru saja.

Untuk perlindungan yang lebih kuat, gunakan autentikasi atau backend dengan kontrol akses.
