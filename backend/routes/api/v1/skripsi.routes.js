import express from 'express'
import SkripsiSetsController from '#controllers/api/v1/skripsiSets.controller'
import SkripsiTabsController from '#controllers/api/v1/skripsiTabs.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

// Skripsi Sets - all under /skripsi/sets
const featureConstantKey = 'skripsi_is_active'
router.use(authenticateToken)
router.use(checkFeature(featureConstantKey))

router.get('/skripsi/sets', asyncHandler(SkripsiSetsController.getSets))
router.post('/skripsi/sets', asyncHandler(SkripsiSetsController.createSet))
router.post('/skripsi/export-word', asyncHandler(SkripsiSetsController.exportToWord))
router.get('/skripsi/sets/:id', asyncHandler(SkripsiSetsController.getSet))
router.put('/skripsi/sets/:id', asyncHandler(SkripsiSetsController.updateSet))
router.put('/skripsi/sets/:id/content', asyncHandler(SkripsiSetsController.updateContent))
router.delete('/skripsi/sets/:id', asyncHandler(SkripsiSetsController.deleteSet))

// Skripsi Tabs - under /skripsi/tabs
router.get('/skripsi/tabs/:tabId/messages', asyncHandler(SkripsiTabsController.getMessages))
router.post('/skripsi/tabs/:id/messages', asyncHandler(SkripsiTabsController.sendMessage))

export default router
