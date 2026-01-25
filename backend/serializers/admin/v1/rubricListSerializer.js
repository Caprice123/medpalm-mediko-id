export class RubricListSerializer {
    /**
     * Serialize array of rubrics for list view (index endpoint)
     */
    static serialize(rubrics) {
        return rubrics.map(rubric => this.serializeRubric(rubric))
    }

    /**
     * Serialize single rubric for list view
     */
    static serializeRubric(rubric) {
        return {
            id: rubric.id,
            name: rubric.name,
            content: rubric.content,
            createdAt: rubric.created_at,
            updatedAt: rubric.updated_at
        }
    }
}
