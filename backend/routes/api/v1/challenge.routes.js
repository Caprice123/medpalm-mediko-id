import express from 'express'
import challengeController from '#controllers/api/v1/challenge.controller'
import { authenticateToken, optionalAuthenticate } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// Public, for the same reason as the webinar listing — see that route file.
router.get('/', optionalAuthenticate, asyncHandler(challengeController.index.bind(challengeController)))

router.use(authenticateToken)

router.get('/my-badges', asyncHandler(challengeController.myBadges.bind(challengeController)))
router.get('/:uniqueId', asyncHandler(challengeController.show.bind(challengeController)))
router.get('/:uniqueId/badges', asyncHandler(challengeController.badges.bind(challengeController)))
router.get('/:uniqueId/leaderboard', asyncHandler(challengeController.leaderboard.bind(challengeController)))
router.post('/:uniqueId/start', asyncHandler(challengeController.start.bind(challengeController)))
router.post('/:uniqueId/answer', asyncHandler(challengeController.answer.bind(challengeController)))
router.post('/:uniqueId/submit', asyncHandler(challengeController.submit.bind(challengeController)))
router.post('/:uniqueId/reward/read', asyncHandler(challengeController.markRewardRead.bind(challengeController)))

export default router
