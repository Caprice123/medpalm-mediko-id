import { GetTagsService } from '#services/tag/getTagsService'
import { CreateTagService } from '#services/tag/createTagService'
import { UpdateTagService } from '#services/tag/updateTagService'
import { DeleteTagService } from '#services/tag/deleteTagService'

class TagController {
  /**
   * Get all tags with optional type filter
   * GET /api/v1/tags
   */
  async index(req, res) {
    const { type } = req.query

    const tags = await GetTagsService.call({ type })

    return res.status(200).json({
      data: tags
    })
  }

  /**
   * Create new tag
   * POST /api/v1/tags
   */
  async create(req, res) {
    const { name, type } = req.body

    const tag = await CreateTagService.call({ name, type })

    return res.status(201).json({
      data: tag
    })
  }

  /**
   * Update existing tag
   * PUT /api/v1/tags/:id
   */
  async update(req, res) {
    const { id } = req.params
    const { name, type } = req.body

    const tag = await UpdateTagService.call(id, { name, type })

    return res.status(200).json({
      data: tag
    })
  }

  /**
   * Delete tag (soft delete)
   * DELETE /api/v1/tags/:id
   */
  async destroy(req, res) {
    const { id } = req.params

    await DeleteTagService.call(id)

    return res.status(200).json({
      message: 'Tag deleted successfully'
    })
  }
}

export default new TagController()
