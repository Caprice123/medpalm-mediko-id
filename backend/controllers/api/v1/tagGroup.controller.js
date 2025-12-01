import { GetTagGroupsService } from '../../../services/tagGroup/getTagGroupsService.js'

class TagGroupController {
  /**
   * Get all tag groups
   * GET /api/v1/tag-groups
   */
  async index(req, res) {
    const tagGroups = await GetTagGroupsService.call()

    return res.status(200).json({
      success: true,
      data: tagGroups
    })
  }
}

export default new TagGroupController()
