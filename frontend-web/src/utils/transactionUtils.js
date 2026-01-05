/**
 * Transaction utilities for translating and formatting transaction-related data
 */

/**
 * Get localized status label
 * @param {string} status - Payment status
 * @param {string} lang - Language code ('id' or 'en')
 * @returns {string} Localized status label
 */
export const getStatusLabel = (status, lang = 'id') => {
  const labels = {
    id: {
      completed: 'Selesai',
      pending: 'Pending',
      waiting_approval: 'Menunggu Persetujuan',
      failed: 'Gagal',
      rejected: 'Ditolak'
    },
    en: {
      completed: 'Completed',
      pending: 'Pending',
      waiting_approval: 'Waiting Approval',
      failed: 'Failed',
      rejected: 'Rejected'
    }
  }

  return labels[lang]?.[status] || status
}

/**
 * Get localized bundle type label
 * @param {string} type - Bundle type
 * @param {string} lang - Language code ('id' or 'en')
 * @returns {string} Localized type label
 */
export const getTypeLabel = (type, lang = 'id') => {
  const labels = {
    id: {
      credits: 'Kredit',
      subscription: 'Langganan',
      hybrid: 'Hybrid'
    },
    en: {
      credits: 'Credits',
      subscription: 'Subscription',
      hybrid: 'Hybrid'
    }
  }

  return labels[lang]?.[type] || type
}

/**
 * Get localized payment method label
 * @param {string} method - Payment method
 * @param {string} lang - Language code ('id' or 'en')
 * @returns {string} Localized payment method label
 */
export const getPaymentMethodLabel = (method, lang = 'id') => {
  const labels = {
    id: {
      xendit: 'Xendit (Online)',
      manual: 'Transfer Manual'
    },
    en: {
      xendit: 'Xendit (Online)',
      manual: 'Manual Transfer'
    }
  }

  return labels[lang]?.[method] || method
}

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `Rp ${Number(amount || 0).toLocaleString('id-ID')}`
}

/**
 * Format date to Indonesian locale
 * @param {string|Date} dateString - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = true) => {
  const date = new Date(dateString)
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Intl.DateTimeFormat('id-ID', options).format(date)
}

/**
 * Get file icon emoji based on content type
 * @param {string} contentType - File content type
 * @returns {string} Emoji icon
 */
export const getFileIcon = (contentType) => {
  if (contentType?.startsWith('image/')) return '🖼️'
  if (contentType?.startsWith('application/pdf')) return '📄'
  return '📎'
}
