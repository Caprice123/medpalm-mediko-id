import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetAtlasModelDetailService extends BaseService {
  static async call(modelId) {
    this.validate(modelId)

    const model = await prisma.atlas_models.findUnique({
      where: { unique_id: modelId },
      include: {
        atlas_model_tags: {
          include: { tags: { include: { tag_group: true } } }
        }
      }
    })

    if (!model) {
      throw new ValidationError('Atlas model not found')
    }

    return {
      ...model,
      tags: model.atlas_model_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id,
        tagGroupName: t.tags.tag_group?.name || null
      }))
    }
  }

  static validate(modelId) {
    if (!modelId || typeof modelId !== 'string') {
      throw new ValidationError('Model ID is required')
    }
  }
}
