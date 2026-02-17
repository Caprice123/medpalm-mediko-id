import moment from 'moment-timezone'

export class RubricSerializer {
    static serialize(rubric) {
        return {
            id: rubric.id,
            name: rubric.name,
            content: rubric.content,
            createdAt: rubric.created_at ? moment(rubric.created_at).tz('Asia/Jakarta').toISOString() : null,
            updatedAt: rubric.updated_at ? moment(rubric.updated_at).tz('Asia/Jakarta').toISOString() : null
        }
    }
}
