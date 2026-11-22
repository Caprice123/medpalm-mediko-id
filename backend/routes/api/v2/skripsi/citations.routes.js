import express from 'express'
import SkripsiCitationsV2Controller from '#controllers/api/v2/skripsi/citations.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/citations. A kept source is addressed by its own
// id here; listing them, saving one and generating the daftar pustaka all need
// the report, so those sit under sets.routes.js instead.
const router = express.Router()

const bind = (method) => asyncHandler(SkripsiCitationsV2Controller[method].bind(SkripsiCitationsV2Controller))

router.put('/:citationId', bind('update'))
router.delete('/:citationId', bind('destroy'))

export default router
