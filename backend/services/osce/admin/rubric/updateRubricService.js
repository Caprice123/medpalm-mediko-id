import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateRubricService extends BaseService {
  static async call(rubricId, { name, content }) {
    if (!rubricId) {
      throw new ValidationError('Rubric ID is required')
    }

    // Check if rubric exists
    const existingRubric = await prisma.osce_rubrics.findUnique({
      where: { id: parseInt(rubricId) },
    })

    if (!existingRubric) {
      throw new ValidationError('Rubric not found')
    }

    // If name is being changed, check for uniqueness
    if (name && name.trim() !== existingRubric.name) {
      const duplicateRubric = await prisma.osce_rubrics.findUnique({
        where: { name: name.trim() },
      })

      if (duplicateRubric) {
        throw new ValidationError('Rubric with this name already exists')
      }
    }

    // Build update data
    const updateData = {}
    if (name && name.trim()) {
      updateData.name = name.trim()
    }
    if (content && content.trim()) {
      updateData.content = content.trim()
    }
    updateData.updated_at = new Date()

    const rubric = await prisma.osce_rubrics.update({
      where: { id: parseInt(rubricId) },
      data: updateData,
    })

    return rubric
  }
}
