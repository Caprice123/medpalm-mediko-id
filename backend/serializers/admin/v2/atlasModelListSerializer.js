import moment from 'moment-timezone'

// Row shape for atlas model lists. Deliberately omits `editorContent`: it is a whole
// BlockNote document per row, and no list renders it. The edit form fetches it from the
// show endpoint instead.

export class AtlasModelListSerializer {
  static serialize(models) {
    return models.map(model => ({
      id: model.id,
      uniqueId: model.unique_id,
      title: model.title,
      description: model.description,
      embedUrl: model.embed_url,
      status: model.status,
      version: model.version ?? 1,
      createdAt: model.created_at
        ? moment(model.created_at).tz('Asia/Jakarta').toISOString()
        : null,
    }))
  }
}
