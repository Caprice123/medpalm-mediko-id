/**
 * Backfills existing BioDigital embed URLs so stored data matches what the write path now
 * produces: whitespace stripped, and every param in ENFORCED_PARAMS pinned.
 *
 * Covers every column that actually holds a BioDigital URL (confirmed by scanning all 390
 * text/json columns in the schema):
 *   atlas_models.embed_url, anatomy_quizzes.embed_url, diagnostic_quizzes.embed_url,
 *   summary_notes.content, summary_notes.markdown_content
 *
 *   node scripts/backfillBiodigitalEmbedParams.js [--write] [--table=<name>] [--uniqueId=<uuid>]
 *
 * Without --write it only reports. Every touched row is backed up to scripts/backups/ first,
 * and --restore on that file puts the originals back.
 */
import fs from 'fs'
import path from 'path'
import prisma from '#prisma/client'
import { sanitizeEmbedUrlsInText, countChangedUrls, ENFORCED_PARAMS } from '#utils/biodigitalUrl'

const WRITE = process.argv.includes('--write')
const ONLY_TABLE = process.argv.find(a => a.startsWith('--table='))?.split('=')[1] ?? null
// Narrows the run to one record, so a change can be piloted on a single page before the rest.
const ONLY_ID = process.argv.find(a => a.startsWith('--uniqueId='))?.split('=')[1] ?? null
const RESTORE = process.argv.find(a => a.startsWith('--restore='))?.split('=')[1] ?? null

// model is the Prisma delegate name; columns are the text/json fields that can hold a URL.
const TARGETS = [
  { model: 'atlas_models', columns: ['embed_url'] },
  { model: 'anatomy_quizzes', columns: ['embed_url'] },
  { model: 'diagnostic_quizzes', columns: ['embed_url'] },
  { model: 'summary_notes', columns: ['content', 'markdown_content'] },
]

const backupDir = path.join(import.meta.dirname, 'backups')

if (RESTORE) {
  const file = path.isAbsolute(RESTORE) ? RESTORE : path.join(backupDir, path.basename(RESTORE))
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'))
  console.log(`mode     : ${WRITE ? 'RESTORE' : 'dry run (restore)'}`)
  console.log(`backup   : ${file}`)
  console.log(`rows     : ${rows.length}`)
  if (WRITE) {
    for (const row of rows) {
      await prisma[row.model].update({ where: { id: row.id }, data: row.before })
    }
    console.log(`restored : ${rows.length} row(s)`)
  } else {
    console.log('dry run - re-run with --write to apply')
  }
  await prisma.$disconnect()
  process.exit(0)
}

console.log(`mode     : ${WRITE ? 'WRITE' : 'dry run'}`)
console.log(`enforcing: ${Object.entries(ENFORCED_PARAMS).map(([k, v]) => `${k}=${v}`).join(', ')}`)

const touched = []

for (const { model, columns } of TARGETS) {
  if (ONLY_TABLE && ONLY_TABLE !== model) continue

  const rows = await prisma[model].findMany({
    where: {
      ...(ONLY_ID ? { unique_id: ONLY_ID } : {}),
      OR: columns.map(c => ({ [c]: { contains: 'biodigital' } })),
    },
    select: Object.fromEntries([['id', true], ['unique_id', true], ...columns.map(c => [c, true])]),
  })

  let urlsChanged = 0
  const rowsChanged = []

  for (const row of rows) {
    const before = {}
    const after = {}
    for (const col of columns) {
      const next = sanitizeEmbedUrlsInText(row[col])
      if (next === row[col]) continue
      urlsChanged += countChangedUrls(row[col])
      before[col] = row[col]
      after[col] = next
    }
    if (Object.keys(after).length === 0) continue
    rowsChanged.push({ model, id: row.id, unique_id: row.unique_id, before, after })
  }

  console.log(`  ${model.padEnd(20)} rows_with_biodigital=${String(rows.length).padStart(5)}`
    + `  rows_to_change=${String(rowsChanged.length).padStart(5)}  urls_to_change=${urlsChanged}`)
  touched.push(...rowsChanged)
}

if (touched.length === 0) {
  console.log('nothing to change')
  await prisma.$disconnect()
  process.exit(0)
}

console.log(`total    : ${touched.length} row(s)`)

if (!WRITE) {
  console.log('dry run - re-run with --write to apply')
  await prisma.$disconnect()
  process.exit(0)
}

fs.mkdirSync(backupDir, { recursive: true })
const backupPath = path.join(backupDir, `biodigital-params-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
fs.writeFileSync(backupPath, JSON.stringify(touched.map(t => ({ model: t.model, id: t.id, before: t.before })), null, 1))
console.log(`backup   : ${backupPath}`)

for (const t of touched) {
  await prisma[t.model].update({ where: { id: t.id }, data: { ...t.after, updated_at: new Date() } })
}
console.log(`written  : ${touched.length} row(s)`)

await prisma.$disconnect()
