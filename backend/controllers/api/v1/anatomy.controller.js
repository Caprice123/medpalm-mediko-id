import { GetAnatomyQuizzesService } from '#services/anatomy/getAnatomyQuizzesService'
import { GetAnatomyQuizDetailService } from '#services/anatomy/admin/getAnatomyQuizDetailService'
import attachmentService from '#services/attachment/attachmentService'
import prisma from '#prisma/client'

class AnatomyController {
  async index(req, res) {
    const { university, semester } = req.query

    const result = await GetAnatomyQuizzesService.call({ university, semester })

    return res.status(200).json({
      data: result.data,
      pagination: result.pagination
    })
  }

  async show(req, res) {
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
      data: quiz
    })
  }

  async submit(req, res) {
    const { id } = req.params
    const { answers } = req.body // Array of { question_id, answer }
    const userId = req.user.id

    // Fetch quiz with questions
    const quiz = await prisma.anatomy_quizzes.findUnique({
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
        question: question.question,
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
