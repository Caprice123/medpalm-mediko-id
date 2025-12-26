import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import * as SkripsiAdminController from '../../../controllers/admin/v1/skripsi.controller.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Constants management
router.get('/skripsi/constants', asyncHandler(SkripsiAdminController.getConstants))
router.put('/skripsi/constants/:key', asyncHandler(SkripsiAdminController.updateConstant))
router.put('/skripsi/constants', asyncHandler(SkripsiAdminController.updateMultipleConstants))

// Skripsi Sets management
router.get('/skripsi/sets', asyncHandler(SkripsiAdminController.getSets))
router.get('/skripsi/sets/:id', asyncHandler(SkripsiAdminController.getSet))
router.get('/skripsi/sets/:id/tabs', asyncHandler(SkripsiAdminController.getSetTabs))
router.delete('/skripsi/sets/:id', asyncHandler(SkripsiAdminController.deleteSet))

export default router
