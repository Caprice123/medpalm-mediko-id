import express from 'express'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'
import categoriesController from '#controllers/api/v2/diagnostic/categories.controller'
import submodulesController from '#controllers/api/v2/diagnostic/submodules.controller'
import sessionController from '#controllers/api/v2/diagnostic/session.controller'
import progressController from '#controllers/api/v2/diagnostic/progress.controller'
import rateController from '#controllers/api/v2/diagnostic/rate.controller'

const router = express.Router()

router.use(authenticateToken)
router.use(checkFeature('diagnostic_is_active'))

// Categories + submodules
router.get('/categories',                            asyncHandler(categoriesController.index.bind(categoriesController)))
router.get('/modules/:moduleId/submodules',           asyncHandler(submodulesController.index.bind(submodulesController)))

// Sessions
router.post('/session',                              asyncHandler(sessionController.startSession.bind(sessionController)))
router.post('/custom-session',                       asyncHandler(sessionController.startCustomSession.bind(sessionController)))
router.post('/due-session',                          asyncHandler(sessionController.startDueSession.bind(sessionController)))
router.post('/node-due-session',                     asyncHandler(sessionController.startNodeDueSession.bind(sessionController)))

// Progress
router.get('/due-today',                             asyncHandler(progressController.getDueToday.bind(progressController)))
router.get('/progress/summary',                      asyncHandler(progressController.getProgressSummary.bind(progressController)))
router.get('/progress/modules',                      asyncHandler(progressController.getProgressModules.bind(progressController)))

// Rate
router.post('/rate',                                 asyncHandler(rateController.create.bind(rateController)))

export default router
