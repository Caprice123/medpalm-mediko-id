import prisma from '#prisma/client'
import { UserPurchaseSerializer } from '../../../serializers/userPurchaseSerializer.js'
import { ValidationError } from '#errors/validationError'
import { getEffectiveCreditBalance, deductUserCredits, addUserCredits } from '#utils/creditUtils'
import moment from 'moment-timezone'
import { ExportTransactionsService } from '#services/credits/exportTransactionsService'

class CreditsController {
  /**
   * Get user's credit balance
   */
  async getBalance(req, res) {
    const userId = req.user.id
    const balance = await getEffectiveCreditBalance(userId)
    res.status(200).json({ data: { balance } })
  }

  _buildTransactionWhere(query) {
    const { code, id, email, status, type, startDate, endDate } = query
    const where = {}
    if (status) where.payment_status = status
    if (type) where.bundle_type = type
    if (id) where.id = parseInt(id)
    if (code) where.pricing_plan = { code: { contains: code, mode: 'insensitive' } }
    if (email) where.user = { email: { contains: email, mode: 'insensitive' } }
    if (startDate || endDate) {
      where.created_at = {}
      if (startDate) where.created_at.gte = moment.tz(startDate, 'YYYY-MM-DD', 'Asia/Jakarta').startOf('day').toDate()
      if (endDate) where.created_at.lte = moment.tz(endDate, 'YYYY-MM-DD', 'Asia/Jakarta').endOf('day').toDate()
    }
    return where
  }

  /**
   * Get all user purchases (admin only)
   */
  async getAllTransactions(req, res) {
    const { page = 1, perPage = 20 } = req.query

    const where = this._buildTransactionWhere(req.query)
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
      take: perPageNum + 1,
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
   * Export all transactions matching filters as Excel (admin only)
   */
  async exportTransactions(req, res) {
    const buffer = await ExportTransactionsService.call(req.query)
    const filename = `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(buffer)
  }

  /**
   * Get user's transaction history
   */
  async getUserTransactions(req, res) {
    const userId = req.user.id
    const { limit = 50, offset = 0, type } = req.query

    const where = { user_id: userId }
    if (type) where.type = type

    const transactions = await prisma.credit_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: parseInt(limit) + 1,
        skip: parseInt(offset)
      })

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
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: transactions.length > parseInt(limit)
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
      return deductUserCredits(tx, userId, amount, description || 'Credit deduction', sessionId)
    })

    res.status(200).json({
      data: {
        newBalance: result.newBalance
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
      await prisma.$transaction(async (tx) => {
        // Add credits back to the bucket this transaction belongs to
        const bucket = await tx.user_credits.findUnique({
          where: { id: transaction.user_credit_id }
        })
        const newBalance = parseFloat(bucket.balance) + parseFloat(transaction.amount)
        await tx.user_credits.update({
          where: { id: transaction.user_credit_id },
          data: { balance: newBalance, updated_at: new Date() }
        })
        await tx.credit_transactions.update({
          where: { id: parseInt(transactionId) },
          data: { payment_status: 'completed', balance_after: newBalance }
        })
      })
    } else {
      await prisma.credit_transactions.update({
        where: { id: parseInt(transactionId) },
        data: { payment_status: 'failed' }
      })
    }

    res.status(200).json({ message: `Payment ${status} successfully` })
  }

  /**
   * Add bonus credits (admin only)
   * Supports credit_type ('permanent'/'expiring') and expiry_days
   */
  async addBonus(req, res) {
    const { userId, amount, description, credit_type, expiry_days } = req.body

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        error: 'User ID and amount (> 0) are required'
      })
    }

    const creditType = credit_type || 'permanent'
    let expiresAt = null
    if (creditType === 'expiring' && expiry_days) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + Number(expiry_days))
    }

    const result = await prisma.$transaction(async (tx) => {
      return addUserCredits(tx, parseInt(userId), amount, {
        creditType,
        expiresAt,
        description: description || 'Bonus credits from admin',
        transactionType: 'bonus'
      })
    })

    res.status(200).json({
      data: { newBalance: result.newBalance }
    })
  }
}

export default new CreditsController()
