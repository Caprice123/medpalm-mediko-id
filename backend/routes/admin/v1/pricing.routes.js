import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import pricingPlanController from '#controllers/admin/v1/pricing.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// Admin routes (all require authentication and admin role)
router.get('/', asyncHandler(pricingPlanController.index.bind(pricingPlanController)))
router.get('/:id', asyncHandler(pricingPlanController.show.bind(pricingPlanController)))
router.post('/', asyncHandler(pricingPlanController.create.bind(pricingPlanController)))
router.put('/:id', asyncHandler(pricingPlanController.update.bind(pricingPlanController)))
router.patch('/:id/toggle', asyncHandler(pricingPlanController.toggle.bind(pricingPlanController)))

export default router
