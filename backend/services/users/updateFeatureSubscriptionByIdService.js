import momentTz from 'moment-timezone'

const TZ = 'Asia/Jakarta'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateFeatureSubscriptionByIdService extends BaseService {
  static async call(id, { startDate, endDate }) {
    const now = new Date()
    const data = { updated_at: now }
    if (startDate !== undefined) data.start_date = momentTz(startDate || now).tz(TZ).startOf('day').toDate()
    if (endDate !== undefined) data.end_date = momentTz(endDate).tz(TZ).endOf('day').toDate()

    const row = await prisma.user_feature_subscriptions.update({
      where: { id },
      data,
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    return {
      id: row.id,
      userId: row.user_id,
      feature: row.feature,
      startDate: row.start_date,
      endDate: row.end_date,
      isActive: row.start_date <= now && row.end_date >= now,
      createdAt: row.created_at,
      user: row.user ? { id: row.user.id, name: row.user.name, email: row.user.email } : null,
    }
  }
}
