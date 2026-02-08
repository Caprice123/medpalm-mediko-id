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
router.get('/conversations/:uniqueId', asyncHandler(ConversationController.show))
router.put('/conversations/:uniqueId', asyncHandler(ConversationController.update))
router.delete('/conversations/:uniqueId', asyncHandler(ConversationController.delete))

// Message management
router.get('/conversations/:conversationUniqueId/messages', asyncHandler(MessageController.index))
router.post('/conversations/:conversationUniqueId/send', asyncHandler(MessageController.create))

// Message feedback
router.post('/messages/:messageId/feedback', asyncHandler(MessageController.feedback))

// Finalize message (for both completed and truncated streams)
router.post('/conversations/:conversationUniqueId/messages/:messageId/finalize', asyncHandler(MessageController.finalize))

// Truncate message when streaming is stopped (DEPRECATED - use finalize instead)
router.patch('/conversations/:conversationUniqueId/messages/:messageId/truncate', asyncHandler(MessageController.truncate))

export default router
