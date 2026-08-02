import { GetNodeAnatomyQuizzesService } from '#services/featureNodes/user/getNodeAnatomyQuizzesService'

class AnatomyQuizzesController {
  async nodeAnatomyQuizzes(req, res) {
    const data = await GetNodeAnatomyQuizzesService.call({ nodeId: req.params.id })
    return res.json({ data })
  }
}

export default new AnatomyQuizzesController()
