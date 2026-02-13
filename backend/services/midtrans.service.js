import midtransClient from 'midtrans-client'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Midtrans Snap client
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
})

/**
 * Create Snap token for payment
 * @param {Object} params - Transaction parameters
 * @param {string} params.orderId - Unique order ID (transaction reference)
 * @param {number} params.amount - Amount in IDR
 * @param {Object} params.customerDetails - Customer information
 * @param {string} params.customerDetails.email - Customer email
 * @param {string} params.customerDetails.firstName - Customer first name
 * @param {string} params.customerDetails.lastName - Customer last name (optional)
 * @param {Array} params.itemDetails - Array of items being purchased
 * @returns {Promise<Object>} Snap token response
 */
export const createSnapToken = async ({ orderId, amount, customerDetails, itemDetails }) => {
  try {
    console.log('Creating Midtrans Snap token with params:', {
      orderId,
      amount,
      customerDetails,
      itemDetails
    })

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        email: customerDetails.email,
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName || ''
      },
      item_details: itemDetails,
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/topup?status=success`
      }
    }

    const transaction = await snap.createTransaction(parameter)

    console.log('Midtrans Snap token created:', {
      token: transaction.token,
      redirect_url: transaction.redirect_url
    })

    return {
      token: transaction.token,
      redirectUrl: transaction.redirect_url
    }
  } catch (error) {
    console.error('Midtrans createSnapToken error:', error)
    throw new Error(`Failed to create Midtrans Snap token: ${error.message}`)
  }
}

/**
 * Verify webhook notification signature
 * @param {Object} notification - Notification data from Midtrans
 * @returns {boolean} True if signature is valid
 */
export const verifySignature = (notification) => {
  try {
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key
    } = notification

    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''

    // Create signature string: order_id + status_code + gross_amount + serverKey
    const signatureString = order_id + status_code + gross_amount + serverKey

    // Hash with SHA512
    const hash = crypto
      .createHash('sha512')
      .update(signatureString)
      .digest('hex')

    console.log('Signature verification:', {
      received: signature_key,
      calculated: hash,
      match: hash === signature_key
    })

    return hash === signature_key
  } catch (error) {
    console.error('Midtrans signature verification error:', error)
    return false
  }
}

/**
 * Get transaction status from Midtrans
 * @param {string} orderId - Order ID to check
 * @returns {Promise<Object>} Transaction status
 */
export const getTransactionStatus = async (orderId) => {
  try {
    const status = await snap.transaction.status(orderId)

    console.log('Midtrans transaction status:', status)

    return status
  } catch (error) {
    console.error('Midtrans getTransactionStatus error:', error)
    throw new Error(`Failed to get transaction status: ${error.message}`)
  }
}

/**
 * Cancel transaction
 * @param {string} orderId - Order ID to cancel
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelTransaction = async (orderId) => {
  try {
    const response = await snap.transaction.cancel(orderId)

    console.log('Midtrans transaction cancelled:', response)

    return response
  } catch (error) {
    console.error('Midtrans cancelTransaction error:', error)
    throw new Error(`Failed to cancel transaction: ${error.message}`)
  }
}

export default {
  createSnapToken,
  verifySignature,
  getTransactionStatus,
  cancelTransaction
}
