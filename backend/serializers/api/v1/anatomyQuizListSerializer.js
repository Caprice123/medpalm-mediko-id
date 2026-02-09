export class AnatomyQuizListSerializer {
  static serialize(quizzes) {
    return quizzes.map(quiz => {
      const quizTags = quiz.anatomy_quiz_tags || quiz.tags || []

      // Separate tags by group
      const allTags = quizTags.map(t => ({
        id: t.tags ? t.tags.id : t.id,
        name: t.tags ? t.tags.name : t.name,
        tagGroupName: t.tags?.tag_group?.name || t.tagGroupName
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

      return {
        id: quiz.id,
        uniqueId: quiz.unique_id,
        title: quiz.title,
        description: quiz.description,
        universityTags: universityTags.map(tag => ({
          id: tag.id,
          name: tag.name
        })),
        semesterTags: semesterTags.map(tag => ({
          id: tag.id,
          name: tag.name
        })),
        questionCount: quiz.questionCount || quiz._count?.anatomy_questions || 0,
        updatedAt: quiz.updatedAt || quiz.updated_at
      }
    })
  }
}
