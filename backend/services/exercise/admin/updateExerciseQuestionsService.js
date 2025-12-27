import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class UpdateExerciseQuestionsService extends BaseService {
    static async call(topicId, questions) {
        this.validate(topicId, questions)

        // Check if topic exists
        const topic = await prisma.exercise_topics.findUnique({
            where: { id: parseInt(topicId) }
        })

        if (!topic) {
            throw new ValidationError('Topic not found')
        }

        // Delete existing questions and create new ones in a transaction
        const updatedTopic = await prisma.$transaction(async (tx) => {
            // Delete existing questions
            await tx.exercise_questions.deleteMany({
                where: { topic_id: parseInt(topicId) }
            })

            // Create new questions
            await tx.exercise_questions.createMany({
                data: questions.map((q, index) => ({
                    topic_id: parseInt(topicId),
                    question: q.question,
                    answer: q.answer,
                    explanation: q.explanation,
                    order: q.order !== undefined ? q.order : index
                }))
            })

            // Fetch and return updated topic
            return await tx.exerciseTopic.findUnique({
                where: { id: parseInt(topicId) },
                include: {
                    questions: {
                        orderBy: { order: 'asc' }
                    }
                }
            })
        })

        return updatedTopic
    }

    static validate(topicId, questions) {
        if (!topicId) {
            throw new ValidationError('Topic ID is required')
        }

        const id = parseInt(topicId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid topic ID')
        }

        if (!questions || !Array.isArray(questions)) {
            throw new ValidationError('Questions array is required')
        }

        if (questions.length === 0) {
            throw new ValidationError('At least one question is required')
        }

        // Validate each question
        questions.forEach((q, index) => {
            if (!q.question || typeof q.question !== 'string') {
                throw new ValidationError(`Question ${index + 1}: question text is required`)
            }
            if (!q.answer || typeof q.answer !== 'string') {
                throw new ValidationError(`Question ${index + 1}: answer is required`)
            }
        })
    }
}
