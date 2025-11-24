import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import creditPlanController from '../../../controllers/api/v1/creditPlan.controller.js'

const router = express.Router()

// Public route (no authentication required - for landing page)
router.get('/active', asyncHandler(creditPlanController.index.bind(creditPlanController)))

// Authenticated routes
router.get('/', authenticateToken, asyncHandler(creditPlanController.index.bind(creditPlanController)))

export default router
