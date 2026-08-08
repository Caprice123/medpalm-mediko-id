import fs from 'fs'

const API_BASE = 'https://video.bunnycdn.com'
const MAX_CONTEXT_LENGTH = 25 // watermark strip is too short to render a long username

class BunnyStreamService {
  get apiKey() { return process.env.BUNNY_STREAM_API_KEY }
  get libraryId() { return process.env.BUNNY_STREAM_LIBRARY_ID }
  get embedDomain() { return process.env.BUNNY_STREAM_EMBED_DOMAIN }

  embedUrl(videoId, { autoplay = false, context = null } = {}) {
    const base = this.embedDomain
      ? `https://${this.embedDomain}/${videoId}`
      : `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}`
    const params = []
    if (autoplay) params.push('autoplay')
    if (context) {
      const truncated = context.length > MAX_CONTEXT_LENGTH ? `${context.slice(0, MAX_CONTEXT_LENGTH - 1)}…` : context
      params.push(`context=${encodeURIComponent(truncated)}`)
    }
    return params.length ? `${base}?${params.join('&')}` : base
  }

  async uploadVideo(filePath, originalName) {
    // Step 1: create video record in Bunny Stream library
    const createRes = await fetch(`${API_BASE}/library/${this.libraryId}/videos`, {
      method: 'POST',
      headers: {
        AccessKey: this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: originalName }),
    })
    if (!createRes.ok) {
      const err = await createRes.text()
      throw new Error(`Bunny Stream create failed: ${err}`)
    }
    const { guid: videoId } = await createRes.json()

    // Step 2: upload video bytes to Bunny Stream
    const fileStream = fs.createReadStream(filePath)
    const stat = fs.statSync(filePath)
    const uploadRes = await fetch(`${API_BASE}/library/${this.libraryId}/videos/${videoId}`, {
      method: 'PUT',
      headers: {
        AccessKey: this.apiKey,
        'Content-Type': 'application/octet-stream',
        'Content-Length': String(stat.size),
      },
      body: fileStream,
      duplex: 'half',
    })
    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      throw new Error(`Bunny Stream upload failed: ${err}`)
    }

    return { videoId }
  }
}

export default new BunnyStreamService()
