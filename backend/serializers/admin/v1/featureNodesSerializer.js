import { toJakartaISO } from '#utils/dateUtils'

export class FeatureNodesSerializer {
  static serialize(node, hasVideo = false, videoMeta = null) {
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
      order: node.order ?? null,
      icon: node.icon ?? null,
      description: node.description ?? null,
      hasVideo,
      videoUrl: videoMeta?.url ?? null,
      videoFilename: videoMeta?.filename ?? null,
      videoByteSize: videoMeta?.byteSize ?? null,
      videoExplanation: node.video_explanation ?? null,
      createdAt: toJakartaISO(node.created_at),
      updatedAt: toJakartaISO(node.updated_at),
    }
  }

  static serializeList(nodes) {
    return nodes.map(n => {
      const serialized = this.serialize(n)
      const { hasVideo, videoExplanation, ...rest } = serialized
      return rest
    })
  }
}
