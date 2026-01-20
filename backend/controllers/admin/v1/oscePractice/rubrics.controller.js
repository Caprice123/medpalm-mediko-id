import { CreateOsceTopicService } from '#services/osce/admin/createOsceTopicService'
import { GetOsceTopicsService } from '#services/osce/admin/getOsceTopicsService'
import { GetOsceTopicDetailService } from '#services/osce/admin/getOsceTopicDetailService'
import { UpdateOsceTopicService } from '#services/osce/admin/updateOsceTopicService'
import { OsceTopicSerializer } from '#serializers/admin/v1/osceTopicSerializer'
import { OsceTopicListSerializer } from '#serializers/admin/v1/osceTopicListSerializer'
import { GetRubricsService } from '#services/osce/admin/rubric/getRubricsService'
import { CreateRubricService } from '#services/osce/admin/rubric/createRubricService'
import { GetRubricService } from '#services/osce/admin/rubric/getRubricService'
import { UpdateRubricService } from '#services/osce/admin/rubric/updateRubricService'

class RubricsController {
  async index(req, res) {
    const { name } = req.query

    const result = await GetRubricsService.call({
        name
    })

    return res.status(200).json({
      data: result.rubrics,
    })
  }

  async create(req, res) {
    const {
        name,
        content
    } = req.body

    const rubric = await CreateRubricService.call({
        name,
        content
    })

    return res.status(201).json({
      data: rubric,
    })
  }

  async show(req, res) {
    const { rubricId } = req.params

    const rubric = await GetRubricService.call(rubricId)

    return res.status(200).json({
      data: rubric
    })
  }

  async update(req, res) {
    const { rubricId } = req.params
    const {
      name,
      content
    } = req.body

    const updatedTopic = await UpdateRubricService.call(rubricId, {
      name,
      content
    })

    return res.status(200).json({
      data: updatedTopic,
    })
  }
}

export default new RubricsController()
