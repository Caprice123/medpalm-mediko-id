import express from 'express'
import constantController from '#controllers/admin/v1/constant.controller'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'

const router = express.Router()

router.use(authenticateToken)
// Get constants (optionally filtered by keys)
router.get('/', asyncHandler(constantController.index.bind(constantController)))

router.use(requireAdmin)
// Update constants
router.put('/', asyncHandler(constantController.update.bind(constantController)))

export default router
