import express from 'express'
import adminChallengeController from '#controllers/admin/v1/challenge.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { requireTabPermission, requireFeaturePermission } from '#middleware/permission.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { DisburseBadgesService } from '#services/challenge/disburseBadgesService'

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
  const count = await DisburseBadgesService.call()
  return res.status(200).json({ ok: true, disbursedCount: count })
}))

export default router
