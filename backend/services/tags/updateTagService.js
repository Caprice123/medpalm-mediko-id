import { ValidationError } from "../../errors/validationError.js"
import prisma from "../../prisma/client.js"
import { BaseService } from "../baseService.js"

export class UpdateTagService extends BaseService {
    static async call(tagId, { name, groupName }) {
        this.validate(tagId)

        // Check if tag exists
        const existingTag = await prisma.tags.findUnique({
            where: { id: parseInt(tagId) }
        })

        if (!existingTag) {
            throw new ValidationError('Tag dengan nama tersebut tidak ditemukan')
        }

        // Find tag group based on groupName
        const tagGroup = await prisma.tag_groups.findUnique({
            where: { name: groupName }
        })

        if (!tagGroup) {
            throw new ValidationError("Tag group dengan nama tersebut tidak ditemukan")
        }

        // Check if another tag with same name and type exists (excluding current tag)
        const duplicateTag = await prisma.tags.findFirst({
            where: {
                name,
                tag_group_id: tagGroup.id,
                id: {
                    not: parseInt(tagId)
                }
            }
        })

        if (duplicateTag) {
            throw new ValidationError(`Tag "${name}" sudah ada dalam group tersebut"`)
        }

        const updatedTag = await prisma.tags.update({
            where: { id: parseInt(tagId) },
            data: {
                name,
                tag_group_id: tagGroup.id
            }
        })

        return updatedTag
    }

    static validate(tagId) {
        if (!tagId) {
            throw new ValidationError('Tag ID is required')
        }

        const id = parseInt(tagId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid tag ID')
        }
    }
}
