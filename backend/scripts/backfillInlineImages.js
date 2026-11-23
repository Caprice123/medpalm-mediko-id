/**
 * Moves base64 images into blobs across every summary note that still has them.
 *
 * Runs the same code path as the single-note CLI — both call migrateNote() from
 * scripts/lib/inlineImageMigration.js — so the bulk job executes exactly what was verified
 * against one note first.
 *
 * No column backups. The image bytes reach iDrive before the columns are rewritten, each with a
 * checksum, so the pictures themselves cannot be lost; what a backup would additionally protect
 * is the byte-exact JSON shape, since `content` is re-serialized rather than edited in place.
 * Instead every note gets a manifest line naming each blob and its checksum — a few hundred
 * kilobytes for the whole run, enough to audit afterwards and to rebuild the original base64
 * from storage if it ever came to that.
 *
 * The worklist is defined by the data, not by a cursor file: a note qualifies while its content
 * still contains `data:image`, so a migrated note drops out on its own and the job is safe to
 * stop and restart. One note failing never stops the run.
 *
 *   node scripts/backfillInlineImages.js                  # survey only, nothing written
 *   node scripts/backfillInlineImages.js --limit=5 --write
 *   node scripts/backfillInlineImages.js --write
 */
import fs from 'fs'
import path from 'path'
import prisma from '#prisma/client'
import { migrateNote, DEFAULT_BASE } from './lib/inlineImageMigration.js'

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}
const WRITE = process.argv.includes('--write')
const LIMIT = parseInt(arg('limit', '0'), 10) || 0
const BASE = arg('base-url', DEFAULT_BASE)

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`
const kb = (n) => `${(n / 1024).toFixed(0)} kB`

// Sizes come from the database; `content` itself is deliberately not selected, because pulling
// 592 MB of columns merely to build a worklist is the very cost this job exists to remove.
const worklist = await prisma.$queryRaw`
  SELECT unique_id,
         pg_column_size(content) AS content_bytes,
         (length(content) - length(replace(content, 'data:image', ''))) / 10 AS images
  FROM summary_notes
  WHERE is_deleted = false AND content LIKE '%data:image%'
  ORDER BY pg_column_size(content) ASC`

const notes = (LIMIT ? worklist.slice(0, LIMIT) : worklist).map((row) => ({
  uniqueId: row.unique_id,
  contentBytes: Number(row.content_bytes),
  images: Number(row.images),
}))

const totalBytes = notes.reduce((sum, n) => sum + n.contentBytes, 0)
const totalImages = notes.reduce((sum, n) => sum + n.images, 0)

console.log(`notes to migrate : ${notes.length}${LIMIT ? ` (limited from ${worklist.length})` : ''}`)
console.log(`inline images    : ${totalImages}`)
console.log(`content to shrink: ${mb(totalBytes)}`)
console.log(`base url         : ${BASE}`)
console.log(`mode             : ${WRITE ? 'WRITE' : 'survey only — nothing is written'}`)

if (notes.length === 0) {
  console.log('\nnothing left to migrate')
  await prisma.$disconnect()
  process.exit(0)
}

if (!WRITE) {
  // Smallest and largest, so the shape of the job is visible without touching anything. A real
  // rehearsal is not possible here: finding the blob ids means uploading, which is a side
  // effect, so a survey reports sizes only and uploads nothing.
  console.log('\nsmallest 3:')
  for (const n of notes.slice(0, 3)) console.log(`  ${kb(n.contentBytes).padStart(9)}  ${n.images} images  ${n.uniqueId}`)
  console.log('largest 3:')
  for (const n of notes.slice(-3)) console.log(`  ${kb(n.contentBytes).padStart(9)}  ${n.images} images  ${n.uniqueId}`)
  console.log('\nsurvey only — re-run with --write to migrate')
  await prisma.$disconnect()
  process.exit(0)
}

const manifestDir = path.join(import.meta.dirname, 'backups')
fs.mkdirSync(manifestDir, { recursive: true })
const manifestPath = path.join(manifestDir, `backfill-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`)
console.log(`manifest         : ${manifestPath}\n`)

let done = 0
let failed = 0
let shrunkFrom = 0
let shrunkTo = 0
let uploaded = 0
let reused = 0
const started = Date.now()

for (const [i, note] of notes.entries()) {
  const label = `[${String(i + 1).padStart(3)}/${notes.length}]`
  try {
    const blobs = []
    const report = await migrateNote({
      uniqueId: note.uniqueId,
      write: true,
      base: BASE,
      backupDir: null,
      onImage: ({ blobId, bytes, mime, reused: wasReused }) => blobs.push({ blobId, bytes, mime, reused: wasReused }),
    })

    if (report.skipped) {
      console.log(`${label} skipped (no inline images)  ${note.uniqueId}`)
      continue
    }

    done += 1
    shrunkFrom += report.before.content
    shrunkTo += report.after.content
    uploaded += report.uploadedBytes
    reused += report.reused

    fs.appendFileSync(manifestPath, JSON.stringify({
      uniqueId: report.uniqueId,
      title: report.title,
      images: report.images,
      reused: report.reused,
      leftInline: report.leftInline,
      before: report.before,
      after: report.after,
      blobs,
      at: new Date().toISOString(),
    }) + '\n')

    const warn = report.leftInline > 0 ? `  !! ${report.leftInline} still inline` : ''
    console.log(`${label} ${kb(report.before.content).padStart(9)} -> ${kb(report.after.content).padStart(7)}  ${String(report.images).padStart(3)} img  ${report.title.slice(0, 44)}${warn}`)
  } catch (error) {
    failed += 1
    fs.appendFileSync(manifestPath, JSON.stringify({
      uniqueId: note.uniqueId, error: error.message, at: new Date().toISOString(),
    }) + '\n')
    console.log(`${label} FAILED  ${note.uniqueId}  ${error.message}`)
  }
}

const mins = ((Date.now() - started) / 60000).toFixed(1)
console.log(`\nmigrated   : ${done}`)
console.log(`failed     : ${failed}`)
console.log(`content    : ${mb(shrunkFrom)} -> ${mb(shrunkTo)}`)
console.log(`uploaded   : ${mb(uploaded)} (${reused} images reused from existing blobs)`)
console.log(`elapsed    : ${mins} min`)
console.log(`manifest   : ${manifestPath}`)

await prisma.$disconnect()
