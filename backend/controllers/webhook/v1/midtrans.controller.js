import { PrismaClient } from '@prisma/client'
import { verifySignature } from '#services/midtrans.service'
import { ValidationError } from '#errors/validationError'

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
    const creditsIncluded = purchase.pricing_plan?.credits_included || 0

    console.log(`Processing successful payment for purchase ${purchase.id}`)

    // Update purchase and grant credits/subscription in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update purchase record to completed
      await tx.user_purchases.update({
        where: { id: purchase.id },
        data: {
          payment_status: 'completed',
          payment_reference: orderId
        }
      })

      // 2. Activate subscription if plan includes subscription
      if (purchase.bundle_type === 'subscription' || purchase.bundle_type === 'hybrid') {
        // Find the pending subscription created for this user
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
          // Activate the pending subscription
          await tx.user_subscriptions.update({
            where: { id: pendingSubscription.id },
            data: {
              status: 'active'
            }
          })
        } else {
          // Fallback: Create new active subscription
          console.warn(`No pending subscription found for user ${purchase.user_id}, creating new active subscription`)

          const activeSubscription = await tx.user_subscriptions.findFirst({
            where: {
              user_id: purchase.user_id,
              end_date: { gte: new Date() },
              status: 'active'
            },
            orderBy: {
              end_date: 'desc'
            }
          })

          let subscriptionStart
          let subscriptionEnd

          if (activeSubscription) {
            subscriptionStart = activeSubscription.end_date
            subscriptionEnd = new Date(subscriptionStart)
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (purchase.pricing_plan.duration_days || 30))
          } else {
            subscriptionStart = new Date()
            subscriptionEnd = new Date(subscriptionStart)
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (purchase.pricing_plan.duration_days || 30))
          }

          await tx.user_subscriptions.create({
            data: {
              user_id: purchase.user_id,
              start_date: subscriptionStart,
              end_date: subscriptionEnd,
              status: 'active'
            }
          })
        }
      }

      // 3. Add credits to user's balance if plan includes credits
      if (creditsIncluded > 0) {
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
        const balanceAfter = Number(balanceBefore) + Number(creditsIncluded)

        // Update balance
        await tx.user_credits.update({
          where: { user_id: purchase.user_id },
          data: {
            balance: balanceAfter,
            updated_at: new Date()
          }
        })

        // 4. Create credit transaction ledger record
        await tx.credit_transactions.create({
          data: {
            user_id: purchase.user_id,
            user_credit_id: userCredit.id,
            type: purchase.bundle_type === 'credits' ? 'purchase' : 'subscription_bonus',
            amount: creditsIncluded,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Credits from ${purchase.pricing_plan.name} (Paid via Midtrans ${paymentType})`,
            payment_status: 'completed',
            payment_method: `midtrans - ${paymentType}`,
            payment_reference: orderId
          }
        })
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
