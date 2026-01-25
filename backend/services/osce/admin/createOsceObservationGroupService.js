import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class CreateOsceObservationGroupService extends BaseService {
    static async call({ name }) {
        // Validate inputs
        this.validate({ name })

        // Create observation group
        const group = await prisma.osce_observation_groups.create({
            data: {
                name,
                is_active: true
            }
        })

        return group
    }

    static validate({ name }) {
        if (!name || name.trim().length < 2) {
            throw new ValidationError('Name is required and must be at least 2 characters')
        }
    }
}
