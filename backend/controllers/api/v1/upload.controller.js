import IDriveService from '#services/idrive.service'
import blobService from '#services/attachment/blobService'
import fs from 'fs'
import path from 'path'

class UploadController {
  /**
   * Upload image to S3 (iDrive) and create blob record
   * @route POST /api/v1/upload/image
   * @param {string} type - Upload type (skripsi-editor, anatomy, flashcard, etc.)
   */
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided'
        })
      }

      console.log('Upload request - req.file:', req.file)
      console.log('Upload request - req.body:', req.body)

      const { type = 'general' } = req.body
      const filePath = req.file.path

      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: 'File path is missing',
          debug: { file: req.file }
        })
      }

      // Determine folder based on type
      const folderMap = {
        'skripsi-editor': 'skripsi-images',
        'anatomy': 'anatomy-images',
        'flashcard': 'flashcard-images',
        'exercise': 'exercise-images',
        'general': 'uploads'
      }

      const folder = folderMap[type] || 'uploads'

      // Calculate checksum before upload to check for duplicates
      const contentType = req.file.mimetype
      const byteSize = blobService.getFileSize(filePath)
      const checksum = blobService.calculateChecksum(filePath)

      // Check if blob with same checksum already exists
      const existingBlob = await blobService.getBlobByChecksum(checksum)

      let blob
      let presignedUrl

      if (existingBlob) {
        // Blob already exists, reuse it
        console.log(`Blob with checksum ${checksum} already exists (ID: ${existingBlob.id}), reusing...`)
        blob = existingBlob
        presignedUrl = await IDriveService.getSignedUrl(existingBlob.key, 7 * 24 * 60 * 60)

        // Delete temporary file since we're not uploading
        fs.unlinkSync(filePath)
      } else {
        // Upload to iDrive
        console.log(`Uploading new file with checksum ${checksum}...`)
        const result = await IDriveService.uploadFile(filePath, folder)

        // Create blob record
        blob = await blobService.createBlob({
          key: result.key,
          filename: req.file.originalname, // Use original filename
          contentType,
          byteSize,
          checksum,
          metadata: {
            generatedName: result.fileName, // Store generated name in metadata
            uploadType: type,
            uploadedFrom: 'upload_api'
          }
        })

        // Generate presigned URL (expires in 7 days)
        presignedUrl = await IDriveService.getSignedUrl(result.key, 7 * 24 * 60 * 60)

        // Delete temporary file
        fs.unlinkSync(filePath)
      }

      return res.status(200).json({
        success: true,
        data: {
          blobId: blob.id,
          url: presignedUrl,
          key: blob.key,
          fileName: blob.filename, // Return original filename
          byteSize: blob.byteSize  // Return file size
        }
      })
    } catch (error) {
      // Clean up temp file on error
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }

      console.error('Upload error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error.message
      })
    }
  }
}

export default new UploadController()
