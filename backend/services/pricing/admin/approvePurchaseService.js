import moment from 'moment'
import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { addUserCredits } from '#utils/creditUtils'
import { applyPlanFeatures } from '#services/users/applyPlanFeaturesService'

export class ApprovePurchaseService extends BaseService {
  static async call(purchaseId, status) {
    if (!['completed', 'failed'].includes(status)) {
      throw new ValidationError('Status must be either "completed" or "failed"')
    }

    const purchase = await prisma.user_purchases.findUnique({
      where: { id: parseInt(purchaseId) },
      include: { pricing_plan: true }
    })

    if (!purchase) {
      throw new ValidationError('Purchase not found')
    }

    if (purchase.payment_status !== 'waiting_approval') {
      throw new ValidationError('Purchase is not waiting for approval')
    }

    if (status === 'completed') {
      await prisma.$transaction(async (tx) => {
        await tx.user_purchases.update({
          where: { id: parseInt(purchaseId) },
          data: { payment_status: 'completed', updated_at: new Date() }
        })

        // Handle credits — use snapshotted values from purchase
        const creditsIncluded = purchase.credits_included ?? purchase.pricing_plan.credits_included
        const creditType = purchase.credit_type ?? purchase.pricing_plan.credit_type ?? 'permanent'
        const creditExpiryDays = purchase.credit_expiry_days ?? purchase.pricing_plan.credit_expiry_days

        if (creditsIncluded > 0) {
          let expiresAt = null
          if (creditType === 'expiring' && creditExpiryDays) {
            expiresAt = new Date()
            expiresAt.setDate(expiresAt.getDate() + creditExpiryDays)
          }

          await addUserCredits(tx, purchase.user_id, creditsIncluded, {
            creditType,
            expiresAt,
            description: `Purchase: ${purchase.pricing_plan.name}`,
            transactionType: 'purchase',
            paymentMethod: purchase.payment_method,
            paymentReference: purchase.payment_reference
          })
        }

        // Handle subscription — use snapshotted duration_days from purchase
        const durationDays = purchase.duration_days ?? purchase.pricing_plan.duration_days
        let featureStartDate
        let featureEndDate

        // Grant feature access — each feature gets its own start date based on its own last subscription
        if (durationDays > 0) {
          await applyPlanFeatures(tx, purchase.user_id, purchase.allowed_features || [], durationDays)
        }
      })
    } else {
      await prisma.user_purchases.update({
        where: { id: parseInt(purchaseId) },
        data: { payment_status: 'rejected', updated_at: new Date() }
      })
    }
  }
}
