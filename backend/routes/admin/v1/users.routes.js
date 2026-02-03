import express from 'express'
import { authenticateToken, requireAdmin, requireSuperAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import usersController from '#controllers/admin/v1/users.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Get all users
router.get('/', asyncHandler(usersController.index.bind(usersController)))
// Get single user details
router.get('/:id', asyncHandler(usersController.show.bind(usersController)))
// Get user subscriptions with pagination (supports status filter: 'active', 'all', etc.)
router.get('/:id/subscriptions', asyncHandler(usersController.getSubscriptions.bind(usersController)))
// Adjust user credits
router.put('/credits', asyncHandler(usersController.addCredit.bind(usersController)))
// Update user role (superadmin only)
router.put('/:id/role', requireSuperAdmin, asyncHandler(usersController.updateRole.bind(usersController)))

export default router
