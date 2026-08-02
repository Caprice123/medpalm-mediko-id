import express from 'express'
import atlasModelsController from '#controllers/admin/v2/atlas-quiz/unlinkedModels.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('atlas'))

router.get('/unlinked', asyncHandler(atlasModelsController.getUnlinked.bind(atlasModelsController)))
router.put('/unlinked/:uniqueId', asyncHandler(atlasModelsController.updateUnlinked.bind(atlasModelsController)))
router.delete('/unlinked/:uniqueId', asyncHandler(atlasModelsController.deleteUnlinked.bind(atlasModelsController)))
router.put('/unlinked/:uniqueId/assign', asyncHandler(atlasModelsController.assignToNode.bind(atlasModelsController)))


export default router
