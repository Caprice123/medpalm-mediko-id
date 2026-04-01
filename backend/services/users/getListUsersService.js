import { ValidationError } from '#errors/validationError';
import prisma from '#prisma/client';
import { ValidatePaginationUtils } from '#utils/validatePaginationUtils';
import { BaseService } from "../baseService.js";
import moment from "moment-timezone";

export class GetListUsersService extends BaseService {
    static async call(filters = {}) {
        this.validate(filters)

        const userId = filters.userId
        const email = filters.email
        const name = filters.name
        const status = filters.status
        const page = Number(filters.page) || 1
        const perPage = Number(filters.perPage) || 50

        const where = {}

        // User ID filter - exact match
        if (userId) {
            where.id = userId
        }

        // Email filter - partial match (contains)
        if (email) {
            where.email = {
                contains: email,
                mode: 'insensitive'
            }
        }

        // Name filter - partial match (contains)
        if (name) {
            where.name = {
                contains: name,
                mode: 'insensitive'
            }
        }

        // Status filter - exact match
        if (status && status !== 'all') {
            where.is_active = status === 'active'
        }

        const users = await prisma.users.findMany({
            where,
            include: {
                user_subscription: {
                    orderBy: {
                        id: 'desc'
                    },
                    select: {
                        id: true,
                        start_date: true,
                        end_date: true,
                        status: true,
                        created_at: true,
                    }
                },
                user_credits: {
                    select: {
                        balance: true,
                        credit_type: true,
                        expires_at: true,
                    }
                }
            },
            orderBy: {
                id: 'desc'
            },
            skip: (page - 1) * perPage,
            take: perPage + 1
        })

        const isLastPage = users.length > perPage
        const usersToReturn = isLastPage ? users.slice(0, perPage) : users
        return { users: usersToReturn, isLastPage }
    }

    static validate(filters) {
        ValidatePaginationUtils.validate(Number(filters.page), Number(filters.perPage))

        // No need to validate email format since we're doing partial match search
        // Validate status if provided
        if (filters.status && !['all', 'active', 'inactive'].includes(filters.status)) {
            throw new ValidationError("Status must be 'all', 'active', or 'inactive'")
        }
    }
}