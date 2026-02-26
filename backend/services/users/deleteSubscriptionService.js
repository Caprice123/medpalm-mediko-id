import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class DeleteSubscriptionService extends BaseService {
    /**
     * Delete a subscription by ID
     * @param {number} subscriptionId
     */
    static async call(subscriptionId) {
        const subscription = await prisma.user_subscriptions.findUnique({
            where: { id: subscriptionId }
        });

        if (!subscription) {
            throw new ValidationError("Subscription not found");
        }

        await prisma.user_subscriptions.delete({
            where: { id: subscriptionId }
        });
    }
}
