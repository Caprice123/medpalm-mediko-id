import { GetUserChallengesService } from '#services/challenge/user/getChallengesService'
import { GetChallengeDetailService } from '#services/challenge/user/getChallengeDetailService'
import { GetChallengeBadgesService } from '#services/challenge/user/getChallengeBadgesService'
import { GetChallengeLeaderboardService } from '#services/challenge/user/getChallengeLeaderboardService'
import { GetMyBadgesService } from '#services/challenge/user/getMyBadgesService'
import { StartChallengeService } from '#services/challenge/user/startChallengeService'
import { SubmitChallengeService } from '#services/challenge/user/submitChallengeService'
import { SaveAnswerService } from '#services/challenge/user/saveAnswerService'
import { UserChallengeSerializer } from '#serializers/api/v1/challengeSerializer'

class ChallengeController {
  async index(req, res) {
    const { page, perPage, search, tab, universityId, semesterId } = req.query
    const result = await GetUserChallengesService.call({ userId: req.user.id, page, perPage, search, tab, universityId, semesterId })
    return res.status(200).json({
      data: UserChallengeSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async myBadges(req, res) {
    const data = await GetMyBadgesService.call({ userId: req.user.id })
    return res.status(200).json({ data })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const result = await GetChallengeDetailService.call({ challengeUniqueId: uniqueId, userId: req.user.id })
    return res.status(200).json({ data: UserChallengeSerializer.serializeDetail(result) })
  }

  async badges(req, res) {
    const { uniqueId } = req.params
    const result = await GetChallengeBadgesService.call({ challengeUniqueId: uniqueId })
    return res.status(200).json({ data: UserChallengeSerializer.serializeBadges(result) })
  }

  async leaderboard(req, res) {
    const { uniqueId } = req.params
    const result = await GetChallengeLeaderboardService.call({ challengeUniqueId: uniqueId, userId: req.user.id })
    return res.status(200).json({ data: UserChallengeSerializer.serializeLeaderboard(result) })
  }

  async start(req, res) {
    const { uniqueId } = req.params
    const result = await StartChallengeService.call({ challengeUniqueId: uniqueId, userId: req.user.id })
    return res.status(201).json({ data: result })
  }

  async answer(req, res) {
    const { uniqueId } = req.params
    const { questionId, selectedOptionIndex, timeTakenSeconds } = req.body
    const result = await SaveAnswerService.call({ challengeUniqueId: uniqueId, userId: req.user.id, questionId, selectedOptionIndex, timeTakenSeconds })
    return res.status(200).json({ ok: true, isCorrect: result?.isCorrect ?? null })
  }

  async submit(req, res) {
    const { uniqueId } = req.params
    const result = await SubmitChallengeService.call({ challengeUniqueId: uniqueId, userId: req.user.id })
    return res.status(200).json({ data: result })
  }
}

export default new ChallengeController()
