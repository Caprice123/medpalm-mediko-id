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
        const buckets = user.user_credits || []
        const now = new Date()
        const totalBalance = buckets.reduce((sum, b) => {
            if (b.credit_type === 'permanent') return sum + parseFloat(b.balance)
            if (b.credit_type === 'expiring' && b.expires_at && new Date(b.expires_at) > now) return sum + parseFloat(b.balance)
            return sum
        }, 0)

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.is_active,
            permissions: user.permissions || null,
            userSubscriptions: UserSubscriptionSerializer.serialize(user.user_subscription || []),
            userCredits: { balance: totalBalance },
        }
    }
}