import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import homeV2Controller from '#controllers/api/v2/home.controller'

const router = express.Router()

// Public — the landing page at "/" is reachable without a login, so this route
// deliberately has no authenticateToken middleware.
router.get('/stats', asyncHandler(homeV2Controller.stats.bind(homeV2Controller)))

export default router
