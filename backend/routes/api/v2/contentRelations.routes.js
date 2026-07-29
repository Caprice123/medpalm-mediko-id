import express from 'express'
import userContentRelationsController from '#controllers/api/v2/contentRelations.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)

router.get('/', asyncHandler(userContentRelationsController.listRelations.bind(userContentRelationsController)))

export default router
