import { GetRubricsService } from '#services/osce/admin/rubric/getRubricsService'
import { CreateRubricService } from '#services/osce/admin/rubric/createRubricService'
import { GetRubricService } from '#services/osce/admin/rubric/getRubricService'
import { UpdateRubricService } from '#services/osce/admin/rubric/updateRubricService'
import { RubricSerializer } from '#serializers/admin/v1/rubricSerializer'
import { RubricListSerializer } from '#serializers/admin/v1/rubricListSerializer'

class RubricsController {
  async index(req, res) {
    const { name } = req.query

    const result = await GetRubricsService.call({
        name
    })

    const serializedRubrics = RubricListSerializer.serialize(result.rubrics)

    return res.status(200).json({
      data: serializedRubrics,
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

    const serializedRubric = RubricSerializer.serialize(rubric)

    return res.status(201).json({
      data: serializedRubric,
    })
  }

  async show(req, res) {
    const { rubricId } = req.params

    const rubric = await GetRubricService.call(rubricId)

    const serializedRubric = RubricSerializer.serialize(rubric)

    return res.status(200).json({
      data: serializedRubric
    })
  }

  async update(req, res) {
    const { rubricId } = req.params
    const {
      name,
      content
    } = req.body

    const updatedRubric = await UpdateRubricService.call(rubricId, {
      name,
      content
    })

    const serializedRubric = RubricSerializer.serialize(updatedRubric)

    return res.status(200).json({
      data: serializedRubric,
    })
  }
}

export default new RubricsController()
