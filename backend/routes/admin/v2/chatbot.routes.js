import express from 'express'
import ChatbotAdminV2Controller from '#controllers/admin/v2/chatbot.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Standard admin stack. Note this is the whole access rule for V2: the V1 admin
// panel additionally gated its conversations tab on one hardcoded email address,
// which meant the permission system was not actually in charge of who could read
// student conversations. Here `requireFeaturePermission('chatbot')` is.
router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('chatbot'))

router.get('/research-implementations', asyncHandler(ChatbotAdminV2Controller.getResearchImplementations.bind(ChatbotAdminV2Controller)))

router.get('/research-domains', asyncHandler(ChatbotAdminV2Controller.getResearchDomains.bind(ChatbotAdminV2Controller)))
router.post('/research-domains', asyncHandler(ChatbotAdminV2Controller.createResearchDomain.bind(ChatbotAdminV2Controller)))
router.put('/research-domains/:id', asyncHandler(ChatbotAdminV2Controller.updateResearchDomain.bind(ChatbotAdminV2Controller)))
router.delete('/research-domains/:id', asyncHandler(ChatbotAdminV2Controller.deleteResearchDomain.bind(ChatbotAdminV2Controller)))

router.get('/journals', asyncHandler(ChatbotAdminV2Controller.getJournals.bind(ChatbotAdminV2Controller)))
router.post('/journals', asyncHandler(ChatbotAdminV2Controller.createJournal.bind(ChatbotAdminV2Controller)))
router.put('/journals/:id', asyncHandler(ChatbotAdminV2Controller.updateJournal.bind(ChatbotAdminV2Controller)))
router.delete('/journals/:id', asyncHandler(ChatbotAdminV2Controller.deleteJournal.bind(ChatbotAdminV2Controller)))

router.get('/conversations', asyncHandler(ChatbotAdminV2Controller.getConversations.bind(ChatbotAdminV2Controller)))
router.get('/conversations/:uniqueId/messages', asyncHandler(ChatbotAdminV2Controller.getConversationMessages.bind(ChatbotAdminV2Controller)))
router.delete('/conversations/:uniqueId', asyncHandler(ChatbotAdminV2Controller.deleteConversation.bind(ChatbotAdminV2Controller)))

export default router
