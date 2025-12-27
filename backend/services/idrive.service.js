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
   * Upload a flashcard card image to iDrive E2
   * @param {string} filePath - Local file path
   * @param {string} cardName - Name identifier for the card
   * @returns {Promise<{url: string, key: string, fileName: string}>}
   */
  async uploadFlashcardImage(filePath, cardName) {
    const sanitizedName = cardName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now();
    const ext = path.extname(filePath);
    const fileName = `${sanitizedName}-${timestamp}${ext}`;

    return this.uploadFile(filePath, 'flashcard-images', fileName);
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
   * Get signed URLs for multiple files in bulk (PERFORMANCE OPTIMIZATION)
   * @param {string[]} keys - Array of file keys in bucket
   * @param {number} expiresIn - URL expiration time in seconds (default: 3600)
   * @returns {Promise<string[]>} Array of signed URLs in the same order as keys
   */
  async getBulkSignedUrls(keys, expiresIn = 3600) {
    try {
      // Generate signed URLs in parallel
      const signedUrlPromises = keys.map(key => {
        const command = new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        });
        return getSignedUrl(this.client, command, { expiresIn });
      });

      const signedUrls = await Promise.all(signedUrlPromises);
      return signedUrls;
    } catch (error) {
      console.error('Error generating bulk signed URLs:', error);
      throw new Error('Failed to generate bulk signed URLs: ' + error.message);
    }
  }

  /**
   * Download a file from iDrive e2 to local temporary path
   * @param {string} key - File key in bucket
   * @param {string} localPath - Local path to save the file (optional)
   * @returns {Promise<string>} Path to downloaded file
   */
  async downloadFile(key, localPath = null) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Determine local path
      const downloadPath = localPath || path.join('uploads', `temp-${Date.now()}${path.extname(key)}`);

      // Ensure directory exists
      const dir = path.dirname(downloadPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write to file
      fs.writeFileSync(downloadPath, buffer);

      return downloadPath;
    } catch (error) {
      console.error('Error downloading file from iDrive e2:', error);
      throw new Error('Failed to download file from cloud storage: ' + error.message);
    }
  }

  /**
   * Download a file from iDrive e2 as buffer (in-memory, no disk write)
   * @param {string} key - File key in bucket
   * @returns {Promise<Buffer>} File buffer
   */
  async downloadFileAsBuffer(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      return buffer;
    } catch (error) {
      console.error('Error downloading file from iDrive e2:', error);
      throw new Error('Failed to download file from cloud storage: ' + error.message);
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
