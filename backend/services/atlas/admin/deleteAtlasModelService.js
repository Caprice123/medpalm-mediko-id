import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { decrementNodeStat } from '#utils/nodeStatisticsHelper'
import { closeOrderGap } from '#utils/nodeRecordOrderHelper'

export class DeleteAtlasModelService extends BaseService {
  static async call(modelId) {
    this.validate(modelId)

    const model = await prisma.atlas_models.findUnique({
      where: { unique_id: modelId }
    })

    if (!model) {
      throw new ValidationError('Atlas model not found')
    }

    const record = await prisma.feature_node_records.findFirst({
      where: { record_type: '3d_atlas', record_id: model.id },
    })

    await prisma.atlas_models.update({
      where: { id: model.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })

    if (record) {
      await prisma.feature_node_records.delete({ where: { id: record.id } })
      await closeOrderGap({ nodeId: record.node_id, recordType: '3d_atlas', removedOrder: record.order })
      await decrementNodeStat(record.node_id, '3d_atlas')
    }
  }

  static validate(modelId) {
    if (!modelId || typeof modelId !== 'string') {
      throw new ValidationError('Model ID is required')
    }
  }
}
