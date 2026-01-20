import express from 'express'
import rubricsController from '#controllers/api/v1/oscePractice/rubrics.controller'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken, requireAdmin)

// GET /api/v1/admin/osce-practice/rubrics - List all rubrics with filters
router.get('/', asyncHandler(rubricsController.listRubrics.bind(rubricsController)))

// GET /api/v1/admin/osce-practice/rubrics/:rubricId - Get single rubric
router.get('/:rubricId', asyncHandler(rubricsController.getRubric.bind(rubricsController)))

// POST /api/v1/admin/osce-practice/rubrics - Create new rubric
router.post('/', asyncHandler(rubricsController.createRubric.bind(rubricsController)))

// PUT /api/v1/admin/osce-practice/rubrics/:rubricId - Update rubric
router.put('/:rubricId', asyncHandler(rubricsController.updateRubric.bind(rubricsController)))

// DELETE /api/v1/admin/osce-practice/rubrics/:rubricId - Delete rubric
router.delete('/:rubricId', asyncHandler(rubricsController.deleteRubric.bind(rubricsController)))

export default router
