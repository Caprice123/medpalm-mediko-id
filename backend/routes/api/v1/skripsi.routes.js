import express from 'express'
import SkripsiSetsController from '../../../controllers/api/v1/skripsiSets.controller.js'
import SkripsiTabsController from '../../../controllers/api/v1/skripsiTabs.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// Skripsi Sets - all under /skripsi/sets
router.get('/skripsi/sets', authenticateToken, asyncHandler(SkripsiSetsController.getSets))
router.post('/skripsi/sets', authenticateToken, asyncHandler(SkripsiSetsController.createSet))
router.get('/skripsi/sets/:id', authenticateToken, asyncHandler(SkripsiSetsController.getSet))
router.put('/skripsi/sets/:id', authenticateToken, asyncHandler(SkripsiSetsController.updateSet))
router.put('/skripsi/sets/:id/content', authenticateToken, asyncHandler(SkripsiSetsController.updateContent))
router.delete('/skripsi/sets/:id', authenticateToken, asyncHandler(SkripsiSetsController.deleteSet))

// Skripsi Tabs - under /skripsi/tabs
// router.put('/skripsi/tabs/:id', authenticateToken, asyncHandler(SkripsiTabsController.updateTab)) // Deprecated - use /skripsi/sets/:id/content instead
router.get('/skripsi/tabs/:tabId/messages', authenticateToken, asyncHandler(SkripsiTabsController.getMessages))
router.post('/skripsi/tabs/:id/messages', authenticateToken, asyncHandler(SkripsiTabsController.sendMessage))

export default router
