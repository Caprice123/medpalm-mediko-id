import { UserCreditSerializer } from "./userCreditSerializer.js"
import { UserSubscriptionSerializer } from "./userSubscriptionSerializer.js"

export class UserSerializer {
    static serialize(users) {
        // If single tag object, convert to array
        if (!Array.isArray(users)) {
            if (!users) return []
            return this.serializeOne(users)
        }

        return users.map((user) => this.serializeOne(user))
    }

    static serializeOne(user) {
        // Convert user_purchases to subscription format
        const subscriptions = (user.user_purchases || []).map(purchase => ({
            start_date: purchase.subscription_start,
            end_date: purchase.subscription_end,
        }));

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.is_active,
            userSubscriptions: UserSubscriptionSerializer.serialize(subscriptions),
            userCredits: UserCreditSerializer.serialize(user.user_credit),
        }
    }
}