import express from 'express'
import contentRelationsController from '#controllers/admin/v2/contentRelations.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))

router.get('/', asyncHandler(contentRelationsController.listRelations.bind(contentRelationsController)))
router.post('/', asyncHandler(contentRelationsController.createRelation.bind(contentRelationsController)))
router.delete('/:id', asyncHandler(contentRelationsController.deleteRelation.bind(contentRelationsController)))

export default router
