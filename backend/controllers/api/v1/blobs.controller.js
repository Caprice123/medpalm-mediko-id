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
}

export default new BlobsController()
