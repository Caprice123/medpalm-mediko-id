import express from 'express'
import adminWebinarController from '#controllers/admin/v1/webinar.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('webinar'))

// All registrations (must be before /:uniqueId)
router.get('/registrations', asyncHandler(adminWebinarController.indexRegistrations.bind(adminWebinarController)))

// Webinar CRUD
router.get('/', asyncHandler(adminWebinarController.index.bind(adminWebinarController)))
router.post('/', asyncHandler(adminWebinarController.create.bind(adminWebinarController)))
router.get('/:uniqueId', asyncHandler(adminWebinarController.show.bind(adminWebinarController)))
router.put('/:uniqueId', asyncHandler(adminWebinarController.update.bind(adminWebinarController)))
router.delete('/:uniqueId', asyncHandler(adminWebinarController.delete.bind(adminWebinarController)))

// Registrations
router.get('/:uniqueId/registrations', asyncHandler(adminWebinarController.listRegistrations.bind(adminWebinarController)))
router.get('/registrations/:registrationUniqueId', asyncHandler(adminWebinarController.showRegistration.bind(adminWebinarController)))
router.put('/registrations/:registrationUniqueId/review', asyncHandler(adminWebinarController.reviewRegistration.bind(adminWebinarController)))

export default router
