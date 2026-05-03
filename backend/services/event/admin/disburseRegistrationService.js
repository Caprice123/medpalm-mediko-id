import prisma from '#prisma/client'
import { addUserCredits } from '#utils/creditUtils'
import { applyPlanFeatures } from '#services/users/applyPlanFeaturesService'

export class DisburseRegistrationService {
  static async call(registrationId) {
    const registration = await prisma.event_registrations.findUnique({
      where: { id: registrationId },
      include: { event: true },
    })

    if (!registration || !registration.event) return

    const { event } = registration
    const creditsAmount = event.credits_on_approval || 0
    const allowedFeatures = event.allowed_features || []

    await prisma.$transaction(async (tx) => {
      if (creditsAmount > 0) {
        let expiresAt = null
        if (event.credit_type === 'expiring' && event.credit_expiry_days) {
          expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + event.credit_expiry_days)
        }

        await addUserCredits(tx, registration.user_id, creditsAmount, {
          creditType: event.credit_type || 'permanent',
          expiresAt,
          description: `Credits from event: ${event.title}`,
          transactionType: 'event_registration',
        })
      }

      // Each feature has its own durationDays
      for (const { key, durationDays } of allowedFeatures) {
        if (key && durationDays > 0) {
          await applyPlanFeatures(tx, registration.user_id, [key], durationDays)
        }
      }

      await tx.event_registrations.update({
        where: { id: registrationId },
        data: {
          credits_granted: creditsAmount > 0 ? creditsAmount : null,
          features_granted: allowedFeatures.length > 0 ? allowedFeatures : null,
        },
      })
    })
  }
}
