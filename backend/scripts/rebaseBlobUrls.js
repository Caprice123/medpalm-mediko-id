/**
 * Rewrites the host in `/api/v1/blobs/<id>` references inside a summary note.
 *
 * Exists because the first run of inlineImagesToBlobs.js baked in the wrong API host: the value
 * came from a commented-out line in frontend-web/.env, and that host (medpalm.mediko.id) answers
 * 503 on every path. The deployed bundle calls medpalm-backend.mediko.id.
 *
 *   node scripts/rebaseBlobUrls.js <uniqueId> <fromBase> <toBase> [--write]
 */
import fs from 'fs'
import path from 'path'
import prisma from '#prisma/client'

const [uniqueId, fromBase, toBase] = process.argv.slice(2)
const WRITE = process.argv.includes('--write')

if (!uniqueId || !fromBase || !toBase) {
  console.error('usage: node scripts/rebaseBlobUrls.js <uniqueId> <fromBase> <toBase> [--write]')
  process.exit(1)
}

const from = `${fromBase}/api/v1/blobs/`
const to = `${toBase}/api/v1/blobs/`

// Counted by splitting rather than by regex: the bases are user-supplied URLs full of dots and
// slashes, and escaping them into a pattern is a bug waiting to happen for no gain.
const countOf = (haystack) => (haystack ? haystack.split(from).length - 1 : 0)

const note = await prisma.summary_notes.findUnique({
  where: { unique_id: uniqueId },
  select: { id: true, title: true, content: true, markdown_content: true },
})
if (!note) { console.error(`note ${uniqueId} not found`); process.exit(1) }

const hits = countOf(note.content)
const hitsMd = countOf(note.markdown_content)

console.log(`note     : ${note.title}`)
console.log(`from     : ${from}`)
console.log(`to       : ${to}`)
console.log(`matches  : ${hits} in content, ${hitsMd} in markdown_content`)
console.log(`mode     : ${WRITE ? 'WRITE' : 'dry run'}`)

if (hits + hitsMd === 0) { console.log('nothing to rewrite'); await prisma.$disconnect(); process.exit(0) }

const newContent = note.content.split(from).join(to)
const newMarkdown = note.markdown_content ? note.markdown_content.split(from).join(to) : note.markdown_content

if (!WRITE) {
  console.log('dry run - re-run with --write to apply')
  await prisma.$disconnect()
  process.exit(0)
}

const backupDir = path.join(import.meta.dirname, 'backups')
fs.mkdirSync(backupDir, { recursive: true })
const backupPath = path.join(backupDir, `${uniqueId}-rebase-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
fs.writeFileSync(backupPath, JSON.stringify({ id: note.id, content: note.content, markdown_content: note.markdown_content }))
console.log(`backup   : ${backupPath}`)

await prisma.summary_notes.update({
  where: { unique_id: uniqueId },
  data: { content: newContent, markdown_content: newMarkdown, updated_at: new Date() },
})
console.log('written.')
await prisma.$disconnect()
