import { toJakartaISO } from '#utils/dateUtils'

export class FeatureNodeRecordsSerializer {
  static serialize(record) {
    return {
      id: record.id,
      nodeId: record.node_id,
      nodeName: record.node?.name ?? null,
      nodeSlug: record.node?.slug ?? null,
      nodeType: record.node?.node_type ?? null,
      recordType: record.record_type,
      recordId: record.record_id,
      createdAt: toJakartaISO(record.created_at),
    }
  }

  static serializeList(records) {
    return records.map(this.serialize)
  }
}
