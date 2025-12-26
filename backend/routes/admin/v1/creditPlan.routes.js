import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import creditPlanController from '#controllers/admin/v1/creditPlan.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// Admin routes (all require authentication and admin role)
router.get('/', asyncHandler(creditPlanController.index.bind(creditPlanController)))
router.post('/', asyncHandler(creditPlanController.create.bind(creditPlanController)))
router.put('/:id', asyncHandler(creditPlanController.update.bind(creditPlanController)))
router.patch('/:id/toggle', asyncHandler(creditPlanController.toggle.bind(creditPlanController)))

export default router
