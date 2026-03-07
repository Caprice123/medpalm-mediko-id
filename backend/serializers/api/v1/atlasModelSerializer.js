export class AtlasModelSerializer {
  static serialize(model) {
    const modelTags = model.atlas_model_tags || []

    return {
      id: model.id,
      uniqueId: model.unique_id,
      title: model.title,
      description: model.description,
      embedUrl: model.embed_url,
      editorContent: model.editor_content ? JSON.parse(model.editor_content) : null,
      tags: modelTags.map(tag => ({
        id: tag.tags.id,
        name: tag.tags.name,
        tagGroupId: tag.tags.tag_group_id,
        tagGroupName: tag.tags.tag_group?.name || null
      }))
    }
  }
}
