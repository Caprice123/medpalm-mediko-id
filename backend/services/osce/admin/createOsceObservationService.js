import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class CreateOsceObservationService extends BaseService {
    static async call({ name, groupId, order = 0 }) {
        // Validate inputs
        await this.validate({ name, groupId })

        // Create observation
        const observation = await prisma.osce_observations.create({
            data: {
                name,
                group_id: parseInt(groupId),
            },
            include: {
                osce_observation_group: true
            }
        })

        return observation
    }

    static async validate({ name, groupId }) {
        // Validate required fields
        if (!name || name.trim().length < 2) {
            throw new ValidationError('Name is required and must be at least 2 characters')
        }

        if (!groupId) {
            throw new ValidationError('Group ID is required')
        }

        // Validate group exists
        const group = await prisma.osce_observation_groups.findUnique({
            where: { id: parseInt(groupId) }
        })
        if (!group) {
            throw new ValidationError('Invalid group ID')
        }
    }
}
