import express from 'express'
import SkripsiSetsV2Controller from '#controllers/api/v2/skripsi/sets.controller'
import templatesRoutes from '#routes/api/v2/skripsi/templates.routes'
import setsRoutes from '#routes/api/v2/skripsi/sets.routes'
import sectionsRoutes from '#routes/api/v2/skripsi/sections.routes'
import citationsRoutes from '#routes/api/v2/skripsi/citations.routes'
import chatRoutes from '#routes/api/v2/skripsi/chat.routes'
import searcherRoutes from '#routes/api/v2/skripsi/searcher.routes'
import diagramsRoutes from '#routes/api/v2/skripsi/diagrams.routes'
import { authenticateToken } from '#middleware/auth.middleware'
import { checkFeature } from '#middleware/checkFeature.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Same gate as V1. `/api/v1/skripsi/*` stays mounted and still serves the
// archived V1 pages.
router.use(authenticateToken)
router.use(checkFeature('skripsi_is_active'))

// Config + the first page of sets in one read, replacing V1's two calls on mount.
router.get('/bootstrap', asyncHandler(SkripsiSetsV2Controller.bootstrap.bind(SkripsiSetsV2Controller)))

// One router per thing the editor talks to. The three side panels — AI Chat,
// Searcher and Diagram Builder — each own their own prefix, so a change to one
// panel touches one file.
router.use('/templates', templatesRoutes)
router.use('/sets', setsRoutes)
router.use('/sections', sectionsRoutes)
router.use('/citations', citationsRoutes)
router.use('/chat', chatRoutes)
router.use('/searcher', searcherRoutes)
router.use('/diagrams', diagramsRoutes)

export default router
