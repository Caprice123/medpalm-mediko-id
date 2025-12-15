import express from 'express'
import mcqController from '../../../controllers/admin/v1/mcq.controller.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { uploadImage } from '../../../middlewares/uploadImage.js'
import { uploadPDF } from '../../../middlewares/uploadPDF.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Constants configuration for MCQ feature
router.get('/constants', asyncHandler(mcqController.getConstants.bind(mcqController)))
router.put('/constants', asyncHandler(mcqController.updateConstants.bind(mcqController)))

// Upload question image
router.post(
  '/upload-question-image',
  uploadImage,
  asyncHandler(mcqController.uploadQuestionImage.bind(mcqController))
)

// Generate MCQ questions from text or PDF
router.post(
  '/generate',
  uploadPDF,
  asyncHandler(mcqController.generate.bind(mcqController))
)

// Topic CRUD
router.post('/topics', asyncHandler(mcqController.create.bind(mcqController)))
router.get('/topics', asyncHandler(mcqController.index.bind(mcqController)))
router.get('/topics/:id', asyncHandler(mcqController.show.bind(mcqController)))
router.put('/topics/:id', asyncHandler(mcqController.update.bind(mcqController)))
router.delete('/topics/:id', asyncHandler(mcqController.delete.bind(mcqController)))

export default router
