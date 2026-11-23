/**
 * Moves base64 images out of ONE summary note's BlockNote JSON and into blobs.
 *
 * A thin CLI over migrateNote() in scripts/lib/inlineImageMigration.js — the same function
 * scripts/backfillInlineImages.js drives across every note, so verifying a change here verifies
 * the bulk run too.
 *
 *   node scripts/inlineImagesToBlobs.js <uniqueId>            # uploads images, leaves the note alone
 *   node scripts/inlineImagesToBlobs.js <uniqueId> --write    # also rewrites the note
 *
 * Note that the no-write mode is not a dry run: finding the blob ids means uploading the images
 * and creating their rows, so only the note's own UPDATE is skipped.
 *
 * Writes a snapshot of both columns to scripts/backups/ first. The bulk driver deliberately does
 * not — see its header for why — but for a single note it is cheap insurance.
 */
import path from 'path'
import prisma from '#prisma/client'
import { migrateNote, DEFAULT_BASE } from './lib/inlineImageMigration.js'

const uniqueId = process.argv[2]
const WRITE = process.argv.includes('--write')
const baseArg = process.argv.find((a) => a.startsWith('--base-url='))
const BASE = baseArg ? baseArg.split('=').slice(1).join('=') : DEFAULT_BASE

if (!uniqueId) {
  console.error('usage: node scripts/inlineImagesToBlobs.js <uniqueId> [--write] [--base-url=https://...]')
  process.exit(1)
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`
const kb = (n) => `${(n / 1024).toFixed(0)} kB`

console.log(`base url : ${BASE}`)
console.log(`mode     : ${WRITE ? 'WRITE' : 'no-write (images still upload)'}\n`)

const report = await migrateNote({
  uniqueId,
  write: WRITE,
  base: BASE,
  backupDir: path.join(import.meta.dirname, 'backups'),
  onImage: ({ index, mime, bytes, blobId, reused }) => {
    console.log(`  ${String(index).padStart(2)}. ${mime.padEnd(11)} ${kb(bytes).padStart(8)}  ->  blob ${String(blobId).padEnd(7)} ${reused ? '(reused)' : ''}`)
  },
})

console.log(`\nnote     : ${report.title}`)

if (report.skipped) {
  console.log('no inline images — nothing to do')
  await prisma.$disconnect()
  process.exit(0)
}

console.log(`backup   : ${report.backupPath}`)
console.log(`images   : ${report.images} (${report.reused} reused), ${mb(report.uploadedBytes)} uploaded`)
console.log(`content  : ${mb(report.before.content)}  ->  ${kb(report.after.content)}`)
console.log(`markdown : ${mb(report.before.markdown)}  ->  ${kb(report.after.markdown)}`)
console.log(`left inline: ${report.leftInline}`)

if (!report.written) console.log('\nno-write mode — re-run with --write to rewrite the note')

await prisma.$disconnect()
