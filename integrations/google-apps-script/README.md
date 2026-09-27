# Integrasi Google Sheets — Feedback Siswa v0.4

Backend ini menerima refleksi siswa dari GitHub Pages, mencegah duplikasi pengiriman, lalu menyimpan data ke Google Sheet.

## Penguatan v0.4

- **Submission ID unik** untuk setiap versi refleksi.
- **Session ID** untuk membantu melacak satu sesi perangkat.
- **Idempotensi**: klik/kirim ulang dengan Submission ID yang sama tidak menambah baris ganda.
- **LockService** mencegah race condition saat banyak siswa mengirim bersamaan.
- **Verifikasi server**: frontend mengecek apakah Submission ID benar-benar sudah ada di Sheet.
- **Proteksi formula injection** untuk input yang diawali `=`, `+`, `-`, atau `@`.
- **Migrasi header otomatis** dari struktur v0.3: kolom baru ditambahkan tanpa menghapus data lama.
- Validasi mode, confidence, dan progres.

## Kolom baru

Setelah kolom lama, backend menambahkan:

- Submission ID
- Session ID
- Versi Template

## Data yang disimpan

- waktu server dan waktu siswa
- nama / nomor absen
- kelas
- materi
- mode belajar
- apa yang sudah dipahami
- apa yang masih membingungkan
- kategori kesulitan
- tingkat keyakinan
- progres tahap
- Submission ID
- Session ID
- versi template

Template **tidak sengaja mengirim** email, lokasi, alamat IP, atau informasi perangkat.

## Cara memperbarui deployment yang sudah ada

1. Buka project Google Apps Script yang terhubung ke Sheet.
2. Ganti seluruh isi `Code.gs` dengan versi terbaru dari repository.
3. Simpan.
4. Pilih **Deploy → Manage deployments**.
5. Edit deployment Web App yang sudah ada.
6. Pilih **New version**.
7. Klik **Deploy**.

Gunakan deployment lama yang sama agar URL `/exec` tetap sama.

## Tes setelah update

1. Buka Template Universal v0.4.
2. Ubah isi refleksi.
3. Klik **Kirim Refleksi**.
4. HTML harus menampilkan status terverifikasi.
5. Sheet REFLEKSI akan otomatis memperoleh tiga kolom baru.
6. Menekan kirim ulang tanpa perubahan tidak boleh membuat baris baru.

## Catatan keamanan

Web App ini memang dapat diakses siswa tanpa login agar dapat digunakan dari GitHub Pages. URL endpoint di JavaScript bersifat publik. Karena itu:

- gunakan hanya data pendidikan minimal;
- jangan mengumpulkan data kesehatan, alamat, nomor telepon, atau data sensitif;
- batasi akses Google Sheet hanya untuk guru/pengelola;
- untuk skala lebih besar atau data sensitif, gunakan backend dengan autentikasi dan kontrol akses.

## Dashboard Guru

Tambahkan file `Dashboard.gs` ke project Apps Script yang sama.

Dashboard dibuat **di dalam Google Sheet**, bukan di GitHub Pages. Ini disengaja agar nama siswa dan teks refleksi tidak dipublikasikan melalui website publik.

Setelah file ditambahkan dan disimpan:

1. Reload Google Sheet.
2. Menu baru **IPA Interaktif** akan muncul.
3. Pilih **IPA Interaktif → Perbarui Dashboard**.
4. Sheet **DASHBOARD** dan **RESPON_TERBARU** akan dibuat otomatis.

Dashboard memakai **respons terbaru per siswa + kelas + materi**, sehingga jika seorang siswa mengirim refleksi revisi, dashboard tidak menghitungnya sebagai siswa tambahan.

Filter yang tersedia:

- Kelas
- Materi
- Mode
- Keyakinan
- Kategori kesulitan

Ringkasan utama:

- jumlah respons siswa unik
- jumlah **Perlu bantuan**
- jumlah **Cukup paham**
- jumlah **Sudah yakin**
- kategori kesulitan terbanyak
- daftar siswa/respons yang perlu perhatian

Saat guru membuka spreadsheet, dashboard mencoba diperbarui otomatis. Guru juga dapat memperbarui manual dari menu **IPA Interaktif**.
