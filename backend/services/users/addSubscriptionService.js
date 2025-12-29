import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { parseDateAsGMT7 } from '#utils/dateUtils';
import { BaseService } from "../baseService.js";
import moment from "moment-timezone";

export class AddSubscriptionService extends BaseService {
    static async call(userId, startDate, endDate, planId = null) {
        // Validate user exists
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new ValidationError("User not found");
        }

        // Parse dates in GMT+7 using moment-timezone
        const start = parseDateAsGMT7(startDate);
        const end = parseDateAsGMT7(endDate);

        if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new ValidationError("Invalid date format");
        }

        if (end <= start) {
            throw new ValidationError("End date must be after start date");
        }

        // Current Date (GMT+7)
        const now = moment().tz("Asia/Jakarta").toDate();

        // Get or create a default pricing plan for manual admin subscriptions
        let pricingPlanId = planId;
        if (!pricingPlanId) {
            let manualPlan = await prisma.pricing_plans.findFirst({
                where: { code: 'MANUAL_ADMIN_SUB' }
            });

            if (!manualPlan) {
                manualPlan = await prisma.pricing_plans.create({
                    data: {
                        code: 'MANUAL_ADMIN_SUB',
                        name: 'Manual Admin Subscription',
                        description: 'Subscription added manually by admin',
                        price: 0,
                        bundle_type: 'subscription',
                        duration_days: null,
                        credits_included: 0,
                        is_active: false,
                    }
                });
            }

            pricingPlanId = manualPlan.id;
        }

        // Check if user has an active subscription in user_purchases
        const activePurchase = await prisma.user_purchases.findFirst({
            where: {
                user_id: userId,
                bundle_type: { in: ['subscription', 'hybrid'] },
                subscription_status: 'active',
                subscription_end: { gte: now }
            }
        });

        // If active subscription exists -> update end date
        if (activePurchase) {
            await prisma.user_purchases.update({
                where: { id: activePurchase.id },
                data: {
                    subscription_end: end
                }
            });

            return;
        }

        // If no active subscription -> create new one
        await prisma.user_purchases.create({
            data: {
                user_id: userId,
                pricing_plan_id: pricingPlanId,
                bundle_type: 'subscription',
                subscription_start: start,
                subscription_end: end,
                subscription_status: 'active',
                credits_granted: 0,
                payment_status: 'completed',
                payment_method: 'manual_admin',
                amount_paid: 0,
            }
        });
    }
}
