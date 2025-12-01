import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import tagGroupsController from '../../../controllers/admin/v1/tagGroups.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all tag groups (available for all authenticated users)
router.get('/', asyncHandler(tagGroupsController.index.bind(tagGroupsController)))

export default router
