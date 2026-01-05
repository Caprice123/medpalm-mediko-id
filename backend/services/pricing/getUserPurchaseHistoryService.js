import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserPurchaseHistoryService extends BaseService {
  static async call(userId, filters = {}) {
    // Pagination
    const page = parseInt(filters.page) || 1
    const perPage = parseInt(filters.perPage) || 10
    const skip = (page - 1) * perPage

    const purchases = await prisma.user_purchases.findMany({
      skip,
      take: perPage,
      where: {
        user_id: userId
      },
      include: {
        pricing_plan: true
      },
      orderBy: {
        purchase_date: 'desc'
      }
    })

    const mappedPurchases = purchases.map((purchase) => {
      return {
        id: purchase.id,
        planName: purchase.pricing_plan.name,
        bundleType: purchase.bundle_type,
        amountPaid: purchase.amount_paid,
        purchaseDate: purchase.purchase_date,
        paymentMethod: purchase.payment_method,
        paymentStatus: purchase.payment_status,
        paymentReference: purchase.payment_reference,
        // Pricing plan details
        pricingPlan: {
          creditsIncluded: purchase.pricing_plan.credits_included,
          durationDays: purchase.pricing_plan.duration_days
        }
      }
    })

    return {
      purchases: mappedPurchases,
      pagination: {
        page,
        perPage,
        isLastPage: purchases.length < perPage
      }
    }
  }
}
