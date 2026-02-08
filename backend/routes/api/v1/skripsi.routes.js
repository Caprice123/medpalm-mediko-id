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

router.get('/skripsi/sets', asyncHandler(SkripsiSetsController.getSets))
router.post('/skripsi/sets', asyncHandler(SkripsiSetsController.createSet))
router.post('/skripsi/export-word', asyncHandler(SkripsiSetsController.exportToWord))
router.get('/skripsi/sets/:uniqueId', asyncHandler(SkripsiSetsController.getSet))
router.put('/skripsi/sets/:uniqueId', asyncHandler(SkripsiSetsController.updateSet))
router.put('/skripsi/sets/:uniqueId/content', asyncHandler(SkripsiSetsController.updateContent))
router.delete('/skripsi/sets/:uniqueId', asyncHandler(SkripsiSetsController.deleteSet))

// Skripsi Tabs - under /skripsi/tabs
router.get('/skripsi/tabs/:tabId/messages', asyncHandler(SkripsiTabsController.getMessages))
router.post('/skripsi/tabs/:id/messages', asyncHandler(SkripsiTabsController.sendMessage))
router.post('/skripsi/tabs/:tabId/messages/:messageId/finalize', asyncHandler(SkripsiTabsController.finalizeMessage))
router.patch('/skripsi/tabs/:tabId/messages/:messageId/truncate', asyncHandler(SkripsiTabsController.truncateMessage))
router.put('/skripsi/tabs/:tabId/diagram', asyncHandler(SkripsiTabsController.saveDiagram))

// Diagram Builder - under /skripsi/tabs/:tabId/diagrams and /skripsi/diagrams/:diagramId
router.post('/skripsi/tabs/:tabId/diagrams', asyncHandler(SkripsiDiagramsController.generateDiagram))
router.post('/skripsi/tabs/:tabId/diagrams/manual', asyncHandler(SkripsiDiagramsController.createDiagram))
router.get('/skripsi/tabs/:tabId/diagrams', asyncHandler(SkripsiDiagramsController.getDiagramHistory))
router.get('/skripsi/diagrams/:diagramId', asyncHandler(SkripsiDiagramsController.getDiagramDetail))
router.put('/skripsi/diagrams/:diagramId', asyncHandler(SkripsiDiagramsController.updateDiagram))

export default router
