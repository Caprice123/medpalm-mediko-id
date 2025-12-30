import prisma from '#prisma/client';
import crypto from 'crypto';
import fs from 'fs';

/**
 * Service for managing blob records
 */
class BlobService {
  /**
   * Create a blob record
   * @param {Object} blobData - Blob data
   * @param {string} blobData.key - Storage key
   * @param {string} blobData.filename - Original filename
   * @param {string} blobData.contentType - MIME type
   * @param {number} blobData.byteSize - File size in bytes
   * @param {string} blobData.checksum - File checksum
   * @param {Object} blobData.metadata - Additional metadata (optional)
   * @returns {Promise<Object>} Created blob record
   */
  async createBlob({ key, filename, contentType, byteSize, checksum, metadata = {} }) {
    const blob = await prisma.blobs.create({
      data: {
        key,
        filename,
        content_type: contentType,
        byte_size: byteSize,
        checksum,
        metadata: JSON.stringify(metadata),
        uploaded_at: new Date()
      }
    });

    return blob;
  }

  /**
   * Get blob by ID
   * @param {number} blobId - Blob ID
   * @returns {Promise<Object>} Blob record
   */
  async getBlobById(blobId) {
    return await prisma.blobs.findUnique({
      where: { id: blobId }
    });
  }

  /**
   * Get blob by key
   * @param {string} key - Storage key
   * @returns {Promise<Object>} Blob record
   */
  async getBlobByKey(key) {
    return await prisma.blobs.findFirst({
      where: { key }
    });
  }

  /**
   * Get blob by checksum
   * @param {string} checksum - File checksum (MD5)
   * @returns {Promise<Object>} Blob record
   */
  async getBlobByChecksum(checksum) {
    return await prisma.blobs.findFirst({
      where: { checksum }
    });
  }

  /**
   * Delete blob by ID
   * @param {number} blobId - Blob ID
   * @returns {Promise<Object>} Deleted blob record
   */
  async deleteBlob(blobId) {
    return await prisma.blobs.delete({
      where: { id: blobId }
    });
  }

  /**
   * Calculate file checksum
   * @param {string} filePath - Path to file
   * @returns {string} MD5 checksum
   */
  calculateChecksum(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  }

  /**
   * Get file size
   * @param {string} filePath - Path to file
   * @returns {number} File size in bytes
   */
  getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
  }
}

export default new BlobService();
