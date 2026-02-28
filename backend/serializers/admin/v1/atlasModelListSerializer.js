import moment from 'moment-timezone'

export class AtlasModelListSerializer {
  static serialize(models) {
    return models.map(model => {
      const allTags = (model.atlas_model_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupName: t.tags.tag_group?.name || null
      }))

      const topicTags = allTags.filter(tag => tag.tagGroupName === 'atlas_topic')
      const subtopicTags = allTags.filter(tag => tag.tagGroupName === 'atlas_subtopic')

      return {
        id: model.id,
        uniqueId: model.unique_id,
        title: model.title,
        description: model.description,
        embedUrl: model.embed_url,
        status: model.status,
        topicTags,
        subtopicTags,
        createdAt: model.created_at
          ? moment(model.created_at).tz('Asia/Jakarta').toISOString()
          : null
      }
    })
  }
}
