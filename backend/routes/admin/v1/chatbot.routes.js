import express from 'express'
import ChatbotAdminController from '#controllers/admin/v1/chatbot.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// All routes require 'features' tab permission
router.use(requireTabPermission('features'))

// All chatbot routes require 'chatbot' feature permission
router.use(requireFeaturePermission('chatbot'))

// Research domain management
router.get('/research-domains', asyncHandler(ChatbotAdminController.getResearchDomains))
router.post('/research-domains', asyncHandler(ChatbotAdminController.createResearchDomain))
router.put('/research-domains/:id', asyncHandler(ChatbotAdminController.updateResearchDomain))
router.delete('/research-domains/:id', asyncHandler(ChatbotAdminController.deleteResearchDomain))

// Journal name management
router.get('/journals', asyncHandler(ChatbotAdminController.getJournals.bind(ChatbotAdminController)))
router.post('/journals', asyncHandler(ChatbotAdminController.createJournal.bind(ChatbotAdminController)))
router.put('/journals/:id', asyncHandler(ChatbotAdminController.updateJournal.bind(ChatbotAdminController)))
router.delete('/journals/:id', asyncHandler(ChatbotAdminController.deleteJournal.bind(ChatbotAdminController)))

// Conversation management
router.get('/conversations', asyncHandler(ChatbotAdminController.getConversations))
router.get('/conversations/:uniqueId', asyncHandler(ChatbotAdminController.getConversation))
router.get('/conversations/:uniqueId/messages', asyncHandler(ChatbotAdminController.getConversationMessages))
router.delete('/conversations/:uniqueId', asyncHandler(ChatbotAdminController.deleteConversation))

export default router
