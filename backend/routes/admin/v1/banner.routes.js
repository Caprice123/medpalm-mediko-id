import express from 'express'
import bannerController from '#controllers/admin/v1/bannerController'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('banners'))

router.get('/', asyncHandler(bannerController.index.bind(bannerController)))
router.post('/', asyncHandler(bannerController.create.bind(bannerController)))
router.get('/:uniqueId', asyncHandler(bannerController.show.bind(bannerController)))
router.put('/:uniqueId', asyncHandler(bannerController.update.bind(bannerController)))
router.delete('/:uniqueId', asyncHandler(bannerController.delete.bind(bannerController)))

export default router
