import { GetFeatureNodesService } from '#services/featureNodes/admin/getFeatureNodesService'
import { CreateFeatureNodeService } from '#services/featureNodes/admin/createFeatureNodeService'
import { UpdateFeatureNodeService } from '#services/featureNodes/admin/updateFeatureNodeService'
import { DeleteFeatureNodeService } from '#services/featureNodes/admin/deleteFeatureNodeService'
import { GetFeatureNodeRecordsService } from '#services/featureNodes/admin/getFeatureNodeRecordsService'
import { CreateFeatureNodeRecordService } from '#services/featureNodes/admin/createFeatureNodeRecordService'
import { DeleteFeatureNodeRecordService } from '#services/featureNodes/admin/deleteFeatureNodeRecordService'
import { AutoLinkFlashcardDecksService } from '#services/featureNodes/admin/autoLinkFlashcardDecksService'
import { FeatureNodesSerializer } from '#serializers/admin/v1/featureNodesSerializer'
import { FeatureNodeRecordsSerializer } from '#serializers/admin/v1/featureNodeRecordsSerializer'

class FeatureNodesController {
  async index(req, res) {
    const { search, nodeType, parentId } = req.query
    const nodes = await GetFeatureNodesService.call({
      search,
      nodeType,
      parentId: parentId === 'null' ? null : parentId,
    })
    return res.status(200).json({ data: FeatureNodesSerializer.serializeList(nodes) })
  }

  async create(req, res) {
    const { name, slug, parentId, nodeType } = req.body
    const node = await CreateFeatureNodeService.call({ name, slug, parentId, nodeType })
    return res.status(201).json({ data: FeatureNodesSerializer.serialize(node) })
  }

  async update(req, res) {
    const { id } = req.params
    const { name, slug, parentId, nodeType } = req.body
    const node = await UpdateFeatureNodeService.call({ id, name, slug, parentId, nodeType })
    return res.status(200).json({ data: FeatureNodesSerializer.serialize(node) })
  }

  async delete(req, res) {
    const { id } = req.params
    await DeleteFeatureNodeService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }

  // Records
  async getRecords(req, res) {
    const { recordType, recordId } = req.query
    const records = await GetFeatureNodeRecordsService.call({ recordType, recordId })
    return res.status(200).json({ data: FeatureNodeRecordsSerializer.serializeList(records) })
  }

  async createRecord(req, res) {
    const { nodeId, recordType, recordId } = req.body
    const record = await CreateFeatureNodeRecordService.call({ nodeId, recordType, recordId })
    return res.status(201).json({ data: FeatureNodeRecordsSerializer.serialize(record) })
  }

  async deleteRecord(req, res) {
    const { id } = req.params
    await DeleteFeatureNodeRecordService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }

  async autoLinkFlashcardDecks(req, res) {
    const result = await AutoLinkFlashcardDecksService.call()
    return res.status(200).json({ data: result })
  }
}

export default new FeatureNodesController()
