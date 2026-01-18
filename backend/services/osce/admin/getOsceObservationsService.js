import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class GetOsceObservationsService extends BaseService {
    static async call() {
        // Get all groups with their observations
        const groups = await prisma.osce_observation_groups.findMany({
            include: {
                osce_observations: {
                    orderBy: {
                        name: 'asc'
                    }
                }
            },
            orderBy: {
                id: 'asc'
            }
        })

        return groups
    }
}
