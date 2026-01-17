import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class GetOsceObservationDetailService extends BaseService {
    static async call(observationId) {
        this.validate(observationId)

        const observation = await prisma.osce_observations.findUnique({
            where: { id: parseInt(observationId) },
            include: {
                osce_topic: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        })

        if (!observation) {
            throw new ValidationError('Observation not found')
        }

        return observation
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
