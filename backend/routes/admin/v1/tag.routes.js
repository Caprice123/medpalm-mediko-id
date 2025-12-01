import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import tagsController from '../../../controllers/admin/v1/tags.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all tags (available for all authenticated users)
router.get('/', asyncHandler(tagsController.index.bind(tagsController)))

// CRUD operations require admin role
router.post('/', requireAdmin, asyncHandler(tagsController.create.bind(tagsController)))
router.put('/:id', requireAdmin, asyncHandler(tagsController.update.bind(tagsController)))

export default router
