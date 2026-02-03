import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetRubricService extends BaseService {
  static async call(rubricId) {
    if (!rubricId) {
      throw new ValidationError('Rubric ID is required')
    }

    const rubric = await prisma.osce_rubrics.findUnique({
      where: { id: Number(rubricId) },
    })

    if (!rubric) {
      throw new ValidationError('Rubric not found')
    }

    return rubric
  }
}
