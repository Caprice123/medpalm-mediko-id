import express from 'express'
import { authenticateToken, requireSuperAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import featureSubscriptionsController from '#controllers/admin/v1/featureSubscriptions.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(requireSuperAdmin)

router.get('/', asyncHandler(featureSubscriptionsController.index.bind(featureSubscriptionsController)))
router.post('/', asyncHandler(featureSubscriptionsController.create.bind(featureSubscriptionsController)))
router.patch('/:id', asyncHandler(featureSubscriptionsController.update.bind(featureSubscriptionsController)))

export default router
