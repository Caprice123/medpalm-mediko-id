import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { addUserCredits } from '#utils/creditUtils'

export class ApprovePurchaseService extends BaseService {
  static async call(purchaseId, status) {
    if (!['completed', 'failed'].includes(status)) {
      throw new ValidationError('Status must be either "completed" or "failed"')
    }

    const purchase = await prisma.user_purchases.findUnique({
      where: { id: parseInt(purchaseId) },
      include: {
        pricing_plan: true
      }
    })

    if (!purchase) {
      throw new ValidationError('Purchase not found')
    }

    if (purchase.payment_status !== 'waiting_approval') {
      throw new ValidationError('Purchase is not waiting for approval')
    }

    if (status === 'completed') {
      // Approve: Grant credits and/or subscription
      await prisma.$transaction(async (tx) => {
        // Update purchase status
        await tx.user_purchases.update({
          where: { id: parseInt(purchaseId) },
          data: {
            payment_status: 'completed',
            updated_at: new Date()
          }
        })

        // Handle credits
        if (purchase.pricing_plan.credits_included > 0) {
          const plan = purchase.pricing_plan
          const creditType = plan.credit_type || 'permanent'
          let expiresAt = null

          if (creditType === 'expiring' && plan.credit_expiry_days) {
            expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + plan.credit_expiry_days)
          }

          await addUserCredits(tx, purchase.user_id, plan.credits_included, {
            creditType,
            expiresAt,
            description: `Purchase: ${plan.name}`,
            transactionType: 'purchase',
            paymentMethod: purchase.payment_method,
            paymentReference: purchase.payment_reference
          })
        }

        // Handle subscription
        if (purchase.pricing_plan.duration_days > 0) {
          const startDate = new Date()
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + purchase.pricing_plan.duration_days)

          // Check if user has active subscription
          const activeSubscription = await tx.user_subscriptions.findFirst({
            where: {
              user_id: purchase.user_id,
              end_date: { gte: new Date() }
            },
            orderBy: { end_date: 'desc' }
          })

          if (activeSubscription) {
            // Extend existing subscription
            const extendedEndDate = new Date(activeSubscription.end_date)
            extendedEndDate.setDate(extendedEndDate.getDate() + purchase.pricing_plan.duration_days)

            await tx.user_subscriptions.update({
              where: { id: activeSubscription.id },
              data: {
                end_date: extendedEndDate,
                pricing_plan_id: purchase.pricing_plan_id
              }
            })
          } else {
            // Create new subscription
            await tx.user_subscriptions.create({
              data: {
                user_id: purchase.user_id,
                pricing_plan_id: purchase.pricing_plan_id,
                start_date: startDate,
                end_date: endDate
              }
            })
          }
        }
      })
    } else {
      // Reject: Just update status to failed
      await prisma.user_purchases.update({
        where: { id: parseInt(purchaseId) },
        data: {
          payment_status: 'rejected',
          updated_at: new Date()
        }
      })
    }
  }
}
