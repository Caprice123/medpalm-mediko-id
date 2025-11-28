import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

// Calculate similarity between two strings (case-insensitive)
function calculateSimilarity(str1, str2) {
  // Normalize strings: lowercase, trim, remove extra spaces
  const normalize = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, ' ')

  const a = normalize(str1)
  const b = normalize(str2)

  if (a === b) return 1.0
  if (a.length === 0 || b.length === 0) return 0.0

  // Levenshtein distance
  const matrix = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  const distance = matrix[b.length][a.length]
  const maxLength = Math.max(a.length, b.length)

  return 1 - (distance / maxLength)
}

export class SubmitExerciseProgressService extends BaseService {
  static async call({ topicId, userId, answers = [] }) {
    // Validate inputs
    if (!topicId) {
      throw new ValidationError('Topic ID is required')
    }

    if (!answers || answers.length === 0) {
      throw new ValidationError('Answers are required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get the topic with questions to verify answers
      const topic = await tx.exercise_topics.findUnique({
        where: { id: parseInt(topicId) },
        include: {
          exercise_questions: true
        }
      })

      if (!topic) {
        throw new ValidationError('Topic not found')
      }

      // Create a map of question id to question for quick lookup
      const questionsMap = {}
      topic.exercise_questions.forEach(question => {
        questionsMap[question.id] = question
      })

      let answerResults = []
      let correctCount = 0

      // Process each answer
      for (const answer of answers) {
        const question = questionsMap[answer.questionId]

        if (!question) {
          throw new ValidationError(`Question ${answer.questionId} not found in this topic`)
        }

        // Calculate similarity and correctness
        const similarityScore = calculateSimilarity(answer.userAnswer, question.answer)
        const isCorrect = similarityScore >= 0.9

        if (isCorrect) {
          correctCount++
        }

        answerResults.push({
          questionId: answer.questionId,
          userAnswer: answer.userAnswer,
          correctAnswer: question.answer,
          explanation: question.explanation,
          isCorrect,
          similarityScore
        })
      }

      // Update user_question_progress for persistent tracking (spaced repetition)
      const userIdInt = parseInt(userId)
      const topicIdInt = parseInt(topicId)

      for (const result of answerResults) {
        await tx.user_question_progress.upsert({
          where: {
            user_id_question_id: {
              user_id: userIdInt,
              question_id: result.questionId
            }
          },
          create: {
            user_id: userIdInt,
            question_id: result.questionId,
            topic_id: topicIdInt,
            times_correct: result.isCorrect ? 1 : 0,
            times_incorrect: result.isCorrect ? 0 : 1,
            last_reviewed: new Date()
          },
          update: result.isCorrect
            ? {
                times_correct: { increment: 1 },
                last_reviewed: new Date(),
                updated_at: new Date()
              }
            : {
                times_incorrect: { increment: 1 },
                last_reviewed: new Date(),
                updated_at: new Date()
              }
        })
      }

      // Calculate score as percentage
      const totalQuestions = answerResults.length
      const score = Math.round((correctCount / totalQuestions) * 100)

      return {
        total_questions: totalQuestions,
        correct_questions: correctCount,
        score,
        answers: answerResults
      }
    })

    return result
  }
}
