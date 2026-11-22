import { pathToFileURL } from 'url'
import prisma from '#prisma/client'

// The report templates shown on "Buat laporan baru". Admins can add, rename and
// re-order these from the admin panel; this seed only establishes the defaults.
const skripsiTemplates = [
  {
    key: 'bbdm_report',
    name: 'Laporan Resmi BBDM',
    description: 'Format FK UNDIP: sampul, A–F, referensi',
    position: 1,
    sections: [
      'Terminologi',
      'Rumusan Masalah',
      'Analisis Masalah',
      'Peta Konsep',
      'Sasaran Belajar',
      'Belajar Mandiri',
    ],
  },
  {
    key: 'pbl_standard',
    name: 'Laporan PBL Standar',
    description: 'Skenario sampai kesimpulan, 7 langkah',
    position: 2,
    sections: [
      'Skenario',
      'Klarifikasi Istilah',
      'Rumusan Masalah',
      'Hipotesis',
      'Pembahasan',
      'Kesimpulan',
    ],
  },
  {
    key: 'case_report',
    name: 'Laporan Kasus',
    description: 'Format laporan kasus klinik',
    position: 3,
    sections: [
      'Identitas Pasien',
      'Anamnesis',
      'Pemeriksaan Fisik',
      'Pemeriksaan Penunjang',
      'Diagnosis & Tatalaksana',
    ],
  },
  {
    key: 'refferat',
    name: 'Refferat',
    description: 'Tinjauan pustaka satu topik',
    position: 4,
    sections: [
      'Pendahuluan',
      'Definisi & Epidemiologi',
      'Patofisiologi',
      'Diagnosis',
      'Tatalaksana',
      'Kesimpulan',
    ],
  },
]

async function seedSkripsiTemplates() {
  console.log('Seeding Skripsi Builder report templates...')

  for (const template of skripsiTemplates) {
    const { sections, ...fields } = template

    const record = await prisma.skripsi_templates.upsert({
      where: { key: fields.key },
      update: {
        name: fields.name,
        description: fields.description,
        position: fields.position,
        updated_at: new Date(),
      },
      create: fields,
    })

    // The outline is rewritten wholesale: a seeded template's sections are the
    // seed's to own, and an admin edit is re-applied by editing this file.
    await prisma.skripsi_template_sections.deleteMany({ where: { template_id: record.id } })
    await prisma.skripsi_template_sections.createMany({
      data: sections.map((title, index) => ({
        template_id: record.id,
        title,
        position: index + 1,
      })),
    })

    console.log(`✓ ${fields.name} (${sections.length} bagian)`)
  }

  console.log('Skripsi Builder report templates seeded successfully!')
}

// Run if called directly. The URL is built from the path rather than compared
// as a string: on Windows process.argv[1] is a backslash path, which never
// matches a file:// URL and left this seed exiting silently.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedSkripsiTemplates()
    .then(() => {
      console.log('Done!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Error seeding templates:', error)
      process.exit(1)
    })
}

export default seedSkripsiTemplates
