import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteRubricService extends BaseService {
  static async call(rubricId) {
    if (!rubricId) {
      throw new ValidationError('Rubric ID is required')
    }

    // Check if rubric exists
    const existingRubric = await prisma.osce_rubrics.findUnique({
      where: { id: rubricId },
    })

    if (!existingRubric) {
      throw new ValidationError('Rubric not found')
    }

    // Check if rubric is being used by any topics
    const topicsCount = await prisma.osce_topics.count({
      where: { osce_rubric_id: rubricId },
    })

    if (topicsCount > 0) {
      throw new ValidationError(`Cannot delete rubric. It is currently used by ${topicsCount} topic(s)`)
    }

    await prisma.osce_rubrics.delete({
      where: { id: rubricId },
    })

    return { success: true }
  }
}
