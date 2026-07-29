export class AtlasQuizAtlasModelListSerializer {
  static serialize(row, quizCountMap) {
    return {
      uniqueId: row.uniqueId,
      title: row.title,
      description: row.description,
      moduleName: row.moduleName,
      moduleId: Number(row.moduleId),
      classification: row.classification,
      quizCount: quizCountMap[Number(row.moduleId)] || 0,
    }
  }
}
