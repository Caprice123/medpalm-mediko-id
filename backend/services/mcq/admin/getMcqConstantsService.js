import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

export class GetMcqConstantsService extends BaseService {
  static async call({ keys }) {
    if (!keys || keys.length === 0) {
      return {}
    }

    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: keys
        }
      }
    })

    const result = {}
    keys.forEach(key => {
      const constant = constants.find(c => c.key === key)
      result[key] = constant ? constant.value : ''
    })

    return result
  }
}
