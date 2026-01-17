import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class UpdateOsceObservationService extends BaseService {
    static async call(observationId, { name, groupId, order }) {
        this.validate(observationId, { name })

        // Check if observation exists
        const observation = await prisma.osce_observations.findUnique({
            where: { id: parseInt(observationId) }
        })

        if (!observation) {
            throw new ValidationError('Observation not found')
        }

        // Build update data
        const updateData = {}

        if (name !== undefined) updateData.name = name
        if (groupId !== undefined) updateData.group_id = parseInt(groupId)
        if (order !== undefined) updateData.order = parseInt(order)

        // Validate group if provided
        if (groupId) {
            const group = await prisma.osce_observation_groups.findUnique({
                where: { id: parseInt(groupId) }
            })
            if (!group) {
                throw new ValidationError('Invalid group ID')
            }
        }

        // Update observation
        const updatedObservation = await prisma.osce_observations.update({
            where: { id: parseInt(observationId) },
            data: updateData,
            include: {
                osce_observation_group: true
            }
        })

        return updatedObservation
    }

    static validate(observationId, { name }) {
        if (!observationId) {
            throw new ValidationError('Observation ID is required')
        }

        const id = parseInt(observationId)
        if (isNaN(id) || id <= 0) {
            throw new ValidationError('Invalid observation ID')
        }

        if (name !== undefined && (!name || name.trim().length < 2)) {
            throw new ValidationError('Name must be at least 2 characters')
        }
    }
}
