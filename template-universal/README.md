# Template Universal IPA Interaktif v0.4

Template ini menjadi fondasi semua modul IPA SMP kelas VII, VIII, dan IX.

## Struktur universal

1. **Orientasi** — tujuan, prasyarat, diagnostik.
2. **Engage** — fenomena, apersepsi, prediksi.
3. **Explore** — manipulasi, observasi, simulasi, data.
4. **Explain** — visualisasi, pembentukan konsep, self-explanation.
5. **Elaborate** — aplikasi baru dan strategi tambahan yang adaptif.
6. **Evaluate** — retrieval practice, feedback, dan evaluasi.
7. **Reflect** — refleksi, monitoring, tindak lanjut.

## Feedback ke guru

Tahap Reflect mendukung pengiriman ke Google Sheets melalui Google Apps Script.

Versi v0.4 menambahkan Submission ID, pencegahan duplikasi, verifikasi bahwa data benar-benar tercatat di Sheet, status waktu kirim terakhir, dan proteksi input formula.

Data minimal yang dikirim:
- nama/nomor absen
- kelas
- materi dan mode belajar
- refleksi yang dipahami dan membingungkan
- kategori kesulitan
- tingkat keyakinan
- progres

Jika endpoint belum dikonfigurasi, refleksi hanya disimpan pada perangkat siswa.

## Dua mode penggunaan

- **Mandiri** — petunjuk, feedback, progres, dan dukungan belajar mandiri lebih eksplisit.
- **Bersama Guru** — penjelasan final dapat ditahan agar guru mengendalikan diskusi dan scaffolding.

## Pendekatan adaptif

Pilih sesuai karakter materi: POE, CPA, Worked Example, Guided Inquiry, PBL, Model-Based Learning, Concept Mapping, atau Data Investigation.

## Cara membuat modul baru

1. Salin folder `template-universal/` ke folder materi.
2. Edit `config.js`.
3. Ganti placeholder pada tiap tahap.
4. Hapus strategi/interaksi yang tidak relevan.
5. Uji pada HP dan desktop.
6. Hindari halaman yang terlalu padat dan scroll panjang.
