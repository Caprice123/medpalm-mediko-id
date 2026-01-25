import { CreateOsceObservationGroupService } from '#services/osce/admin/createOsceObservationGroupService'
import { UpdateOsceObservationGroupService } from '#services/osce/admin/updateOsceObservationGroupService'
import { OsceObservationGroupSerializer } from '#serializers/admin/v1/osceObservationGroupSerializer'

class ObservationGroupController {
  async create(req, res) {
    const { name } = req.body

    const group = await CreateOsceObservationGroupService.call({
      name,
    })

    return res.status(201).json({
      data: OsceObservationGroupSerializer.serialize(group),
    })
  }

  async update(req, res) {
    const { id } = req.params
    const { name } = req.body

    const updatedGroup = await UpdateOsceObservationGroupService.call(id, {
      name,
    })

    return res.status(200).json({
      data: OsceObservationGroupSerializer.serialize(updatedGroup),
    })
  }
}

export default new ObservationGroupController()
