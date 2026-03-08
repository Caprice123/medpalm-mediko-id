import { GetDiagnosticQuizzesService } from '#services/diagnostic/getDiagnosticQuizzesService'
import { GetDiagnosticQuizDetailService } from '#services/diagnostic/admin/getDiagnosticQuizDetailService'
import { DiagnosticQuizListSerializer } from '#serializers/api/v1/diagnosticQuizListSerializer'
import { DiagnosticQuizSerializer } from '#serializers/api/v1/diagnosticQuizSerializer'
import attachmentService from '#services/attachment/attachmentService'
import prisma from '#prisma/client'

class DiagnosticController {
  async index(req, res) {
    const { university, semester, page, perPage } = req.query

    const result = await GetDiagnosticQuizzesService.call({ university, semester, page, perPage, userRole: req.user.role })

    return res.status(200).json({
      data: DiagnosticQuizListSerializer.serialize(result.quizzes),
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const userId = req.user.id

    // Fetch quiz with questions
    const quiz = await GetDiagnosticQuizDetailService.call(uniqueId)

    // Check if quiz is published
    if (quiz.status !== 'published') {
      return res.status(403).json({
        message: 'This quiz is not available'
      })
    }

    // TODO: Add subscription check here if needed
    // For now, return the quiz

    return res.status(200).json({
      data: DiagnosticQuizSerializer.serialize(quiz)
    })
  }

  async submit(req, res) {
    const { uniqueId } = req.params
    const { answers } = req.body // Array of { question_id, answer }
    const userId = req.user.id

    // Fetch quiz with questions
    const quiz = await prisma.diagnostic_quizzes.findUnique({
      where: { unique_id: uniqueId },
      include: {
        diagnostic_questions: true
      }
    })

    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      })
    }

    // Grade the answers
    const results = []
    let correctAnswers = 0

    for (const answer of answers) {
      const question = quiz.diagnostic_questions.find(q => q.id === answer.question_id)
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

    const score = Math.round((correctAnswers / quiz.diagnostic_questions.length) * 100)

    // TODO: Save attempt to database for tracking

    return res.status(200).json({
      data: {
        score,
        correctAnswers,
        totalQuestions: quiz.diagnostic_questions.length,
        answers: results
      },
      message: 'Quiz submitted successfully'
    })
  }
}

export default new DiagnosticController()
