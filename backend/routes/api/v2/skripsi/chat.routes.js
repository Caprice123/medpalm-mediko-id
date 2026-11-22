import express from 'express'
import SkripsiChatV2Controller from '#controllers/api/v2/skripsi/chat.controller'
import { asyncHandler } from '#utils/asyncHandler'

// Mounted at /api/v2/skripsi/chat — the AI Chat panel, and nothing else. The
// searcher and the diagram builder have routers of their own, so a change to
// one panel never has to be read around the other two.
const router = express.Router()

const bind = (method) => asyncHandler(SkripsiChatV2Controller[method].bind(SkripsiChatV2Controller))

router.get('/tabs/:tabId/messages', bind('messages'))
router.post('/tabs/:tabId/messages', bind('send'))
router.post('/tabs/:tabId/messages/:messageId/finalize', bind('finalize'))

export default router
