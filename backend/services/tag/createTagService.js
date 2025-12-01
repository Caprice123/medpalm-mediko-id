import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class CreateTagService extends BaseService {
    static async call({ name, type }) {
        this.validate({ name, type })

        // Find or create tag group based on type
        let tagGroup = await prisma.tag_groups.findUnique({
            where: { name: type }
        })

        if (!tagGroup) {
            tagGroup = await prisma.tag_groups.create({
                data: {
                    name: type
                }
            })
        }

        // Check if tag with same name and type already exists
        const existingTag = await prisma.tags.findFirst({
            where: {
                name,
                tag_group_id: tagGroup.id
            }
        })

        if (existingTag) {
            throw new ValidationError(`Tag "${name}" already exists for type "${type}"`)
        }

        const tag = await prisma.tags.create({
            data: {
                name,
                type,
                tag_group_id: tagGroup.id,
                is_active: true
            }
        })

        return tag
    }

    static validate({ name, type }) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new ValidationError('Tag name is required')
        }

        if (!type || typeof type !== 'string' || type.trim().length === 0) {
            throw new ValidationError('Type is required')
        }
    }
}
