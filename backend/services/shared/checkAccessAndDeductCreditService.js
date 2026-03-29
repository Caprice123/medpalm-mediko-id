import { ValidationError } from '#errors/validationError'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { getEffectiveCreditBalance, deductUserCredits } from '#utils/creditUtils'

/**
 * Checks access (subscription and/or credits) based on an access type constant,
 * then optionally deducts credits. Only applies to 'user' role.
 *
 * @param {object} tx           - Prisma transaction client
 * @param {object} options
 * @param {number} options.userId           - User ID
 * @param {string} options.userRole         - User role ('user', 'admin', 'superadmin', etc.)
 * @param {string} options.accessTypeKey    - Constants key for access type, e.g. 'anatomy_access_type'
 *                                            Values: 'subscription' | 'credits' | 'subscription_and_credits' | 'free'
 * @param {string|null} options.creditCostKey - Constants key for credit cost, e.g. 'anatomy_quiz_cost'
 * @param {boolean} options.deductCredit    - Whether to actually deduct credits after checking (default: true)
 * @param {string} options.description      - Description for the credit transaction record
 */
export async function checkAccessAndDeductCredit(tx, {
  userId,
  userRole = 'user',
  accessTypeKey = null,
  creditCostKey = null,
  deductCredit = true,
  description = ''
}) {
  const isUser = userRole === 'user'

  // Only apply access restrictions for regular users
  if (!isUser) return

  // Resolve access type from constants (default to 'free' if not configured)
  let accessType = 'free'
  if (accessTypeKey) {
    const constants = await GetConstantsService.call([accessTypeKey])
    accessType = constants[accessTypeKey] || 'free'
  }

  const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
  const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

  // Subscription check
  if (requiresSubscription) {
    const hasSubscription = await HasActiveSubscriptionService.call(parseInt(userId))
    if (!hasSubscription) {
      throw new ValidationError('Active subscription required')
    }
  }

  // Credit check (and optional deduction)
  if (requiresCredits && creditCostKey) {
    const constants = await GetConstantsService.call([creditCostKey])
    const creditCost = parseFloat(constants[creditCostKey]) || 0

    if (creditCost > 0) {
      const balance = await getEffectiveCreditBalance(parseInt(userId), tx)

      if (balance < creditCost) {
        throw new ValidationError('Insufficient credits')
      }

      if (deductCredit) {
        await deductUserCredits(tx, parseInt(userId), creditCost, description)
      }
    }
  }
}
