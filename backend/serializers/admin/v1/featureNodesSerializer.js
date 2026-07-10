import { toJakartaISO } from '#utils/dateUtils'

export class FeatureNodesSerializer {
  static serialize(node) {
    return {
      id: node.id,
      name: node.name,
      slug: node.slug,
      parentId: node.parent_id,
      parentName: node.parent?.name ?? null,
      nodeType: node.node_type,
      createdAt: toJakartaISO(node.created_at),
      updatedAt: toJakartaISO(node.updated_at),
    }
  }

  static serializeList(nodes) {
    return nodes.map(this.serialize)
  }
}
