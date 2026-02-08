import express from 'express'
import calculatorController from '#controllers/admin/v1/calculator.controller'
import constantRoutes from './constant.routes.js'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Constants configuration for calculator feature
router.use('/constants', constantRoutes)

// Calculator CRUD
router.get('/', asyncHandler(calculatorController.getTopics.bind(calculatorController)))
router.post('/', asyncHandler(calculatorController.create.bind(calculatorController)))
router.get('/:uniqueId', asyncHandler(calculatorController.getTopicDetail.bind(calculatorController)))
router.put('/:uniqueId', asyncHandler(calculatorController.update.bind(calculatorController)))
router.delete('/:uniqueId', asyncHandler(calculatorController.delete.bind(calculatorController)))

export default router
