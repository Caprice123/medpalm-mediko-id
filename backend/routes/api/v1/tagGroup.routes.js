import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import tagGroupController from '../../../controllers/api/v1/tagGroup.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all tag groups (available for all authenticated users)
router.get('/', asyncHandler(tagGroupController.index.bind(tagGroupController)))

export default router
