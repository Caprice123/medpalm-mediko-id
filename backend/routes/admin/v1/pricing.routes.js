import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import pricingPlanController from '#controllers/admin/v1/pricing.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// All pricing routes require 'pricingPlans' tab permission
router.use(requireTabPermission('pricingPlans'))

// Pricing plans CRUD
router.get('/', asyncHandler(pricingPlanController.index.bind(pricingPlanController)))
router.get('/:id', asyncHandler(pricingPlanController.show.bind(pricingPlanController)))
router.post('/', asyncHandler(pricingPlanController.create.bind(pricingPlanController)))
router.put('/:id', asyncHandler(pricingPlanController.update.bind(pricingPlanController)))
router.patch('/:id/toggle', asyncHandler(pricingPlanController.toggle.bind(pricingPlanController)))

// Purchase management
router.get('/purchases/:id', asyncHandler(pricingPlanController.getPurchaseDetail.bind(pricingPlanController)))
router.post('/purchases/:id/approve', asyncHandler(pricingPlanController.approvePurchase.bind(pricingPlanController)))

export default router
