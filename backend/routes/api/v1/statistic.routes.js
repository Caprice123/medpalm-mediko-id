import express from 'express'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import statisticController from '../../../controllers/api/v1/statistic.controller.js'

const router = express.Router()

// GET /api/v1/statistics - Get platform statistics (public endpoint)
router.get('/', asyncHandler(statisticController.index.bind(statisticController)))

// POST /api/v1/statistics/initialize - Initialize statistics from existing data
router.post('/initialize', asyncHandler(statisticController.initialize.bind(statisticController)))

export default router
