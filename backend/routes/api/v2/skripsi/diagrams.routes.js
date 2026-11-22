import express from 'express'
import SkripsiDiagramsV2Controller from '#controllers/api/v2/skripsi/diagrams.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/diagrams — the Diagram Builder panel. The literal
// /tabs routes are declared before /:diagramId so "tabs" is never read as an id.
const router = express.Router()

const bind = (method) => asyncHandler(SkripsiDiagramsV2Controller[method].bind(SkripsiDiagramsV2Controller))

// Generated pictures — what the Diagram Builder makes now.
router.post('/tabs/:tabId/images', bind('generateImage'))
router.get('/tabs/:tabId/images', bind('images'))

// The Excalidraw-era routes. Nothing in V2 calls them any more; they stay for
// the diagrams drawn before the switch.
router.get('/tabs/:tabId/history', bind('history'))
router.post('/tabs/:tabId/generate', bind('generate'))
router.post('/tabs/:tabId/manual', bind('create'))
router.put('/tabs/:tabId/canvas', bind('saveCanvas'))

router.get('/:diagramId', bind('show'))
router.put('/:diagramId', bind('update'))

export default router
