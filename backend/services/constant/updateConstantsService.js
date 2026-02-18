import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateConstantsService extends BaseService {
  static async call(constants) {
    // Validate that constants is an object
    if (!constants || typeof constants !== 'object') {
      throw new ValidationError('Constants must be an object')
    }

    const updates = []

    // Prepare upsert operations for each constant
    for (const [key, value] of Object.entries(constants)) {
      if (typeof value !== 'string') {
        throw new ValidationError(`Value for key "${key}" must be a string`)
      }

      updates.push(
        prisma.constants.upsert({
          where: { key },
          update: { value, updated_at: new Date() },
          create: { key, value }
        })
      )
    }

    // Execute all updates in a transaction
    const result = await prisma.$transaction(updates)

    // Return updated constants as key-value object
    const updated = {}
    result.forEach(constant => {
      updated[constant.key] = constant.value
    })

    return updated
  }
}
