import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import bunnyStreamService from '#services/bunnyStream.service'
import IDriveService from '#services/idrive.service'

// Content types that count as "this subtopic/topic has data" for the shared Materi/TopicHub
// tree — deliberately excludes diagnostic_question, which lives under a separate visibility.
const ANY_CONTENT_RECORD_TYPES = ['flashcard_card', 'mcq_question', 'summary_note', '3d_atlas', 'anatomy_quiz']

function buildContentFilter(hasContent, layer) {
  if (!(hasContent === true || hasContent === 'true')) return {}
  const parsedLayer = parseInt(layer)
  if (parsedLayer === 2) {
    return { node_statistics: { some: { record_type: { in: ANY_CONTENT_RECORD_TYPES }, total_count: { gt: 0 } } } }
  }
  if (parsedLayer === 1) {
    return {
      children: {
        some: {
          layer: 2,
          node_statistics: { some: { record_type: { in: ANY_CONTENT_RECORD_TYPES }, total_count: { gt: 0 } } },
        },
      },
    }
  }
  return {}
}

function buildNodeFilter({ nodeType, visibility, classification, layer, hasContent }) {
  const where = {}
  if (nodeType) where.node_type = nodeType
  if (visibility) where.visibility = visibility
  if (classification) where.classification = classification
  if (layer !== undefined && layer !== '') where.layer = parseInt(layer)
  Object.assign(where, buildContentFilter(hasContent, layer))
  return where
}

export class GetUserFeatureNodesService extends BaseService {
  static async call({ id, name, nodeType, parentId, parentSlug, slug, visibility, classification, layer, hasContent, includeAdjacent, page = 1, perPage = 30, username = null } = {}) {
    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 30))
    const skip = (currentPage - 1) * currentPerPage
    const take = currentPerPage + 1

    const where = buildNodeFilter({ nodeType, visibility, classification, layer, hasContent })
    if (id) where.id = parseInt(id)
    if (name) where.name = name
    if (slug) where.slug = slug

    if (parentSlug) {
      const parent = await prisma.feature_nodes.findUnique({ where: { slug: parentSlug } })
      where.parent_id = parent ? parent.id : -1
    } else if (parentId !== undefined) {
      where.parent_id = parentId === null ? null : parseInt(parentId)
    }

    const nodes = await prisma.feature_nodes.findMany({
      where,
      include: { parent: true },
      orderBy: [{ order: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
      skip,
      take,
    })

    const isLastPage = nodes.length <= currentPerPage
    const data = nodes.slice(0, currentPerPage)

    return {
      data,
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
      videoEmbedUrlMap: await this.buildVideoEmbedUrlMap(data, username),
      adjacentMap: (includeAdjacent === true || includeAdjacent === 'true')
        ? await this.buildAdjacentMap(data, { nodeType, visibility, classification, layer, hasContent })
        : {},
    }
  }

  // Prev/next sibling (closest by `order`, nulls excluded) for each node, keyed by node id.
  // Reuses the exact same filter the list query itself was built with (nodeType, visibility,
  // classification, hasContent) — so prev/next only ever point at a sibling the student could
  // have actually seen in that same filtered list — plus order gt/lt (with closest-first sort,
  // not exact order±1) so it still finds the right neighbor even if the sequence has a gap.
  static async buildAdjacentMap(nodes, siblingFilters = {}) {
    const baseWhere = buildNodeFilter(siblingFilters)
    const adjacentMap = {}

    await Promise.all(nodes.map(async (node) => {
      if (node.order === null) return
      const [prevNode, nextNode] = await Promise.all([
        prisma.feature_nodes.findFirst({
          where: { ...baseWhere, parent_id: node.parent_id, order: { lt: node.order } },
          orderBy: { order: 'desc' },
          select: { slug: true, name: true },
        }),
        prisma.feature_nodes.findFirst({
          where: { ...baseWhere, parent_id: node.parent_id, order: { gt: node.order } },
          orderBy: { order: 'asc' },
          select: { slug: true, name: true },
        }),
      ])
      adjacentMap[node.id] = { prev: prevNode ?? null, next: nextNode ?? null }
    }))
    return adjacentMap
  }

  // Bulk-fetch video attachments for all nodes in one query
  static async buildVideoEmbedUrlMap(nodes, username = null) {
    const nodeIds = nodes.map(n => n.id)
    if (!nodeIds.length) return {}

    const videoAttachments = await prisma.attachments.findMany({
      where: { record_type: 'feature_node', record_id: { in: nodeIds }, name: 'video' },
      include: { blob: true },
    })

    const videoEmbedUrlMap = {}
    await Promise.all(videoAttachments.map(async (att) => {
      if (!att.blob) return
      if (att.blob.provider === 'bunny_stream') {
        videoEmbedUrlMap[att.record_id] = bunnyStreamService.embedUrl(att.blob.key, { autoplay: process.env.NODE_ENV === 'production', context: username })
      } else {
        videoEmbedUrlMap[att.record_id] = await IDriveService.getSignedUrl(att.blob.key, 7 * 24 * 60 * 60)
      }
    }))
    return videoEmbedUrlMap
  }
}
