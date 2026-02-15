import express from 'express'
import SkripsiSetsController from '#controllers/api/v1/skripsiSets.controller'
import SkripsiTabsController from '#controllers/api/v1/skripsiTabs.controller'
import SkripsiDiagramsController from '#controllers/api/v1/skripsiDiagrams.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

// Skripsi Sets - all under /skripsi/sets
const featureConstantKey = 'skripsi_is_active'
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

router.get('/sets', asyncHandler(SkripsiSetsController.getSets))
router.post('/sets', asyncHandler(SkripsiSetsController.createSet))
router.post('/export-word', asyncHandler(SkripsiSetsController.exportToWord))
router.get('/sets/:uniqueId', asyncHandler(SkripsiSetsController.getSet))
router.put('/sets/:uniqueId', asyncHandler(SkripsiSetsController.updateSet))
router.put('/sets/:uniqueId/content', asyncHandler(SkripsiSetsController.updateContent))
router.delete('/sets/:uniqueId', asyncHandler(SkripsiSetsController.deleteSet))

// Skripsi Tabs - under /skripsi/tabs
router.get('/tabs/:tabId/messages', asyncHandler(SkripsiTabsController.getMessages))
router.post('/tabs/:id/messages', asyncHandler(SkripsiTabsController.sendMessage))
router.post('/tabs/:tabId/messages/:messageId/finalize', asyncHandler(SkripsiTabsController.finalizeMessage))
router.patch('/tabs/:tabId/messages/:messageId/truncate', asyncHandler(SkripsiTabsController.truncateMessage))
router.put('/tabs/:tabId/diagram', asyncHandler(SkripsiTabsController.saveDiagram))

// Diagram Builder - under /tabs/:tabId/diagrams and /diagrams/:diagramId
router.post('/tabs/:tabId/diagrams', asyncHandler(SkripsiDiagramsController.generateDiagram))
router.post('/tabs/:tabId/diagrams/manual', asyncHandler(SkripsiDiagramsController.createDiagram))
router.get('/tabs/:tabId/diagrams', asyncHandler(SkripsiDiagramsController.getDiagramHistory))
router.get('/diagrams/:diagramId', asyncHandler(SkripsiDiagramsController.getDiagramDetail))
router.put('/diagrams/:diagramId', asyncHandler(SkripsiDiagramsController.updateDiagram))

export default router
