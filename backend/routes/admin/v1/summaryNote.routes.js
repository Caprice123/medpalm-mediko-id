import express from 'express'
import SummaryNotesAdminController from '#controllers/api/v1/summaryNotes/admin.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
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


router.use(authenticateToken)
router.use(requireAdmin)

// CRUD routes
router.get('/', asyncHandler(SummaryNotesAdminController.index))
router.get('/:id', asyncHandler(SummaryNotesAdminController.show))
router.post('/', asyncHandler(SummaryNotesAdminController.create))
router.put('/:id', asyncHandler(SummaryNotesAdminController.update))
router.delete('/:id', asyncHandler(SummaryNotesAdminController.destroy))

// Generate summary from document
router.post('/generate', upload.single('document'), asyncHandler(SummaryNotesAdminController.generateFromDocument))

// ChromaDB embeddings routes
router.get('/embeddings/list', asyncHandler(SummaryNotesAdminController.getEmbeddings))
router.get('/embeddings/:id', asyncHandler(SummaryNotesAdminController.getEmbeddingDetail))

export default router
