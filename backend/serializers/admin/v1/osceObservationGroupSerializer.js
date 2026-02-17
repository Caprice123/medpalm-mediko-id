import moment from 'moment-timezone'

export class OsceObservationGroupSerializer {
    static serialize(group) {
        return {
            id: group.id,
            name: group.name,
            order: group.order,
            createdAt: group.created_at ? moment(group.created_at).tz('Asia/Jakarta').toISOString() : null,
            updatedAt: group.updated_at ? moment(group.updated_at).tz('Asia/Jakarta').toISOString() : null,
            observations: group.osce_observations ? group.osce_observations.map(obs => ({
                id: obs.id,
                name: obs.name,
                order: obs.order,
                createdAt: obs.created_at ? moment(obs.created_at).tz('Asia/Jakarta').toISOString() : null,
                updatedAt: obs.updated_at ? moment(obs.updated_at).tz('Asia/Jakarta').toISOString() : null
            })) : []
        }
    }
}
