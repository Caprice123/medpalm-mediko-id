export class UserPurchaseSerializer {
  static serialize(purchases) {
    // If single purchase object, convert to array
    if (!Array.isArray(purchases)) {
      if (!purchases) return []
      return this.serializeOne(purchases)
    }

    return purchases.map((purchase) => this.serializeOne(purchase))
  }

  static serializeOne(purchase) {
    return {
      id: purchase.id,
      userId: purchase.user_id,
      user: purchase.user ? {
        id: purchase.user.id,
        name: purchase.user.name,
        email: purchase.user.email
      } : null,
      type: purchase.bundle_type,
      amount: purchase.credits_granted,
      description: `Purchase: ${purchase.pricing_plan?.name || 'Unknown Plan'}`,
      paymentStatus: purchase.payment_status,
      paymentMethod: purchase.payment_method,
      paymentReference: purchase.payment_reference,
      amountPaid: purchase.amount_paid,
      createdAt: purchase.purchase_date || purchase.created_at,
      creditPlan: purchase.pricing_plan ? {
        id: purchase.pricing_plan.id,
        name: purchase.pricing_plan.name,
        price: purchase.pricing_plan.price,
        bundleType: purchase.pricing_plan.bundle_type
      } : null,
      subscriptionStart: purchase.subscription_start,
      subscriptionEnd: purchase.subscription_end,
      subscriptionStatus: purchase.subscription_status
    }
  }
}
