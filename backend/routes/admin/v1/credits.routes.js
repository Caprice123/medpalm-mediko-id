import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import creditsController from '#controllers/admin/v1/credits.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Admin routes
router.get('/transactions', asyncHandler(creditsController.getAllTransactions.bind(creditsController)))
router.post('/confirm/:transactionId', asyncHandler(creditsController.confirmPayment.bind(creditsController)))
router.post('/bonus', asyncHandler(creditsController.addBonus.bind(creditsController)))

export default router
