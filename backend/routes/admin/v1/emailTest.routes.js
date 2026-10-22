import express from 'express'
import emailTestController from '#controllers/admin/v1/emailTest.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Operational diagnostic rather than a product feature, so it stops at
// requireAdmin instead of carrying a tab/feature permission of its own.
router.use(authenticateToken)
router.use(requireAdmin)

router.post('/', asyncHandler(emailTestController.create.bind(emailTestController)))

export default router
