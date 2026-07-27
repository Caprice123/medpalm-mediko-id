import { toJakartaISO } from '#utils/dateUtils'

export class UserFeatureNodesSerializer {
  static serialize(node, videoEmbedUrl = null) {
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
      createdAt: toJakartaISO(node.created_at),
      updatedAt: toJakartaISO(node.updated_at),
    }
  }

  static serializeList(nodes, videoEmbedUrlMap = {}) {
    return nodes.map(n => this.serialize(n, videoEmbedUrlMap[n.id] ?? null))
  }
}
