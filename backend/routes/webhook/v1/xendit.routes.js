import express from 'express'
import {
  handleXenditInvoiceWebhook,
  handleXenditVAWebhook
} from '#controllers/webhook/v1/xendit.controller'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Xendit webhook endpoints (no authentication required - verified by token)
router.post('/xendit/invoice', asyncHandler(handleXenditInvoiceWebhook))
router.post('/xendit/va', asyncHandler(handleXenditVAWebhook))

export default router
