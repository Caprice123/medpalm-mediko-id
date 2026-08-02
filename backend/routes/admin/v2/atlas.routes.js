import express from 'express'
import atlasV2Controller from '#controllers/admin/v2/atlas-quiz/models.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('atlas'))

router.get('/', asyncHandler(atlasV2Controller.index.bind(atlasV2Controller)))
router.post('/', asyncHandler(atlasV2Controller.create.bind(atlasV2Controller)))
router.get('/:uniqueId', asyncHandler(atlasV2Controller.show.bind(atlasV2Controller)))
router.put('/:uniqueId', asyncHandler(atlasV2Controller.update.bind(atlasV2Controller)))
router.delete('/:uniqueId', asyncHandler(atlasV2Controller.destroy.bind(atlasV2Controller)))

export default router
