import { toJakartaISO } from '#utils/dateUtils'

export class UserFeatureNodesSerializer {
  static serialize(node, videoEmbedUrl = null, adjacent = null) {
    return {
      id: node.id,
      name: node.name,
      slug: node.slug,
      parentId: node.parent_id,
      parentName: node.parent?.name ?? null,
      nodeType: node.node_type,
      visibility: node.visibility,
      classification: node.classification,
      layer: node.layer,
      icon: node.icon ?? null,
      description: node.description ?? null,
      videoEmbedUrl,
      videoExplanation: node.video_explanation ?? null,
      prevSubtopic: adjacent?.prev ? { slug: adjacent.prev.slug, name: adjacent.prev.name } : null,
      nextSubtopic: adjacent?.next ? { slug: adjacent.next.slug, name: adjacent.next.name } : null,
      createdAt: toJakartaISO(node.created_at),
      updatedAt: toJakartaISO(node.updated_at),
    }
  }

  static serializeList(nodes, videoEmbedUrlMap = {}, adjacentMap = {}) {
    return nodes.map(n => this.serialize(n, videoEmbedUrlMap[n.id] ?? null, adjacentMap[n.id] ?? null))
  }
}
