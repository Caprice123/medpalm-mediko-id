import express from 'express'
import diagnosticNodesController from '#controllers/admin/v2/diagnosticNodes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { uploadExcel } from '#middlewares/uploadExcel'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('diagnostic'))

// Nodes CRUD
router.get('/', asyncHandler(diagnosticNodesController.index.bind(diagnosticNodesController)))
router.post('/', asyncHandler(diagnosticNodesController.create.bind(diagnosticNodesController)))
router.put('/:id', asyncHandler(diagnosticNodesController.update.bind(diagnosticNodesController)))
router.delete('/:id', asyncHandler(diagnosticNodesController.destroy.bind(diagnosticNodesController)))

// Questions template download
router.get('/questions/template', diagnosticNodesController.downloadTemplate.bind(diagnosticNodesController))

// Questions per node
router.get('/:nodeId/questions', asyncHandler(diagnosticNodesController.getQuestions.bind(diagnosticNodesController)))
router.post('/:nodeId/questions', asyncHandler(diagnosticNodesController.addQuestion.bind(diagnosticNodesController)))
router.post('/:nodeId/questions/import', uploadExcel, asyncHandler(diagnosticNodesController.importQuestions.bind(diagnosticNodesController)))
router.put('/:nodeId/questions/:questionId', asyncHandler(diagnosticNodesController.updateQuestion.bind(diagnosticNodesController)))
router.delete('/:nodeId/questions/:questionId', asyncHandler(diagnosticNodesController.deleteQuestion.bind(diagnosticNodesController)))

export default router
