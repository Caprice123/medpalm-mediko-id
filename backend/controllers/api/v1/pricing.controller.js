import { GetActivePricingPlansService } from '#services/pricing/getActivePricingPlansService'
import { PurchasePricingPlanService } from '#services/pricing/purchasePricingPlanService'
import { GetUserStatusService, HasActiveSubscriptionService, GetUserCreditBalanceService } from '#services/pricing/getUserStatusService'
import { GetUserPurchaseHistoryService } from '#services/pricing/getUserPurchaseHistoryService'
import { GetUserPurchaseDetailService } from '#services/pricing/getUserPurchaseDetailService'
import { AttachPaymentEvidenceService } from '#services/pricing/uploadPaymentEvidenceService'
import { createInvoice } from '#services/xendit.service'
import { createSnapToken } from '#services/midtrans.service'
import prisma from '#prisma/client'

class PricingController {
  /**
   * Get all active pricing plans (public)
   * Optionally filter by bundle_type: credits, subscription, hybrid
   */
  async getPlans(req, res) {
    const { bundle_type } = req.query

    const plans = await GetActivePricingPlansService.call(bundle_type || null)

    res.status(200).json({
      data: plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        bundleType: plan.bundle_type,
        durationDays: plan.duration_days,
        creditsIncluded: plan.credits_included,
        isPopular: plan.is_popular,
        discount: plan.discount,
        order: plan.order,
        allowedPaymentMethods: plan.allowed_payment_method || 'xendit'
      }))
    })
  }

  /**
   * Get user's comprehensive status (subscription + credits)
   */
  async getUserStatus(req, res) {
    const userId = req.user.id

    const status = await GetUserStatusService.call(userId)

    res.status(200).json({
      data: status
    })
  }

  /**
   * Get user's purchase history (all payments) with pagination
   */
  async getPurchaseHistory(req, res) {
    const userId = req.user.id
    const { page, perPage } = req.query

    const result = await GetUserPurchaseHistoryService.call(userId, { page, perPage })

    res.status(200).json({
      data: result.purchases,
      pagination: result.pagination
    })
  }

  /**
   * Get purchase detail (single purchase with attachments)
   */
  async getPurchaseDetail(req, res) {
    const userId = req.user.id
    const { id } = req.params

    const result = await GetUserPurchaseDetailService.call(userId, id)

    res.status(200).json({
      data: result
    })
  }

  /**
   * Purchase a pricing plan
   */
  async purchase(req, res) {
    const userId = req.user.id
    const { pricingPlanId, paymentMethod } = req.body

    if (!pricingPlanId) {
      return res.status(400).json({
        error: 'Pricing plan ID is required'
      })
    }

    // Note: We allow users to purchase subscriptions even if they have an active one
    // The subscription will be stacked/extended from the current active subscription's end date

    const purchase = await PurchasePricingPlanService.call(
      userId,
      pricingPlanId,
      paymentMethod || 'manual'
    )

    // If payment method is Xendit, create invoice and return URL
    let paymentInfo = null
    if (paymentMethod === 'xendit') {
      try {
        // Get user email
        const user = await prisma.users.findUnique({
          where: { id: userId },
          select: { email: true, name: true }
        })

        if (!user || !user.email) {
          return res.status(400).json({
            error: 'User email is required for Xendit payment'
          })
        }

        // Create Xendit invoice
        const invoice = await createInvoice({
          amount: Number(purchase.amount_paid),
          externalId: `PURCHASE-${purchase.id}-${Date.now()}`,
          payerEmail: user.email,
          description: `${purchase.pricing_plan.name} - ${purchase.bundle_type === 'credits' ? `${purchase.pricing_plan.credits_included} Credits` : purchase.bundle_type === 'subscription' ? 'Subscription' : 'Hybrid Package'}`
        })

        // Debug: Log the full invoice response
        console.log('Xendit invoice created:', JSON.stringify(invoice, null, 2))

        // Store Xendit invoice ID in payment_reference
        await prisma.user_purchases.update({
          where: { id: purchase.id },
          data: { payment_reference: invoice.id }
        })

        paymentInfo = {
          invoiceUrl: invoice.invoice_url || invoice.invoiceUrl,
          invoiceId: invoice.id,
          expiresAt: invoice.expiry_date || invoice.expiryDate,
          reference: invoice.id
        }

        console.log('Payment info being sent:', paymentInfo)
      } catch (error) {
        console.error('Error creating Xendit invoice:', error)
        // Delete the pending purchase if invoice creation failed
        await prisma.user_purchases.delete({
          where: { id: purchase.id }
        })
        return res.status(500).json({
          error: 'Failed to create payment invoice. Please try again.'
        })
      }
    } else if (paymentMethod === 'midtrans') {
      try {
        // Get user details
        const user = await prisma.users.findUnique({
          where: { id: userId },
          select: { email: true, name: true }
        })

        if (!user || !user.email) {
          return res.status(400).json({
            error: 'User email is required for Midtrans payment'
          })
        }

        // Parse user name
        const nameParts = (user.name || 'Customer').split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || ''

        const orderId = `PURCHASE-${purchase.id}-${Date.now()}`
        const description = `${purchase.pricing_plan.name} - ${purchase.bundle_type === 'credits' ? `${purchase.pricing_plan.credits_included} Credits` : purchase.bundle_type === 'subscription' ? 'Subscription' : 'Hybrid Package'}`

        // Create Midtrans Snap token
        const snapResult = await createSnapToken({
          orderId,
          amount: Number(purchase.amount_paid),
          customerDetails: {
            email: user.email,
            firstName,
            lastName
          },
          itemDetails: [
            {
              id: purchase.pricing_plan_id,
              price: Number(purchase.amount_paid),
              quantity: 1,
              name: description
            }
          ]
        })

        console.log('Midtrans Snap token created:', snapResult)

        // Store order ID in payment_reference
        await prisma.user_purchases.update({
          where: { id: purchase.id },
          data: { payment_reference: orderId }
        })

        paymentInfo = {
          snapToken: snapResult.token,
          redirectUrl: snapResult.redirectUrl,
          orderId,
          clientKey: process.env.MIDTRANS_CLIENT_KEY
        }

        console.log('Midtrans payment info being sent:', paymentInfo)
      } catch (error) {
        console.error('Error creating Midtrans Snap token:', error)
        // Delete the pending purchase if Snap token creation failed
        await prisma.user_purchases.delete({
          where: { id: purchase.id }
        })
        return res.status(500).json({
          error: 'Failed to create payment token. Please try again.'
        })
      }
    }

    res.status(201).json({
      data: {
        id: purchase.id,
        planName: purchase.pricing_plan.name,
        bundleType: purchase.bundle_type,
        amountPaid: purchase.amount_paid,
        paymentStatus: purchase.payment_status,
        paymentInfo: paymentInfo
      },
      message: (paymentMethod === 'xendit' || paymentMethod === 'midtrans') ? 'Payment invoice created. Please complete payment.' : 'Purchase completed successfully'
    })
  }

  /**
   * Attach payment evidence for manual payment
   */
  async attachPaymentEvidence(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const { blobId } = req.body

    if (!blobId) {
      return res.status(400).json({
        error: 'Blob ID is required'
      })
    }

    const result = await AttachPaymentEvidenceService.call(
      userId,
      id,
      blobId
    )

    res.status(200).json({
      data: result,
    })
  }
}

export default new PricingController()
