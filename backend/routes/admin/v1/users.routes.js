import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import usersController from '#controllers/admin/v1/users.controller'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)
router.use(requireAdmin)

// Get all users
router.get('/', asyncHandler(usersController.index.bind(usersController)))
// Adjust user credits
router.put('/credits', asyncHandler(usersController.addCredit.bind(usersController)))
// Adjust user subscriptions
router.put('/subscriptions', asyncHandler(usersController.addSubscription.bind(usersController)))

export default router
