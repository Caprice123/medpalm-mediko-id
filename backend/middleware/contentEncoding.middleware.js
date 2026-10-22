/**
 * Rejects request bodies that arrive compressed.
 *
 * body-parser (Express 5) transparently inflates `Content-Encoding: br`,
 * `gzip` and `deflate` request bodies. The bundled Brotli decoder in Node.js
 * < 22.23.4 / 24.22.1 / 26.12.1 has an out-of-bounds write (CVE-2026-111497)
 * that a malformed stream can turn into remote code execution, so an
 * attacker-controlled compressed body is a direct path into the vulnerable
 * decoder.
 *
 * No browser compresses request bodies on its own and no client of this API
 * does either, so refusing them costs nothing and removes the inbound surface
 * entirely — independent of which Node.js build the host happens to run.
 */
export const rejectCompressedRequestBody = (req, res, next) => {
  const header = req.headers['content-encoding']
  if (!header) return next()

  const unsupported = header
    .split(',')
    .map((encoding) => encoding.trim().toLowerCase())
    .filter((encoding) => encoding && encoding !== 'identity')

  if (unsupported.length === 0) return next()

  return res.status(415).json({
    message: `Content-Encoding '${unsupported.join(', ')}' tidak didukung. Kirim request body tanpa kompresi.`,
  })
}
