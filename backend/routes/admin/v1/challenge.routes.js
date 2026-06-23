import express from 'express'
import adminChallengeController from '#controllers/admin/v1/challenge.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { CompleteChallengeService } from '#services/challenge/completeChallengeService'
import prisma from '#prisma/client'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)
router.use(requireTabPermission('features'))
router.use(requireFeaturePermission('challenge'))

// Challenges CRUD
router.get('/', asyncHandler(adminChallengeController.index.bind(adminChallengeController)))
router.post('/', asyncHandler(adminChallengeController.create.bind(adminChallengeController)))
router.put('/:uniqueId', asyncHandler(adminChallengeController.update.bind(adminChallengeController)))
router.delete('/:uniqueId', asyncHandler(adminChallengeController.destroy.bind(adminChallengeController)))

// Questions
router.get('/:uniqueId/questions', asyncHandler(adminChallengeController.indexQuestions.bind(adminChallengeController)))
router.post('/:uniqueId/questions', asyncHandler(adminChallengeController.createQuestion.bind(adminChallengeController)))
router.put('/:uniqueId/questions/:questionUniqueId', asyncHandler(adminChallengeController.updateQuestion.bind(adminChallengeController)))
router.delete('/:uniqueId/questions/:questionUniqueId', asyncHandler(adminChallengeController.destroyQuestion.bind(adminChallengeController)))

// Badges
router.get('/:uniqueId/badges', asyncHandler(adminChallengeController.indexBadges.bind(adminChallengeController)))
router.post('/:uniqueId/badges', asyncHandler(adminChallengeController.createBadge.bind(adminChallengeController)))
router.put('/:uniqueId/badges/:badgeUniqueId', asyncHandler(adminChallengeController.updateBadge.bind(adminChallengeController)))
router.delete('/:uniqueId/badges/:badgeUniqueId', asyncHandler(adminChallengeController.destroyBadge.bind(adminChallengeController)))

// Leaderboard
router.get('/:uniqueId/leaderboard', asyncHandler(adminChallengeController.leaderboard.bind(adminChallengeController)))

// Dev/test only: manually trigger badge disbursement
router.post('/trigger-disburse', asyncHandler(async (req, res) => {
  const count = await CompleteChallengeService.call()
  return res.status(200).json({ ok: true, disbursedCount: count })
}))

// Dev/test only: queue answer key email for a specific session
router.post('/test-answer-key-email', asyncHandler(async (req, res) => {
  const { sessionUniqueId } = req.body

  const session = await prisma.challenge_sessions.findUnique({
    where: { unique_id: sessionUniqueId },
    include: { challenge: true },
  })
  if (!session) return res.status(404).json({ ok: false, message: 'Session not found' })

  await CompleteChallengeService.sendAnswerKeyEmails({ challenge: session.challenge, sessions: [session] })

  return res.status(200).json({ ok: true })
}))

export default router
