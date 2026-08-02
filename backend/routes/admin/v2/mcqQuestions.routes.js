import express from 'express'
import mcqQuestionsController from '#controllers/admin/v2/mcq/unlinkedQuestions.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('mcq'))

router.get('/unlinked', asyncHandler(mcqQuestionsController.getUnlinked.bind(mcqQuestionsController)))
router.put('/unlinked/:questionId', asyncHandler(mcqQuestionsController.updateUnlinked.bind(mcqQuestionsController)))
router.delete('/unlinked/:questionId', asyncHandler(mcqQuestionsController.deleteUnlinked.bind(mcqQuestionsController)))
router.put('/unlinked/:questionId/assign', asyncHandler(mcqQuestionsController.assignToNode.bind(mcqQuestionsController)))

export default router
