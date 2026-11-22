import express from 'express'
import SkripsiResearchV2Controller from '#controllers/api/v2/skripsi/research.controller'
import SkripsiSetsV2Controller from '#controllers/api/v2/skripsi/sets.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/searcher — the Searcher panel: the admin-curated
// domain and journal pickers, plus the per-set settings that decide what a
// search is allowed to reach.
const router = express.Router()

const research = (method) => asyncHandler(SkripsiResearchV2Controller[method].bind(SkripsiResearchV2Controller))
const set = (method) => asyncHandler(SkripsiSetsV2Controller[method].bind(SkripsiSetsV2Controller))

// The search itself.
router.post('/run', research('search'))

router.get('/domains', research('domains'))
router.get('/journals', research('journals'))
router.get('/journals/search', research('searchJournals'))

// Research settings belong to the set: two reports can search different
// journals and year ranges.
router.get('/sets/:uniqueId/settings', set('getResearchSettings'))
router.put('/sets/:uniqueId/settings', set('updateResearchSettings'))

export default router
