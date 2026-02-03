import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "../baseService.js"

export class DeleteTagService extends BaseService {
    static async call(tagId) {
        this.validate(tagId)

        // Check if tag exists
        const existingTag = await prisma.tags.findUnique({
            where: { id: parseInt(tagId) }
        })

        if (!existingTag) {
            throw new ValidationError('Tag not found')
        }
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
