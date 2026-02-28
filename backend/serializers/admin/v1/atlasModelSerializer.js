export class AtlasModelSerializer {
  static serialize(model) {
    const modelTags = model.atlas_model_tags || []

    return {
      id: model.id,
      uniqueId: model.unique_id,
      title: model.title,
      description: model.description,
      embedUrl: model.embed_url,
      status: model.status,
      tags: modelTags.map(tag => ({
        id: tag.tags ? tag.tags.id : tag.id,
        name: tag.tags ? tag.tags.name : tag.name,
        tagGroupId: tag.tags ? tag.tags.tag_group_id : tag.tagGroupId
      }))
    }
  }
}
