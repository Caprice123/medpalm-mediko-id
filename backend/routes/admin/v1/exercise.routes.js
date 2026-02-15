import express from 'express'
import exerciseController from '#controllers/admin/v1/exercise.controller'
import constantRoutes from './constant.routes.js'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All exercise routes require 'exercise' feature permission
router.use(requireFeaturePermission('exercise'))

// Constants configuration for exercise feature
router.use('/constants', constantRoutes)

// Generate questions
router.post('/generate', asyncHandler(exerciseController.generateQuestions.bind(exerciseController)))
router.post('/generate-from-pdf', asyncHandler(exerciseController.generateQuestionsFromPDF.bind(exerciseController)))

// Topic CRUD
router.get('/topics', asyncHandler(exerciseController.index.bind(exerciseController)))
router.post('/topics', asyncHandler(exerciseController.create.bind(exerciseController)))
router.get('/topics/:uniqueId', asyncHandler(exerciseController.show.bind(exerciseController)))
router.put('/topics/:uniqueId', asyncHandler(exerciseController.update.bind(exerciseController)))

export default router
