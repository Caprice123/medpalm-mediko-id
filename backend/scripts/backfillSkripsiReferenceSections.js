import { pathToFileURL } from 'url'
import prisma from '#prisma/client'

// Every report ends with a Referensi section: it is where "Kumpulkan referensi"
// writes the daftar pustaka, it cannot be renamed, moved or deleted, and no new
// section can be added below it. Reports created before that rule have no such
// section, so they are given one here.
//
// Two shapes, decided per report:
//   - the last section is empty and not already named for references → it is
//     renamed and flagged, rather than leaving an empty "Bagian Baru" stranded
//     above a new one;
//   - otherwise → a new empty Referensi section is appended.
//
// A report with no sections at all is skipped: there is no document there yet,
// and creating one from a maintenance script would put a section into drafts
// nobody has opened. Those get theirs from the create service the moment the
// first section exists.
//
// Run with --apply to write; without it, it only reports.
//
//   node scripts/backfillSkripsiReferenceSections.js
//   node scripts/backfillSkripsiReferenceSections.js --apply

const REFERENCE_TITLE = 'Referensi'
const REFERENCE_PATTERN = /referensi|daftar pustaka|pustaka/i

const isEmpty = (content) => !String(content ?? '').replace(/<[^>]*>/g, '').trim()

async function backfillSkripsiReferenceSections({ apply = false } = {}) {
  const sets = await prisma.skripsi_sets.findMany({
    where: { is_deleted: false },
    select: {
      id: true,
      title: true,
      sections: {
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: { id: true, title: true, content: true, position: true, is_reference_slot: true },
      },
    },
  })

  const counts = { flagged: 0, renamed: 0, appended: 0, skipped: 0, empty: 0 }

  for (const set of sets) {
    const { sections } = set

    if (sections.length === 0) {
      counts.empty += 1
      continue
    }

    if (sections.some(section => section.is_reference_slot)) {
      counts.skipped += 1
      continue
    }

    // A section already named for references takes the flag and moves to the
    // end; its wording is the student's and is kept.
    const named = sections.find(section => REFERENCE_PATTERN.test(section.title))
    const last = sections[sections.length - 1]

    if (named) {
      counts.flagged += 1
      console.log(`  flag    ${set.title} → "${named.title}"`)

      if (apply) {
        const rest = sections.filter(section => section.id !== named.id)
        await prisma.$transaction([
          ...rest.map((section, index) => (
            prisma.skripsi_sections.update({ where: { id: section.id }, data: { position: index } })
          )),
          prisma.skripsi_sections.update({
            where: { id: named.id },
            data: { position: rest.length, is_reference_slot: true },
          }),
        ])
      }
      continue
    }

    if (isEmpty(last.content)) {
      counts.renamed += 1
      console.log(`  rename  ${set.title} → "${last.title}" jadi "${REFERENCE_TITLE}"`)

      if (apply) {
        await prisma.skripsi_sections.update({
          where: { id: last.id },
          data: { title: REFERENCE_TITLE, is_reference_slot: true, updated_at: new Date() },
        })
      }
      continue
    }

    counts.appended += 1
    console.log(`  append  ${set.title} (setelah "${last.title}")`)

    if (apply) {
      await prisma.skripsi_sections.create({
        data: {
          set_id: set.id,
          title: REFERENCE_TITLE,
          content: '',
          position: last.position + 1,
          is_reference_slot: true,
        },
      })
    }
  }

  console.log([
    '',
    `${apply ? 'Applied' : 'Would apply'}:`,
    `  flagged an existing section : ${counts.flagged}`,
    `  renamed an empty last one   : ${counts.renamed}`,
    `  appended a new one          : ${counts.appended}`,
    `  already had one             : ${counts.skipped}`,
    `  skipped (no sections yet)   : ${counts.empty}`,
  ].join('\n'))

  if (!apply) console.log('\nRe-run with --apply to write the changes.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  backfillSkripsiReferenceSections({ apply: process.argv.includes('--apply') })
    .then(() => prisma.$disconnect())
    .then(() => process.exit(0))
    .catch(async (error) => {
      console.error('Backfill failed:', error)
      await prisma.$disconnect()
      process.exit(1)
    })
}

export default backfillSkripsiReferenceSections
