export class AnatomyQuizListSerializer {
  static serialize(quizzes, attachmentMap = new Map()) {
    return quizzes.map(quiz => {
      const allTags = (quiz.anatomy_quiz_tags || []).map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupName: t.tags.tag_group?.name || null
      }))

      const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
      const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        status: quiz.status,
        questionCount: quiz._count?.anatomy_questions || 0,
        universityTags,
        semesterTags,
        createdAt: quiz.created_at
      }
    })
  }
}
