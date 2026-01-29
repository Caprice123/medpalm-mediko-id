import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetConstantsService extends BaseService {
  static async call(keys = null) {
    const where = {}

    // If keys array is provided, filter by those keys
    if (keys && Array.isArray(keys) && keys.length > 0) {
      where.key = { in: keys }
    }

    const constants = await prisma.constants.findMany({
      where,
    })

    // Transform to key-value object
    const result = {}
    constants.forEach(constant => {
      result[constant.key] = constant.value
    })
    console.log(result)

    return result
  }
}
