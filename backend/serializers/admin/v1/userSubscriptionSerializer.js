import moment from 'moment-timezone'

export class UserSubscriptionSerializer {
    static serialize(userSubscriptions) {
        // If single tag object, convert to array
        if (!Array.isArray(userSubscriptions)) {
            if (!userSubscriptions) return []
            return this.serializeOne(userSubscriptions)
        }

        return userSubscriptions.map((userSubscription) => this.serializeOne(userSubscription))
    }

    static serializeOne(userSubscription) {
        return {
            id: userSubscription.id,
            startDate: userSubscription.start_date ? moment(userSubscription.start_date).tz('Asia/Jakarta').toISOString() : null,
            endDate: userSubscription.end_date ? moment(userSubscription.end_date).tz('Asia/Jakarta').toISOString() : null,
            status: userSubscription.status,
            isCurrentlyActive: userSubscription.isCurrentlyActive || false,
            createdAt: userSubscription.created_at ? moment(userSubscription.created_at).tz('Asia/Jakarta').toISOString() : null,
        }
    }
}