/**
 * Moving base64 images out of a summary note's BlockNote JSON and into blobs.
 *
 * Notes written through the editor's paste path carry their images inline as
 * `data:image/...;base64,...` inside `props.url`, and `markdown_content` carries a second copy of
 * every one of them. That makes the detail endpoint ship the whole document — images and all —
 * before the reader can render a single paragraph: one note measured 17 MB and ~13 s.
 *
 * Each distinct image is uploaded through the same path `POST /api/v1/upload/image` uses
 * (IDriveService + blobService, deduplicated by checksum) and the reference is rewritten to
 * `<base>/api/v1/blobs/<id>`, which 302-redirects to a presigned iDrive URL. The text then
 * arrives on its own and the browser fetches the images in parallel, after first paint.
 *
 * This module is the single implementation, shared by the one-note CLI
 * (scripts/inlineImagesToBlobs.js) and the 307-note driver (scripts/backfillInlineImages.js), so
 * the bulk run executes exactly the code path that was verified against one note first.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import prisma from '#prisma/client'
import IDriveService from '#services/idrive.service'
import blobService from '#services/attachment/blobService'

// The API host the deployed bundle actually calls. NOT medpalm.mediko.id, which is dead and
// answers 503 on every path, and not medpal.id, which serves the SPA and answers any unknown
// path with index.html and a 200 — both of which look alive enough to fool a quick check.
export const DEFAULT_BASE = 'https://medpalm-backend.mediko.id'

const FOLDER = 'summary-note-images'
const DATA_URI = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s

const EXT = {
  'image/png': '.png', 'image/jpeg': '.jpg', 'image/jpg': '.jpg',
  'image/gif': '.gif', 'image/webp': '.webp', 'image/svg+xml': '.svg',
}

/**
 * Every string in the tree is a candidate. An image usually hangs off `props.url` on an image
 * block, but embeds and custom blocks keep their source in their own props, and walking the
 * whole document means none of those are missed.
 *
 * `visit` returns a replacement string, or undefined to leave the value alone.
 */
export function walkStrings(node, visit) {
  if (Array.isArray(node)) {
    node.forEach((child) => walkStrings(child, visit))
    return
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      const value = node[key]
      if (typeof value === 'string') {
        const replaced = visit(value)
        if (replaced !== undefined) node[key] = replaced
      } else {
        walkStrings(value, visit)
      }
    }
  }
}

async function uploadOne(mime, base64, label, sourceNote) {
  const buffer = Buffer.from(base64, 'base64')
  const checksum = crypto.createHash('md5').update(buffer).digest('base64')

  // blobService dedupes by checksum, so re-running — or the same figure repeated within a note
  // or across notes — reuses the blob instead of uploading it again.
  const existing = await blobService.getBlobByChecksum(checksum)
  if (existing) return { blob: existing, reused: true, bytes: buffer.length }

  const tmp = path.join(os.tmpdir(), `sn-${Date.now()}-${label}${EXT[mime] || '.bin'}`)
  fs.writeFileSync(tmp, buffer)
  try {
    const result = await IDriveService.uploadFile(tmp, FOLDER)
    const blob = await blobService.createBlob({
      key: result.key,
      filename: `summary-note-image-${label}${EXT[mime] || '.bin'}`,
      contentType: mime,
      byteSize: buffer.length,
      checksum,
      metadata: {
        generatedName: result.fileName,
        uploadedFrom: 'inlineImagesToBlobs',
        sourceNote,
      },
    })
    return { blob, reused: false, bytes: buffer.length }
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
  }
}

/**
 * Migrates one note.
 *
 * With `write: false` the note is left untouched — but the images ARE uploaded and their blob
 * rows ARE created, because that is the only way to know the ids the rewrite would use. A
 * no-write run therefore has a real side effect, and abandoning it leaves orphan blobs behind.
 * They are harmless and a later run reuses them by checksum, but it is not a pure rehearsal.
 *
 * @returns {Promise<object>} a report; `skipped: true` when the note has no inline images.
 */
export async function migrateNote({ uniqueId, write = false, base = DEFAULT_BASE, backupDir = null, onImage = null }) {
  const note = await prisma.summary_notes.findUnique({
    where: { unique_id: uniqueId },
    select: { id: true, unique_id: true, title: true, content: true, markdown_content: true },
  })
  if (!note) throw new Error(`note ${uniqueId} not found`)

  const before = { content: note.content.length, markdown: note.markdown_content?.length ?? 0 }

  // Collect the distinct data URIs first, so an image used twice is uploaded once.
  const doc = JSON.parse(note.content)
  const found = new Map()
  walkStrings(doc, (value) => {
    const m = value.match(DATA_URI)
    if (m && !found.has(value)) found.set(value, { mime: m[1], base64: m[2] })
    return undefined
  })

  if (found.size === 0) {
    return { uniqueId, title: note.title, skipped: true, images: 0, before, after: before }
  }

  // Snapshot both columns before anything is rewritten. Written even on a no-write run, so the
  // file exists before anyone adds --write.
  let backupPath = null
  if (backupDir) {
    fs.mkdirSync(backupDir, { recursive: true })
    backupPath = path.join(backupDir, `${uniqueId}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(backupPath, JSON.stringify({
      id: note.id, unique_id: note.unique_id, title: note.title,
      content: note.content, markdown_content: note.markdown_content,
    }))
  }

  const urlFor = new Map()
  let uploadedBytes = 0
  let reusedCount = 0
  let index = 0
  for (const [dataUri, { mime, base64 }] of found) {
    index += 1
    const { blob, reused, bytes } = await uploadOne(mime, base64, index, uniqueId)
    urlFor.set(dataUri, `${base}/api/v1/blobs/${blob.id}`)
    uploadedBytes += bytes
    if (reused) reusedCount += 1
    if (onImage) onImage({ index, total: found.size, mime, bytes, blobId: blob.id, reused })
  }

  walkStrings(doc, (value) => urlFor.get(value))
  const newContent = JSON.stringify(doc)

  let newMarkdown = note.markdown_content
  if (newMarkdown) {
    for (const [dataUri, url] of urlFor) newMarkdown = newMarkdown.split(dataUri).join(url)
  }

  const leftInline = (newContent.match(/data:image\//g) || []).length
    + ((newMarkdown || '').match(/data:image\//g) || []).length

  if (write) {
    await prisma.summary_notes.update({
      where: { unique_id: uniqueId },
      data: { content: newContent, markdown_content: newMarkdown, updated_at: new Date() },
    })
  }

  return {
    uniqueId,
    title: note.title,
    skipped: false,
    images: found.size,
    reused: reusedCount,
    uploadedBytes,
    leftInline,
    backupPath,
    written: write,
    before,
    after: { content: newContent.length, markdown: newMarkdown?.length ?? 0 },
  }
}
