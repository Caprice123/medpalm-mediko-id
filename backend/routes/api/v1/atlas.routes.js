import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import atlasController from '#controllers/api/v1/atlas.controller'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('atlas_is_active'))

// List published atlas models
router.get('/', asyncHandler(atlasController.index.bind(atlasController)))

// Get single atlas model detail
router.get('/:uniqueId', asyncHandler(atlasController.show.bind(atlasController)))

export default router
