import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import favoritesController from '#controllers/api/v1/favorites.controller'

const router = express.Router()

router.use(authenticateToken)
router.get('/', asyncHandler(favoritesController.index.bind(favoritesController)))
router.post('/toggle', asyncHandler(favoritesController.toggle.bind(favoritesController)))

export default router
