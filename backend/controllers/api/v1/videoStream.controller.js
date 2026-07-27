import { Readable } from 'stream'
import prisma from '#prisma/client'
import { signBunnyVideoUrl } from '#utils/bunnyTokenAuth'

class VideoStreamController {
  async stream(req, res) {
    const { slug } = req.params

    const node = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!node || !node.video_url) {
      return res.status(404).json({ message: 'Video tidak ditemukan' })
    }

    // Sign URL for server→Bunny request (no IP binding — IP is the server's)
    const videoUrl = signBunnyVideoUrl(node.video_url, null)

    const fetchHeaders = {}
    if (req.headers.range) fetchHeaders['Range'] = req.headers.range

    const upstream = await fetch(videoUrl, { headers: fetchHeaders })

    if (upstream.status >= 400) {
      return res.status(502).json({ message: 'Gagal mengambil video' })
    }

    res.status(upstream.status)

    for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
      const val = upstream.headers.get(header)
      if (val) res.setHeader(header, val)
    }

    // Disable caching so the signed URL isn't stored in browser cache
    res.setHeader('Cache-Control', 'no-store')

    Readable.fromWeb(upstream.body).pipe(res)
  }
}

export default new VideoStreamController()
