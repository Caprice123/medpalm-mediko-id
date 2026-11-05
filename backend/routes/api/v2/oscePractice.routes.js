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

// The V2 hub's three reads. V1's `/api/v1/oscePractice/{topics,sessions}` stay as they are and
// still serve the archived V1 pages; these answer the board instead — the session to resume,
// stations carrying the student's own record, and history rows that can report a last page.
router.get('/hub', asyncHandler(oscePracticeV2Controller.hub.bind(oscePracticeV2Controller)))
router.get('/stations', asyncHandler(oscePracticeV2Controller.stations.bind(oscePracticeV2Controller)))
router.get('/sessions', asyncHandler(oscePracticeV2Controller.sessions.bind(oscePracticeV2Controller)))

export default router
