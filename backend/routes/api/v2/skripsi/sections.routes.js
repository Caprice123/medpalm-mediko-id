import express from 'express'
import SkripsiSectionsV2Controller from '#controllers/api/v2/skripsi/sections.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/sections. A section is addressed by its own id
// here; creating one and re-ordering the list need the set, so those sit under
// sets.routes.js instead.
const router = express.Router()

const bind = (method) => asyncHandler(SkripsiSectionsV2Controller[method].bind(SkripsiSectionsV2Controller))

router.put('/:sectionId', bind('update'))
router.post('/:sectionId/ai-edit', bind('aiEdit'))
router.post('/:sectionId/assist', bind('assist'))
router.delete('/:sectionId', bind('destroy'))

export default router
