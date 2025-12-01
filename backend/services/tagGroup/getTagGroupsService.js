import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class GetTagGroupsService extends BaseService {
    static async call(filters = {}) {
        const where = {}

        // Filter by name(s) if provided
        if (filters.name) {
            // If name is an array, use 'in' operator
            if (Array.isArray(filters.name)) {
                where.name = {
                    in: filters.name
                }
            } else {
                // Single name, use exact match
                where.name = filters.name
            }
        }

        const tagGroups = await prisma.tag_groups.findMany({
            where,
            orderBy: {
                name: 'asc'
            },
        })

        return tagGroups
    }
}
