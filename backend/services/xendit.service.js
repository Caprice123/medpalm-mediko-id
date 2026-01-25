import { Xendit } from 'xendit-node'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Xendit with API key
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_default_key'
})

const { Invoice, VirtualAcc } = xenditClient

/**
 * Create invoice for credit purchase
 * @param {Object} params - Invoice parameters
 * @param {number} params.amount - Amount in IDR
 * @param {string} params.externalId - Unique external ID (transaction reference)
 * @param {string} params.payerEmail - Customer email
 * @param {string} params.description - Invoice description
 * @returns {Promise<Object>} Invoice object from Xendit
 */
export const createInvoice = async ({ amount, externalId, payerEmail, description }) => {
  try {
    console.log('Creating Xendit invoice with params:', {
      amount,
      externalId,
      payerEmail,
      description
    })

    const invoice = await Invoice.createInvoice({
      data: {
        externalId,
        amount,
        payerEmail,
        description,
        currency: 'IDR',
        reminderTime: 1, // Reminder in minutes before expiry
        successRedirectUrl: process.env.FRONTEND_URL,
        failureRedirectUrl: process.env.FRONTEND_URL,
        invoiceDuration: 86400, // 24 hours in seconds
        shouldSendEmail: true,
        items: [
          {
            name: description,
            quantity: 1,
            price: amount
          }
        ]
      }
    })

    console.log('Xendit invoice raw response:', JSON.stringify(invoice, null, 2))
    console.log('Invoice URL field check:', {
      invoice_url: invoice.invoice_url,
      invoiceUrl: invoice.invoiceUrl,
      invoice_url_exists: !!invoice.invoice_url,
      invoiceUrl_exists: !!invoice.invoiceUrl
    })

    return invoice
  } catch (error) {
    console.error('Xendit createInvoice error:', error)
    throw new Error(`Failed to create Xendit invoice: ${error.message}`)
  }
}

/**
 * Get invoice by ID
 * @param {string} invoiceId - Xendit invoice ID
 * @returns {Promise<Object>} Invoice object from Xendit
 */
export const getInvoice = async (invoiceId) => {
  try {
    const invoice = await Invoice.getInvoiceById({
      invoiceId
    })
    return invoice
  } catch (error) {
    console.error('Xendit getInvoice error:', error)
    throw new Error(`Failed to get Xendit invoice: ${error.message}`)
  }
}

/**
 * Expire an invoice
 * @param {string} invoiceId - Xendit invoice ID
 * @returns {Promise<Object>} Expired invoice object from Xendit
 */
export const expireInvoice = async (invoiceId) => {
  try {
    const invoice = await Invoice.expireInvoice({
      invoiceId
    })
    return invoice
  } catch (error) {
    console.error('Xendit expireInvoice error:', error)
    throw new Error(`Failed to expire Xendit invoice: ${error.message}`)
  }
}

/**
 * Verify webhook callback signature
 * @param {string} token - Xendit callback token from header
 * @returns {boolean} True if token matches
 */
export const verifyWebhookToken = (token) => {
  const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN
  if (!webhookToken) {
    console.warn('XENDIT_WEBHOOK_TOKEN not configured')
    return false
  }
  return token === webhookToken
}

/**
 * Create virtual account for payment
 * @param {Object} params - VA parameters
 * @param {string} params.externalId - Unique external ID
 * @param {string} params.bankCode - Bank code (BCA, BNI, BRI, MANDIRI, PERMATA)
 * @param {string} params.name - Customer name
 * @param {number} params.expectedAmount - Expected amount in IDR
 * @returns {Promise<Object>} Virtual account object from Xendit
 */
export const createVirtualAccount = async ({ externalId, bankCode, name, expectedAmount }) => {
  try {
    const va = await VirtualAcc.createFixedVA({
      data: {
        externalId,
        bankCode,
        name,
        expectedAmount,
        isClosed: true, // Closed VA - exact amount only
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }
    })

    return va
  } catch (error) {
    console.error('Xendit createVirtualAccount error:', error)
    throw new Error(`Failed to create virtual account: ${error.message}`)
  }
}

export default {
  createInvoice,
  getInvoice,
  expireInvoice,
  verifyWebhookToken,
  createVirtualAccount
}
