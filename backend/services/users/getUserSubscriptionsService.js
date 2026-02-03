import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { ValidatePaginationUtils } from '#utils/validatePaginationUtils';
import { BaseService } from "../baseService.js";

export class GetUserSubscriptionsService extends BaseService {
    static async call(userId, filters = {}) {
        this.validate(userId, filters)

        const page = Number(filters.page) || 1
        const perPage = Number(filters.perPage) || 20

        const where = {
            user_id: userId
        }

        // Filter by status
        if (filters.status === 'active') {
            // For active: must have status='active' AND current date is between start_date and end_date
            const now = new Date()
            where.status = 'active'
            where.start_date = { lte: now }
            where.end_date = { gte: now }
        } else if (filters.status && filters.status !== 'all') {
            // For other specific statuses
            where.status = filters.status
        }
        // If status is 'all' or undefined, don't add status filter

        const subscriptions = await prisma.user_subscriptions.findMany({
            where,
            orderBy: {
                created_at: 'desc'
            },
            skip: (page - 1) * perPage,
            take: perPage + 1
        })

        const isLastPage = subscriptions.length <= perPage
        const subscriptionsToReturn = isLastPage ? subscriptions : subscriptions.slice(0, perPage)

        // Mark which subscriptions are currently active based on date range
        const now = new Date()
        const enrichedSubscriptions = subscriptionsToReturn.map(sub => ({
            ...sub,
            isCurrentlyActive: sub.start_date <= now && now <= sub.end_date && sub.status === 'active'
        }))

        return { subscriptions: enrichedSubscriptions, isLastPage }
    }

    static validate(userId, filters) {
        if (!userId || isNaN(parseInt(userId))) {
            throw new ValidationError("Valid userId is required")
        }

        ValidatePaginationUtils.validate(Number(filters.page), Number(filters.perPage))

        // Validate status if provided
        if (filters.status && !['all', 'active', 'not_active', 'expired'].includes(filters.status)) {
            throw new ValidationError("Status must be 'all', 'active', 'not_active', or 'expired'")
        }
    }
}
