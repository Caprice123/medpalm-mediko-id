import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import recentlyViewedController from '#controllers/api/v1/recentlyViewed.controller'

const router = express.Router()

router.use(authenticateToken)
router.get('/', asyncHandler(recentlyViewedController.index.bind(recentlyViewedController)))

export default router
