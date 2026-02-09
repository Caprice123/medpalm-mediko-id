import express from 'express'
import ChatbotAdminController from '#controllers/admin/v1/chatbot.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// Conversation management
router.get('/conversations', asyncHandler(ChatbotAdminController.getConversations))
router.get('/conversations/:uniqueId', asyncHandler(ChatbotAdminController.getConversation))
router.get('/conversations/:uniqueId/messages', asyncHandler(ChatbotAdminController.getConversationMessages))
router.delete('/conversations/:uniqueId', asyncHandler(ChatbotAdminController.deleteConversation))

export default router
