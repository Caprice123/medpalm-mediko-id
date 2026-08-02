import { SubmitMcqAnswerService } from '#services/mcq/v2/user/submitMcqAnswerService'

class AnswerController {
  async create(req, res) {
    const userId = req.user.id
    const { questionId } = req.body
    await SubmitMcqAnswerService.call({ userId, questionId })
    res.json({ success: true })
  }
}

export default new AnswerController()
