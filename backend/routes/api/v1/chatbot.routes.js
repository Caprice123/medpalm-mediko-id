import express from 'express'
import ChatbotController from '#controllers/api/v1/chatbot.controller'
import ConversationController from '#controllers/api/v1/chatbot/conversations.controller'
import MessageController from '#controllers/api/v1/chatbot/messages.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

const featureConstantKey = 'chatbot_is_active'

// All routes require authentication
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

// Configuration
router.get('/config', asyncHandler(ChatbotController.getConfig))

// Conversation management
router.get('/conversations', asyncHandler(ConversationController.index))
router.post('/conversations', asyncHandler(ConversationController.create))
router.get('/conversations/:id', asyncHandler(ConversationController.show))
router.put('/conversations/:id', asyncHandler(ConversationController.update))
router.delete('/conversations/:id', asyncHandler(ConversationController.delete))

// Message management
router.get('/conversations/:conversationId/messages', asyncHandler(MessageController.index))
router.post('/conversations/:conversationId/send', asyncHandler(MessageController.create))
router.post('/conversations/:conversationId/save-partial-message', asyncHandler(MessageController.savePartialMessage))

// Message feedback
router.post('/messages/:messageId/feedback', asyncHandler(MessageController.feedback))

export default router
