import prisma from '#prisma/client'
import { UserPurchaseSerializer } from '../../../serializers/userPurchaseSerializer.js'

class CreditsController {
  /**
   * Get user's credit balance
   */
  async getBalance(req, res) {
    const userId = req.user.id

    let userCredit = await prisma.user_credits.findUnique({
      where: { user_id: userId }
    })

    if (!userCredit) {
      userCredit = await prisma.user_credits.create({
        data: {
          user_id: userId,
          balance: 0
        }
      })
    }

    res.status(200).json({
      data: {
        balance: userCredit.balance
      }
    })
  }

  /**
   * Get all user purchases (admin only)
   */
  async getAllTransactions(req, res) {
    const { page = 1, perPage = 20, status } = req.query

    const where = {}
    if (status) where.payment_status = status

    const pageNum = parseInt(page)
    const perPageNum = parseInt(perPage)
    const skip = (pageNum - 1) * perPageNum

    const purchases = await prisma.user_purchases.findMany({
      where,
      include: {
        user: true,
        pricing_plan: true
      },
      orderBy: { created_at: 'desc' },
      take: perPageNum + 1, // Fetch one extra to check if there's a next page
      skip
    })

    const hasMore = purchases.length > perPageNum
    const results = hasMore ? purchases.slice(0, perPageNum) : purchases

    res.status(200).json({
      data: {
        transactions: UserPurchaseSerializer.serialize(results),
        pagination: {
          page: pageNum,
          perPage: perPageNum,
          isLastPage: !hasMore
        }
      }
    })
  }

  /**
   * Get user's transaction history
   */
  async getUserTransactions(req, res) {
    const userId = req.user.id
    const { limit = 50, offset = 0, type } = req.query

    const where = { user_id: userId }
    if (type) where.type = type

    const [transactions, total] = await Promise.all([
      prisma.credit_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.credit_transactions.count({ where })
    ])

    res.status(200).json({
      data: {
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          balanceBefore: t.balance_before,
          balanceAfter: t.balance_after,
          description: t.description,
          paymentStatus: t.payment_status,
          createdAt: t.created_at
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      }
    })
  }

  /**
   * Deduct credits from user
   */
  async deductCredits(req, res) {
    const userId = req.user.id
    const { amount, description, sessionId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0'
      })
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get user credit
      const userCredit = await tx.user_credits.findUnique({
        where: { user_id: userId }
      })

      if (!userCredit || userCredit.balance < amount) {
        throw new Error('Insufficient credits')
      }

      const balanceBefore = userCredit.balance
      const balanceAfter = balanceBefore - amount

      // Update balance
      await tx.user_credits.update({
        where: { user_id: userId },
        data: { balance: balanceAfter }
      })

      // Create transaction record
      const transaction = await tx.credit_transactions.create({
        data: {
          user_id: userId,
          user_credit_id: userCredit.id,
          type: 'deduction',
          amount: -amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: description || 'Credit deduction',
          payment_status: 'completed',
          session_id: sessionId
        }
      })

      return { transaction, newBalance: balanceAfter }
    })

    res.status(200).json({
      data: {
        newBalance: result.newBalance,
        transaction: {
          id: result.transaction.id,
          amount: result.transaction.amount,
          balanceAfter: result.transaction.balance_after,
          description: result.transaction.description
        }
      }
    })
  }

  /**
   * Confirm payment (admin only)
   */
  async confirmPayment(req, res) {
    const { transactionId } = req.params
    const { status } = req.body

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be either "completed" or "failed"'
      })
    }

    const transaction = await prisma.credit_transactions.findUnique({
      where: { id: parseInt(transactionId) }
    })

    if (!transaction) {
      return res.status(404).json({
        error: 'Transaction not found'
      })
    }

    if (transaction.payment_status !== 'pending') {
      return res.status(400).json({
        error: 'Transaction is not pending'
      })
    }

    if (status === 'completed') {
      // Grant credits
      await prisma.$transaction(async (tx) => {
        const userCredit = await tx.user_credits.findUnique({
          where: { id: transaction.user_credit_id }
        })

        const newBalance = userCredit.balance + transaction.amount

        await tx.user_credits.update({
          where: { id: transaction.user_credit_id },
          data: { balance: newBalance }
        })

        await tx.credit_transactions.update({
          where: { id: parseInt(transactionId) },
          data: {
            payment_status: 'completed',
            balance_after: newBalance
          }
        })
      })
    } else {
      // Mark as failed
      await prisma.credit_transactions.update({
        where: { id: parseInt(transactionId) },
        data: { payment_status: 'failed' }
      })
    }

    res.status(200).json({
      message: `Payment ${status} successfully`
    })
  }

  /**
   * Add bonus credits (admin only)
   */
  async addBonus(req, res) {
    const { userId, amount, description } = req.body

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        error: 'User ID and amount (> 0) are required'
      })
    }

    const result = await prisma.$transaction(async (tx) => {
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
      const balanceAfter = balanceBefore + amount

      // Update balance
      await tx.user_credits.update({
        where: { user_id: userId },
        data: { balance: balanceAfter }
      })

      // Create transaction record
      const transaction = await tx.credit_transactions.create({
        data: {
          user_id: userId,
          user_credit_id: userCredit.id,
          type: 'bonus',
          amount: amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: description || 'Bonus credits from admin',
          payment_status: 'completed'
        }
      })

      return { transaction, newBalance: balanceAfter }
    })

    res.status(200).json({
      data: {
        newBalance: result.newBalance,
        transaction: {
          id: result.transaction.id,
          amount: result.transaction.amount,
          description: result.transaction.description
        }
      }
    })
  }
}

export default new CreditsController()
