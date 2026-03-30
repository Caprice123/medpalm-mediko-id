import express from 'express'
import constantController from '#controllers/admin/v1/constant.controller'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// GET /api/v1/constants?keys=key1,key2 - Public endpoint (no auth required)
router.get('/', asyncHandler(constantController.index.bind(constantController)))

export default router
