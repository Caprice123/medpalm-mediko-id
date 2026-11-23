// Turns the base64 images a paste leaves behind into uploaded blobs, just before a note is saved.
//
// BlockNote only routes a pasted image through `uploadFile` when the clipboard carries nothing
// but files. Its paste handler picks the first clipboard type from a fixed priority list —
// ["vscode-editor-data", "blocknote/html", "text/markdown", "text/html", "text/plain", "Files"] —
// and "Files" is last. So a screenshot becomes a blob, but anything copied out of a web page,
// Word, PowerPoint or Google Docs arrives as text/html, goes through pasteHTML, and keeps
// whatever src the HTML carried. When that src is a data: URI, the whole image lands in the
// note's JSON. That is how 307 notes grew to 592 MB between them, one of them 17 MB on its own.
//
// Catching it here rather than by replacing BlockNote's paste handler is deliberate: every way
// an image can reach the content — paste, import, a generated summary, a future editor version —
// passes through save, so one check covers them all and nothing has to be revisited when
// BlockNote changes.
//
// Only data: URIs are lifted. A pasted link stays a link: it is already a reference rather than
// a payload, the editor is not its owner, and rehosting someone else's URL silently is not this
// function's call to make.

const DATA_IMAGE = /^data:(image\/[a-zA-Z0-9.+-]+);base64,/

const EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

// Every string in the tree is a candidate. An image usually sits at `props.url` on an image
// block, but embeds and custom blocks keep their source in their own props, and walking the
// whole document means none of those are missed.
//
// `visit` returns a replacement string, or undefined to leave the value as it is.
function walkStrings(node, visit) {
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

function collectDataUris(blocks) {
  const found = new Set()
  walkStrings(blocks, (value) => {
    if (DATA_IMAGE.test(value)) found.add(value)
    return undefined
  })

  return [...found]
}

// `fetch` decodes a data: URI natively, which is both faster and far less code than walking the
// base64 through atob into a byte array.
async function dataUriToFile(dataUri, index) {
  const mime = dataUri.match(DATA_IMAGE)[1]
  const blob = await (await fetch(dataUri)).blob()

  return new File([blob], `pasted-image-${index}.${EXTENSION[mime] || 'bin'}`, { type: mime })
}

/**
 * @param {Array} blocks        the note's BlockNote content
 * @param {Function} uploadImage  (File) => Promise<string>, the URL to reference it by
 * @returns {Promise<{ blocks: Array, lifted: number, failed: number }>} `blocks` is a new array;
 *          the caller's is never mutated, so a failed save leaves the editor's state alone.
 */
export async function liftInlineImages(blocks, uploadImage) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return { blocks, lifted: 0, failed: 0 }
  }

  const dataUris = collectDataUris(blocks)
  if (dataUris.length === 0) {
    return { blocks, lifted: 0, failed: 0 }
  }

  const urlFor = new Map()
  let failed = 0

  // Sequential rather than Promise.all: these are whole images, and a note pasted out of a
  // slide deck can hold a dozen. Firing them at once competes with the save the admin is
  // waiting on, for no gain they would notice.
  for (const [index, dataUri] of dataUris.entries()) {
    try {
      const file = await dataUriToFile(dataUri, index + 1)
      urlFor.set(dataUri, await uploadImage(file))
    } catch (error) {
      // The image stays inline rather than being dropped. A note that saves fat is a problem to
      // clean up later; a note that loses a figure, or refuses to save at all and costs the
      // admin their edit, is worse.
      failed += 1
      console.warn('Gagal mengunggah gambar tertanam, tetap disimpan sebagai base64:', error)
    }
  }

  if (urlFor.size === 0) return { blocks, lifted: 0, failed }

  const rewritten = JSON.parse(JSON.stringify(blocks))
  walkStrings(rewritten, (value) => urlFor.get(value))

  return { blocks: rewritten, lifted: urlFor.size, failed }
}
