import moment from 'moment-timezone'

// Detail shape for one atlas model: everything the V2 admin edit form needs, including
// the heavy fields the list serializer deliberately leaves out (`editorContent`).
// No tags — V2 content is organised by the feature_nodes tree, not by tag.
export class AtlasModelSerializer {
  static serialize(model) {
    return {
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
    }
  }
}
