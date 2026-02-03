import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class CreateRubricService extends BaseService {
  static async call({ name, content }) {
    if (!name || !name.trim()) {
      throw new ValidationError('Rubric name is required')
    }

    if (!content || !content.trim()) {
      throw new ValidationError('Rubric content is required')
    }

    // Check if rubric with same name already exists
    const existingRubric = await prisma.osce_rubrics.findUnique({
      where: { name: name.trim() },
    })

    if (existingRubric) {
      throw new ValidationError('Rubric with this name already exists')
    }

    const rubric = await prisma.osce_rubrics.create({
      data: {
        name: name.trim(),
        content: content.trim(),
      },
    })

    return rubric
  }
}
