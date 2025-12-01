import { ValidationUtils } from '../../../utils/validationUtils.js'
import { GetTagGroupsService } from '../../../services/tagGroup/getTagGroupsService.js'
import { TagGroupSerializer } from '../../../serializers/admin/v1/tagGroupSerializer.js'

class TagGroupsController {
  async index(req, res) {
    ValidationUtils.validate_fields({
        request: req,
        requiredFields: [],
        optionalFields: ["name"]
    })

    // Parse name parameter - if it's a comma-separated string, convert to array
    const filters = {}
    if (req.query.name) {
      if (req.query.name.includes(',')) {
        filters.name = req.query.name.split(',').map(n => n.trim())
      } else {
        filters.name = req.query.name
      }
    }

    const tagGroups = await GetTagGroupsService.call(filters)

    res.status(200).json({
      data: TagGroupSerializer.serialize(tagGroups),
    })
  }
}

export default new TagGroupsController()
