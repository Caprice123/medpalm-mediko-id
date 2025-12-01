import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class UpdateTagService extends BaseService {
    static async call(tagId, { name, type }) {
        this.validate(tagId, { name, type })

        // Check if tag exists
        const existingTag = await prisma.tags.findUnique({
            where: { id: parseInt(tagId) }
        })

        if (!existingTag) {
            throw new ValidationError('Tag not found')
        }

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

        // Check if another tag with same name and type exists (excluding current tag)
        const duplicateTag = await prisma.tags.findFirst({
            where: {
                name,
                type,
                id: {
                    not: parseInt(tagId)
                }
            }
        })

        if (duplicateTag) {
            throw new ValidationError(`Tag "${name}" already exists for type "${type}"`)
        }

        const updatedTag = await prisma.tags.update({
            where: { id: parseInt(tagId) },
            data: {
                name,
                type,
                tag_group_id: tagGroup.id
            }
        })

        return updatedTag
    }

    static validate(tagId, { name, type }) {
        if (!tagId) {
            throw new ValidationError('Tag ID is required')
        }

        const id = parseInt(tagId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid tag ID')
        }

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new ValidationError('Tag name is required')
        }

        if (!type || typeof type !== 'string' || type.trim().length === 0) {
            throw new ValidationError('Type is required')
        }
    }
}
