import express from 'express'
import SkripsiTemplatesV2Controller from '#controllers/api/v2/skripsi/templates.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/templates. Authentication and the feature gate are
// applied once by the parent router.
const router = express.Router()

const bind = (method) => asyncHandler(SkripsiTemplatesV2Controller[method].bind(SkripsiTemplatesV2Controller))

router.get('/', bind('index'))

// A student's own saved outlines. The admin-managed templates are not writable
// from here — those live under /admin/v2/skripsi/templates.
router.post('/', bind('create'))
router.delete('/:id', bind('destroy'))

export default router
