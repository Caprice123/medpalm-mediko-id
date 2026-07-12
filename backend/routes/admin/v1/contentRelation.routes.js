import express from 'express'
import contentRelationController from '#controllers/admin/v1/contentRelation.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('featuresV2'))

router.get('/', asyncHandler(contentRelationController.index.bind(contentRelationController)))
router.post('/', asyncHandler(contentRelationController.create.bind(contentRelationController)))
router.delete('/:id', asyncHandler(contentRelationController.destroy.bind(contentRelationController)))

export default router
