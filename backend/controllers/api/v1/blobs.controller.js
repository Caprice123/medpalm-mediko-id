import idriveService from '#services/idrive.service'
import prisma from '#prisma/client'

export class BlobsController {
  /**
   * GET /api/v1/blobs/:blobId
   * Serves blob image by generating fresh presigned URL and redirecting
   */
  async show(req, res) {
    const { blobId } = req.params

    // Get blob from database
    const blob = await prisma.blobs.findUnique({
    where: { id: parseInt(blobId) }
    })

    if (!blob) {
    return res.status(404).json({
        message: 'Blob not found'
    })
    }

    // Generate fresh presigned URL (valid for 1 hour)
    const presignedUrl = await idriveService.getSignedUrl(blob.key, 3600)

    // Redirect to presigned URL
    res.redirect(presignedUrl)
  }

  /**
   * GET /api/v1/blobs/:blobId/url
   * Returns the presigned URL as JSON (for DOCX export, etc.)
   */
  async getUrl(req, res) {
    try {
      const { blobId } = req.params

      // Get blob from database
      const blob = await prisma.blobs.findUnique({
        where: { id: parseInt(blobId) }
      })

      if (!blob) {
        return res.status(404).json({
          message: 'Blob not found'
        })
      }

      // Generate fresh presigned URL (valid for 1 hour)
      const presignedUrl = await idriveService.getSignedUrl(blob.key, 3600)

      // Return URL as JSON
      res.json({
        url: presignedUrl
      })
    } catch (error) {
      console.error('Failed to get blob URL:', error)
      res.status(500).json({
        message: 'Failed to get blob URL',
        error: error.message
      })
    }
  }
}

export default new BlobsController()
