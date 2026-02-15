import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { uploadSingleImage } from '#middlewares/uploadSingleImage'
import uploadController from '#controllers/api/v1/upload.controller'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Upload image endpoint
router.post('/image', authenticateToken, uploadSingleImage, asyncHandler(uploadController.uploadImage))

export default router
