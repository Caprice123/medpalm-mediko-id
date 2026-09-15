import express from 'express'
import featureNodesV2Controller from '#controllers/admin/v2/featureNodes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, checkFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { AuthorizationError } from '#errors/authorizationError'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

router.get('/', asyncHandler(featureNodesV2Controller.index.bind(featureNodesV2Controller)))

export default router
