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
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.is_active,
            permissions: user.permissions || null,
            userSubscriptions: UserSubscriptionSerializer.serialize(user.user_subscription || []),
            userCredits: UserCreditSerializer.serialize(user.user_credit),
        }
    }
}