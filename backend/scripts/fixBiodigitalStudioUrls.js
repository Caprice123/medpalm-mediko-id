/**
 * Rewrites BioDigital Studio editor links inside summary notes into public viewer links.
 *
 * Exists because several notes were authored by pasting the address bar while the model was open
 * in BioDigital Studio (https://human.biodigital.com/studio/edit?id=XXXX). That path is the
 * authoring page: embedded in an iframe it redirects to /login and the reader only ever sees
 * "Sign in to your account". The public embed for the same content is /viewer/?id=XXXX — the
 * model id is identical, so the rewrite is a plain path swap.
 *
 * Caveat found after the first run: /viewer/?id=X alone loads as a top-level page but is refused
 * inside an iframe ("Your BioDigital Human embed requires proper authentication"). A working embed
 * also carries the licensed account's paid= (and uaid=) params, which only the Share > Embed
 * dialog emits. So this rewrite is necessary but not sufficient — hence --restore.
 *
 *   node scripts/fixBiodigitalStudioUrls.js [--write] [--uniqueId=<uuid>]
 *   node scripts/fixBiodigitalStudioUrls.js --restore=<backup.json> [--write]
 *
 * Without --write it only reports. Every touched row is backed up to scripts/backups/ first.
 */
import fs from 'fs'
import path from 'path'
import prisma from '#prisma/client'

const WRITE = process.argv.includes('--write')
const ONLY = process.argv.find(a => a.startsWith('--uniqueId='))?.split('=')[1] ?? null
const RESTORE = process.argv.find(a => a.startsWith('--restore='))?.split('=')[1] ?? null

if (RESTORE) {
  const file = path.isAbsolute(RESTORE) ? RESTORE : path.join(import.meta.dirname, 'backups', path.basename(RESTORE))
  const rows = JSON.parse(fs.readFileSync(file, 'utf8'))
  console.log(`mode     : ${WRITE ? 'RESTORE' : 'dry run (restore)'}`)
  console.log(`backup   : ${file}`)
  console.log(`rows     : ${rows.length}`)
  if (!WRITE) {
    console.log('dry run - re-run with --write to apply')
  } else {
    for (const row of rows) {
      await prisma.summary_notes.update({
        where: { id: row.id },
        data: { content: row.content, markdown_content: row.markdown_content, updated_at: new Date() },
      })
    }
    console.log(`restored : ${rows.length} note(s)`)
  }
  await prisma.$disconnect()
  process.exit(0)
}
// Two broken shapes, matched up to whatever terminates the URL: a JSON string quote, an escaped
// quote, a markdown link's closing paren, or whitespace.
//   /studio/edit?id=X          — pasted from the Studio address bar
//   /login?returnUrl=%2Fstudio%2Fedit%3Fid%3DX — pasted after Studio had already bounced to login
const BROKEN_URL = /https?:\/\/human\.biodigital\.com\/(?:studio\/|login\?)[^"'\s)\\<>]*/g

// Model ids are short alphanumeric tokens. Anything else that rode along on a mangled URL
// (a stray `>` from surrounding markup, a tracking suffix) is cut here rather than being
// carried into the rewritten link.
const cleanId = (id) => id?.match(/^[A-Za-z0-9_-]+/)?.[0] ?? null

const skipped = []

function toViewerUrl(brokenUrl) {
  const url = new URL(brokenUrl)
  // The id is the only thing worth carrying over; every other param describes the editor session.
  // On a /login URL it sits one level down, inside the encoded returnUrl.
  const returnUrl = url.searchParams.get('returnUrl')
  const id = cleanId(url.searchParams.get('id')
    ?? (returnUrl ? new URLSearchParams(returnUrl.split('?')[1] ?? '').get('id') : null)
    // Two hand-damaged variants in the data: one link came through a Google Doc, which
    // percent-encoded the `=` into `?id%3D7NuI&sa=D&...`, so no parser sees an `id` param at
    // all; another was typed as `?-=7Og1`, losing the key but keeping the id as the only value.
    ?? brokenUrl.match(/id(?:=|%3D)([A-Za-z0-9_-]+)/)?.[1]
    ?? (([...url.searchParams.values()].length === 1
      && /^[A-Za-z0-9]{3,6}$/.test([...url.searchParams.values()][0]))
      ? [...url.searchParams.values()][0]
      : null))
  if (!id) {
    skipped.push(brokenUrl)
    return brokenUrl
  }
  // No ui-* params: BioDigital's defaults already enable labels, chapters, info and fullscreen,
  // and the long query string the Share dialog emits only repeats those defaults.
  return `https://human.biodigital.com/viewer/?id=${id}`
}

const rewrite = (text) => (text ? text.replace(BROKEN_URL, toViewerUrl) : text)
const countOf = (text) => (text ? (text.match(BROKEN_URL) || []).length : 0)

const notes = await prisma.summary_notes.findMany({
  where: {
    ...(ONLY ? { unique_id: ONLY } : {}),
    OR: ['biodigital.com/studio', 'biodigital.com/login'].flatMap(needle => [
      { content: { contains: needle } },
      { markdown_content: { contains: needle } },
    ]),
  },
  select: { id: true, unique_id: true, title: true, content: true, markdown_content: true },
  orderBy: { id: 'asc' },
})

console.log(`mode     : ${WRITE ? 'WRITE' : 'dry run'}`)
console.log(`notes    : ${notes.length}${ONLY ? ` (filtered to ${ONLY})` : ''}`)

if (notes.length === 0) {
  console.log('nothing to rewrite')
  await prisma.$disconnect()
  process.exit(0)
}

const planned = notes.map(note => ({
  note,
  hits: countOf(note.content),
  hitsMd: countOf(note.markdown_content),
  content: rewrite(note.content),
  markdown: rewrite(note.markdown_content),
}))

const totalHits = planned.reduce((sum, p) => sum + p.hits + p.hitsMd, 0)
const ids = new Set()
for (const p of planned) {
  for (const m of (p.content.match(/viewer\/\?id=([A-Za-z0-9_-]+)/g) || [])) ids.add(m)
  console.log(`  ${String(p.note.id).padStart(4)}  ${p.note.unique_id}  ${p.hits}+${p.hitsMd}  ${p.note.title}`)
}
console.log(`embeds   : ${totalHits}`)
if (skipped.length > 0) {
  console.log(`skipped  : ${skipped.length} URL(s) with no id param, left untouched`)
  for (const s of new Set(skipped)) console.log(`    ${s}`)
}

if (!WRITE) {
  console.log('dry run - re-run with --write to apply')
  await prisma.$disconnect()
  process.exit(0)
}

const backupDir = path.join(import.meta.dirname, 'backups')
fs.mkdirSync(backupDir, { recursive: true })
const backupPath = path.join(backupDir, `biodigital-studio-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
fs.writeFileSync(backupPath, JSON.stringify(notes.map(n => ({
  id: n.id, unique_id: n.unique_id, content: n.content, markdown_content: n.markdown_content,
})), null, 1))
console.log(`backup   : ${backupPath}`)

for (const p of planned) {
  await prisma.summary_notes.update({
    where: { id: p.note.id },
    data: { content: p.content, markdown_content: p.markdown, updated_at: new Date() },
  })
}
console.log(`written  : ${planned.length} note(s)`)
await prisma.$disconnect()
