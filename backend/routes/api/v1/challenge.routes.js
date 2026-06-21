import express from 'express'
import challengeController from '#controllers/api/v1/challenge.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)

router.get('/', asyncHandler(challengeController.index.bind(challengeController)))
router.get('/my-badges', asyncHandler(challengeController.myBadges.bind(challengeController)))
router.get('/:uniqueId', asyncHandler(challengeController.show.bind(challengeController)))
router.get('/:uniqueId/badges', asyncHandler(challengeController.badges.bind(challengeController)))
router.get('/:uniqueId/leaderboard', asyncHandler(challengeController.leaderboard.bind(challengeController)))
router.post('/:uniqueId/start', asyncHandler(challengeController.start.bind(challengeController)))
router.post('/:uniqueId/answer', asyncHandler(challengeController.answer.bind(challengeController)))
router.post('/:uniqueId/submit', asyncHandler(challengeController.submit.bind(challengeController)))

export default router
