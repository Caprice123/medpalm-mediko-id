import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

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

          const newBalance = userCredit.balance + purchase.pricing_plan.credits_included

          await tx.user_credits.update({
            where: { id: userCredit.id },
            data: { balance: newBalance }
          })

          // Create credit transaction record
          await tx.credit_transactions.create({
            data: {
              user_id: purchase.user_id,
              user_credit_id: userCredit.id,
              type: 'purchase',
              amount: purchase.pricing_plan.credits_included,
              balance_before: userCredit.balance,
              balance_after: newBalance,
              description: `Purchase: ${purchase.pricing_plan.name}`,
              payment_status: 'completed',
              payment_method: purchase.payment_method,
              payment_reference: purchase.payment_reference
            }
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
