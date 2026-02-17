import moment from 'moment-timezone'

export class OsceObservationSerializer {
    static serialize(observation) {
        return {
            id: observation.id,
            groupId: observation.group_id,
            name: observation.name,
            order: observation.order,
            createdAt: observation.created_at ? moment(observation.created_at).tz('Asia/Jakarta').toISOString() : null,
            updatedAt: observation.updated_at ? moment(observation.updated_at).tz('Asia/Jakarta').toISOString() : null,
            group: observation.osce_observation_group ? {
                id: observation.osce_observation_group.id,
                name: observation.osce_observation_group.name
            } : null
        }
    }
}
