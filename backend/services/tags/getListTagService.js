
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class GetListTagService extends BaseService {
    static async call(filters = {}) {
        const where = {}

        // Filter by type if provided
        if (filters.tagGroupNames) {
            where.name = {
                in: filters.tagGroupNames.split(",")
            }
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
}