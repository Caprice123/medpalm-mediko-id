import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class GetTagsService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const where = {}

        // Filter by type if provided
        if (filters.name) {
            where.name = filters.name
        }

        const tags = await prisma.tag_groups.findMany({
            where,
            orderBy: [
                { name: 'asc' }
            ],
            include: {
                tags: {
                    select: {
                        id: true,
                        name: true,
                        tag_group_id: true
                    },
                    orderBy: [
                        { name: 'asc' }
                    ]
                }
            }
        })

        return tags
    }

    static validate(filters) {
        if (filters.type && !['university', 'semester'].includes(filters.type)) {
            throw new ValidationError('Type must be either "university" or "semester"')
        }
    }
}
