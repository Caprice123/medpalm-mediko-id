import express from 'express'
import featureNodesController from '#controllers/admin/v1/featureNodes.controller'
import nodeCardsController from '#controllers/admin/v1/nodeCards.controller'
import nodeQuestionsController from '#controllers/admin/v1/nodeQuestions.controller'
import nodeAtlasController from '#controllers/admin/v1/nodeAtlas.controller'
import nodeAnatomyController from '#controllers/admin/v1/nodeAnatomy.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { uploadExcel } from '#middlewares/uploadExcel'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('nodeStructure'))
router.use(requireFeaturePermission('featureNodes'))

// Nodes CRUD
router.get('/', asyncHandler(featureNodesController.index.bind(featureNodesController)))
router.post('/', asyncHandler(featureNodesController.create.bind(featureNodesController)))
router.get('/:id', asyncHandler(featureNodesController.show.bind(featureNodesController)))
router.put('/:id', asyncHandler(featureNodesController.update.bind(featureNodesController)))
router.delete('/:id', asyncHandler(featureNodesController.delete.bind(featureNodesController)))

// Node cards (flashcard_cards linked via feature_node_records)
router.get('/cards/template', nodeCardsController.downloadTemplate.bind(nodeCardsController))
router.get('/:nodeId/cards', asyncHandler(nodeCardsController.getNodeCards.bind(nodeCardsController)))
router.post('/:nodeId/cards', asyncHandler(nodeCardsController.addNodeCard.bind(nodeCardsController)))
router.post('/:nodeId/cards/import', uploadExcel, asyncHandler(nodeCardsController.importCards.bind(nodeCardsController)))
router.put('/:nodeId/cards/:cardId', asyncHandler(nodeCardsController.updateNodeCard.bind(nodeCardsController)))
router.delete('/:nodeId/cards/:cardId', asyncHandler(nodeCardsController.deleteNodeCard.bind(nodeCardsController)))
router.put('/:nodeId/cards/:cardId/move', asyncHandler(nodeCardsController.moveNodeCard.bind(nodeCardsController)))

// Node questions (mcq_questions linked via feature_node_records)
router.get('/questions/template', nodeQuestionsController.downloadTemplate.bind(nodeQuestionsController))
router.get('/:nodeId/questions', asyncHandler(nodeQuestionsController.getNodeQuestions.bind(nodeQuestionsController)))
router.post('/:nodeId/questions', asyncHandler(nodeQuestionsController.addNodeQuestion.bind(nodeQuestionsController)))
router.post('/:nodeId/questions/import', uploadExcel, asyncHandler(nodeQuestionsController.importQuestions.bind(nodeQuestionsController)))
router.put('/:nodeId/questions/:questionId', asyncHandler(nodeQuestionsController.updateNodeQuestion.bind(nodeQuestionsController)))
router.delete('/:nodeId/questions/:questionId', asyncHandler(nodeQuestionsController.deleteNodeQuestion.bind(nodeQuestionsController)))
router.put('/:nodeId/questions/:questionId/move', asyncHandler(nodeQuestionsController.moveNodeQuestion.bind(nodeQuestionsController)))

// Node atlas models (3d_atlas linked via feature_node_records)
router.get('/:nodeId/atlas-models', asyncHandler(nodeAtlasController.index.bind(nodeAtlasController)))
router.delete('/:nodeId/atlas-models/:modelId', asyncHandler(nodeAtlasController.destroy.bind(nodeAtlasController)))
router.put('/:nodeId/atlas-models/:modelId/move', asyncHandler(nodeAtlasController.move.bind(nodeAtlasController)))

// Node anatomy quizzes (anatomy_quiz linked via feature_node_records)
router.get('/:nodeId/anatomy-quizzes', asyncHandler(nodeAnatomyController.index.bind(nodeAnatomyController)))
router.delete('/:nodeId/anatomy-quizzes/:quizId', asyncHandler(nodeAnatomyController.destroy.bind(nodeAnatomyController)))
router.put('/:nodeId/anatomy-quizzes/:quizId/move', asyncHandler(nodeAnatomyController.move.bind(nodeAnatomyController)))

export default router
