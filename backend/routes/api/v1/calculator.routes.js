import express from 'express'
import calculatorController from '../../../controllers/api/v1/calculator.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Calculator endpoints
router.get('/topics', asyncHandler(calculatorController.getTopics.bind(calculatorController)))
router.post('/:topicId/calculate', asyncHandler(calculatorController.calculate.bind(calculatorController)))

export default router
