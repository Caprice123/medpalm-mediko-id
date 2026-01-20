import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetRubricService extends BaseService {
  static async call(rubricId) {
    if (!rubricId) {
      throw new Error('Rubric ID is required')
    }

    const rubric = await prisma.osce_rubrics.findUnique({
      where: { id: rubricId },
    })

    if (!rubric) {
      throw new Error('Rubric not found')
    }

    return rubric
  }
}
