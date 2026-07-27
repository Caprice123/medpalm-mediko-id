import IDriveService from '#services/idrive.service'
import bunnyStreamService from '#services/bunnyStream.service'
import blobService from '#services/attachment/blobService'
import fs from 'fs'

class UploadController {
  async uploadImage(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file provided' })

      const { type = 'general' } = req.body
      const filePath = req.file.path

      const folderMap = {
        'skripsi-editor': 'skripsi-images',
        'diagnostic': 'diagnostic-images',
        'anatomy': 'anatomy-images',
        'flashcard': 'flashcard-images',
        'exercise': 'exercise-images',
        'general': 'uploads'
      }
      const folder = folderMap[type] || 'uploads'

      const contentType = req.file.mimetype
      const byteSize = blobService.getFileSize(filePath)
      const checksum = blobService.calculateChecksum(filePath)
      const existingBlob = await blobService.getBlobByChecksum(checksum)

      let blob, presignedUrl

      if (existingBlob) {
        blob = existingBlob
        presignedUrl = await IDriveService.getSignedUrl(existingBlob.key, 7 * 24 * 60 * 60)
        fs.unlinkSync(filePath)
      } else {
        const result = await IDriveService.uploadFile(filePath, folder)
        blob = await blobService.createBlob({
          key: result.key,
          filename: req.file.originalname,
          contentType,
          byteSize,
          checksum,
          metadata: { generatedName: result.fileName, uploadType: type, uploadedFrom: 'upload_api' }
        })
        presignedUrl = await IDriveService.getSignedUrl(result.key, 7 * 24 * 60 * 60)
        fs.unlinkSync(filePath)
      }

      return res.status(200).json({
        data: {
          blobId: blob.id,
          url: presignedUrl,
          key: blob.key,
          fileName: blob.filename,
          contentType: blob.content_type,
          byteSize: blob.byte_size
        }
      })
    } catch (error) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
      console.error('Upload error:', error)
      return res.status(500).json({ message: 'Failed to upload image', error: error.message })
    }
  }

  async uploadFile(req, res) {
    const filePath = req.file.path
    const provider = req.body.provider === 'bunny_stream' ? 'bunny_stream' : 'idrive'
    const folder = req.body.folder || 'uploads'
    try {
      let blob

      const byteSize = blobService.getFileSize(filePath)
      const checksum = blobService.calculateChecksum(filePath)
      const existingBlob = await blobService.getBlobByChecksum(checksum)

      if (existingBlob) {
        blob = existingBlob
      } else if (provider === 'bunny_stream') {
        const { videoId } = await bunnyStreamService.uploadVideo(filePath, req.file.originalname)
        blob = await blobService.createBlob({
          key: videoId,
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          byteSize,
          checksum,
          provider: 'bunny_stream',
        })
      } else {
        const result = await IDriveService.uploadFile(filePath, folder)
        blob = await blobService.createBlob({
          key: result.key,
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          byteSize,
          checksum,
          provider: 'idrive',
        })
      }

      let url = null
      if (blob.provider === 'bunny_stream') {
        url = bunnyStreamService.embedUrl(blob.key)
      } else {
        url = await IDriveService.getSignedUrl(blob.key, 7 * 24 * 60 * 60)
      }

      return res.status(200).json({ data: { blobId: blob.id, filename: blob.filename, provider: blob.provider, url } })
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  }
}

export default new UploadController()
