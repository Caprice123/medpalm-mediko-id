import { GetActivePricingPlansService } from '#services/pricing/getActivePricingPlansService'
import { PurchasePricingPlanService } from '#services/pricing/purchasePricingPlanService'
import { GetUserStatusService, HasActiveSubscriptionService, GetUserCreditBalanceService } from '#services/pricing/getUserStatusService'
import { GetUserPurchaseHistoryService } from '#services/pricing/getUserPurchaseHistoryService'
import { createInvoice } from '#services/xendit.service'
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
        order: plan.order
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
   * Get user's purchase history (all payments)
   */
  async getPurchaseHistory(req, res) {
    const userId = req.user.id

    const purchases = await GetUserPurchaseHistoryService.call(userId)

    res.status(200).json({
      data: purchases
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

    // Check if user already has active subscription (only for subscription/hybrid plans)
    const plan = await GetActivePricingPlansService.call()
    const selectedPlan = plan.find(p => p.id === pricingPlanId)

    if (selectedPlan && (selectedPlan.bundle_type === 'subscription' || selectedPlan.bundle_type === 'hybrid')) {
      const hasActive = await HasActiveSubscriptionService.call(userId)
      if (hasActive) {
        return res.status(400).json({
          error: 'You already have an active subscription'
        })
      }
    }

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
          description: `${purchase.pricing_plan.name} - ${purchase.bundle_type === 'credits' ? `${purchase.credits_granted} Credits` : purchase.bundle_type === 'subscription' ? 'Subscription' : 'Hybrid Package'}`
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
    }

    res.status(201).json({
      data: {
        id: purchase.id,
        planName: purchase.pricing_plan.name,
        bundleType: purchase.bundle_type,
        creditsGranted: purchase.credits_granted,
        amountPaid: purchase.amount_paid,
        subscription: purchase.subscription_status ? {
          startDate: purchase.subscription_start,
          endDate: purchase.subscription_end,
          status: purchase.subscription_status
        } : null,
        paymentInfo: paymentInfo
      },
      message: paymentMethod === 'xendit' ? 'Payment invoice created. Please complete payment.' : 'Purchase completed successfully'
    })
  }
}

export default new PricingController()
