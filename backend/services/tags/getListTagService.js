
import prisma from "../../prisma/client.js";
import { BaseService } from "../baseService.js";

export class GetListTagService extends BaseService {
    static async call(filters = {}) {
        const where = {}

        // Filter by type if provided
        if (filters.tagGroupNames) {
            where.groupName = {
                in: filters.tagGroupNames
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
                        tag_group_id: true,
                        is_active: true
                    },
                    where: {
                        is_active: true,
                    },
                    orderBy: [
                        { name: 'asc' }
                    ]
                }
            }
        })
        console.log(tags)

        return tags
    }
}