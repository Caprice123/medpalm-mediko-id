import crypto from 'crypto'

/**
 * Generate MD5 checksum for content
 * @param {string} content - Content to hash
 * @returns {string} - MD5 hash
 */
export function generateChecksum(content) {
  return crypto
    .createHash('md5')
    .update(content, 'utf8')
    .digest('hex')
}

/**
 * Compare two checksums
 * @param {string} checksum1
 * @param {string} checksum2
 * @returns {boolean}
 */
export function compareChecksums(checksum1, checksum2) {
  return checksum1 === checksum2
}
