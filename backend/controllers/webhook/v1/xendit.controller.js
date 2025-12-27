import { PrismaClient } from '@prisma/client'
import { verifyWebhookToken } from '#services/xendit.service'

const prisma = new PrismaClient()

/**
 * Handle Xendit invoice webhook
 * This is called when invoice status changes (paid, expired, etc.)
 */
export const handleXenditInvoiceWebhook = async (req, res) => {
  try {
    // Verify webhook token
    const callbackToken = req.headers['x-callback-token']
    if (!verifyWebhookToken(callbackToken)) {
      console.error('Invalid webhook token')
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook token'
      })
    }

    const webhookData = req.body
    console.log('Xendit invoice webhook received:', JSON.stringify(webhookData, null, 2))

    const {
      id: invoiceId,
      external_id: externalId,
      status,
      paid_amount: paidAmount,
      payment_method: paymentMethod,
      payment_channel: paymentChannel,
      paid_at: paidAt
    } = webhookData

    // Find transaction by external ID (our payment reference)
    // The external_id is the unique reference we generated
    const transactions = await prisma.credit_transactions.findMany({
      where: {
        OR: [
          { paymentReference: invoiceId }, // Xendit invoice ID
          { paymentReference: { contains: externalId.split('-')[0] } } // Original reference prefix
        ],
        paymentStatus: 'pending'
      },
      include: {
        creditPlan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (transactions.length === 0) {
      console.error(`Transaction not found for invoice ${invoiceId} / ${externalId}`)
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    const transaction = transactions[0] // Get the most recent matching transaction

    // Handle different invoice statuses
    switch (status) {
      case 'PAID':
        await handlePaidInvoice(transaction, {
          paidAmount,
          paymentMethod,
          paymentChannel,
          paidAt,
          invoiceId
        })
        break

      case 'EXPIRED':
        await handleExpiredInvoice(transaction)
        break

      default:
        console.log(`Unhandled invoice status: ${status}`)
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({
      message: 'Webhook processed'
    })
  } catch (error) {
    console.error('Error processing Xendit webhook:', error)
    // Still return 200 to prevent retries
    res.status(200).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    })
  }
}

/**
 * Handle paid invoice - add credits to user
 */
async function handlePaidInvoice(transaction, paymentDetails) {
  try {
    const { paidAmount, paymentMethod, paymentChannel, paidAt, invoiceId } = paymentDetails

    // Get user credit
    const userCredit = await prisma.user_credits.findUnique({
      where: { id: transaction.userCreditId }
    })

    if (!userCredit) {
      throw new Error('User credit account not found')
    }

    const newBalance = userCredit.balance + transaction.amount

    // Update transaction and user credit in a single transaction
    await prisma.$transaction([
      // Update user credit balance
      prisma.user_credits.update({
        where: { id: transaction.userCreditId },
        data: { balance: newBalance }
      }),
      // Update transaction status
      prisma.credit_transactions.update({
        where: { id: transaction.id },
        data: {
          paymentStatus: 'completed',
          balanceAfter: newBalance,
          paymentReference: invoiceId,
          paymentMethod: `${paymentMethod} - ${paymentChannel}`,
          description: `${transaction.description} (Paid via ${paymentChannel})`
        }
      })
    ])

    console.log(`Payment completed for transaction ${transaction.id}. Added ${transaction.amount} credits to user ${transaction.userId}`)
  } catch (error) {
    console.error('Error handling paid invoice:', error)
    throw error
  }
}

/**
 * Handle expired invoice - mark as failed
 */
async function handleExpiredInvoice(transaction) {
  try {
    await prisma.credit_transactions.update({
      where: { id: transaction.id },
      data: {
        paymentStatus: 'failed',
        description: `${transaction.description} (Invoice expired)`
      }
    })

    console.log(`Invoice expired for transaction ${transaction.id}`)
  } catch (error) {
    console.error('Error handling expired invoice:', error)
    throw error
  }
}

/**
 * Handle Xendit virtual account webhook
 * This is called when VA payment is received
 */
export const handleXenditVAWebhook = async (req, res) => {
  try {
    // Verify webhook token
    const callbackToken = req.headers['x-callback-token']
    if (!verifyWebhookToken(callbackToken)) {
      console.error('Invalid webhook token')
      return res.status(401).json({
        success: false,
        message: 'Invalid webhook token'
      })
    }

    const webhookData = req.body
    console.log('Xendit VA webhook received:', JSON.stringify(webhookData, null, 2))

    const {
      external_id: externalId,
      amount,
      bank_code: bankCode,
      transaction_timestamp: transactionTimestamp
    } = webhookData

    // Find transaction by external ID
    const transaction = await prisma.credit_transactions.findFirst({
      where: {
        paymentReference: { contains: externalId },
        paymentStatus: 'pending'
      },
      include: {
        creditPlan: true
      }
    })

    if (!transaction) {
      console.error(`Transaction not found for VA payment ${externalId}`)
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    // Process payment
    await handlePaidInvoice(transaction, {
      paidAmount: amount,
      paymentMethod: 'Virtual Account',
      paymentChannel: bankCode,
      paidAt: transactionTimestamp,
      invoiceId: externalId
    })

    // Return 200 to acknowledge receipt
    res.status(200).json({
      message: 'VA webhook processed'
    })
  } catch (error) {
    console.error('Error processing Xendit VA webhook:', error)
    // Still return 200 to prevent retries
    res.status(200).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    })
  }
}

export default {
  handleXenditInvoiceWebhook,
  handleXenditVAWebhook
}
