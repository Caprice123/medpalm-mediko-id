import express from 'express'
import anatomyV2Controller from '#controllers/admin/v2/atlas-quiz/quizzes.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('anatomy'))

router.get('/', asyncHandler(anatomyV2Controller.index.bind(anatomyV2Controller)))
router.post('/', asyncHandler(anatomyV2Controller.create.bind(anatomyV2Controller)))
router.get('/:uniqueId', asyncHandler(anatomyV2Controller.show.bind(anatomyV2Controller)))
router.put('/:uniqueId', asyncHandler(anatomyV2Controller.update.bind(anatomyV2Controller)))
router.delete('/:uniqueId', asyncHandler(anatomyV2Controller.destroy.bind(anatomyV2Controller)))

export default router
