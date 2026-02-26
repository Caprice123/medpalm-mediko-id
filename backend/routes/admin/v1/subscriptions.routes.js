import express from 'express'
import { authenticateToken, requireAdmin, requireSuperAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import subscriptionsController from '#controllers/admin/v1/subscriptions.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireSuperAdmin)

// Add subscription for a user
// PUT /admin/v1/subscriptions
router.put('/', asyncHandler(subscriptionsController.addSubscription.bind(subscriptionsController)))

// Update subscription dates (superadmin only)
// PATCH /admin/v1/subscriptions/:id
router.patch('/:id', asyncHandler(subscriptionsController.updateSubscription.bind(subscriptionsController)))

// Delete a subscription (superadmin only)
// DELETE /admin/v1/subscriptions/:id
router.delete('/:id', asyncHandler(subscriptionsController.deleteSubscription.bind(subscriptionsController)))

export default router
