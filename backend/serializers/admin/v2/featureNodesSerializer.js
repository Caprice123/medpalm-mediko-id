import { toJakartaISO } from '#utils/dateUtils'

export class FeatureNodesV2Serializer {
  static serialize(node) {
    const statsMap = {}
    for (const stat of (node.node_statistics ?? [])) {
      statsMap[stat.record_type] = stat.total_count
    }

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
      atlasCount: statsMap['3d_atlas'] ?? 0,
      quizCount: statsMap['anatomy_quiz'] ?? 0,
      createdAt: toJakartaISO(node.created_at),
      updatedAt: toJakartaISO(node.updated_at),
    }
  }

  static serializeList(nodes) {
    return nodes.map(n => this.serialize(n))
  }
}
