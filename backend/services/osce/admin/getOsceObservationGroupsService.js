import prisma from '#prisma/client'
import { BaseService } from "#services/baseService"

export class GetOsceObservationGroupsService extends BaseService {
    static async call() {
        // Get all groups with their observations
        const groups = await prisma.osce_observation_groups.findMany({
            where: {
                is_active: true
            },
            include: {
                osce_observations: {
                    where: {
                        is_active: true
                    },
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
