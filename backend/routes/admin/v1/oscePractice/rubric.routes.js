import express from 'express'
import rubricsController from '#controllers/admin/v1/oscePractice/rubrics.controller'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken, requireAdmin)

// GET /api/v1/admin/osce-practice/rubrics - List all rubrics with filters
router.get('/', asyncHandler(rubricsController.index.bind(rubricsController)))

// GET /api/v1/admin/osce-practice/rubrics/:rubricId - Get single rubric
router.get('/:rubricId', asyncHandler(rubricsController.show.bind(rubricsController)))

// POST /api/v1/admin/osce-practice/rubrics - Create new rubric
router.post('/', asyncHandler(rubricsController.create.bind(rubricsController)))

// PUT /api/v1/admin/osce-practice/rubrics/:rubricId - Update rubric
router.put('/:rubricId', asyncHandler(rubricsController.update.bind(rubricsController)))


export default router
