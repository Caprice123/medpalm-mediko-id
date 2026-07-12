import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken } from '#middleware/auth.middleware'
import featureNodesController from '#controllers/api/v1/featureNodes.controller'

const router = express.Router()
router.use(authenticateToken)
router.get('/', asyncHandler(featureNodesController.index.bind(featureNodesController)))
export default router
