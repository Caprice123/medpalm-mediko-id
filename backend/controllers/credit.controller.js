import { PrismaClient } from '@prisma/client'
import { createInvoice } from '#services/xendit.service'




const prisma = new PrismaClient()

// Get user's credit balance
export const getUserCreditBalance = async (req, res) => {
  try {
    const userId = req.user.id

    let userCredit = await prisma.user_credits.findUnique({
      where: { userId }
    })

    // Create user credit record if it doesn't exist
    if (!userCredit) {
      userCredit = await prisma.user_credits.create({
        data: {
          userId,
          balance: 0
        }
      })
    }

    res.status(200).json({
      data: {
        balance: userCredit.balance,
        userId: userCredit.userId
      }
    })
  } catch (error) {
    console.error('Error fetching user credit balance:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit balance',
      error: error.message
    })
  }
}

// Get user's credit transaction history
export const getUserCreditTransactions = async (req, res) => {
  try {
    const userId = req.user.id
    const { limit = 50, offset = 0, type } = req.query

    const where = { userId }
    if (type) {
      where.type = type
    }

    const [transactions, total] = await Promise.all([
      prisma.credit_transactions.findMany({
        where,
        include: {
          creditPlan: {
            select: {
              name: true,
              credits: true,
              price: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.credit_transactions.count({ where })
    ])

    res.status(200).json({
      data: {
        transactions,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching credit transactions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit transactions',
      error: error.message
    })
  }
}

// Purchase credit (initiate transaction with Xendit)
export const purchaseCredit = async (req, res) => {
  try {
    const userId = req.user.id
    const user = req.user
    const { creditPlanId, paymentMethod = 'xendit' } = req.body

    if (!creditPlanId) {
      return res.status(400).json({
        success: false,
        message: 'Credit plan ID is required'
      })
    }

    // Get credit plan
    const creditPlan = await prisma.credit_plans.findUnique({
      where: { id: parseInt(creditPlanId) }
    })

    if (!creditPlan) {
      return res.status(404).json({
        success: false,
        message: 'Credit plan not found'
      })
    }

    if (!creditPlan.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This credit plan is not available'
      })
    }

    // Get or create user credit
    let userCredit = await prisma.user_credits.findUnique({
      where: { userId }
    })

    if (!userCredit) {
      userCredit = await prisma.user_credits.create({
        data: {
          userId,
          balance: 0
        }
      })
    }

    // Generate unique reference
    const paymentReference = `TXN-${Date.now()}-${userId}`

    // Calculate final amount (apply discount if any)
    const finalAmount = creditPlan.discount > 0
      ? creditPlan.price - (creditPlan.price * creditPlan.discount / 100)
      : creditPlan.price

    // Create transaction record
    const transaction = await prisma.credit_transactions.create({
      data: {
        userId,
        userCreditId: userCredit.id,
        type: 'purchase',
        amount: creditPlan.credits,
        balanceBefore: userCredit.balance,
        balanceAfter: userCredit.balance, // Will be updated when payment is confirmed
        description: `Purchase ${creditPlan.name}`,
        creditPlanId: creditPlan.id,
        paymentStatus: 'pending',
        paymentMethod,
        paymentReference
      },
      include: {
        creditPlan: true
      }
    })

    // If payment method is Xendit, create invoice
    if (paymentMethod === 'xendit') {
      try {
        const invoice = await createInvoice({
          amount: parseFloat(finalAmount),
          externalId: paymentReference,
          payerEmail: user.email,
          description: `MedPalm Credits - ${creditPlan.name} (${creditPlan.credits} credits)`
        })

        // Update transaction with Xendit invoice ID
        await prisma.credit_transactions.update({
          where: { id: transaction.id },
          data: {
            paymentReference: invoice.id // Store Xendit invoice ID
          }
        })

        res.status(201).json({
          success: true,
          message: 'Payment initiated. Please complete the payment via the provided link.',
          data: {
            transaction: {
              ...transaction,
              paymentReference: invoice.id
            },
            paymentInfo: {
              amount: finalAmount,
              originalAmount: creditPlan.price,
              discount: creditPlan.discount,
              credits: creditPlan.credits,
              reference: paymentReference,
              invoiceUrl: invoice.invoice_url,
              invoiceId: invoice.id,
              expiryDate: invoice.expiry_date
            }
          }
        })
      } catch (xenditError) {
        console.error('Xendit error:', xenditError)

        // Delete transaction if Xendit fails
        await prisma.credit_transactions.delete({
          where: { id: transaction.id }
        })

        return res.status(500).json({
          success: false,
          message: 'Failed to create payment invoice. Please try again.',
          error: xenditError.message
        })
      }
    } else {
      // Manual payment method
      res.status(201).json({
        success: true,
        message: 'Purchase initiated. Please complete the manual payment and wait for admin approval.',
        data: {
          transaction,
          paymentInfo: {
            amount: finalAmount,
            originalAmount: creditPlan.price,
            discount: creditPlan.discount,
            credits: creditPlan.credits,
            reference: paymentReference
          }
        }
      })
    }
  } catch (error) {
    console.error('Error purchasing credit:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initiate credit purchase',
      error: error.message
    })
  }
}

// Admin: Confirm manual payment
export const confirmPayment = async (req, res) => {
  try {
    const { transactionId } = req.params
    const { status = 'completed' } = req.body // 'completed' or 'failed'

    const transaction = await prisma.credit_transactions.findUnique({
      where: { id: parseInt(transactionId) },
      include: { creditPlan: true }
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    if (transaction.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Transaction has already been processed'
      })
    }

    if (status === 'completed') {
      // Add credits to user's account
      const userCredit = await prisma.user_credits.findUnique({
        where: { id: transaction.userCreditId }
      })

      const newBalance = userCredit.balance + transaction.amount

      // Update in transaction
      await prisma.$transaction([
        prisma.user_credits.update({
          where: { id: transaction.userCreditId },
          data: { balance: newBalance }
        }),
        prisma.credit_transactions.update({
          where: { id: parseInt(transactionId) },
          data: {
            paymentStatus: 'completed',
            balanceAfter: newBalance
          }
        })
      ])

      res.status(200).json({
        success: true,
        message: 'Payment confirmed and credits added successfully',
        data: { newBalance }
      })
    } else {
      // Mark as failed
      await prisma.credit_transactions.update({
        where: { id: parseInt(transactionId) },
        data: { paymentStatus: 'failed' }
      })

      res.status(200).json({
        success: true,
        message: 'Payment marked as failed'
      })
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    })
  }
}

// Deduct credits (when user uses a feature)
export const deductCredits = async (req, res) => {
  try {
    const userId = req.user.id
    const { amount, description, sessionId } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid credit amount is required'
      })
    }

    // Get user credit
    const userCredit = await prisma.user_credits.findUnique({
      where: { userId }
    })

    if (!userCredit) {
      return res.status(404).json({
        success: false,
        message: 'User credit account not found'
      })
    }

    if (userCredit.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits',
        data: {
          required: amount,
          available: userCredit.balance
        }
      })
    }

    const newBalance = userCredit.balance - amount

    // Deduct credits in transaction
    const [updatedCredit, transaction] = await prisma.$transaction([
      prisma.user_credits.update({
        where: { userId },
        data: { balance: newBalance }
      }),
      prisma.credit_transactions.create({
        data: {
          userId,
          userCreditId: userCredit.id,
          type: 'deduction',
          amount: -amount, // Negative for deduction
          balanceBefore: userCredit.balance,
          balanceAfter: newBalance,
          description: description || 'Credit deduction',
          sessionId: sessionId ? parseInt(sessionId) : null
        }
      })
    ])

    res.status(200).json({
      message: 'Credits deducted successfully',
      data: {
        transaction,
        newBalance: updatedCredit.balance
      }
    })
  } catch (error) {
    console.error('Error deducting credits:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to deduct credits',
      error: error.message
    })
  }
}

// Admin: Add bonus credits to user
export const addBonusCredits = async (req, res) => {
  try {
    const { userId, amount, description } = req.body

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'User ID and valid amount are required'
      })
    }

    // Get or create user credit
    let userCredit = await prisma.user_credits.findUnique({
      where: { userId: parseInt(userId) }
    })

    if (!userCredit) {
      userCredit = await prisma.user_credits.create({
        data: {
          userId: parseInt(userId),
          balance: 0
        }
      })
    }

    const newBalance = userCredit.balance + parseInt(amount)

    // Add bonus in transaction
    const [updatedCredit, transaction] = await prisma.$transaction([
      prisma.user_credits.update({
        where: { userId: parseInt(userId) },
        data: { balance: newBalance }
      }),
      prisma.credit_transactions.create({
        data: {
          userId: parseInt(userId),
          userCreditId: userCredit.id,
          type: 'bonus',
          amount: parseInt(amount),
          balanceBefore: userCredit.balance,
          balanceAfter: newBalance,
          description: description || 'Bonus credits from admin'
        }
      })
    ])

    res.status(200).json({
      message: 'Bonus credits added successfully',
      data: {
        transaction,
        newBalance: updatedCredit.balance
      }
    })
  } catch (error) {
    console.error('Error adding bonus credits:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add bonus credits',
      error: error.message
    })
  }
}

// Admin: Get all credit transactions (for monitoring)
export const getAllCreditTransactions = async (req, res) => {
  try {
    const { limit = 100, offset = 0, type, status } = req.query

    const where = {}
    if (type) where.type = type
    if (status) where.paymentStatus = status

    const [transactions, total] = await Promise.all([
      prisma.credit_transactions.findMany({
        where,
        include: {
          creditPlan: {
            select: {
              name: true,
              credits: true,
              price: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset)
      }),
      prisma.credit_transactions.count({ where })
    ])

    res.status(200).json({
      data: {
        transactions,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching all credit transactions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit transactions',
      error: error.message
    })
  }
}
