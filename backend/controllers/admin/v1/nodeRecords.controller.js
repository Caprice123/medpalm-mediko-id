import { CreateNodeRecordService } from '#services/featureNodes/admin/createNodeRecordService'

class NodeRecordsController {
  async create(req, res) {
    const { nodeId, recordType, recordId } = req.body
    const record = await CreateNodeRecordService.call({ nodeId, recordType, recordId })
    return res.status(201).json({
      data: { id: record.id, nodeId: record.node_id, recordType: record.record_type, recordId: record.record_id },
    })
  }
}

export default new NodeRecordsController()
