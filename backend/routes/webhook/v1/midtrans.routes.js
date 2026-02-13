import express from 'express'
import { handleMidtransNotification } from '#controllers/webhook/v1/midtrans.controller'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Midtrans webhook endpoint (no authentication required - verified by signature)
router.post('/notification', asyncHandler(handleMidtransNotification))

export default router
