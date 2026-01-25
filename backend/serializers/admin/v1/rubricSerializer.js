export class RubricSerializer {
    static serialize(rubric) {
        return {
            id: rubric.id,
            name: rubric.name,
            content: rubric.content,
            createdAt: rubric.created_at,
            updatedAt: rubric.updated_at
        }
    }
}
