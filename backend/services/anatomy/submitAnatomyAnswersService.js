import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

// Calculate similarity using Levenshtein distance
function calculateSimilarity(str1, str2) {
  // Normalize strings: lowercase, trim, and collapse multiple spaces
  const normalize = s => (s || '').toLowerCase().trim().replace(/\s+/g, ' ')
  const a = normalize(str1)
  const b = normalize(str2)

  // Perfect match
  if (a === b) return 1.0

  // Empty strings
  if (a.length === 0 || b.length === 0) return 0.0

  // Levenshtein distance using dynamic programming
  const matrix = []

  // Initialize first column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  // Initialize first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        )
      }
    }
  }

  // Convert distance to similarity (0 to 1)
  const distance = matrix[b.length][a.length]
  const maxLength = Math.max(a.length, b.length)
  return 1 - distance / maxLength
}

export class SubmitAnatomyAnswersService extends BaseService {
  static async call({ attemptId, userId, answers }) {
    const result = await prisma.$transaction(async tx => {
      // Get the attempt
      const attempt = await tx.anatomy_quiz_attempts.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
          anatomy_quiz: {
            include: {
              anatomy_questions: true
            }
          }
        }
      })

      if (!attempt) {
        throw new ValidationError('Attempt not found')
      }

      // Verify ownership
      if (attempt.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized: This attempt belongs to another user')
      }

      // Check if already completed
      if (attempt.status === 'completed') {
        throw new ValidationError('This attempt has already been submitted')
      }

      // Validate all question IDs exist
      const questionIds = attempt.anatomy_quiz.anatomy_questions.map(q => q.id)
      const answerQuestionIds = answers.map(a => a.questionId)

      for (const qId of answerQuestionIds) {
        if (!questionIds.includes(qId)) {
          throw new ValidationError(`Invalid question ID: ${qId}`)
        }
      }

      // Create question lookup map
      const questionMap = {}
      attempt.anatomy_quiz.anatomy_questions.forEach(q => {
        questionMap[q.id] = q
      })

      // Evaluate answers
      const answerResults = []
      let correctCount = 0

      for (const answer of answers) {
        const question = questionMap[answer.questionId]

        if (!question) {
          throw new ValidationError(`Question not found: ${answer.questionId}`)
        }

        // Calculate similarity using Levenshtein distance
        const similarityScore = calculateSimilarity(answer.userAnswer, question.answer)
        const isCorrect = similarityScore >= 0.9 // 90% threshold

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

        // Save answer to database
        await tx.anatomy_quiz_answers.create({
          data: {
            attempt_id: attempt.id,
            question_id: answer.questionId,
            user_answer: answer.userAnswer,
            is_correct: isCorrect,
            similarity_score: similarityScore
          }
        })

        // Update user_anatomy_progress for spaced repetition
        await tx.user_anatomy_progress.upsert({
          where: {
            user_id_question_id: {
              user_id: parseInt(userId),
              question_id: answer.questionId
            }
          },
          create: {
            user_id: parseInt(userId),
            question_id: answer.questionId,
            quiz_id: attempt.anatomy_quiz.id,
            times_correct: isCorrect ? 1 : 0,
            times_incorrect: isCorrect ? 0 : 1,
            last_reviewed: new Date()
          },
          update: isCorrect
            ? {
                times_correct: { increment: 1 },
                last_reviewed: new Date()
              }
            : {
                times_incorrect: { increment: 1 },
                last_reviewed: new Date()
              }
        })
      }

      // Calculate score
      const totalQuestions = answers.length
      const score = Math.round((correctCount / totalQuestions) * 100)

      // Update attempt
      await tx.anatomy_quiz_attempts.update({
        where: { id: attempt.id },
        data: {
          status: 'completed',
          correct_count: correctCount,
          score: score,
          completed_at: new Date()
        }
      })

      // Return results
      return {
        attemptId: attempt.id,
        total_questions: totalQuestions,
        correct_questions: correctCount,
        score: score,
        image_url: attempt.anatomy_quiz.image_url,
        answers: answerResults
      }
    })

    return result
  }

  static validate({ attemptId, userId, answers }) {
    if (!attemptId) {
      throw new ValidationError('Attempt ID is required')
    }

    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new ValidationError('Answers are required')
    }

    // Validate each answer
    for (const answer of answers) {
      if (!answer.questionId) {
        throw new ValidationError('Question ID is required for each answer')
      }

      if (answer.userAnswer === undefined || answer.userAnswer === null) {
        throw new ValidationError('User answer is required for each question')
      }

      // Convert to string if not already
      if (typeof answer.userAnswer !== 'string') {
        answer.userAnswer = String(answer.userAnswer)
      }
    }
  }
}
