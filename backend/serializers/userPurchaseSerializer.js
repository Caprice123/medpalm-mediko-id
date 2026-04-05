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
      bundleType: purchase.bundle_type,
      description: `Purchase: ${purchase.pricing_plan?.name || 'Unknown Plan'}`,
      paymentStatus: purchase.payment_status,
      paymentMethod: purchase.payment_method,
      paymentReference: purchase.payment_reference,
      amountPaid: purchase.amount_paid,
      purchaseDate: purchase.purchase_date,
      phoneNumber: purchase.phone_number || null,
      university: purchase.university || null,
      createdAt: purchase.created_at,
      pricingPlan: purchase.pricing_plan ? {
        id: purchase.pricing_plan.id,
        name: purchase.pricing_plan.name,
        price: purchase.pricing_plan.price,
        bundleType: purchase.pricing_plan.bundle_type,
        creditsIncluded: purchase.pricing_plan.credits_included,
        durationDays: purchase.pricing_plan.duration_days
      } : null
    }
  }
}
