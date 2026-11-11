import express from 'express'
import SkripsiSetsV2Controller from '#controllers/api/v2/skripsi/sets.controller'
import SkripsiTabsV2Controller from '#controllers/api/v2/skripsi/tabs.controller'
import SkripsiDiagramsV2Controller from '#controllers/api/v2/skripsi/diagrams.controller'
import SkripsiResearchV2Controller from '#controllers/api/v2/skripsi/research.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { checkFeature } from '#middleware/checkFeature.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Same gate as V1. `/api/v1/skripsi/*` stays mounted and still serves the
// archived V1 pages.
router.use(authenticateToken)
router.use(checkFeature('skripsi_is_active'))

const bind = (controller, method) => asyncHandler(controller[method].bind(controller))

// Config + the first page of sets in one read, replacing V1's two calls on mount.
router.get('/bootstrap', bind(SkripsiSetsV2Controller, 'bootstrap'))

// Research pickers. These sit above /sets/:uniqueId so a literal path segment
// is never swallowed by the uniqueId param.
router.get('/research/domains', bind(SkripsiResearchV2Controller, 'domains'))
router.get('/research/journals', bind(SkripsiResearchV2Controller, 'journals'))
router.get('/research/journals/search', bind(SkripsiResearchV2Controller, 'searchJournals'))

router.get('/sets', bind(SkripsiSetsV2Controller, 'index'))
router.post('/sets', bind(SkripsiSetsV2Controller, 'create'))
router.get('/sets/:uniqueId', bind(SkripsiSetsV2Controller, 'show'))
router.put('/sets/:uniqueId', bind(SkripsiSetsV2Controller, 'update'))
router.delete('/sets/:uniqueId', bind(SkripsiSetsV2Controller, 'destroy'))

// The editor autosaves, so content is its own write rather than a full set update.
router.put('/sets/:uniqueId/content', bind(SkripsiSetsV2Controller, 'updateContent'))

// Research settings belong to the set: two sets can search different journals.
router.get('/sets/:uniqueId/research-settings', bind(SkripsiSetsV2Controller, 'getResearchSettings'))
router.put('/sets/:uniqueId/research-settings', bind(SkripsiSetsV2Controller, 'updateResearchSettings'))

router.get('/tabs/:tabId/messages', bind(SkripsiTabsV2Controller, 'messages'))
router.post('/tabs/:tabId/messages', bind(SkripsiTabsV2Controller, 'send'))
router.post('/tabs/:tabId/messages/:messageId/finalize', bind(SkripsiTabsV2Controller, 'finalize'))
router.put('/tabs/:tabId/diagram', bind(SkripsiTabsV2Controller, 'saveDiagram'))

router.get('/tabs/:tabId/diagrams', bind(SkripsiDiagramsV2Controller, 'history'))
router.post('/tabs/:tabId/diagrams', bind(SkripsiDiagramsV2Controller, 'generate'))
router.post('/tabs/:tabId/diagrams/manual', bind(SkripsiDiagramsV2Controller, 'create'))
router.get('/diagrams/:diagramId', bind(SkripsiDiagramsV2Controller, 'show'))
router.put('/diagrams/:diagramId', bind(SkripsiDiagramsV2Controller, 'update'))

export default router
