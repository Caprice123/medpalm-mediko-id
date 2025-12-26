export class AnatomyQuizSerializer {
  static serialize(quiz) {
    // Handle both old and new relation names
    const quizTags = quiz.anatomy_quiz_tags || quiz.tags || []
    const quizQuestions = quiz.anatomy_questions || quiz.questions || []

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      blob: quiz.blobId ? {
        id: quiz.blobId,
        url: quiz.image_url,
        key: quiz.image_key,
        filename: quiz.image_filename,
        size: quiz.image_size
      } : null,
      status: quiz.status,
      is_active: quiz.is_active,
      tags: quizTags.map(tag => ({
        id: tag.tags ? tag.tags.id : tag.tag ? tag.tag.id : tag.id,
        name: tag.tags ? tag.tags.name : tag.tag ? tag.tag.name : tag.name,
        tagGroupId: tag.tags
          ? tag.tags.tag_group_id
          : tag.tag
          ? tag.tag.tag_group_id
          : tag.tagGroupId
      })),
      questions: quizQuestions.map((q, index) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        explanation: q.explanation || '',
        order: q.order !== undefined ? q.order : index
      })),
      questionCount: quizQuestions.length,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at
    }
  }
}
