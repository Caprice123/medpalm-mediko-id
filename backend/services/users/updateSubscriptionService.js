import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { BaseService } from "../baseService.js";

export class UpdateSubscriptionService extends BaseService {
    /**
     * Update start/end dates of an existing subscription
     * @param {number} subscriptionId
     * @param {string|Date} startDate
     * @param {string|Date} endDate
     */
    static async call(subscriptionId, startDate, endDate) {
        const subscription = await prisma.user_subscriptions.findUnique({
            where: { id: subscriptionId }
        });

        if (!subscription) {
            throw new ValidationError("Subscription not found");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime())) {
            throw new ValidationError("Invalid start date");
        }

        if (isNaN(end.getTime())) {
            throw new ValidationError("Invalid end date");
        }

        if (end <= start) {
            throw new ValidationError("End date must be after start date");
        }

        await prisma.user_subscriptions.update({
            where: { id: subscriptionId },
            data: {
                start_date: start,
                end_date: end,
                updated_at: new Date(),
            }
        });
    }
}
