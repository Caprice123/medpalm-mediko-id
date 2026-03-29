import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

/**
 * Returns the non-expired credit buckets for a user, ordered:
 * expiring first (soonest expires_at), then permanent last.
 */
async function getActiveBuckets(userId, prismaClient) {
  const now = new Date()
  const buckets = await prismaClient.user_credits.findMany({
    where: {
      user_id: userId,
      balance: { gt: 0 },
      OR: [
        { credit_type: 'permanent' },
        { credit_type: 'expiring', expires_at: { gt: now } }
      ]
    }
  })

  // Sort: expiring (soonest first) before permanent
  buckets.sort((a, b) => {
    if (a.credit_type === 'expiring' && b.credit_type === 'permanent') return -1
    if (a.credit_type === 'permanent' && b.credit_type === 'expiring') return 1
    if (a.credit_type === 'expiring' && b.credit_type === 'expiring') {
      return new Date(a.expires_at) - new Date(b.expires_at)
    }
    return 0
  })

  return buckets
}

/**
 * Get full credit breakdown for a user: permanentBalance, expiringBuckets[], totalBalance.
 * @param {number} userId
 * @param {object} [prismaClient]
 * @returns {Promise<{ permanentBalance: number, expiringBuckets: Array, totalBalance: number }>}
 */
export async function getCreditBreakdown(userId, prismaClient = prisma) {
  const now = new Date()
  const buckets = await prismaClient.user_credits.findMany({
    where: { user_id: userId },
    orderBy: { expires_at: 'asc' }
  })
  const permanentBalance = parseFloat(
    buckets.filter(b => b.credit_type === 'permanent')
      .reduce((sum, b) => sum + parseFloat(b.balance), 0).toFixed(2)
  )
  const expiringBuckets = buckets
    .filter(b => b.credit_type === 'expiring' && b.balance > 0 && b.expires_at && new Date(b.expires_at) > now)
    .map(b => ({
      balance: parseFloat(parseFloat(b.balance).toFixed(2)),
      expiresAt: b.expires_at,
      daysRemaining: Math.ceil((new Date(b.expires_at) - now) / (1000 * 60 * 60 * 24))
    }))
  const totalBalance = parseFloat((permanentBalance + expiringBuckets.reduce((s, b) => s + b.balance, 0)).toFixed(2))
  return { permanentBalance, expiringBuckets, totalBalance }
}

/**
 * Get effective credit balance for a user (sum of all non-expired buckets).
 * @param {number} userId
 * @param {object} [prismaClient] - Prisma client (use tx inside transactions)
 * @returns {Promise<number>}
 */
export async function getEffectiveCreditBalance(userId, prismaClient = prisma) {
  const buckets = await getActiveBuckets(userId, prismaClient)
  return parseFloat(buckets.reduce((sum, b) => sum + parseFloat(b.balance), 0).toFixed(2))
}

/**
 * Deduct credits from a user using expiring-first order.
 * Must be called inside a Prisma transaction.
 *
 * @param {object} tx - Prisma transaction client
 * @param {number} userId
 * @param {number} amount - Amount to deduct (positive number)
 * @param {string} description
 * @param {number|null} [sessionId]
 * @returns {Promise<{ newBalance: number }>}
 */
export async function deductUserCredits(tx, userId, amount, description, sessionId = null) {
  const buckets = await getActiveBuckets(userId, tx)
  const totalBalance = buckets.reduce((sum, b) => sum + parseFloat(b.balance), 0)

  if (totalBalance < amount) {
    throw new ValidationError('Insufficient credits')
  }

  let remaining = parseFloat(amount.toFixed(2))

  for (const bucket of buckets) {
    if (remaining <= 0) break

    const bucketBalance = parseFloat(parseFloat(bucket.balance).toFixed(2))
    const deductFromBucket = parseFloat(Math.min(bucketBalance, remaining).toFixed(2))
    const balanceBefore = bucketBalance
    const balanceAfter = parseFloat((bucketBalance - deductFromBucket).toFixed(2))

    await tx.user_credits.update({
      where: { id: bucket.id },
      data: { balance: balanceAfter, updated_at: new Date() }
    })

    await tx.credit_transactions.create({
      data: {
        user_id: userId,
        user_credit_id: bucket.id,
        type: 'deduction',
        amount: -deductFromBucket,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description,
        payment_status: 'completed',
        session_id: sessionId || null
      }
    })

    remaining = parseFloat((remaining - deductFromBucket).toFixed(2))
  }

  const newBalance = await getEffectiveCreditBalance(userId, tx)
  return { newBalance }
}

/**
 * Add credits to a user.
 * - permanent: upserts into the user's single permanent bucket
 * - expiring: creates a new bucket row with the given expiry date
 * Must be called inside a Prisma transaction.
 *
 * @param {object} tx - Prisma transaction client
 * @param {number} userId
 * @param {number} amount
 * @param {string} [creditType] - 'permanent' | 'expiring'
 * @param {Date|null} [expiresAt] - required when creditType is 'expiring'
 * @param {string} [description]
 * @param {string} [transactionType] - type field on credit_transactions (e.g. 'purchase', 'bonus')
 * @param {string|null} [paymentMethod]
 * @param {string|null} [paymentReference]
 * @returns {Promise<{ bucket: object, newBalance: number }>}
 */
export async function addUserCredits(tx, userId, amount, {
  creditType = 'permanent',
  expiresAt = null,
  description = '',
  transactionType = 'purchase',
  paymentMethod = null,
  paymentReference = null
} = {}) {
  let bucket

  if (creditType === 'permanent') {
    // Find or create the single permanent bucket for this user
    bucket = await tx.user_credits.findFirst({
      where: { user_id: userId, credit_type: 'permanent' }
    })

    if (!bucket) {
      bucket = await tx.user_credits.create({
        data: { user_id: userId, balance: 0, credit_type: 'permanent', expires_at: null }
      })
    }
  } else {
    // Each expiring grant is its own bucket
    bucket = await tx.user_credits.create({
      data: { user_id: userId, balance: 0, credit_type: 'expiring', expires_at: expiresAt }
    })
  }

  const balanceBefore = parseFloat(parseFloat(bucket.balance).toFixed(2))
  const balanceAfter = parseFloat((balanceBefore + parseFloat(amount)).toFixed(2))

  await tx.user_credits.update({
    where: { id: bucket.id },
    data: { balance: balanceAfter, updated_at: new Date() }
  })

  await tx.credit_transactions.create({
    data: {
      user_id: userId,
      user_credit_id: bucket.id,
      type: transactionType,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description,
      payment_status: 'completed',
      payment_method: paymentMethod,
      payment_reference: paymentReference
    }
  })

  const newBalance = await getEffectiveCreditBalance(userId, tx)
  return { bucket, newBalance }
}
