import { ListContentRelationsService } from '#services/contentRelation/listContentRelationsService'
import { CreateContentRelationService } from '#services/contentRelation/createContentRelationService'
import { UpdateContentRelationService } from '#services/contentRelation/updateContentRelationService'
import { DeleteContentRelationService } from '#services/contentRelation/deleteContentRelationService'

class ContentRelationController {
  async index(req, res) {
    const { sourceType, sourceId } = req.query
    const relations = await ListContentRelationsService.call({ sourceType, sourceId })
    res.status(200).json({ data: relations })
  }

  async create(req, res) {
    const { sourceType, sourceId, targetType, targetId, relationType, label } = req.body
    const relation = await CreateContentRelationService.call({ sourceType, sourceId, targetType, targetId, relationType, label })
    res.status(201).json({ data: relation })
  }

  async update(req, res) {
    const { id } = req.params
    const { label } = req.body
    const relation = await UpdateContentRelationService.call({ id, label })
    res.status(200).json({ data: relation })
  }

  async destroy(req, res) {
    const { id } = req.params
    await DeleteContentRelationService.call({ id })
    res.status(200).json({ message: 'Relasi berhasil dihapus' })
  }
}

export default new ContentRelationController()
