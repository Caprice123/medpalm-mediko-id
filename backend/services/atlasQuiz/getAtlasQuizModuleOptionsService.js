import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetAtlasQuizModuleOptionsService extends BaseService {
  static async call({ slug }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic) throw new ValidationError('Topik tidak ditemukan')

    const modules = await prisma.feature_nodes.findMany({
      where: { parent_id: topic.id, layer: 2, node_type: 'module' },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    })

    return modules.map(m => ({ id: m.id, name: m.name }))
  }
}
