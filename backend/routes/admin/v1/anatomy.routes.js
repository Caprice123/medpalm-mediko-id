import express from 'express'
import anatomyController from '../../../controllers/admin/v1/anatomy.controller.js'
import constantRoutes from './constant.routes.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { uploadImage } from '../../../middlewares/uploadImage.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Constants configuration for anatomy feature
router.use('/constants', constantRoutes)

// Upload anatomy image only (no AI generation)
router.post(
  '/upload-image',
  uploadImage,
  asyncHandler(anatomyController.uploadImage.bind(anatomyController))
)

// Generate questions from image using Gemini (preview mode)
router.post(
  '/generate-from-image',
  uploadImage,
  asyncHandler(anatomyController.generateQuestionsFromImage.bind(anatomyController))
)

// Quiz CRUD
router.post('/quizzes', asyncHandler(anatomyController.create.bind(anatomyController)))
router.get('/quizzes', asyncHandler(anatomyController.index.bind(anatomyController)))
router.get('/quizzes/:id', asyncHandler(anatomyController.show.bind(anatomyController)))
router.put('/quizzes/:id', asyncHandler(anatomyController.update.bind(anatomyController)))
router.delete('/quizzes/:id', asyncHandler(anatomyController.delete.bind(anatomyController)))

export default router
