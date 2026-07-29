export class AtlasQuizTopicSerializer {
  static serialize(topic, atlasCountMap, quizCountMap) {
    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      icon: topic.icon,
      classification: topic.classification,
      atlasModelCount: atlasCountMap[topic.id] || 0,
      quizCount: quizCountMap[topic.id] || 0,
    }
  }
}
