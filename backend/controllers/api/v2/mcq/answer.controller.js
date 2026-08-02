import { SubmitMcqAnswerService } from '#services/mcq/v2/user/submitMcqAnswerService'

class AnswerController {
  async create(req, res) {
    const userId = req.user.id
    const { questionId } = req.body
    const result = await SubmitMcqAnswerService.call({ userId, questionId })
    return res.status(200).json({ data: result })
  }
}

export default new AnswerController()
