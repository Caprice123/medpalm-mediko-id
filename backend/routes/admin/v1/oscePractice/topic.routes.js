import express from 'express'
import topicController from '#controllers/admin/v1/oscePractice/topic.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Topics CRUD
router.get('/', asyncHandler(topicController.index.bind(topicController)))
router.post('/', asyncHandler(topicController.create.bind(topicController)))
router.get('/:id', asyncHandler(topicController.show.bind(topicController)))
router.put('/:id', asyncHandler(topicController.update.bind(topicController)))

export default router
