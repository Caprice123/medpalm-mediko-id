import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class DeleteOsceObservationService extends BaseService {
    static async call(observationId) {
        this.validate(observationId)

        // Check if observation exists
        const observation = await prisma.osce_observations.findUnique({
            where: { id: parseInt(observationId) }
        })

        if (!observation) {
            throw new ValidationError('Observation not found')
        }

        // Soft delete by setting is_active to false
        await prisma.osce_observations.update({
            where: { id: parseInt(observationId) },
        })

        return true
    }

    static validate(observationId) {
        if (!observationId) {
            throw new ValidationError('Observation ID is required')
        }

        const id = parseInt(observationId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid observation ID')
        }
    }
}
