import express from 'express'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken } from '#middleware/auth.middleware'
import { checkFeature } from '#middleware/checkFeature.middleware'
import oscePracticeV2Controller from '#controllers/api/v2/oscePractice.controller'

const router = express.Router()

// Same gate as the v1 session routes: when the feature is switched off the history page is
// unreachable anyway, and the chart must not be the one surface that stays live.
router.use(authenticateToken)
router.use(checkFeature('osce_practice_is_active'))

router.get('/performance', asyncHandler(oscePracticeV2Controller.performance.bind(oscePracticeV2Controller)))

export default router
