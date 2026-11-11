import express from 'express'
import ChatbotV2Controller from '#controllers/api/v2/chatbot.controller'
import ConversationV2Controller from '#controllers/api/v2/chatbot/conversations.controller'
import MessageV2Controller from '#controllers/api/v2/chatbot/messages.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { checkFeature } from '#middleware/checkFeature.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Same gate as V1: signed in, and the chatbot feature switched on.
// `/api/v1/chatbot/*` stays mounted and still serves the archived V1 page.
router.use(authenticateToken)
router.use(checkFeature('chatbot_is_active'))

// Config + this user's chat settings in one read, replacing V1's two mount calls.
router.get('/bootstrap', asyncHandler(ChatbotV2Controller.bootstrap.bind(ChatbotV2Controller)))

router.put('/settings', asyncHandler(ChatbotV2Controller.updateSettings.bind(ChatbotV2Controller)))
router.get('/domains', asyncHandler(ChatbotV2Controller.domains.bind(ChatbotV2Controller)))
router.get('/journals', asyncHandler(ChatbotV2Controller.journals.bind(ChatbotV2Controller)))
router.get('/journals/search', asyncHandler(ChatbotV2Controller.searchJournals.bind(ChatbotV2Controller)))

router.get('/conversations', asyncHandler(ConversationV2Controller.index.bind(ConversationV2Controller)))
router.post('/conversations', asyncHandler(ConversationV2Controller.create.bind(ConversationV2Controller)))
router.get('/conversations/:uniqueId', asyncHandler(ConversationV2Controller.show.bind(ConversationV2Controller)))
router.put('/conversations/:uniqueId', asyncHandler(ConversationV2Controller.update.bind(ConversationV2Controller)))
router.delete('/conversations/:uniqueId', asyncHandler(ConversationV2Controller.delete.bind(ConversationV2Controller)))

router.get('/conversations/:conversationUniqueId/messages', asyncHandler(MessageV2Controller.index.bind(MessageV2Controller)))
router.post('/conversations/:conversationUniqueId/send', asyncHandler(MessageV2Controller.create.bind(MessageV2Controller)))
router.post('/conversations/:conversationUniqueId/messages/:messageId/finalize', asyncHandler(MessageV2Controller.finalize.bind(MessageV2Controller)))

// Feedback hangs off the message, not off a conversation — see the controller note.
router.post('/messages/:messageId/feedback', asyncHandler(MessageV2Controller.feedback.bind(MessageV2Controller)))

export default router
