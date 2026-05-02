import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class CreatePricingPlanService extends BaseService {
  static async call(req) {
    const {
      name,
      code,
      description,
      price,
      bundle_type,
      duration_days,
      credits_included,
      credit_type,
      credit_expiry_days,
      is_popular,
      discount,
      order,
      allowed_payment_method,
      allowed_features,
    } = req.body

    // Convert allowed_payment_method array to comma-separated string
    let paymentMethods = allowed_payment_method || 'midtrans'

    const resolvedCreditType = credit_type || 'permanent'

    const plan = await prisma.pricing_plans.create({
      data: {
        name,
        code: code || null,
        description,
        price: Number(price),
        bundle_type: bundle_type || 'credits',
        duration_days: bundle_type === 'subscription' || bundle_type === 'hybrid' ? Number(duration_days) : null,
        credits_included: Number(credits_included) || 0,
        credit_type: resolvedCreditType,
        credit_expiry_days: resolvedCreditType === 'expiring' && credit_expiry_days ? Number(credit_expiry_days) : null,
        is_active: true,
        is_popular: is_popular || false,
        discount: Number(discount) || 0,
        order: Number(order) || 0,
        allowed_payment_method: paymentMethods,
        allowed_features: Array.isArray(allowed_features) ? allowed_features : [],
      }
    })

    return plan
  }
}
