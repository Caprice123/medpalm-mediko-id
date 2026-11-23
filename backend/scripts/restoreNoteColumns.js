/**
 * Restores a summary note's `content` and `markdown_content` from a backup file written by
 * scripts/inlineImagesToBlobs.js or scripts/rebaseBlobUrls.js.
 *
 * Those scripts snapshot both columns before they rewrite anything, but nothing read the
 * snapshots back — a migration whose rollback is "open the JSON and paste it into a client by
 * hand" does not really have a rollback. This is that path.
 *
 * The backup is matched to the note by `id`, so a file from one note can never be written over
 * another. Blobs are left alone: restoring the base64 does not delete the uploaded images, and
 * re-running the migration afterwards reuses them by checksum.
 *
 *   node scripts/restoreNoteColumns.js <backupFile>            # reports what it would restore
 *   node scripts/restoreNoteColumns.js <backupFile> --write    # applies it
 */
import fs from 'fs'
import prisma from '#prisma/client'

const file = process.argv[2]
const WRITE = process.argv.includes('--write')

if (!file) {
  console.error('usage: node scripts/restoreNoteColumns.js <backupFile> [--write]')
  process.exit(1)
}
if (!fs.existsSync(file)) {
  console.error(`backup not found: ${file}`)
  process.exit(1)
}

const mb = (n) => `${((n || 0) / 1024 / 1024).toFixed(2)} MB`
const backup = JSON.parse(fs.readFileSync(file, 'utf8'))

if (!backup.id || typeof backup.content !== 'string') {
  console.error('backup file has no `id` or no `content` — refusing to guess which note it belongs to')
  process.exit(1)
}

const note = await prisma.summary_notes.findUnique({
  where: { id: backup.id },
  select: { id: true, unique_id: true, title: true, content: true, markdown_content: true },
})

if (!note) {
  console.error(`note id ${backup.id} from the backup no longer exists`)
  process.exit(1)
}

const inlineIn = (s) => ((s || '').match(/data:image\//g) || []).length

console.log(`note            : ${note.title} (${note.unique_id})`)
console.log(`backup file     : ${file}`)
console.log('')
console.log(`content         : ${mb(note.content.length)}  ->  ${mb(backup.content.length)}`)
console.log(`markdown_content: ${mb(note.markdown_content?.length)}  ->  ${mb(backup.markdown_content?.length)}`)
console.log(`inline images   : ${inlineIn(note.content)} now  ->  ${inlineIn(backup.content)} after restore`)
console.log(`mode            : ${WRITE ? 'WRITE' : 'dry run'}`)

if (!WRITE) {
  console.log('\ndry run - re-run with --write to apply')
  await prisma.$disconnect()
  process.exit(0)
}

await prisma.summary_notes.update({
  where: { id: backup.id },
  data: {
    content: backup.content,
    markdown_content: backup.markdown_content ?? null,
    updated_at: new Date(),
  },
})

console.log('\nrestored.')
await prisma.$disconnect()
