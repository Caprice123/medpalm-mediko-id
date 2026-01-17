import { CreateOsceObservationService } from '#services/osce/admin/createOsceObservationService'
import { GetOsceObservationsService } from '#services/osce/admin/getOsceObservationsService'
import { UpdateOsceObservationService } from '#services/osce/admin/updateOsceObservationService'
import { OsceObservationGroupSerializer } from '#serializers/admin/v1/osceObservationGroupSerializer'
import { OsceObservationSerializer } from '#serializers/admin/v1/osceObservationSerializer'

class ObservationController {
  async index(req, res) {
    const groups = await GetOsceObservationsService.call()

    return res.status(200).json({
      data: groups.map(g => OsceObservationGroupSerializer.serialize(g))
    })
  }

  async create(req, res) {
    const {
      name,
      groupId,
      order
    } = req.body

    const observation = await CreateOsceObservationService.call({
      name,
      groupId,
      order
    })

    return res.status(201).json({
      data: OsceObservationSerializer.serialize(observation),
    })
  }

  async update(req, res) {
    const { id } = req.params
    const {
      name,
      groupId,
      order
    } = req.body

    const updatedObservation = await UpdateOsceObservationService.call(id, {
      name,
      groupId,
      order
    })

    return res.status(200).json({
      data: OsceObservationSerializer.serialize(updatedObservation),
    })
  }
}

export default new ObservationController()
