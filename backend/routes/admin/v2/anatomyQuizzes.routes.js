import express from 'express'
import anatomyQuizzesController from '#controllers/admin/v2/anatomyQuizzes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('anatomy'))

router.get('/unlinked', asyncHandler(anatomyQuizzesController.getUnlinked.bind(anatomyQuizzesController)))
router.put('/unlinked/:uniqueId', asyncHandler(anatomyQuizzesController.updateUnlinked.bind(anatomyQuizzesController)))
router.delete('/unlinked/:uniqueId', asyncHandler(anatomyQuizzesController.deleteUnlinked.bind(anatomyQuizzesController)))
router.put('/unlinked/:uniqueId/assign', asyncHandler(anatomyQuizzesController.assignToNode.bind(anatomyQuizzesController)))

export default router
