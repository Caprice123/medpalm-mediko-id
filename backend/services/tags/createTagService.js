import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class CreateTagService extends BaseService {
    static async call(request) {
        const { groupName, name } = request

        // Find or create tag group based on type
        let tagGroup = await prisma.tag_groups.findUnique({
            where: { name: groupName }
        })

        if (!tagGroup) {
            throw new ValidationError("Group tag dengan nama tersebut tidak ditemukan di sistem")
        }

        // Check if tag with same name and type already exists
        const existingTag = await prisma.tags.findFirst({
            where: {
                name,
                tag_group_id: tagGroup.id
            }
        })

        if (existingTag) {
            throw new ValidationError(`Tag "${name}" pada group tersebut sudah ada`)
        }

        const tag = await prisma.tags.create({
            data: {
                name,
                tag_group_id: tagGroup.id,
            }
        })

        return tag
    }
}
