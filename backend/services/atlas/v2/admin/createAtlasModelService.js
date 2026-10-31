import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { CreateAtlasModelService } from '#services/atlas/admin/createAtlasModelService'
import { AssignAtlasToNodeService } from '#services/atlas/v2/admin/assignAtlasToNodeService'

export class CreateAtlasModelV2Service extends BaseService {
  static async call({ nodeId, title, description, embedUrl, tags, status, editorContent, createdBy }) {
    if (!nodeId) throw new ValidationError('Node ID wajib diisi')

    const parsedNodeId = parseInt(nodeId)
    // Checked before the model is created so a bad nodeId can't leave an orphan model behind.
    const node = await prisma.feature_nodes.findUnique({ where: { id: parsedNodeId } })
    if (!node) throw new ValidationError('Modul tidak ditemukan')

    const model = await CreateAtlasModelService.call({
      title,
      description,
      embedUrl,
      tags,
      status: status || 'published',
      version: 2,
      createdBy,
      editorContent,
    })

    // Linking goes through the assign path so a freshly created model gets its append
    // `order` and bumps the node's `3d_atlas` statistic — both of which a bare
    // feature_node_records.create() silently skipped.
    await AssignAtlasToNodeService.call({ uniqueId: model.unique_id, nodeId: parsedNodeId })

    return model
  }
}
