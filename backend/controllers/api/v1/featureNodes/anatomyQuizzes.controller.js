import { GetNodeAnatomyQuizzesService } from '#services/anatomy/v2/user/getNodeAnatomyQuizzesService'

class AnatomyQuizzesController {
  async nodeAnatomyQuizzes(req, res) {
    const data = await GetNodeAnatomyQuizzesService.call({ nodeId: req.params.id })
    return res.json({ data })
  }
}

export default new AnatomyQuizzesController()
