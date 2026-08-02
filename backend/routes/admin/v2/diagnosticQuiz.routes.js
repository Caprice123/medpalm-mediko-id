import express from 'express'
import diagnosticQuizController from '#controllers/admin/v2/diagnostic/unlinkedQuestions.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('diagnostic'))

router.get('/unlinked', asyncHandler(diagnosticQuizController.getUnlinked.bind(diagnosticQuizController)))
router.put('/unlinked/:questionId', asyncHandler(diagnosticQuizController.updateUnlinked.bind(diagnosticQuizController)))
router.delete('/unlinked/:questionId', asyncHandler(diagnosticQuizController.deleteUnlinked.bind(diagnosticQuizController)))
router.put('/unlinked/:questionId/assign', asyncHandler(diagnosticQuizController.assignToNode.bind(diagnosticQuizController)))
router.put('/questions/:questionId/move', asyncHandler(diagnosticQuizController.moveQuestion.bind(diagnosticQuizController)))

export default router
