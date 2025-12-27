import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class GetFlashcardDecksService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        // Pagination
        const page = parseInt(filters.page) || 1
        const perPage = parseInt(filters.perPage) || 20
        const skip = (page - 1) * perPage

        const where = {}

        if (filters.status) {
            where.status = filters.status
        }

        // Build filter conditions for tags
        const tagFilters = []

        if (filters.university) {
            tagFilters.push({
                flashcard_deck_tags: {
                    some: {
                        tag_id: parseInt(filters.university)
                    }
                }
            })
        }

        if (filters.semester) {
            tagFilters.push({
                flashcard_deck_tags: {
                    some: {
                        tag_id: parseInt(filters.semester)
                    }
                }
            })
        }

        // Apply tag filters with AND logic
        if (tagFilters.length > 0) {
            where.AND = tagFilters
        }

        const decks = await prisma.flashcard_decks.findMany({
            skip,
            take: perPage,
            where,
            include: {
                flashcard_deck_tags: {
                    include: {
                        tags: {
                            include: {
                                tag_group: true
                            }
                        }
                    }
                },
                flashcard_cards: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return {
            decks: decks,
            pagination: {
                page,
                perPage,
                isLastPage: decks.length < perPage
            }
        }
    }

    static validate(filters) {
        // Validate university filter if provided
        if (filters.university) {
            const universityId = parseInt(filters.university)
            if (isNaN(universityId) || universityId <= 0) {
                throw new ValidationError('Invalid university filter')
            }
        }

        // Validate semester filter if provided
        if (filters.semester) {
            const semesterId = parseInt(filters.semester)
            if (isNaN(semesterId) || semesterId <= 0) {
                throw new ValidationError('Invalid semester filter')
            }
        }
    }
}
