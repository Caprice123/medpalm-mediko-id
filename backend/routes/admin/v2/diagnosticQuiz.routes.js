import express from 'express'
import diagnosticQuizController from '#controllers/admin/v2/diagnostic/unlinkedCases.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('diagnostic'))

router.get('/unlinked', asyncHandler(diagnosticQuizController.getUnlinked.bind(diagnosticQuizController)))
router.put('/unlinked/:caseId', asyncHandler(diagnosticQuizController.updateUnlinked.bind(diagnosticQuizController)))
router.delete('/unlinked/:caseId', asyncHandler(diagnosticQuizController.deleteUnlinked.bind(diagnosticQuizController)))
router.put('/unlinked/:caseId/assign', asyncHandler(diagnosticQuizController.assignToNode.bind(diagnosticQuizController)))
router.put('/cases/:caseId/move', asyncHandler(diagnosticQuizController.moveCase.bind(diagnosticQuizController)))

export default router
