import moment from 'moment'
import { PrismaClient } from '@prisma/client'
import { verifySignature } from '#services/midtrans.service'
import { ValidationError } from '#errors/validationError'
import { addUserCredits } from '#utils/creditUtils'
import { applyPlanFeatures } from '#services/users/applyPlanFeaturesService'

const prisma = new PrismaClient()

/**
 * Handle Midtrans payment notification webhook
 * This is called when payment status changes (settlement, pending, deny, expire, cancel)
 */
export const handleMidtransNotification = async (req, res) => {
  try {
    const notification = req.body
    console.log('Midtrans notification received:', JSON.stringify(notification, null, 2))

    // Verify signature
    if (!verifySignature(notification)) {
      console.error('Invalid Midtrans signature')
      return res.status(401).json({
        message: 'Invalid signature'
      })
    }

    const {
      order_id: orderId,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      gross_amount: grossAmount,
      payment_type: paymentType,
      transaction_time: transactionTime
    } = notification

    // Extract purchase ID from order_id (format: PURCHASE-{id}-{timestamp})
    const purchaseIdMatch = orderId.match(/PURCHASE-(\d+)-/)
    if (!purchaseIdMatch) {
      console.error(`Invalid order_id format: ${orderId}`)
      return res.status(400).json({
        message: 'Invalid order ID format'
      })
    }

    const purchaseId = parseInt(purchaseIdMatch[1])

    // Find the purchase
    const purchase = await prisma.user_purchases.findFirst({
      where: {
        id: purchaseId,
        payment_status: 'pending'
      },
      include: {
        pricing_plan: true
      }
    })

    if (!purchase) {
      console.error(`Purchase not found or already processed: ${purchaseId}`)
      return res.status(404).json({
        message: 'Purchase not found or already processed'
      })
    }

    // Handle different transaction statuses
    if (transactionStatus === 'capture') {
      // For credit card transactions
      if (fraudStatus === 'accept') {
        await handleSuccessfulPayment(purchase, {
          grossAmount,
          paymentType,
          transactionTime,
          orderId
        })
      }
    } else if (transactionStatus === 'settlement') {
      // For non-credit card transactions (bank transfer, e-wallet, etc.)
      await handleSuccessfulPayment(purchase, {
        grossAmount,
        paymentType,
        transactionTime,
        orderId
      })
    } else if (transactionStatus === 'pending') {
      // Payment is pending (waiting for customer to complete)
      await handlePendingPayment(purchase, orderId)
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      // Payment failed/cancelled/expired
      await handleFailedPayment(purchase, transactionStatus)
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({
      message: 'Notification processed'
    })
  } catch (error) {
    console.error('Error processing Midtrans notification:', error)
    // Still return 200 to prevent retries
    res.status(200).json({
      success: false,
      message: 'Notification processing failed',
      error: error.message
    })
  }
}

/**
 * Handle successful payment - grant credits and activate subscription
 */
async function handleSuccessfulPayment(purchase, paymentDetails) {
  try {
    const { grossAmount, paymentType, transactionTime, orderId } = paymentDetails

    if (parseFloat(grossAmount) < parseFloat(purchase.amount_paid)) {
      console.error(`Amount mismatch for purchase ${purchase.id}: paid ${grossAmount}, expected ${purchase.amount_paid}`)
      return
    }

    console.log(`Processing successful payment for purchase ${purchase.id}`)

    const durationDays = purchase.duration_days ?? purchase.pricing_plan?.duration_days
    const creditsIncluded = purchase.credits_included ?? purchase.pricing_plan?.credits_included ?? 0
    const creditType = purchase.credit_type ?? purchase.pricing_plan?.credit_type ?? 'permanent'
    const creditExpiryDays = purchase.credit_expiry_days ?? purchase.pricing_plan?.credit_expiry_days
    const allowedFeatures = purchase.allowed_features || []

    await prisma.$transaction(async (tx) => {
      // 1. Update purchase record to completed
      await tx.user_purchases.update({
        where: { id: purchase.id },
        data: { payment_status: 'completed', payment_reference: orderId }
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
          description: `Credits from ${purchase.pricing_plan?.name} (Paid via Midtrans ${paymentType})`,
          transactionType: purchase.bundle_type === 'credits' ? 'purchase' : 'subscription_bonus',
          paymentMethod: `midtrans - ${paymentType}`,
          paymentReference: orderId
        })
      }

      // 4. Grant feature access — each feature uses its own last subscription as base
      if (durationDays > 0) {
        await applyPlanFeatures(tx, purchase.user_id, allowedFeatures, durationDays)
      }
    })

    console.log(`Payment completed for purchase ${purchase.id}. Granted ${creditsIncluded} credits to user ${purchase.user_id}`)
  } catch (error) {
    console.error('Error handling successful payment:', error)
    throw error
  }
}

/**
 * Handle pending payment - update payment reference
 */
async function handlePendingPayment(purchase, orderId) {
  try {
    await prisma.user_purchases.update({
      where: { id: purchase.id },
      data: {
        payment_reference: orderId
      }
    })

    console.log(`Payment pending for purchase ${purchase.id}`)
  } catch (error) {
    console.error('Error handling pending payment:', error)
    throw error
  }
}

/**
 * Handle failed payment - mark as failed and expire subscription
 */
async function handleFailedPayment(purchase, reason) {
  try {
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

    console.log(`Payment ${reason} for purchase ${purchase.id}`)
  } catch (error) {
    console.error('Error handling failed payment:', error)
    throw error
  }
}

export default {
  handleMidtransNotification
}
