import express from 'express'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import featureController from '../../../controllers/api/v1/feature.controller.js'

const router = express.Router()

// GET /api/v1/features - Get all active features (public endpoint for landing page)
router.get('/', asyncHandler(featureController.index.bind(featureController)))

export default router
