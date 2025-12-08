import { GetAnatomyQuizzesService } from '../../../services/anatomy/getAnatomyQuizzesService.js'
import { GetAnatomyQuizDetailService } from '../../../services/anatomy/admin/getAnatomyQuizDetailService.js'
import { StartAnatomyQuizService } from '../../../services/anatomy/startAnatomyQuizService.js'
import { SubmitAnatomyAnswersService } from '../../../services/anatomy/submitAnatomyAnswersService.js'
import prisma from '../../../prisma/client.js'

class AnatomyController {
  /**
   * Get all published anatomy quizzes with optional filters
   * GET /api/v1/anatomy/quizzes
   */
  async getQuizzes(req, res) {
    const { university, semester } = req.query

    const quizzes = await GetAnatomyQuizzesService.call({ university, semester })

    return res.status(200).json({
      success: true,
      data: quizzes
    })
  }

  /**
   * Get single quiz for user to take
   * GET /api/v1/anatomy/quizzes/:id
   */
  async getQuiz(req, res) {
    const { id } = req.params
    const userId = req.user.id

    // Fetch quiz with questions
    const quiz = await GetAnatomyQuizDetailService.call(id)

    // Check if quiz is published
    if (quiz.status !== 'published') {
      return res.status(403).json({
        success: false,
        message: 'This quiz is not available'
      })
    }

    // TODO: Add subscription check here if needed
    // For now, return the quiz

    return res.status(200).json({
      success: true,
      data: quiz
    })
  }

  /**
   * Submit answers for a quiz (simpler approach)
   * POST /api/v1/anatomy/quizzes/:id/submit
   */
  async submitQuizAnswers(req, res) {
    const { id } = req.params
    const { answers } = req.body // Array of { question_id, answer }
    const userId = req.user.id

    // Fetch quiz with questions
    const quiz = await prisma.anatomy_quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        anatomy_questions: true
      }
    })

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
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
      const isCorrect = userAnswer === correctAnswer

      if (isCorrect) correctAnswers++

      results.push({
        question: question.label,
        userAnswer: answer.answer,
        correctAnswer: question.answer,
        isCorrect,
        explanation: question.explanation
      })
    }

    const score = Math.round((correctAnswers / quiz.anatomy_questions.length) * 100)

    // TODO: Save attempt to database for tracking

    return res.status(200).json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions: quiz.anatomy_questions.length,
        answers: results
      },
      message: 'Quiz submitted successfully'
    })
  }

  /**
   * Start an anatomy quiz (creates session)
   * POST /api/v1/anatomy/quizzes/:id/start
   */
  async startQuiz(req, res) {
    const { id } = req.params
    const userId = req.user.id

    const result = await StartAnatomyQuizService.call({
      quizId: id,
      userId
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Anatomy quiz started successfully'
    })
  }

  /**
   * Submit answers for an anatomy quiz attempt
   * POST /api/v1/anatomy/attempts/:attemptId/submit
   */
  async submitAnswers(req, res) {
    const { attemptId } = req.params
    const { answers } = req.body
    const userId = req.user.id

    const result = await SubmitAnatomyAnswersService.call({
      attemptId,
      userId,
      answers
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Answers submitted successfully'
    })
  }
}

export default new AnatomyController()
