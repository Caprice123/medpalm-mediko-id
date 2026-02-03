import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class PurchasePricingPlanService extends BaseService {
  static async call(userId, pricingPlanId, paymentMethod = 'manual') {
    // Get the pricing plan
    const plan = await prisma.pricing_plans.findUnique({
      where: { id: pricingPlanId }
    })

    if (!plan) {
      throw new ValidationError('Pricing plan not found')
    }

    if (!plan.is_active) {
      throw new ValidationError('Pricing plan is not active')
    }

    // For Xendit payments, create purchase with pending status
    // Create subscription with 'not_active' status
    // Credits will be granted after webhook confirms payment
    if (paymentMethod === 'xendit') {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create the purchase record with pending status
        const purchase = await tx.user_purchases.create({
          data: {
            user_id: userId,
            pricing_plan_id: pricingPlanId,
            bundle_type: plan.bundle_type,
            payment_status: 'pending',
            payment_method: paymentMethod,
            amount_paid: plan.price
          },
          include: {
            pricing_plan: true
          }
        })

        // 2. Create subscription record with 'not_active' status if plan includes subscription
        if (plan.bundle_type === 'subscription' || plan.bundle_type === 'hybrid') {
          // Check if user has an active subscription
          const activeSubscription = await tx.user_subscriptions.findFirst({
            where: {
              user_id: userId,
              end_date: { gte: new Date() },
              status: 'active' // Only consider active subscriptions
            },
            orderBy: {
              end_date: 'desc' // Get the latest ending subscription
            }
          })

          let subscriptionStart
          let subscriptionEnd

          if (activeSubscription) {
            // If user has active subscription, extend from current end date
            subscriptionStart = activeSubscription.end_date
            subscriptionEnd = new Date(subscriptionStart)
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
          } else {
            // If no active subscription, start from today
            subscriptionStart = new Date()
            subscriptionEnd = new Date(subscriptionStart)
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (plan.duration_days || 30))
          }

          await tx.user_subscriptions.create({
            data: {
              user_id: userId,
              start_date: subscriptionStart,
              end_date: subscriptionEnd,
              status: 'not_active' // Mark as not_active until payment is confirmed
            }
          })
        }

        return purchase
      })

      return result
    }

    // For manual payment method, create purchase with pending status
    // User needs to upload payment evidence, then admin approves
    // Credits/subscription will be granted after admin approval via ApprovePurchaseService
    const result = await prisma.$transaction(async (tx) => {
      // Create the purchase record with pending status (user_purchases table)
      const purchase = await tx.user_purchases.create({
        data: {
          user_id: userId,
          pricing_plan_id: pricingPlanId,
          bundle_type: plan.bundle_type,
          payment_status: 'pending',
          payment_method: paymentMethod,
          amount_paid: plan.price
        },
        include: {
          pricing_plan: true
        }
      })

      return purchase
    })

    return result
  }
}
