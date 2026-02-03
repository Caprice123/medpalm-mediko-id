export class TagSerializer {
    static serialize(tags) {
        // If single tag object, convert to array
        if (!Array.isArray(tags)) {
            if (!tags) return []
            return this.serializeOne(tags)
        }

        return tags.map((tag) => this.serializeOne(tag))
    }

    static serializeOne(tag) {
        return {
            id: tag.id,
            name: tag.name,
            tagGroupId: tag.tag_group_id,
        }
    }
}