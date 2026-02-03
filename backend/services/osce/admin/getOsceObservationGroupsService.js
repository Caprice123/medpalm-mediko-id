import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class GetOsceObservationGroupsService extends BaseService {
    static async call() {
        // Get all groups with their observations
        const groups = await prisma.osce_observation_groups.findMany({
            include: {
                osce_observations: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })

        return groups
    }
}
