import express from 'express'
import SummaryNotesAdminController from '../../../controllers/api/v1/summaryNotes/admin.controller.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/temp'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.ms-powerpoint', // ppt
      'application/msword' // doc
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, PPTX, and DOCX are allowed.'))
    }
  }
})

// CRUD routes
router.get('/', authenticateToken, requireAdmin, asyncHandler(SummaryNotesAdminController.index))
router.get('/:id', authenticateToken, requireAdmin, asyncHandler(SummaryNotesAdminController.show))
router.post('/', authenticateToken, requireAdmin, asyncHandler(SummaryNotesAdminController.create))
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(SummaryNotesAdminController.update))
router.delete('/:id', authenticateToken, requireAdmin, asyncHandler(SummaryNotesAdminController.destroy))

// Generate summary from document
router.post('/generate', authenticateToken, requireAdmin, upload.single('document'), asyncHandler(SummaryNotesAdminController.generateFromDocument))

export default router
