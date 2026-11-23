# PBL Case Builder — Prompt Setiap Integrasi AI

Setiap panel AI di PBL (`skripsi/v2`) prompt-nya **diatur penuh dari panel admin** dan
**dipakai apa adanya**. Tidak ada lapisan tambahan: apa yang diisi admin di textarea itulah
yang dikirim ke model.

Prompt yang ada di kode (`DEFAULT_PROMPT`, `REWRITE_PROMPT`, `DRAFT_PROMPT`,
`buildImagePrompt`) hanya berfungsi sebagai **fallback kalau konstantanya kosong** — supaya
database yang belum pernah di-seed tetap bisa menjawab. Begitu key-nya ada isinya, kode tidak
menambahkan apa pun.

> **Konsekuensinya: admin memegang juga aturan yang membuat panel berfungsi.** Setiap panel di
> bawah punya catatan "jangan dihapus saat menulis ulang" — aturan yang kalau hilang membuat
> panel rusak dengan gejala yang terlihat seperti masalah model, bukan masalah setting.

Yang disisipkan runtime di luar prompt hanyalah konteks laporan dan pesan mahasiswa, pada
posisi yang dijelaskan per panel. Notasi `«...»` berarti nilai runtime.

---

## Daftar isi

1. [AI Chat](#1-ai-chat)
2. [Asisten Bagian — mode menyunting](#2-asisten-bagian--mode-menyunting)
3. [Asisten Bagian — mode menulis draf](#3-asisten-bagian--mode-menulis-draf)
4. [Diagram Builder](#4-diagram-builder)
5. [Searcher](#5-searcher)
6. [Ringkasan konstanta](#ringkasan-konstanta)
7. [Batas ukuran](#batas-ukuran)
8. [Catatan teknis](#catatan-teknis)

Seluruh PBL hanya punya **empat pemanggilan model** dan **satu pencarian**.

| Panel | Service | Panggilan model | Field admin |
|---|---|---|---|
| AI Chat | `normalChatV2Service` | `generateStreamWithHistory` | `pbl_ai_chat_prompt` |
| Asisten Bagian | `sectionAssistantV2Service` | `generateFromText` | `pbl_ai_edit_rewrite_prompt`, `pbl_ai_edit_draft_prompt` |
| Diagram Builder | `generateSkripsiDiagramImageV2Service` | `generateImage` | `pbl_diagram_prompt` |
| Searcher | `runSkripsiSearcherV2Service` | `PerplexityService.search` | — tidak ada prompt |
| ~~`/ai-edit`~~ | `editSectionTextV2Service` | ter-route, tanpa pemanggil frontend | ikut `pbl_ai_edit_rewrite_prompt` |

---

## 1. AI Chat

**Service:** `backend/services/skripsi/v2/normalChatV2Service.js`
**Model:** `pbl_ai_chat_model` → `gemini-2.5-flash`
**Field admin:** `pbl_ai_chat_prompt`

Gemini menerima `systemInstruction` terpisah dari `contents`, jadi prompt ini benar-benar
menempati slot system — bukan disisipkan sebagai pesan pertama.

### Yang diisi admin

Isi awal setelah seeding, dan ini yang muncul di textarea:

```
Kamu adalah asisten AI yang mendampingi mahasiswa kedokteran menyusun laporan PBL (Problem-Based Learning).

Peranmu:
- Menjelaskan konsep klinis dan mekanisme penyakit yang relevan dengan kasus
- Membantu menyusun kerangka pembahasan dan alur argumen laporan
- Meninjau struktur, koherensi, dan kualitas penulisan akademis
- Membantu merumuskan learning issue dan menajamkan pertanyaan
- Memberi masukan konstruktif atas bagian laporan yang dilampirkan mahasiswa

Panduan:
- Gunakan bahasa Indonesia formal dan akademis
- Jawab langsung dan runtut; pakai poin bila itu memudahkan pembaca
- Jika mahasiswa melampirkan isi laporannya, jadikan itu rujukan utama, dan jangan mengarang isi bagian yang masih kosong
- Katakan terus terang bila kamu tidak yakin, dan sebutkan apa yang perlu mahasiswa verifikasi ke sumber primer
- Untuk klaim klinis yang spesifik, arahkan mahasiswa memverifikasi lewat tab Searcher yang mencari jurnal dan guideline

Tab ini percakapan biasa tanpa pencarian otomatis, jadi kamu tidak memegang daftar referensi. Jangan mengaku mengutip sumber yang tidak kamu miliki, dan jangan menuliskan penanda sitasi seperti [1].
```

> **Jangan dihapus saat menulis ulang:** paragraf terakhir. Tab ini tidak punya retrieval,
> jadi tidak pernah memegang daftar referensi. Tanpa diberi tahu, model yang dimintai sumber
> akan mengarang — dan frontend akan mengubah `[1]` yang ia tulis menjadi tautan ke sumber
> yang tidak ada.
>
> Jangan pula menyuruh model menolak menjawab ketika tidak ada referensi. Referensi di sini
> memang selalu kosong, jadi model akan menolak menjawab **apa pun**. Itu persis yang terjadi
> ketika tab ini masih meminjam prompt Searcher.

### Yang dikirim ke AI

`systemInstruction` — prompt di atas apa adanya. Kalau mahasiswa mencentang sesuatu di dialog
konteks, blok konteks **ditempel di belakangnya**:

```
«seluruh isi pbl_ai_chat_prompt»

--- KONTEKS LAPORAN MAHASISWA ---
Berikut isi laporan yang sedang dikerjakan. Gunakan sebagai rujukan saat menjawab.
Jangan menyalin ulang bagian ini ke dalam jawaban kecuali diminta, dan jangan mengarang isi bagian yang ditandai masih kosong.

Judul laporan: Crush Syndrome pada Korban Gempa

Kasus PBL (konteks, bukan bagian yang ditulis):
Tn. A, 34 tahun, tertimpa reruntuhan selama 8 jam. Tungkai kanan bengkak, urin
berwarna gelap...

Isi bagian "Patofisiologi":
Kerusakan otot menyebabkan keluarnya mioglobin ke sirkulasi [1]...

Referensi tersimpan (gunakan penanda [n] persis seperti di sini):
[1] Sever MS, Vanholder R. Management of crush victims in mass disasters. 2013.
[2] Bosch X, Poch E. Rhabdomyolysis and acute kidney injury. N Engl J Med. 2009.
--- AKHIR KONTEKS ---
```

Kalau mahasiswa tidak mencentang apa pun, seluruh blok `--- KONTEKS ... ---` tidak ikut
dikirim — yang terkirim hanya prompt admin, tanpa sisa penanda apa pun.

`contents` — 10 turn terakhir (`skripsi_ai_researcher_context_messages`), baris berisi teks
kosong sudah disaring, lalu pesan baru:

```js
[
  { role: 'user',  parts: [{ text: 'kenapa urinnya gelap?' }] },
  { role: 'model', parts: [{ text: 'Warna gelap itu mioglobinuria...' }] },
  { role: 'user',  parts: [{ text: 'tolong bantu susun pembahasannya' }] },
]
```

`sender_type: 'user'` menjadi `role: 'user'`; selain itu menjadi `role: 'model'`.

### Variasi isi bagian dalam blok konteks

| Keadaan bagian | Yang muncul di prompt |
|---|---|
| ada isinya | `Isi bagian "«judul»":` lalu teksnya (HTML sudah distrip) |
| masih kosong | `Isi bagian "«judul»":` lalu `(masih kosong)` |
| kena batas 60.000 char | teks terpotong, lalu `(bagian ini dipotong karena konteks sudah penuh)` |
| tidak muat sama sekali | `Catatan: «n» bagian lain dilampirkan mahasiswa tetapi tidak muat dan tidak disertakan di sini.` |

---

## 2. Asisten Bagian — mode menyunting

**Service:** `backend/services/skripsi/v2/sectionAssistantV2Service.js` (mode `rewrite`)
**Endpoint:** `POST /api/v2/skripsi/sections/:sectionId/assist`
**Model:** `pbl_ai_edit_model` → `gemini-2.5-flash`
**Field admin:** `pbl_ai_edit_rewrite_prompt`

Dipakai saat mahasiswa memblok teks di editor lalu meminta revisi.

### Yang diisi admin

```
Anda adalah asisten penyunting untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.
Tugas Anda hanya menyunting potongan teks yang diberikan sesuai instruksi penyunting.

Aturan wajib:
- Jawab HANYA dengan teks hasil suntingan. Tanpa pembuka, tanpa penutup, tanpa penjelasan, tanpa tanda kutip pembungkus, tanpa blok kode markdown.
- Gunakan Bahasa Indonesia ilmiah yang baku dan sesuai gaya penulisan laporan akademik.
- Pertahankan istilah medis, nama obat, dosis, satuan dan angka apa adanya.
- Jangan mengarang data, diagnosis, angka, atau sumber yang tidak ada pada konteks yang diberikan.
- Jika konteks menyertakan daftar referensi, pakai penanda [n] yang sama persis; jangan membuat nomor baru.
- Pertahankan semua penanda sitasi seperti [1], [2] persis di posisi yang sama relatif terhadap kalimatnya.
- Jangan menambah fakta, diagnosis, atau klaim baru yang tidak ada pada teks asli.
- Jika teks asli sudah memenuhi instruksi, kembalikan teks tersebut dengan perbaikan seperlunya saja.
```

> **Jangan dihapus saat menulis ulang:**
> - **"Jawab HANYA dengan teks hasil suntingan"** — hasilnya langsung mengganti teks yang
>   diblok mahasiswa. Model yang menambahi pembuka ("Berikut hasil revisinya:") atau
>   membungkus dengan blok kode markdown akan memasukkan sampah itu ke dalam laporan.
> - **Aturan penanda sitasi** — revisi yang menghilangkan `[1]` memutus kalimat dari sumber
>   yang sudah dicari mahasiswa.

### Yang dikirim ke AI

`systemInstruction` — prompt di atas apa adanya, tanpa tambahan.

`contents` — satu pesan user, dengan mahasiswa mencentang **Kasus** dan **Isi bagian ini**:

```
Judul laporan: Crush Syndrome pada Korban Gempa

Kasus PBL (konteks, bukan bagian yang ditulis):
Tn. A, 34 tahun, tertimpa reruntuhan selama 8 jam...
Isi bagian "Patofisiologi":
Kerusakan otot menyebabkan keluarnya mioglobin ke sirkulasi [1]. Mioglobin
kemudian mengendap di tubulus ginjal...
Bagian yang sedang dikerjakan: Patofisiologi
Instruksi mahasiswa:
- perjelas alur dari kerusakan otot sampai gagal ginjal

Teks yang harus disunting:
"""
Mioglobin kemudian mengendap di tubulus ginjal dan menyebabkan AKI [1].
"""
```

> Tidak ada baris kosong antara isi bagian dan `Bagian yang sedang dikerjakan:`. Itu bukan
> salah tulis dokumen ini — lihat [Catatan teknis](#baris-kosong-pemisah-hilang).

Kalau mahasiswa mencentang **"Isi bagian ini"**, bagian yang sedang dikerjakan ditaruh
**paling depan** dalam daftar, sehingga dialah yang paling terakhir terpotong kalau budget
konteks habis.

---

## 3. Asisten Bagian — mode menulis draf

**Service:** sama, mode `draft`
**Field admin:** `pbl_ai_edit_draft_prompt`

Dipakai saat bagian laporan masih kosong — tidak ada teks yang bisa diblok, jadi mahasiswa
tidak akan pernah bisa minta versi pertama lewat mode menyunting.

### Yang diisi admin

```
Anda adalah asisten penulis untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.
Tugas Anda menulis draf untuk satu bagian laporan sesuai instruksi mahasiswa dan konteks laporan yang diberikan.

Aturan wajib:
- Jawab HANYA dengan isi bagian tersebut. Tanpa pembuka, tanpa penutup, tanpa komentar, tanpa blok kode markdown.
- Jangan menulis ulang judul bagian; mahasiswa sudah punya judulnya.
- Format dengan HTML sederhana saja: <p>, <ul>, <ol>, <li>, <strong>, <em>. Tanpa atribut, tanpa tag lain.
- Gunakan Bahasa Indonesia ilmiah yang baku dan sesuai gaya penulisan laporan akademik.
- Pertahankan istilah medis, nama obat, dosis, satuan dan angka apa adanya.
- Jangan mengarang data, diagnosis, angka, atau sumber yang tidak ada pada konteks yang diberikan.
- Jika konteks menyertakan daftar referensi, pakai penanda [n] yang sama persis; jangan membuat nomor baru.
- Tulis draf yang masih wajar untuk disunting mahasiswa, bukan teks final yang mengaku lengkap.
```

> **Jangan dihapus saat menulis ulang:** **daftar putih tag HTML**. Hasilnya masuk ke editor
> rich text; tag di luar daftar itu tidak dirender dan muncul sebagai markup mentah di dalam
> dokumen mahasiswa.

### Yang dikirim ke AI

`systemInstruction` — prompt di atas apa adanya.

`contents` — satu pesan user. Bentuknya sama dengan mode menyunting, **tanpa blok
`Teks yang harus disunting`** karena belum ada teks yang diblok:

```
Judul laporan: Crush Syndrome pada Korban Gempa

Kasus PBL (konteks, bukan bagian yang ditulis):
Tn. A, 34 tahun, tertimpa reruntuhan selama 8 jam...
Bagian yang sedang dikerjakan: Tatalaksana Awal
Instruksi mahasiswa:
- tulis draf tatalaksana di lapangan sebelum ekstraksi
```

> **Kenapa dua field, bukan satu.** Aturannya saling bertentangan: mode `draft` **harus**
> mengizinkan beberapa tag HTML karena hasilnya masuk editor rich text, sementara mode
> `rewrite` **melarang** pembungkus apa pun karena hasilnya langsung mengganti teks yang
> diblok. Digabung jadi satu prompt, dua-duanya rusak.

---

## 4. Diagram Builder

**Service:** `backend/services/skripsi/v2/generateSkripsiDiagramImageV2Service.js`
**Model:** `pbl_diagram_image_model` → `gemini-2.5-flash-image`
**Field admin:** `pbl_diagram_prompt`

Model gambar tidak punya pemisahan system/user — `generateImage(model, prompt)` hanya menerima
**satu string**. Jadi yang diisi admin adalah brief gambar secara utuh, dan hanya penanda
`{{deskripsi}}` yang disubstitusi.

### Yang diisi admin

```
Buat diagram edukatif untuk mahasiswa kedokteran berdasarkan permintaan berikut:
"{{deskripsi}}"

Ketentuan gambar:
- Gaya flowchart/diagram ilmiah yang bersih, bukan ilustrasi artistik.
- Latar putih polos, garis dan panah tegas, kotak-kotak rapi.
- Semua teks dalam Bahasa Indonesia, ejaan medis yang benar, huruf besar jelas dan mudah dibaca.
- Tanpa watermark, tanpa logo, tanpa tangan atau figur manusia dekoratif.
- Susun alurnya dari atas ke bawah agar mudah diikuti.
```

Yang ditulis mahasiswa adalah **topik** ("patofisiologi crush syndrome"), bukan brief gambar.
Brief inilah yang mengubahnya jadi brief.

> **Jangan dihapus saat menulis ulang:** penanda `{{deskripsi}}`. Kalau hilang, topik mahasiswa
> ditempel di akhir brief sebagai `"«topik»"` supaya tidak ikut hilang — tapi posisinya jadi di
> luar kendali, dan brief tanpa topik sama sekali akan membuat model mengarang subjeknya
> sendiri.

| Kondisi | Perilaku |
|---|---|
| brief memuat `{{deskripsi}}` | topik disisipkan di posisi itu, semua kemunculan |
| penanda terhapus | topik ditambahkan di akhir, dalam tanda kutip |
| field kosong | jatuh ke `buildImagePrompt` di kode |

### Yang dikirim ke AI

Satu string, untuk mahasiswa yang menulis `patofisiologi crush syndrome`:

```
Buat diagram edukatif untuk mahasiswa kedokteran berdasarkan permintaan berikut:
"patofisiologi crush syndrome"

Ketentuan gambar:
- Gaya flowchart/diagram ilmiah yang bersih, bukan ilustrasi artistik.
- Latar putih polos, garis dan panah tegas, kotak-kotak rapi.
- Semua teks dalam Bahasa Indonesia, ejaan medis yang benar, huruf besar jelas dan mudah dibaca.
- Tanpa watermark, tanpa logo, tanpa tangan atau figur manusia dekoratif.
- Susun alurnya dari atas ke bawah agar mudah diikuti.
```

---

## 5. Searcher

**Service:** `backend/services/skripsi/v2/runSkripsiSearcherV2Service.js`

**Tidak ada prompt, dan tidak bisa ada.** Service ini memanggil `PerplexityService.search()`
— Search API Perplexity, yang mengembalikan hasil pencarian mentah **tanpa model yang menjawab
di atasnya**. Tidak ada slot prompt untuk dikonfigurasi; menambah field prompt di panel admin
hanya akan jadi tombol mati.

Yang dikirim hanyalah parameter pencarian:

```js
{
  query: 'crush syndrome rhabdomyolysis management',   // atau array untuk mode Multiple
  max_results: 10,                                     // limit mahasiswa ?? pbl_searcher_max_results
  search_mode: 'academic',                             // hanya bila mahasiswa menyalakan filter
  // + filter domain dan filter waktu bila dinyalakan
}
```

`search_mode` sengaja tidak di-default: parameter itu tidak diterima di semua API key
Perplexity, jadi mengirimnya selalu akan menggagalkan pencarian yang tidak pernah meminta
pemisahan web/akademik.

Yang bisa diatur admin untuk Searcher: saklar aktif, biaya kredit, dan jumlah hasil default.

---

## Ringkasan konstanta

Semua key diawali `pbl_`. Yang berakhiran `_prompt` berisi **prompt utuh** yang dipakai apa
adanya.

| Key | Isi awal | Keterangan |
|---|---|---|
| `pbl_ai_chat_enabled` | `true` | saklar tab AI Chat |
| `pbl_ai_chat_model` | `gemini-2.5-flash` | model AI Chat |
| `pbl_ai_chat_prompt` | 1143 char | system prompt AI Chat |
| `pbl_ai_chat_cost` | `0` | biaya kredit per pesan |
| `pbl_ai_edit_enabled` | `true` | saklar Asisten Bagian |
| `pbl_ai_edit_model` | `gemini-2.5-flash` | model Asisten Bagian |
| `pbl_ai_edit_rewrite_prompt` | 1027 char | system prompt mode menyunting |
| `pbl_ai_edit_draft_prompt` | 997 char | system prompt mode menulis draf |
| `pbl_ai_edit_cost` | `0` | biaya kredit per permintaan |
| `pbl_searcher_enabled` | `true` | saklar Searcher |
| `pbl_searcher_max_results` | `10` | jumlah hasil bila mahasiswa tidak mengatur |
| `pbl_searcher_cost` | `0` | biaya kredit per pencarian |
| `pbl_diagram_enabled` | `true` | saklar Diagram Builder |
| `pbl_diagram_image_model` | `gemini-2.5-flash-image` | model gambar |
| `pbl_diagram_prompt` | 474 char | brief gambar, memuat `{{deskripsi}}` |
| `pbl_diagram_cost` | `0` | biaya kredit per diagram |

### Seeder hanya mengisi sekali

`prisma/seeds/pblConstants.seed.js` memakai `upsert` dengan `update: {}` — key yang sudah ada
**tidak disentuh**. Jadi menjalankan seeder berapa kali pun tidak akan me-reset prompt yang
sudah diedit admin.

Satu jebakan: `console.log` di seeder mencetak nilai hasil hitungan, bukan nilai yang sebenarnya
tersimpan. Setelah admin mengedit prompt lalu seeder dijalankan lagi, log akan mencetak teks
default padahal DB menyimpan editan admin. Jangan pakai output seeder untuk verifikasi — query
tabel `constants` langsung.

### Mengembalikan prompt ke default

Karena seeder tidak menimpa, hapus dulu row-nya lalu jalankan seeder:

```js
await prisma.constants.deleteMany({ where: { key: 'pbl_ai_chat_prompt' } })
// lalu: node prisma/seeds/pblConstants.seed.js
```

Alternatif tanpa menyentuh DB: kosongkan field di panel admin. Nilai kosong membuat service
jatuh ke prompt fallback di kode, yang isinya sama dengan default — tapi isinya tidak akan
terlihat di panel.

---

## Batas ukuran

| Apa | Batas | Di mana |
|---|---|---|
| Teks yang diblok | 6.000 char | `sectionAssistantV2Service` |
| Instruksi mahasiswa | 500 char | `sectionAssistantV2Service` |
| Deskripsi diagram | 1.000 char | `generateSkripsiDiagramImageV2Service` |
| `case_text` dalam konteks | 4.000 char | `skripsiReportContextV2` |
| Seluruh bagian yang dilampirkan | 60.000 char total | `skripsiReportContextV2` |
| Jumlah referensi | 30 entri | `skripsiReportContextV2` |
| Riwayat chat | 10 turn | `skripsi_ai_researcher_context_messages` |

Batas bagian bersifat **total**, bukan per bagian: satu bagian panjang boleh memakai seluruh
budget, dan bagian yang tidak muat disebutkan di prompt, tidak dibuang diam-diam.

Prompt dari panel admin **tidak** dibatasi panjangnya. Isinya ikut setiap request, jadi prompt
panjang memakan budget token yang sama dengan konteks laporan.

---

## Catatan teknis

### `/ai-edit` sudah tidak dipakai

`EditSectionTextV2Service` masih ter-route di `routes/api/v2/skripsi/sections.routes.js:13`,
tapi tidak ada pemanggil di frontend — semuanya lewat `/assist`
(`store/skripsi/v2/userAction.js:532`). Service itu ikut memakai `pbl_ai_edit_rewrite_prompt`
sehingga tetap konsisten bila nanti dihidupkan lagi, tapi untuk sekarang ia kode mati dengan
prompt fallback-nya sendiri yang nyaris duplikat `REWRITE_PROMPT`.

Bedanya dengan `/assist`, kalau sewaktu-waktu dipakai lagi: ia **tidak** memakai
`buildReportContext` dan selalu menyertakan kasus bila ada.

```
Judul laporan: «title»
Bagian laporan: «judul bagian»

Kasus PBL (konteks, jangan ikut disunting):
«case_text»

Instruksi penyunting:
- «instruksi»

Teks yang harus disunting:
"""
«teks»
"""
```

### Baris kosong pemisah hilang

Di `sectionAssistantV2Service.js` ada entri `''` yang dimaksudkan sebagai baris kosong pemisah,
tetapi array-nya di-`.filter(Boolean)` — string kosong itu falsy, jadi ikut terbuang. Akibatnya
`«case_text»` dan `Isi bagian` menempel langsung ke `Bagian yang sedang dikerjakan:` tanpa baris
kosong. Contoh di §2 dan §3 adalah bentuk sebenarnya, bukan perkiraan.

Tidak fatal, tapi batas antar-blok jadi lebih kabur bagi model. Perbaikannya: ganti `''` menjadi
string berawalan newline, pola yang sudah dipakai `editSectionTextV2Service`.

### Double-gate pada AI Chat

`normalChatV2Service.js` masih memeriksa `skripsi_ai_researcher_enabled`, padahal
`sendMessageV2Service` sudah memeriksa `pbl_ai_chat_enabled`. Dua saklar untuk satu tab, dan
panel admin hanya bisa mengatur yang satu — mematikan Skripsi Builder V1 akan ikut mematikan
AI Chat V2 tanpa penjelasan di panel.

---

## Riwayat singkat

Sebelum 2026-11-23, AI Chat tidak punya konstanta sendiri dan meminjam
`skripsi_ai_researcher_model` + `skripsi_ai_researcher_prompt` milik Searcher. Akibatnya:

1. model yang menjawab adalah `sonar-pro` (model pencarian Perplexity) untuk tab percakapan
   biasa;
2. `provider` tidak dikembalikan service, sehingga stream Perplexity diumpankan ke parser
   Gemini — jawaban selalu 0 karakter, tanpa error apa pun;
3. baris riwayat berisi teks kosong (sisa stream yang di-stop) dikirim mentah, dan Perplexity
   menolak seluruh request dengan `content cannot be empty`;
4. prompt Searcher menyuruh model menolak menjawab bila tidak ada referensi — padahal tab ini
   tidak pernah punya referensi, sehingga chat menolak menjawab apa pun.

Keempatnya sudah diperbaiki, dan setiap panel sekarang memakai konstanta `pbl_*` miliknya
sendiri dengan prompt yang sepenuhnya diatur dari panel admin.
