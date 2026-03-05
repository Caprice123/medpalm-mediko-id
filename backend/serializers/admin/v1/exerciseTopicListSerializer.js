import moment from 'moment-timezone'

export class ExerciseTopicListSerializer {
  static serialize(topics) {
    return topics.map(topic => {
      const allTags = (topic.exercise_topic_tags || []).filter(tt => tt.tags).map(tt => ({
        id: tt.tags.id,
        name: tt.tags.name,
        tagGroupName: tt.tags.tag_group?.name || null
      }))

      return {
        id: topic.id,
        uniqueId: topic.unique_id,
        title: topic.title,
        description: topic.description,
        status: topic.status,
        questionCount: topic.question_count || 0,
        universityTags: allTags.filter(t => t.tagGroupName === 'university'),
        semesterTags: allTags.filter(t => t.tagGroupName === 'semester'),
        topicTags: allTags.filter(t => t.tagGroupName === 'topic'),
        departmentTags: allTags.filter(t => t.tagGroupName === 'department'),
        createdAt: topic.created_at ? moment(topic.created_at).tz('Asia/Jakarta').toISOString() : null,
      }
    })
  }
}
