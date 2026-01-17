import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class DeleteOsceObservationGroupService extends BaseService {
    static async call(groupId) {
        this.validate(groupId)

        const group = await prisma.osce_observation_groups.findUnique({
            where: { id: parseInt(groupId) }
        })

        if (!group) {
            throw new ValidationError('Group not found')
        }

        // Soft delete
        await prisma.osce_observation_groups.update({
            where: { id: parseInt(groupId) },
            data: {
                is_active: false
            }
        })

        return true
    }

    static validate(groupId) {
        if (!groupId) {
            throw new ValidationError('Group ID is required')
        }

        const id = parseInt(groupId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid group ID')
        }
    }
}
