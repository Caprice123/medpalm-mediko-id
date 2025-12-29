import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class PurchasePricingPlanService extends BaseService {
  static async call(userId, pricingPlanId, paymentMethod = 'manual') {
    // Get the pricing plan
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: pricingPlanId }
    })

    if (!plan) {
      throw new Error('Pricing plan not found')
    }

    if (!plan.is_active) {
      throw new Error('Pricing plan is not active')
    }

    // Calculate subscription dates if needed
    let subscriptionStart = null
    let subscriptionEnd = null
    let subscriptionStatus = null

    if (plan.bundle_type === 'subscription' || plan.bundle_type === 'hybrid') {
      subscriptionStart = new Date()
      subscriptionEnd = new Date(subscriptionStart)
      subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
      subscriptionStatus = 'active'
    }

    // Create purchase and add credits in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the purchase record
      const purchase = await tx.user_purchases.create({
        data: {
          user_id: userId,
          pricing_plan_id: pricingPlanId,
          bundle_type: plan.bundle_type,
          subscription_start: subscriptionStart,
          subscription_end: subscriptionEnd,
          subscription_status: subscriptionStatus,
          credits_granted: plan.credits_included,
          payment_status: 'completed',
          payment_method: paymentMethod,
          amount_paid: plan.price
        },
        include: {
          pricing_plan: true
        }
      })

      // Add credits to user's balance if plan includes credits
      if (plan.credits_included > 0) {
        // Find or create user credits
        let userCredit = await tx.user_credits.findUnique({
          where: { user_id: userId }
        })

        if (!userCredit) {
          userCredit = await tx.user_credits.create({
            data: {
              user_id: userId,
              balance: 0
            }
          })
        }

        const balanceBefore = userCredit.balance
        const balanceAfter = balanceBefore + plan.credits_included

        // Update balance
        await tx.user_credits.update({
          where: { user_id: userId },
          data: {
            balance: balanceAfter,
            updated_at: new Date()
          }
        })

        // Create credit transaction record
        await tx.credit_transactions.create({
          data: {
            user_id: userId,
            user_credit_id: userCredit.id,
            type: plan.bundle_type === 'credits' ? 'purchase' : 'subscription_bonus',
            amount: plan.credits_included,
            balance_before: balanceBefore,
            balance_after: balanceAfter,
            description: `Credits from ${plan.name}`,
            payment_status: 'completed',
            payment_method: paymentMethod
          }
        })
      }

      return purchase
    })

    return result
  }
}
