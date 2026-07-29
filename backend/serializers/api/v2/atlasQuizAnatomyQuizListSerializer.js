export class AtlasQuizAnatomyQuizListSerializer {
  static serialize(row) {
    return {
      uniqueId: row.uniqueId,
      title: row.title,
      description: row.description,
      questionCount: Number(row.questionCount),
      difficulty: row.difficulty || 'medium',
      estimatedMinutes: row.estimatedMinutes ? Number(row.estimatedMinutes) : null,
      module: {
        id: Number(row.moduleId),
        name: row.moduleName,
        classification: row.classification,
      },
    }
  }
}
