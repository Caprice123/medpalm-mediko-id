import { GetChallengesService } from '#services/challenge/admin/getChallengesService'
import { CreateChallengeService } from '#services/challenge/admin/createChallengeService'
import { UpdateChallengeService } from '#services/challenge/admin/updateChallengeService'
import { DeleteChallengeService } from '#services/challenge/admin/deleteChallengeService'
import { GetQuestionsService } from '#services/challenge/admin/getQuestionsService'
import { CreateQuestionService } from '#services/challenge/admin/createQuestionService'
import { UpdateQuestionService } from '#services/challenge/admin/updateQuestionService'
import { DeleteQuestionService } from '#services/challenge/admin/deleteQuestionService'
import { GetBadgesService } from '#services/challenge/admin/getBadgesService'
import { CreateBadgeService } from '#services/challenge/admin/createBadgeService'
import { UpdateBadgeService } from '#services/challenge/admin/updateBadgeService'
import { DeleteBadgeService } from '#services/challenge/admin/deleteBadgeService'
import { GetAdminLeaderboardService } from '#services/challenge/admin/getAdminLeaderboardService'
import { AdminChallengeSerializer } from '#serializers/admin/v1/challengeSerializer'

class AdminChallengeController {
  async index(req, res) {
    const { page, perPage, status, search, scoringType, universityId, semesterId } = req.query
    const result = await GetChallengesService.call({ page, perPage, status, search, scoringType, universityId, semesterId })
    return res.status(200).json({
      data: AdminChallengeSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async create(req, res) {
    const { title, description, scoringType, durationMinutes, specialDurationMinutes, totalQuestions, basePointsPerCorrect, timeBonusPool, timeBonusMultiplier, maxSpecialPerSession, status, startAt, endAt, tagIds } = req.body
    const challenge = await CreateChallengeService.call({
      title, description, scoringType, durationMinutes, specialDurationMinutes, totalQuestions,
      basePointsPerCorrect, timeBonusPool, timeBonusMultiplier, maxSpecialPerSession,
      status, startAt, endAt, createdBy: req.user.id, tagIds,
    })
    return res.status(201).json({ data: AdminChallengeSerializer.serialize(challenge) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, scoringType, durationMinutes, specialDurationMinutes, totalQuestions, basePointsPerCorrect, timeBonusPool, timeBonusMultiplier, maxSpecialPerSession, status, startAt, endAt, tagIds } = req.body
    const challenge = await UpdateChallengeService.call({
      uniqueId, title, description, scoringType, durationMinutes, specialDurationMinutes, totalQuestions,
      basePointsPerCorrect, timeBonusPool, timeBonusMultiplier, maxSpecialPerSession,
      status, startAt, endAt, tagIds,
    })
    return res.status(200).json({ data: AdminChallengeSerializer.serialize(challenge) })
  }

  async destroy(req, res) {
    const { uniqueId } = req.params
    await DeleteChallengeService.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }

  async indexQuestions(req, res) {
    const { uniqueId } = req.params
    const { page, perPage } = req.query
    const result = await GetQuestionsService.call({ challengeUniqueId: uniqueId, page, perPage })
    return res.status(200).json({
      data: AdminChallengeSerializer.serializeQuestionList(result.data),
      pagination: result.pagination,
    })
  }

  async createQuestion(req, res) {
    const { uniqueId } = req.params
    const { question, options, correctOptionIndex, explanation, order, isSpecial, questionImageBlobId, optionImageBlobIds } = req.body
    const q = await CreateQuestionService.call({
      challengeUniqueId: uniqueId, question, options, correctOptionIndex, explanation, order,
      isSpecial, questionImageBlobId, optionImageBlobIds,
    })
    return res.status(201).json({ data: AdminChallengeSerializer.serializeQuestion(q) })
  }

  async updateQuestion(req, res) {
    const { questionUniqueId } = req.params
    const { question, options, correctOptionIndex, explanation, order, isSpecial, questionImageBlobId, optionImageBlobIds } = req.body
    const q = await UpdateQuestionService.call({
      uniqueId: questionUniqueId, question, options, correctOptionIndex, explanation, order,
      isSpecial, questionImageBlobId, optionImageBlobIds,
    })
    return res.status(200).json({ data: AdminChallengeSerializer.serializeQuestion(q) })
  }

  async destroyQuestion(req, res) {
    const { questionUniqueId } = req.params
    await DeleteQuestionService.call(questionUniqueId)
    return res.status(200).json({ data: { success: true } })
  }

  async indexBadges(req, res) {
    const { uniqueId } = req.params
    const badges = await GetBadgesService.call(uniqueId)
    return res.status(200).json({ data: AdminChallengeSerializer.serializeBadgeList(badges) })
  }

  async createBadge(req, res) {
    const { uniqueId } = req.params
    const { name, description, minRank, maxRank, imageBlobId } = req.body
    const badge = await CreateBadgeService.call({ challengeUniqueId: uniqueId, name, description, minRank, maxRank, imageBlobId })
    return res.status(201).json({ data: AdminChallengeSerializer.serializeBadge(badge) })
  }

  async updateBadge(req, res) {
    const { badgeUniqueId } = req.params
    const { name, description, minRank, maxRank, imageBlobId } = req.body
    const badge = await UpdateBadgeService.call({ uniqueId: badgeUniqueId, name, description, minRank, maxRank, imageBlobId })
    return res.status(200).json({ data: AdminChallengeSerializer.serializeBadge(badge) })
  }

  async destroyBadge(req, res) {
    const { badgeUniqueId } = req.params
    await DeleteBadgeService.call(badgeUniqueId)
    return res.status(200).json({ data: { success: true } })
  }

  async leaderboard(req, res) {
    const { uniqueId } = req.params
    const { page, perPage } = req.query
    const result = await GetAdminLeaderboardService.call({ challengeUniqueId: uniqueId, page, perPage })
    return res.status(200).json({
      data: result.data,
      pagination: result.pagination,
    })
  }
}

export default new AdminChallengeController()
