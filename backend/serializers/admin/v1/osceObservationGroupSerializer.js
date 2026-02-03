export class OsceObservationGroupSerializer {
    static serialize(group) {
        return {
            id: group.id,
            name: group.name,
            order: group.order,
            createdAt: group.created_at,
            updatedAt: group.updated_at,
            observations: group.osce_observations ? group.osce_observations.map(obs => ({
                id: obs.id,
                name: obs.name,
                order: obs.order,
                createdAt: obs.created_at,
                updatedAt: obs.updated_at
            })) : []
        }
    }
}
