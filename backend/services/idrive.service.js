import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

class IDriveService {
  constructor() {
    this.client = new S3Client({
      endpoint: process.env.IDRIVE_E2_ENDPOINT,
      region: process.env.IDRIVE_E2_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.IDRIVE_E2_ACCESS_KEY,
        secretAccessKey: process.env.IDRIVE_E2_SECRET_KEY,
      },
      forcePathStyle: true, // Required for S3-compatible services
    });
    this.bucket = process.env.IDRIVE_E2_BUCKET;
  }

  /**
   * Upload a file to iDrive e2
   * @param {string} filePath - Local file path
   * @param {string} folder - Folder in bucket (e.g., 'exercise-pdfs')
   * @param {string} fileName - Custom file name (optional, will generate if not provided)
   * @returns {Promise<{key: string, url: string}>} Uploaded file info
   */
  async uploadFile(filePath, folder = 'uploads', fileName = null) {
    try {
      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(filePath);

      // Generate unique filename if not provided
      const uniqueFileName = fileName || `${crypto.randomBytes(16).toString('hex')}${ext}`;
      const key = `${folder}/${uniqueFileName}`;

      // Upload to iDrive e2
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: this.getContentType(ext),
      });

      await this.client.send(command);

      // Generate public URL
      const url = `${process.env.IDRIVE_E2_ENDPOINT}/${this.bucket}/${key}`;

      return {
        key,
        url,
        fileName: uniqueFileName,
      };
    } catch (error) {
      console.error('Error uploading file to iDrive e2:', error);
      throw new Error('Failed to upload file to cloud storage: ' + error.message);
    }
  }

  /**
   * Upload PDF file for exercise topic
   * @param {string} filePath - Local PDF file path
   * @param {string} topicName - Topic name for organizing files
   * @returns {Promise<{key: string, url: string}>} Uploaded file info
   */
  async uploadExercisePDF(filePath, topicName) {
    const sanitizedName = topicName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    const fileName = `${sanitizedName}-${timestamp}.pdf`;

    return this.uploadFile(filePath, 'exercise-pdfs', fileName);
  }

  /**
   * Upload PDF file for flashcard deck
   * @param {string} filePath - Local PDF file path
   * @param {string} deckName - Deck name for organizing files
   * @returns {Promise<{key: string, url: string}>} Uploaded file info
   */
  async uploadFlashcardPDF(filePath, deckName) {
    const sanitizedName = deckName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    const fileName = `${sanitizedName}-${timestamp}.pdf`;

    return this.uploadFile(filePath, 'flashcard-pdfs', fileName);
  }

  /**
   * Upload image file for anatomy quiz
   * @param {string} filePath - Local image file path
   * @param {string} quizName - Quiz name for organizing files
   * @returns {Promise<{key: string, url: string, fileName: string}>} Uploaded file info
   */
  async uploadAnatomyImage(filePath, quizName) {
    const sanitizedName = quizName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    const ext = path.extname(filePath);
    const fileName = `${sanitizedName}-${timestamp}${ext}`;

    return this.uploadFile(filePath, 'anatomy-images', fileName);
  }

  /**
   * Get a signed URL for temporary access to a private file
   * @param {string} key - File key in bucket
   * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
   * @returns {Promise<string>} Signed URL
   */
  async getSignedUrl(key, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      
      const signedUrl = await getSignedUrl(this.client, command, { expiresIn });
      console.log(signedUrl)
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL: ' + error.message);
    }
  }

  /**
   * Delete a file from iDrive e2
   * @param {string} key - File key in bucket
   * @returns {Promise<void>}
   */
  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.error('Error deleting file from iDrive e2:', error);
      throw new Error('Failed to delete file from cloud storage: ' + error.message);
    }
  }

  /**
   * Get content type based on file extension
   * @param {string} ext - File extension
   * @returns {string} Content type
   */
  getContentType(ext) {
    const types = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.txt': 'text/plain',
      '.json': 'application/json',
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
  }
}

export default new IDriveService();
