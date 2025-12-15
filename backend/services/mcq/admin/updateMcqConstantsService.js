import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class UpdateMcqConstantsService extends BaseService {
  static async call({ constants }) {
    if (!constants || Object.keys(constants).length === 0) {
      throw new ValidationError('No constants provided')
    }

    // Validate all values are strings
    Object.entries(constants).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        throw new ValidationError(`Value for key "${key}" must be a string`)
      }
    })

    // Update or create constants
    const updates = Object.entries(constants).map(([key, value]) =>
      prisma.constants.upsert({
        where: { key },
        update: {
          value,
          updated_at: new Date()
        },
        create: {
          key,
          value,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )

    await Promise.all(updates)

    return { success: true }
  }
}
