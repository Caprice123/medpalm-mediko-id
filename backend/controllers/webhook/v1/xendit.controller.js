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

    // First, check if this is a user_purchase (new pricing plan flow)
    const purchase = await prisma.user_purchases.findFirst({
      where: {
        payment_reference: invoiceId,
        payment_status: 'pending'
      },
      include: {
        pricing_plan: true
      }
    })

    if (purchase) {
      // Handle pricing plan purchase
      switch (status) {
        case 'PAID':
          await handlePaidPurchase(purchase, {
            paidAmount,
            paymentMethod,
            paymentChannel,
            paidAt,
            invoiceId
          })
          break

        case 'EXPIRED':
          await handleExpiredPurchase(purchase)
          break

        default:
          console.log(`Unhandled invoice status: ${status}`)
      }

      return res.status(200).json({
        message: 'Webhook processed'
      })
    }

    // Fallback to credit_transactions (old flow)
    const transactions = await prisma.credit_transactions.findMany({
      where: {
        OR: [
          { payment_reference: invoiceId }, // Xendit invoice ID
          { payment_reference: { contains: externalId.split('-')[0] } } // Original reference prefix
        ],
        payment_status: 'pending'
      },
      include: {
        credit_plans: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    if (transactions.length === 0) {
      console.error(`Transaction/Purchase not found for invoice ${invoiceId} / ${externalId}`)
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
      where: { id: transaction.user_credit_id }
    })

    if (!userCredit) {
      throw new Error('User credit account not found')
    }

    const newBalance = userCredit.balance + transaction.amount

    // Update transaction and user credit in a single transaction
    await prisma.$transaction([
      // Update user credit balance
      prisma.user_credits.update({
        where: { id: transaction.user_credit_id },
        data: { balance: newBalance }
      }),
      // Update transaction status
      prisma.credit_transactions.update({
        where: { id: transaction.id },
        data: {
          payment_status: 'completed',
          balance_after: newBalance,
          payment_reference: invoiceId,
          payment_method: `${paymentMethod} - ${paymentChannel}`,
          description: `${transaction.description} (Paid via ${paymentChannel})`
        }
      })
    ])

    console.log(`Payment completed for transaction ${transaction.id}. Added ${transaction.amount} credits to user ${transaction.user_id}`)
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
        payment_status: 'failed',
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
 * Handle paid purchase - grant credits and activate subscription
 */
async function handlePaidPurchase(purchase, paymentDetails) {
  try {
    const { paidAmount, paymentMethod, paymentChannel, paidAt, invoiceId } = paymentDetails

    // Calculate subscription dates if needed
    let subscriptionStart = null
    let subscriptionEnd = null
    let subscriptionStatus = null

    if (purchase.bundle_type === 'subscription' || purchase.bundle_type === 'hybrid') {
      subscriptionStart = new Date()
      subscriptionEnd = new Date(subscriptionStart)
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (purchase.pricing_plan.duration_days || 30))
      subscriptionStatus = 'active'
    }

    // Update purchase and grant credits in a transaction
    await prisma.$transaction(async (tx) => {
      // Update purchase record to completed
      await tx.user_purchases.update({
        where: { id: purchase.id },
        data: {
          payment_status: 'completed',
          subscription_start: subscriptionStart,
          subscription_end: subscriptionEnd,
          subscription_status: subscriptionStatus
        }
      })

      // Add credits to user's balance if plan includes credits
      if (purchase.credits_granted > 0) {
        // Find or create user credits
        let userCredit = await tx.user_credits.findUnique({
          where: { user_id: purchase.user_id }
        })

        if (!userCredit) {
          userCredit = await tx.user_credits.create({
            data: {
              user_id: purchase.user_id,
              balance: 0
            }
          })
        }

        const balanceBefore = userCredit.balance
        const balanceAfter = Number(balanceBefore) + Number(purchase.credits_granted)

        // Update balance
        await tx.user_credits.update({
          where: { user_id: purchase.user_id },
          data: {
            balance: balanceAfter,
            updated_at: new Date()
          }
        })

        // Create credit transaction record
        await tx.credit_transactions.create({
          data: {
            user_id: purchase.user_id,
            user_credit_id: userCredit.id,
            type: purchase.bundle_type === 'credits' ? 'purchase' : 'subscription_bonus',
            amount: purchase.credits_granted,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Credits from ${purchase.pricing_plan.name} (Paid via ${paymentChannel})`,
            payment_status: 'completed',
            payment_method: `${paymentMethod} - ${paymentChannel}`,
            payment_reference: invoiceId
          }
        })
      }
    })

    console.log(`Payment completed for purchase ${purchase.id}. Granted ${purchase.credits_granted} credits to user ${purchase.user_id}`)
  } catch (error) {
    console.error('Error handling paid purchase:', error)
    throw error
  }
}

/**
 * Handle expired purchase - mark as failed and delete
 */
async function handleExpiredPurchase(purchase) {
  try {
    // For expired invoices, we can either delete the purchase or mark it as failed
    // Deleting makes sense since no payment was made
    await prisma.user_purchases.update({
      where: { id: purchase.id },
      data: {
        payment_status: 'failed'
      }
    })

    console.log(`Invoice expired for purchase ${purchase.id}`)
  } catch (error) {
    console.error('Error handling expired purchase:', error)
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
        payment_reference: { contains: externalId },
        payment_status: 'pending'
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
      payment_method: 'Virtual Account',
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
