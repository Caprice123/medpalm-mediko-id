import prisma from '#prisma/client'
import { GetFeatureNodesService } from '#services/flashcard/v2-1/admin/getFeatureNodesService'
import { CreateFeatureNodeService } from '#services/flashcard/v2-1/admin/createFeatureNodeService'
import { UpdateFeatureNodeService } from '#services/flashcard/v2-1/admin/updateFeatureNodeService'
import { DeleteFeatureNodeService } from '#services/flashcard/v2-1/admin/deleteFeatureNodeService'
import { SwapNodeOrderService } from '#services/featureNodes/admin/swapNodeOrderService'
import { FeatureNodesSerializer } from '#serializers/admin/v1/featureNodesSerializer'
import attachmentService from '#services/attachment/attachmentService'

async function buildHasVideoSet(nodeIds) {
  if (!nodeIds.length) return new Set()
  const atts = await prisma.attachments.findMany({
    where: { record_type: 'feature_node', record_id: { in: nodeIds }, name: 'video' },
    select: { record_id: true },
  })
  return new Set(atts.map(a => a.record_id))
}

class FeatureNodesController {
  async index(req, res) {
    const { search, nodeType, parentId, layer, visibility, classification, sortBy, page, perPage } = req.query
    const { nodes, pagination } = await GetFeatureNodesService.call({
      search,
      nodeType,
      parentId: parentId === 'null' ? null : parentId,
      layer,
      visibility,
      classification,
      sortBy,
      page,
      perPage,
    })
    return res.status(200).json({
      data: FeatureNodesSerializer.serializeList(nodes),
      ...(pagination ? { pagination } : {}),
    })
  }

  async show(req, res) {
    const { id } = req.params
    const node = await prisma.feature_nodes.findUnique({
      where: { id: parseInt(id) },
      include: { parent: true, _count: { select: { children: true } } },
    })
    if (!node) return res.status(404).json({ message: 'Node tidak ditemukan' })
    const att = await attachmentService.getAttachmentWithUrl('feature_node', node.id, 'video', 7 * 24 * 60 * 60)
    const hasVideo = !!att
    const videoMeta = att ? { url: att.url, filename: att.blob?.filename ?? null, byteSize: att.blob?.byte_size ?? null } : null
    return res.status(200).json({ data: FeatureNodesSerializer.serialize(node, hasVideo, videoMeta) })
  }

  async create(req, res) {
    const { name, slug, parentId, nodeType, visibility, classification, layer, icon, description, videoBlobId, videoExplanation } = req.body
    const node = await CreateFeatureNodeService.call({ name, slug, parentId, nodeType, visibility, classification, layer, icon, description, videoBlobId, videoExplanation })
    return res.status(201).json({ data: FeatureNodesSerializer.serialize(node, !!videoBlobId) })
  }

  async update(req, res) {
    const { id } = req.params
    const { name, slug, parentId, nodeType, visibility, classification, layer, icon, description, videoBlobId, videoExplanation } = req.body
    const node = await UpdateFeatureNodeService.call({ id, name, slug, parentId, nodeType, visibility, classification, layer, icon, description, videoBlobId, videoExplanation })
    const hasVideoSet = await buildHasVideoSet([node.id])
    return res.status(200).json({ data: FeatureNodesSerializer.serialize(node, hasVideoSet.has(node.id)) })
  }

  async delete(req, res) {
    const { id } = req.params
    await DeleteFeatureNodeService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }

  async swapOrder(req, res) {
    const { id } = req.params
    const { withNodeId } = req.body
    await SwapNodeOrderService.call({ nodeId: parseInt(id), withNodeId: parseInt(withNodeId) })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new FeatureNodesController()
