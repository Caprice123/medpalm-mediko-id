import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

// Content types that count as "this subtopic/topic has data" for the shared Materi/TopicHub
// tree — deliberately excludes diagnostic_question, which lives under a separate visibility.
const ANY_CONTENT_RECORD_TYPES = ['flashcard_card', 'mcq_question', 'summary_note', '3d_atlas', 'anatomy_quiz']

export class GetUserFeatureNodesService extends BaseService {
  static async call({ id, name, nodeType, parentId, parentSlug, slug, visibility, classification, layer, hasContent, page = 1, perPage = 30 } = {}) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 30))
    const skip = (currentPage - 1) * currentPerPage
    const take = currentPerPage + 1

    const where = {}
    if (id) where.id = parseInt(id)
    if (name) where.name = name
    if (nodeType) where.node_type = nodeType
    if (visibility) where.visibility = visibility
    if (classification) where.classification = classification
    if (slug) where.slug = slug
    if (layer !== undefined && layer !== '') where.layer = parseInt(layer)

    if (hasContent === true || hasContent === 'true') {
      const parsedLayer = parseInt(layer)
      if (parsedLayer === 2) {
        where.node_statistics = { some: { record_type: { in: ANY_CONTENT_RECORD_TYPES }, total_count: { gt: 0 } } }
      } else if (parsedLayer === 1) {
        where.children = {
          some: {
            layer: 2,
            node_statistics: { some: { record_type: { in: ANY_CONTENT_RECORD_TYPES }, total_count: { gt: 0 } } },
          },
        }
      }
    }

    if (parentSlug) {
      const parent = await prisma.feature_nodes.findUnique({ where: { slug: parentSlug } })
      where.parent_id = parent ? parent.id : -1
    } else if (parentId !== undefined) {
      where.parent_id = parentId === null ? null : parseInt(parentId)
    }

    const nodes = await prisma.feature_nodes.findMany({
      where,
      include: { parent: true },
      orderBy: { name: 'asc' },
      skip,
      take,
    })

    const isLastPage = nodes.length <= currentPerPage
    return {
      data: nodes.slice(0, currentPerPage),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }
}
