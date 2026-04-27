import { ValidationError } from '#errors/validationError'
import { AuthorizationError } from '#errors/authorizationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'

export class GetAtlasModelDetailService extends BaseService {
  static async call(modelId, { userId, userRole = 'user' } = {}) {
    this.validate(modelId)

    const model = await prisma.$transaction(async (tx) => {
      const model = await tx.atlas_models.findUnique({
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

      if (userRole === 'user' && model.status !== 'published') {
        throw new AuthorizationError('This atlas model is not available')
      }

      await checkAccessAndDeductCredit(tx, {
        userId,
        userRole,
        accessTypeKey: 'atlas_access_type',
        creditCostKey: 'atlas_model_cost',
        description: `Viewed atlas model: ${model.id} - ${model.title}`,
        featureKey: 'atlas',
      })

      return model
    })

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
