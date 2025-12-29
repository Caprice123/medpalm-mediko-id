import prisma from '#prisma/client';
import blobService from '#services/attachment/blobService';
import idriveService from '#services/idrive.service';
import path from 'path';

/**
 * Service for managing attachments
 */
class AttachmentService {
  /**
   * Upload file and create attachment record
   * @param {Object} options - Upload options
   * @param {string} options.filePath - Local file path
   * @param {string} options.recordType - Type of record (e.g., 'flashcard_card', 'anatomy_quiz')
   * @param {number} options.recordId - ID of the record
   * @param {string} options.name - Attachment name/identifier (e.g., 'image', 'pdf')
   * @param {string} options.folder - iDrive folder (e.g., 'flashcard-images')
   * @param {string} options.customFileName - Custom filename (optional)
   * @returns {Promise<Object>} Created attachment with blob info
   */
  async uploadAndAttach({ filePath, recordType, recordId, name, folder, customFileName = null }) {
    try {
      // Upload file to iDrive
      const uploadResult = await idriveService.uploadFile(filePath, folder, customFileName);

      // Get file info
      const contentType = this.getContentType(path.extname(filePath));
      const byteSize = blobService.getFileSize(filePath);
      const checksum = blobService.calculateChecksum(filePath);

      // Create blob record
      const blob = await blobService.createBlob({
        key: uploadResult.key,
        filename: uploadResult.fileName,
        contentType,
        byteSize,
        checksum,
        metadata: {
          originalName: path.basename(filePath),
          uploadedFrom: recordType
        }
      });

      // Create attachment record
      const attachment = await this.attach({
        name,
        recordType,
        recordId,
        blobId: blob.id
      });

      return {
        attachment,
        blob,
        key: uploadResult.key
      };
    } catch (error) {
      console.error('Error uploading and attaching file:', error);
      throw new Error('Failed to upload and attach file: ' + error.message);
    }
  }

  /**
   * Create attachment record linking a record to a blob
   * @param {Object} options - Attachment options
   * @param {number} options.blobId - Blob ID
   * @param {string} options.recordType - Type of record (e.g., 'anatomy_quiz', 'flashcard_card')
   * @param {number} options.recordId - ID of the record
   * @param {string} options.name - Attachment name/identifier (e.g., 'image', 'pdf')
   * @returns {Promise<Object>} Created attachment
   */
  async attach({ blobId, recordType, recordId, name }) {
    return await prisma.attachments.create({
      data: {
        name,
        record_type: recordType,
        record_id: recordId,
        blob_id: blobId
      }
    });
  }

  /**
   * Get attachments for a record
   * @param {string} recordType - Type of record
   * @param {number} recordId - ID of the record
   * @param {string} name - Attachment name (optional)
   * @returns {Promise<Array>} Attachments with blob info
   */
  async getAttachments(recordType, recordId, name = null) {
    const where = {
      recordType,
      recordId
    };

    if (name) {
      where.name = name;
    }

    const attachments = await prisma.attachments.findMany({
      where,
      include: {
        // Note: Prisma doesn't have relations defined, so we'll do manual join
      }
    });

    // Manually fetch blob data
    const attachmentsWithBlobs = await Promise.all(
      attachments.map(async (attachment) => {
        const blob = await blobService.getBlobById(attachment.blob_id);
        return {
          ...attachment,
          blob
        };
      })
    );

    return attachmentsWithBlobs;
  }

  /**
   * Get attachment with presigned URL
   * @param {string} recordType - Type of record
   * @param {number} recordId - ID of the record
   * @param {string} name - Attachment name
   * @param {number} expiresIn - URL expiration in seconds (default: 3600 = 1 hour)
   * @returns {Promise<Object|null>} Attachment with presigned URL
   */
  async getAttachmentWithUrl(recordType, recordId, name, expiresIn = 3600) {
    const attachments = await this.getAttachments(recordType, recordId, name);

    if (attachments.length === 0) {
      return null;
    }

    const attachment = attachments[0];
    const presignedUrl = await idriveService.getSignedUrl(attachment.blob.key, expiresIn);

    return {
      ...attachment,
      url: presignedUrl
    };
  }

  /**
   * Get multiple attachments with presigned URLs (bulk operation)
   * @param {Array} records - Array of {recordType, recordId, name}
   * @param {number} expiresIn - URL expiration in seconds (default: 3600 = 1 hour)
   * @returns {Promise<Map>} Map of recordId -> attachment with URL
   */
  async getBulkAttachmentsWithUrls(records, expiresIn = 3600) {
    const attachmentMap = new Map();

    // Fetch all attachments
    const allAttachments = await Promise.all(
      records.map(async ({ recordType, recordId, name }) => {
        const attachments = await this.getAttachments(recordType, recordId, name);
        return { recordId, attachment: attachments[0] || null };
      })
    );

    // Extract keys for bulk presigned URL generation
    const keys = allAttachments
      .filter(({ attachment }) => attachment !== null)
      .map(({ attachment }) => attachment.blob.key);

    // Generate presigned URLs in bulk
    const presignedUrls = await idriveService.getBulkSignedUrls(keys, expiresIn);

    // Map URLs back to attachments
    let urlIndex = 0;
    allAttachments.forEach(({ recordId, attachment }) => {
      if (attachment) {
        attachmentMap.set(recordId, {
          ...attachment,
          url: presignedUrls[urlIndex++]
        });
      } else {
        attachmentMap.set(recordId, null);
      }
    });

    return attachmentMap;
  }

  /**
   * Delete attachment
   * @param {number} attachmentId - Attachment ID
   * @param {boolean} deleteBlob - Whether to delete the blob as well (default: true)
   * @returns {Promise<void>}
   */
  async deleteAttachment(attachmentId, deleteBlob = true) {
    const attachment = await prisma.attachments.findUnique({
      where: { id: attachmentId }
    });

    if (!attachment) {
      throw new Error('Attachment not found');
    }

    // Delete attachment record
    await prisma.attachments.delete({
      where: { id: attachmentId }
    });

    // Delete blob if requested
    if (deleteBlob) {
      const blob = await blobService.getBlobById(attachment.blob_id);

      // Delete from iDrive
      await idriveService.deleteFile(blob.key);

      // Delete blob record
      await blobService.deleteBlob(attachment.blob_id);
    }
  }

  /**
   * Get content type from file extension
   * @param {string} ext - File extension
   * @returns {string} Content type
   */
  getContentType(ext) {
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.svg': 'image/svg+xml'
    };

    return contentTypes[ext.toLowerCase()] || 'application/octet-stream';
  }
}

export default new AttachmentService();
