import express from 'express'
import eventV2Controller from '#controllers/api/v2/event.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Signed-in only. The public landing page stays on /api/v1/events.
router.use(authenticateToken)

router.get('/', asyncHandler(eventV2Controller.index.bind(eventV2Controller)))

export default router
