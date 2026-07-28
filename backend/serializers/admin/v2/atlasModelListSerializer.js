import moment from 'moment-timezone'

export class AtlasModelListSerializer {
  static serialize(models) {
    return models.map(model => ({
      id: model.id,
      uniqueId: model.unique_id,
      title: model.title,
      description: model.description,
      embedUrl: model.embed_url,
      editorContent: model.editor_content ? JSON.parse(model.editor_content) : null,
      status: model.status,
      version: model.version ?? 1,
      createdAt: model.created_at
        ? moment(model.created_at).tz('Asia/Jakarta').toISOString()
        : null,
    }))
  }
}
