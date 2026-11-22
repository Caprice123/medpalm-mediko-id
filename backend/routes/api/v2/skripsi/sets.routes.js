import express from 'express'
import SkripsiSetsV2Controller from '#controllers/api/v2/skripsi/sets.controller'
import SkripsiSectionsV2Controller from '#controllers/api/v2/skripsi/sections.controller'
import SkripsiCitationsV2Controller from '#controllers/api/v2/skripsi/citations.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/sets — the report itself and the sections that
// belong to it. Writes addressed by section id live in sections.routes.js.
const router = express.Router()

const set = (method) => asyncHandler(SkripsiSetsV2Controller[method].bind(SkripsiSetsV2Controller))
const section = (method) => asyncHandler(SkripsiSectionsV2Controller[method].bind(SkripsiSectionsV2Controller))
const citation = (method) => asyncHandler(SkripsiCitationsV2Controller[method].bind(SkripsiCitationsV2Controller))

router.get('/', set('index'))
router.post('/', set('create'))
router.get('/:uniqueId', set('show'))
router.put('/:uniqueId', set('update'))
router.delete('/:uniqueId', set('destroy'))

// V1's single-blob document. Kept so a set written before sections existed can
// still be read and saved.
router.put('/:uniqueId/content', set('updateContent'))

// The group whose report this is — shown on the cover and in the Word export.
router.get('/:uniqueId/members', set('members'))
router.put('/:uniqueId/members', set('updateMembers'))

// The document itself: the editor reads these on open, and writes each one on
// its own as it autosaves.
router.get('/:uniqueId/sections', section('index'))
router.post('/:uniqueId/sections', section('create'))
router.put('/:uniqueId/sections/reorder', section('reorder'))

// The sources kept for the daftar pustaka, and the one call that writes it into
// the reference section. A citation is addressed by its own id once it exists,
// so its edit and delete sit in citations.routes.js.
router.get('/:uniqueId/citations', citation('index'))
router.post('/:uniqueId/citations', citation('create'))
router.post('/:uniqueId/citations/generate', citation('generate'))

export default router
