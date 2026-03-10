import { GetAnatomyQuizzesService } from '#services/anatomy/getAnatomyQuizzesService'
import { GetAnatomyQuizDetailService } from '#services/anatomy/getAnatomyQuizDetailService'
import { AnatomyQuizListSerializer } from '#serializers/api/v1/anatomyQuizListSerializer'
import { AnatomyQuizSerializer } from '#serializers/api/v1/anatomyQuizSerializer'
import prisma from '#prisma/client'

class AnatomyController {
  async index(req, res) {
    const { topic, search, page, perPage } = req.query

    const result = await GetAnatomyQuizzesService.call({ topic, search, page, perPage, userRole: req.user.role })

    return res.status(200).json({
      data: AnatomyQuizListSerializer.serialize(result.quizzes),
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    // Fetch quiz with questions (service enforces published-only for user role)
    const quiz = await GetAnatomyQuizDetailService.call(uniqueId, { userId: req.user.id, userRole: req.user.role })

    return res.status(200).json({
      data: AnatomyQuizSerializer.serialize(quiz)
    })
  }

  async submit(req, res) {
    const { uniqueId } = req.params
    const { answers } = req.body // Array of { question_id, answer }
    const userId = req.user.id

    // Fetch quiz with questions
    const quiz = await prisma.anatomy_quizzes.findUnique({
      where: { unique_id: uniqueId },
      include: {
        anatomy_questions: true
      }
    })

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }

    if (req.user.role === 'user' && quiz.status !== 'published') {
      return res.status(403).json({
        message: 'This quiz is not available'
      })
    }

    // Grade the answers
    const results = []
    let correctAnswers = 0

    for (const answer of answers) {
      const question = quiz.anatomy_questions.find(q => q.id === answer.question_id)
      if (!question) continue

      const userAnswer = answer.answer.trim().toLowerCase()
      const correctAnswer = question.answer.trim().toLowerCase()

      // For both text and multiple_choice, compare normalized strings
      const isCorrect = userAnswer === correctAnswer

      if (isCorrect) correctAnswers++

      results.push({
        question: question.question,
        answerType: question.answer_type || 'text',
        userAnswer: answer.answer,
        correctAnswer: question.answer,
        isCorrect
      })
    }

    const score = Math.round((correctAnswers / quiz.anatomy_questions.length) * 100)

    // TODO: Save attempt to database for tracking

    return res.status(200).json({
      data: {
        score,
        correctAnswers,
        totalQuestions: quiz.anatomy_questions.length,
        answers: results
      },
      message: 'Quiz submitted successfully'
    })
  }
}

export default new AnatomyController()
