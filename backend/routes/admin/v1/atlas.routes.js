import express from 'express'
import atlasController from '#controllers/admin/v1/atlas.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('atlas'))

router.get('/', asyncHandler(atlasController.index.bind(atlasController)))
router.post('/', asyncHandler(atlasController.create.bind(atlasController)))
router.get('/:uniqueId', asyncHandler(atlasController.show.bind(atlasController)))
router.put('/:uniqueId', asyncHandler(atlasController.update.bind(atlasController)))
router.delete('/:uniqueId', asyncHandler(atlasController.delete.bind(atlasController)))

export default router
