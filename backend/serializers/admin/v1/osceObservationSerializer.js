export class OsceObservationSerializer {
    static serialize(observation) {
        return {
            id: observation.id,
            groupId: observation.group_id,
            name: observation.name,
            order: observation.order,
            isActive: observation.is_active,
            createdAt: observation.created_at,
            updatedAt: observation.updated_at,
            group: observation.osce_observation_group ? {
                id: observation.osce_observation_group.id,
                name: observation.osce_observation_group.name
            } : null
        }
    }
}
