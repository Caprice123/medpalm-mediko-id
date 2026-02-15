import express from 'express'
import { authenticateToken, requireAdmin, requireSuperAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import usersController from '#controllers/admin/v1/users.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All user routes require 'users' tab permission
router.use(requireTabPermission('users'))

// User management
router.get('/', asyncHandler(usersController.index.bind(usersController)))
router.get('/:id', asyncHandler(usersController.show.bind(usersController)))
router.get('/:id/subscriptions', asyncHandler(usersController.getSubscriptions.bind(usersController)))
router.put('/credits', asyncHandler(usersController.addCredit.bind(usersController)))

// Superadmin only routes
router.put('/:id/role', requireSuperAdmin, asyncHandler(usersController.updateRole.bind(usersController)))
router.put('/:id/permissions', requireSuperAdmin, asyncHandler(usersController.updatePermissions.bind(usersController)))

export default router
