import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class UpdateOsceObservationGroupService extends BaseService {
    static async call(groupId, { name, order }) {
        this.validate(groupId, { name })

        const group = await prisma.osce_observation_groups.findUnique({
            where: { id: parseInt(groupId) }
        })

        if (!group) {
            throw new ValidationError('Group not found')
        }

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (order !== undefined) updateData.order = parseInt(order)

        const updatedGroup = await prisma.osce_observation_groups.update({
            where: { id: parseInt(groupId) },
            data: updateData
        })

        return updatedGroup
    }

    static validate(groupId, { name }) {
        if (!groupId) {
            throw new ValidationError('Group ID is required')
        }

        const id = parseInt(groupId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid group ID')
        }

        if (name !== undefined && (!name || name.trim().length < 2)) {
            throw new ValidationError('Name must be at least 2 characters')
        }
    }
}
