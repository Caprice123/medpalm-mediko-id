import express from 'express'
import ChatbotController from '#controllers/api/v1/chatbot.controller'
import ConversationController from '#controllers/api/v1/chatbot/conversations.controller'
import MessageController from '#controllers/api/v1/chatbot/messages.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

const featureConstantKey = 'chatbot_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Configuration
router.get('/config', authenticateToken, asyncHandler(ChatbotController.getConfig))

// Conversation management
router.get('/conversations', authenticateToken, asyncHandler(ConversationController.index))
router.post('/conversations', authenticateToken, asyncHandler(ConversationController.create))
router.get('/conversations/:id', authenticateToken, asyncHandler(ConversationController.show))
router.put('/conversations/:id', authenticateToken, asyncHandler(ConversationController.update))
router.delete('/conversations/:id', authenticateToken, asyncHandler(ConversationController.delete))

// Message management
router.get('/conversations/:conversationId/messages', authenticateToken, asyncHandler(MessageController.getMessages))
router.post('/conversations/:conversationId/send', authenticateToken, asyncHandler(MessageController.sendMessage))

// Message feedback
router.post('/messages/:messageId/feedback', authenticateToken, asyncHandler(MessageController.submitFeedback))

export default router
