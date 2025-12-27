/**
 * Format bytes to human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.45 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * Get file icon emoji based on MIME type
 * @param {string} type - MIME type (e.g., "application/pdf")
 * @returns {string} Emoji icon
 */
export const getFileIcon = (type) => {
  if (!type) return '📄'
  if (type.includes('pdf')) return '📕'
  if (type.includes('presentation') || type.includes('powerpoint')) return '📊'
  if (type.includes('document') || type.includes('word')) return '📘'
  if (type.includes('image')) return '🖼️'
  return '📄'
}
