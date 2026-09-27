# IPA Interaktif

Portal media pembelajaran IPA interaktif SMP kelas VII, VIII, dan IX.

## Status

Fondasi **Template Universal v0.2** sudah diterapkan.

## Kerangka universal

1. Orientasi
2. Engage
3. Explore
4. Explain
5. Elaborate
6. Evaluate
7. Reflect

Template menyediakan dua mode:

- **Belajar Mandiri**
- **Bersama Guru**

Strategi tambahan tetap fleksibel dan dipilih sesuai karakter materi, misalnya POE, CPA, Worked Example, Guided Inquiry, PBL, Model-Based Learning, Concept Mapping, dan Data Investigation.

## Struktur repository

- `index.html` — beranda portal
- `assets/` — aset portal
- `template-universal/` — template dasar semua modul
- `kelas-9/listrik-dinamis/` — modul pilot yang akan diadaptasi dari template universal

## Fondasi pedagogis

- 5E + Orientasi dan Refleksi
- Cognitive Theory of Multimedia Learning
- Cognitive Load Theory
- Universal Design for Learning
- Self-Regulated Learning
- ICAP
- Retrieval practice dan feedback formatif

## Aturan pengembangan modul

1. Mulai dari `template-universal/`.
2. Pertahankan alur universal, tetapi sesuaikan aktivitas dengan tujuan pembelajaran.
3. Jangan memaksakan satu pendekatan tambahan pada semua materi.
4. Utamakan tampilan ringkas, responsif, dan tidak bergantung pada scroll panjang.
5. Uji setiap modul pada HP dan desktop.


## Dashboard Guru

Dashboard guru berada di Google Sheet privat melalui `integrations/google-apps-script/Dashboard.gs`.
Dashboard merangkum respons terbaru, keyakinan, kategori kesulitan, dan teks yang masih membingungkan siswa tanpa mempublikasikan data siswa di GitHub Pages.
