import { GetEmbeddingsService } from '#services/embedding/getEmbeddingsService'

class EmbeddingsController {
  async index(req, res) {
    const { page, perPage } = req.query
    const result = await GetEmbeddingsService.call({
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 20,
    })
    return res.status(200).json({ data: result.data, pagination: result.pagination })
  }

  async show(req, res) {
    const { id } = req.params
    const embedding = await GetEmbeddingsService.getById(id)
    return res.status(200).json({ data: embedding })
  }
}

export default new EmbeddingsController()
