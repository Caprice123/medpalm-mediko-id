import express from 'express'
import adminEventController from '#controllers/admin/v1/event.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('events'))

// All registrations (must be before /:code)
router.get('/registrations', asyncHandler(adminEventController.indexRegistrations.bind(adminEventController)))

// Event CRUD
router.get('/', asyncHandler(adminEventController.index.bind(adminEventController)))
router.post('/', asyncHandler(adminEventController.create.bind(adminEventController)))
router.get('/:code', asyncHandler(adminEventController.show.bind(adminEventController)))
router.put('/:code', asyncHandler(adminEventController.update.bind(adminEventController)))
router.delete('/:code', asyncHandler(adminEventController.delete.bind(adminEventController)))

// Registrations per event
router.get('/:code/registrations', asyncHandler(adminEventController.listRegistrations.bind(adminEventController)))
router.get('/registrations/:registrationUniqueId', asyncHandler(adminEventController.showRegistration.bind(adminEventController)))
router.put('/registrations/:registrationUniqueId/review', asyncHandler(adminEventController.reviewRegistration.bind(adminEventController)))

export default router
