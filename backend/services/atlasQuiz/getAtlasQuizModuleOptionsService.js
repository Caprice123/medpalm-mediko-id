import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetAtlasQuizModuleOptionsService extends BaseService {
  static async call({ slug, page = 1, perPage = 50 }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic) throw new ValidationError('Topik tidak ditemukan')

    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(50, Math.max(1, parseInt(perPage) || 50))
    const skip = (currentPage - 1) * currentPerPage

    const rows = await prisma.feature_nodes.findMany({
      where: {
        parent_id: topic.id,
        layer: 2,
        node_type: 'module',
        node_statistics: { some: { record_type: { in: ['3d_atlas', 'anatomy_quiz'] }, total_count: { gt: 0 } } },
      },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
      skip,
      take: currentPerPage + 1,
    })

    const isLastPage = rows.length <= currentPerPage
    const modules = rows.slice(0, currentPerPage).map(m => ({ id: m.id, name: m.name }))

    return { modules, pagination: { page: currentPage, perPage: currentPerPage, isLastPage } }
  }
}
