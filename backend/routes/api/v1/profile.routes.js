import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import profileController from '#controllers/api/v1/profile.controller'

const router = express.Router()

router.get('/', authenticateToken, asyncHandler(profileController.getProfile.bind(profileController)))
router.put('/', authenticateToken, asyncHandler(profileController.updateProfile.bind(profileController)))

export default router
