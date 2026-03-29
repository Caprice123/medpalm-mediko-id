import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import moment from 'moment-timezone'
import { getEffectiveCreditBalance } from '#utils/creditUtils'

/**
 * Get comprehensive user status including subscription and credits
 */
export class GetUserStatusService extends BaseService {
  static async call(userId) {
    // Get active subscription from user_subscriptions table
    const activeSubscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        status: 'active',
        end_date: {
          gte: new Date()
        }
      },
      orderBy: {
        end_date: 'desc'
      }
    })

    const now = new Date()
    const allBuckets = await prisma.user_credits.findMany({
      where: { user_id: userId },
      orderBy: { expires_at: 'asc' }
    })

    const permanentBalance = parseFloat(
      allBuckets
        .filter(b => b.credit_type === 'permanent')
        .reduce((sum, b) => sum + parseFloat(b.balance), 0)
        .toFixed(2)
    )

    const expiringBuckets = allBuckets
      .filter(b => b.credit_type === 'expiring' && b.balance > 0 && b.expires_at && new Date(b.expires_at) > now)
      .map(b => ({
        id: b.id,
        balance: parseFloat(parseFloat(b.balance).toFixed(2)),
        expiresAt: b.expires_at,
        daysRemaining: Math.ceil((new Date(b.expires_at) - now) / (1000 * 60 * 60 * 24))
      }))

    const creditBalance = parseFloat(
      (permanentBalance + expiringBuckets.reduce((sum, b) => sum + b.balance, 0)).toFixed(2)
    )

    return {
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        startDate: activeSubscription.start_date,
        endDate: activeSubscription.end_date,
        status: activeSubscription.status,
        daysRemaining: Math.ceil((new Date(activeSubscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      } : null,
      creditBalance,
      permanentBalance,
      expiringBuckets,
      userId: userId
    }
  }
}

/**
 * Check if user has active subscription
 */
export class HasActiveSubscriptionService extends BaseService {
  static async call(userId) {
    if (process.env.NODE_ENV == "development") {
        return true
    }
    const subscription = await prisma.user_subscriptions.findFirst({
      where: {
        user_id: userId,
        status: 'active',
        start_date: {
            lte: moment(new Date()).toDate()
        },
        end_date: {
            gte: moment(new Date()).toDate()
        }
      }
    })

    return !!subscription
  }
}

/**
 * Get user's credit balance
 */
export class GetUserCreditBalanceService extends BaseService {
  static async call(userId) {
    return getEffectiveCreditBalance(userId)
  }
}
