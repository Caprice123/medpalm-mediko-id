import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteAtlasModelService extends BaseService {
  static async call(modelId) {
    this.validate(modelId)

    const model = await prisma.atlas_models.findUnique({
      where: { unique_id: modelId }
    })

    if (!model) {
      throw new ValidationError('Atlas model not found')
    }

    await prisma.$executeRaw`DELETE FROM atlas_models WHERE id = ${model.id}`
  }

  static validate(modelId) {
    if (!modelId || typeof modelId !== 'string') {
      throw new ValidationError('Model ID is required')
    }
  }
}
