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
