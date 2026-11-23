import { pathToFileURL } from 'url'
import prisma from '#prisma/client'

// PBL Case Builder (V2) settings — the three panels and what they cost.
//
// Feature-level settings are deliberately NOT duplicated here: the title, the
// description, whether the feature is on at all and how it is paid for stay on
// the `skripsi_*` keys the feature has always used, so there is one switch per
// setting rather than two that can disagree.
//
// What is here is what V2 alone decides. Each key starts at whatever V1 is
// already configured with, so a site that has tuned its Skripsi Builder does
// not find V2 running on different settings; `fallback` covers the keys V1 has
// no equivalent for, and a database never seeded with V1.
const pblConstants = [
  // AI Chat panel — V1's AI researcher tabs are the same pipeline.
  {
    key: 'pbl_ai_chat_enabled',
    inheritFrom: 'skripsi_ai_researcher_enabled',
    fallback: 'true',
    description: 'Mengaktifkan tab AI Chat di editor PBL',
  },
  {
    key: 'pbl_ai_chat_cost',
    inheritFrom: 'skripsi_ai_researcher_cost',
    fallback: '0',
    description: 'Biaya kredit per pesan AI Chat',
  },
  {
    // Not inherited, for the same reason as the editor's model below: the V1
    // researcher key it used to borrow may hold a Perplexity search model,
    // while this tab is a plain conversation with no retrieval step in front
    // of it. Pointed at a search model it streams in a shape the chat handler
    // cannot read, and the Searcher's "no citations" fallback throws the
    // answer away outright.
    key: 'pbl_ai_chat_model',
    fallback: 'gemini-2.5-flash',
    description: 'Model Gemini yang menjawab di tab AI Chat editor PBL',
  },
  {
    // Not inherited: the V1 researcher key this tab used to borrow holds the
    // Searcher's prompt, which forbids answering without a reference — fatal
    // here, since this tab has no retrieval and so never has one.
    //
    // The admin owns this text outright. The last paragraph of the default is
    // what stops a model from inventing citations the frontend would then turn
    // into links to sources that do not exist; worth keeping in a rewrite.
    key: 'pbl_ai_chat_prompt',
    fallback: `Kamu adalah asisten AI yang mendampingi mahasiswa kedokteran menyusun laporan PBL (Problem-Based Learning).

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

Tab ini percakapan biasa tanpa pencarian otomatis, jadi kamu tidak memegang daftar referensi. Jangan mengaku mengutip sumber yang tidak kamu miliki, dan jangan menuliskan penanda sitasi seperti [1].`,
    description: 'System prompt tab AI Chat editor PBL',
  },

  // "Edit dengan AI" — the selection-level editor assistant inside a section.
  // It runs on the same pipeline budget as the chat, so it starts from the
  // chat's switch and price.
  {
    key: 'pbl_ai_edit_enabled',
    inheritFrom: 'skripsi_ai_researcher_enabled',
    fallback: 'true',
    description: 'Mengaktifkan tombol "Edit dengan AI" pada teks terpilih di editor PBL',
  },
  {
    key: 'pbl_ai_edit_cost',
    inheritFrom: 'skripsi_ai_researcher_cost',
    fallback: '0',
    description: 'Biaya kredit per permintaan Edit dengan AI',
  },
  {
    // Not inherited: V1's researcher model may be a Perplexity search model,
    // and this one only rewrites text a student already wrote.
    key: 'pbl_ai_edit_model',
    fallback: 'gemini-2.5-flash',
    description: 'Model Gemini yang menyunting teks terpilih di editor PBL',
  },
  {
    // Two prompts, not one: rewriting and drafting have rules that contradict
    // each other. This one forbids any wrapper around the text it returns,
    // because the result replaces the student's selection directly.
    //
    // Shared by the selection bubble and the section assistant — both edit a
    // selection, so one setting rather than two to keep in step.
    key: 'pbl_ai_edit_rewrite_prompt',
    fallback: `Anda adalah asisten penyunting untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.
Tugas Anda hanya menyunting potongan teks yang diberikan sesuai instruksi penyunting.

Aturan wajib:
- Jawab HANYA dengan teks hasil suntingan. Tanpa pembuka, tanpa penutup, tanpa penjelasan, tanpa tanda kutip pembungkus, tanpa blok kode markdown.
- Gunakan Bahasa Indonesia ilmiah yang baku dan sesuai gaya penulisan laporan akademik.
- Pertahankan istilah medis, nama obat, dosis, satuan dan angka apa adanya.
- Jangan mengarang data, diagnosis, angka, atau sumber yang tidak ada pada konteks yang diberikan.
- Jika konteks menyertakan daftar referensi, pakai penanda [n] yang sama persis; jangan membuat nomor baru.
- Pertahankan semua penanda sitasi seperti [1], [2] persis di posisi yang sama relatif terhadap kalimatnya.
- Jangan menambah fakta, diagnosis, atau klaim baru yang tidak ada pada teks asli.
- Jika teks asli sudah memenuhi instruksi, kembalikan teks tersebut dengan perbaikan seperlunya saja.`,
    description: 'System prompt saat AI menyunting teks yang diblok mahasiswa',
  },
  {
    // The draft counterpart, and the reason the two cannot be merged: this
    // output lands in a rich text editor, so it must allow a small set of HTML
    // tags — exactly what the rewrite prompt forbids. An admin replacing this
    // owns that tag whitelist too; anything outside it reaches the document as
    // literal markup.
    key: 'pbl_ai_edit_draft_prompt',
    fallback: `Anda adalah asisten penulis untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.
Tugas Anda menulis draf untuk satu bagian laporan sesuai instruksi mahasiswa dan konteks laporan yang diberikan.

Aturan wajib:
- Jawab HANYA dengan isi bagian tersebut. Tanpa pembuka, tanpa penutup, tanpa komentar, tanpa blok kode markdown.
- Jangan menulis ulang judul bagian; mahasiswa sudah punya judulnya.
- Format dengan HTML sederhana saja: <p>, <ul>, <ol>, <li>, <strong>, <em>. Tanpa atribut, tanpa tag lain.
- Gunakan Bahasa Indonesia ilmiah yang baku dan sesuai gaya penulisan laporan akademik.
- Pertahankan istilah medis, nama obat, dosis, satuan dan angka apa adanya.
- Jangan mengarang data, diagnosis, angka, atau sumber yang tidak ada pada konteks yang diberikan.
- Jika konteks menyertakan daftar referensi, pakai penanda [n] yang sama persis; jangan membuat nomor baru.
- Tulis draf yang masih wajar untuk disunting mahasiswa, bukan teks final yang mengaku lengkap.`,
    description: 'System prompt saat AI menulis draf satu bagian laporan dari nol',
  },

  // Searcher panel — V1's research mode paid for the same Perplexity calls.
  {
    key: 'pbl_searcher_enabled',
    inheritFrom: 'skripsi_research_enabled',
    fallback: 'true',
    description: 'Mengaktifkan tab Searcher (pencarian jurnal via Perplexity)',
  },
  {
    key: 'pbl_searcher_cost',
    inheritFrom: 'skripsi_research_cost',
    fallback: '0',
    description: 'Biaya kredit per pencarian',
  },
  {
    key: 'pbl_searcher_max_results',
    fallback: '10',
    description: 'Jumlah hasil default ketika mahasiswa tidak mengatur batas hasil',
  },

  // Diagram Builder panel
  {
    key: 'pbl_diagram_enabled',
    inheritFrom: 'skripsi_diagram_builder_enabled',
    fallback: 'true',
    description: 'Mengaktifkan tab Diagram Builder',
  },
  {
    key: 'pbl_diagram_cost',
    inheritFrom: 'skripsi_diagram_builder_cost',
    fallback: '0',
    description: 'Biaya kredit per diagram yang digenerate',
  },
  {
    // V1's diagram model writes Mermaid; V2 draws a picture, so there is no V1
    // value to inherit — it needs an image-capable model.
    key: 'pbl_diagram_image_model',
    fallback: 'gemini-2.5-flash-image',
    description: 'Model Gemini yang menggambar diagram (harus model image-capable)',
  },
  {
    // An image model takes one prompt, with no system/user split, so what the
    // admin edits is the whole drawing brief. `{{deskripsi}}` is where the
    // student's topic is substituted in — what a student types is a topic
    // ("patofisiologi crush syndrome"), not a brief, and this is what turns it
    // into one.
    key: 'pbl_diagram_prompt',
    fallback: `Buat diagram edukatif untuk mahasiswa kedokteran berdasarkan permintaan berikut:
"{{deskripsi}}"

Ketentuan gambar:
- Gaya flowchart/diagram ilmiah yang bersih, bukan ilustrasi artistik.
- Latar putih polos, garis dan panah tegas, kotak-kotak rapi.
- Semua teks dalam Bahasa Indonesia, ejaan medis yang benar, huruf besar jelas dan mudah dibaca.
- Tanpa watermark, tanpa logo, tanpa tangan atau figur manusia dekoratif.
- Susun alurnya dari atas ke bawah agar mudah diikuti.`,
    description: 'Brief gambar Diagram Builder; {{deskripsi}} diganti permintaan mahasiswa',
  },
]

async function seedPblConstants() {
  console.log('Seeding PBL Case Builder (V2) constants...')

  const inheritedKeys = pblConstants.map(c => c.inheritFrom).filter(Boolean)
  const v1Rows = await prisma.constants.findMany({ where: { key: { in: inheritedKeys } } })
  const v1 = Object.fromEntries(v1Rows.map(row => [row.key, row.value]))

  for (const constant of pblConstants) {
    const value = (constant.inheritFrom ? v1[constant.inheritFrom] : undefined) ?? constant.fallback
    const source = constant.inheritFrom && v1[constant.inheritFrom] !== undefined
      ? `dari ${constant.inheritFrom}`
      : 'default'

    // An existing key is left exactly as it is: an admin's own value is
    // theirs, not something a re-run should reset. The `description` on each
    // entry above documents the key here — the constants table stores only a
    // key and a value.
    await prisma.constants.upsert({
      where: { key: constant.key },
      update: {},
      create: { key: constant.key, value },
    })

    console.log(`✓ ${constant.key} = ${value} (${source})`)
  }

  console.log('PBL Case Builder constants seeded successfully!')
}

// Run if called directly. The URL is built from the path rather than compared
// as a string: on Windows process.argv[1] is a backslash path, which never
// matches a file:// URL and left this seed exiting silently.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedPblConstants()
    .then(() => {
      console.log('Done!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Error seeding constants:', error)
      process.exit(1)
    })
}

export default seedPblConstants
