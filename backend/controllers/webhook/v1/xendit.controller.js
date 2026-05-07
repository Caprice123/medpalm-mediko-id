import moment from 'moment'
import { PrismaClient } from '@prisma/client'
import { verifyWebhookToken } from '#services/xendit.service'
import { ValidationError } from '#errors/validationError'
import { addUserCredits } from '#utils/creditUtils'
import { applyPlanFeatures } from '#services/users/applyPlanFeaturesService'

const prisma = new PrismaClient()

/**
 * Handle Xendit invoice webhook
 * This is called when invoice status changes (paid, expired, etc.)
 */
export const handleXenditInvoiceWebhook = async (req, res) => {
    const callbackToken = req.headers['x-callback-token']
    if (!verifyWebhookToken(callbackToken)) {
      console.error('Invalid webhook token')
      return res.status(401).json({ message: 'Invalid webhook token' })
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

    const log = await prisma.webhook_logs.create({
      data: {
        source: 'xendit_invoice',
        event_type: status,
        payment_reference: invoiceId,
        payload: webhookData,
        status: 'processing',
      }
    })

    const updateLog = (status, error_message = null) =>
      prisma.webhook_logs.update({ where: { id: log.id }, data: { status, error_message } })

    // First, check if this is a user_purchase (new pricing plan flow)
    const purchase = await prisma.user_purchases.findFirst({
      where: { payment_reference: invoiceId, payment_status: 'pending' },
      include: { pricing_plan: true }
    })

    if (purchase) {
      switch (status) {
        case 'PAID':
          await handlePaidPurchase(purchase, { paidAmount, paymentMethod, paymentChannel, paidAt, invoiceId })
          break
        case 'EXPIRED':
          await handleExpiredPurchase(purchase)
          break
        default:
          console.log(`Unhandled invoice status: ${status}`)
      }
      await updateLog('processed')
      return res.status(200).json({ message: 'Webhook processed' })
    }

    // Fallback to credit_transactions (old flow)
    const transactions = await prisma.credit_transactions.findMany({
      where: {
        OR: [
          { payment_reference: invoiceId },
          { payment_reference: { contains: externalId.split('-')[0] } }
        ],
        payment_status: 'pending'
      },
      include: { credit_plans: true },
      orderBy: { created_at: 'desc' }
    })

    if (transactions.length === 0) {
      console.error(`Transaction/Purchase not found for invoice ${invoiceId} / ${externalId}`)
      await updateLog('not_found')
      return res.status(404).json({ message: 'Transaction not found' })
    }

    const transaction = transactions[0]

    switch (status) {
      case 'PAID':
        await handlePaidInvoice(transaction, { paidAmount, paymentMethod, paymentChannel, paidAt, invoiceId })
        break
      case 'EXPIRED':
        await handleExpiredInvoice(transaction)
        break
      default:
        console.log(`Unhandled invoice status: ${status}`)
    }

    await updateLog('processed')
    res.status(200).json({ message: 'Webhook processed' })
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
      throw new ValidationError('User credit account not found')
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

    if (parseFloat(paidAmount) < parseFloat(purchase.amount_paid)) {
      console.error(`Amount mismatch for purchase ${purchase.id}: paid ${paidAmount}, expected ${purchase.amount_paid}`)
      return
    }

    const durationDays = purchase.duration_days ?? purchase.pricing_plan?.duration_days
    const creditsIncluded = purchase.credits_included ?? purchase.pricing_plan?.credits_included ?? 0
    const creditType = purchase.credit_type ?? purchase.pricing_plan?.credit_type ?? 'permanent'
    const creditExpiryDays = purchase.credit_expiry_days ?? purchase.pricing_plan?.credit_expiry_days
    const allowedFeatures = purchase.allowed_features || []

    await prisma.$transaction(async (tx) => {
      // 1. Update purchase record to completed
      await tx.user_purchases.update({
        where: { id: purchase.id },
        data: { payment_status: 'completed' }
      })


      // 3. Add credits using snapshotted values
      if (creditsIncluded > 0) {
        let expiresAt = null
        if (creditType === 'expiring' && creditExpiryDays) {
          expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + creditExpiryDays)
        }
        await addUserCredits(tx, purchase.user_id, creditsIncluded, {
          creditType,
          expiresAt,
          description: `Credits from ${purchase.pricing_plan?.name} (Paid via ${paymentChannel})`,
          transactionType: purchase.bundle_type === 'credits' ? 'purchase' : 'subscription_bonus',
          paymentMethod: `${paymentMethod} - ${paymentChannel}`,
          paymentReference: invoiceId
        })
      }

      // 4. Grant feature access — each feature uses its own last subscription as base
      if (durationDays > 0) {
        await applyPlanFeatures(tx, purchase.user_id, allowedFeatures, durationDays)
      }
    })

    console.log(`Payment completed for purchase ${purchase.id}. Granted ${creditsIncluded} credits to user ${purchase.user_id}`)
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
    // For expired invoices, mark purchase as failed and expire any pending subscription
    await prisma.$transaction(async (tx) => {
      // 1. Mark purchase as failed
      await tx.user_purchases.update({
        where: { id: purchase.id },
        data: {
          payment_status: 'failed'
        }
      })

      // 2. Mark any pending subscription as expired
      if (purchase.bundle_type === 'subscription' || purchase.bundle_type === 'hybrid') {
        const pendingSubscription = await tx.user_subscriptions.findFirst({
          where: {
            user_id: purchase.user_id,
            status: 'not_active'
          },
          orderBy: {
            created_at: 'desc'
          }
        })

        if (pendingSubscription) {
          await tx.user_subscriptions.update({
            where: { id: pendingSubscription.id },
            data: {
              status: 'expired'
            }
          })
        }
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
  const callbackToken = req.headers['x-callback-token']
  if (!verifyWebhookToken(callbackToken)) {
    console.error('Invalid webhook token')
    return res.status(401).json({ message: 'Invalid webhook token' })
  }

  const webhookData = req.body
  console.log('Xendit VA webhook received:', JSON.stringify(webhookData, null, 2))

  const {
    external_id: externalId,
    amount,
    bank_code: bankCode,
    transaction_timestamp: transactionTimestamp
  } = webhookData

  const log = await prisma.webhook_logs.create({
    data: {
      source: 'xendit_va',
      event_type: 'PAID',
      payment_reference: externalId,
      payload: webhookData,
      status: 'processing',
    }
  })

  const updateLog = (status, error_message = null) =>
    prisma.webhook_logs.update({ where: { id: log.id }, data: { status, error_message } })

  // First, check if this is a user_purchase (new pricing plan flow)
  const purchase = await prisma.user_purchases.findFirst({
    where: { payment_reference: externalId, payment_status: 'pending' },
    include: { pricing_plan: true }
  })

  if (purchase) {
    await handlePaidPurchase(purchase, {
      paidAmount: amount,
      paymentMethod: 'Virtual Account',
      paymentChannel: bankCode,
      paidAt: transactionTimestamp,
      invoiceId: externalId
    })
    await updateLog('processed')
    return res.status(200).json({ message: 'VA webhook processed' })
  }

  // Fallback to credit_transactions (old flow)
  const transaction = await prisma.credit_transactions.findFirst({
    where: { payment_reference: { contains: externalId }, payment_status: 'pending' },
    include: { credit_plans: true }
  })

  if (!transaction) {
    console.error(`Transaction not found for VA payment ${externalId}`)
    await updateLog('not_found')
    return res.status(404).json({ message: 'Transaction not found' })
  }

  await handlePaidInvoice(transaction, {
    paidAmount: amount,
    paymentMethod: 'Virtual Account',
    paymentChannel: bankCode,
    paidAt: transactionTimestamp,
    invoiceId: externalId
  })

  await updateLog('processed')
  return res.status(200).json({ message: 'VA webhook processed' })
}

export default {
  handleXenditInvoiceWebhook,
  handleXenditVAWebhook
}
