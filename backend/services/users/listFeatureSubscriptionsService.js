import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ALL_FEATURES } from './getUserFeatureSubscriptionsService.js'

export class ListFeatureSubscriptionsService extends BaseService {
  static async call(filters = {}) {
    const feature = filters.feature
    const userId = filters.userId ? parseInt(filters.userId) : undefined
    const isActive = filters.isActive // 'true' | 'false' | undefined
    const search = filters.search
    const page = Number(filters.page) || 1
    const perPage = Number(filters.perPage) || 20
    const now = new Date()

    const where = {}

    if (feature && ALL_FEATURES.includes(feature)) where.feature = feature
    if (userId) where.user_id = userId
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    // isActive filter: active = start_date <= now AND (end_date IS NULL OR end_date >= now)
    if (isActive === 'true') {
      where.start_date = { lte: now }
      where.end_date = { gte: now }
    } else if (isActive === 'false') {
      where.OR = [
        { start_date: { gt: now } },
        { end_date: { lt: now } },
      ]
    }

    const rows = await prisma.user_feature_subscriptions.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { id: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = rows.length <= perPage
    const items = isLastPage ? rows : rows.slice(0, perPage)

    return {
      items: items.map(r => ({
        id: r.id,
        userId: r.user_id,
        feature: r.feature,
        startDate: r.start_date,
        endDate: r.end_date,
        isActive: r.start_date <= now && r.end_date >= now,
        createdAt: r.created_at,
        user: r.user ? { id: r.user.id, name: r.user.name, email: r.user.email } : null,
      })),
      isLastPage,
    }
  }
}
