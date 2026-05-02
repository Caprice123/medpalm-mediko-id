import express from 'express'
import bannerController from '#controllers/api/v1/banner.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)

router.get('/', asyncHandler(bannerController.index.bind(bannerController)))

export default router
