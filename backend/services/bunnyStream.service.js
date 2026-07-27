import fs from 'fs'

const API_BASE = 'https://video.bunnycdn.com'

class BunnyStreamService {
  get apiKey() { return process.env.BUNNY_STREAM_API_KEY }
  get libraryId() { return process.env.BUNNY_STREAM_LIBRARY_ID }
  get embedDomain() { return process.env.BUNNY_STREAM_EMBED_DOMAIN }

  embedUrl(videoId, { autoplay = false } = {}) {
    const base = this.embedDomain
      ? `https://${this.embedDomain}/${videoId}`
      : `https://iframe.mediadelivery.net/embed/${this.libraryId}/${videoId}`
    return autoplay ? `${base}?autoplay` : base
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
