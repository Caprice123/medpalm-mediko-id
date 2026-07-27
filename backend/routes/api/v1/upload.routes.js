import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { uploadSingleImage } from '#middlewares/uploadSingleImage'
import { uploadSingleFile } from '#middlewares/uploadSingleFile'
import uploadController from '#controllers/api/v1/upload.controller'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.post('/image', authenticateToken, uploadSingleImage, asyncHandler(uploadController.uploadImage))
router.post('/file', authenticateToken, uploadSingleFile, asyncHandler(uploadController.uploadFile))

export default router
