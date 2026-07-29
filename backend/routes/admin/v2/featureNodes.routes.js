import express from 'express'
import featureNodesV2Controller from '#controllers/admin/v2/featureNodes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('atlas'))

router.get('/', asyncHandler(featureNodesV2Controller.index.bind(featureNodesV2Controller)))

export default router
