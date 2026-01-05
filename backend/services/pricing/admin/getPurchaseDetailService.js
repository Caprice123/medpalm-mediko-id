import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

export class GetPurchaseDetailService extends BaseService {
  static async call(purchaseId) {
    const purchase = await prisma.user_purchases.findFirst({
      where: {
        id: parseInt(purchaseId)
      },
      include: {
        pricing_plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!purchase) {
      throw new ValidationError('Purchase not found')
    }

    // Fetch payment evidence attachments
    const attachments = await prisma.attachments.findMany({
      where: {
        record_type: 'user_purchases',
        record_id: purchase.id,
        name: 'payment_evidence'
      },
      include: {
        blob: true
      }
    })

    const purchaseData = {
      id: purchase.id,
      user: {
        id: purchase.user.id,
        name: purchase.user.name,
        email: purchase.user.email
      },
      planName: purchase.pricing_plan.name,
      planDescription: purchase.pricing_plan.description,
      bundleType: purchase.bundle_type,
      amountPaid: purchase.amount_paid,
      purchaseDate: purchase.purchase_date,
      paymentMethod: purchase.payment_method,
      paymentStatus: purchase.payment_status,
      paymentReference: purchase.payment_reference,
      createdAt: purchase.created_at,
      updatedAt: purchase.updated_at,
      // Pricing plan details
      pricingPlan: {
        id: purchase.pricing_plan.id,
        code: purchase.pricing_plan.code,
        name: purchase.pricing_plan.name,
        description: purchase.pricing_plan.description,
        price: purchase.pricing_plan.price,
        creditsIncluded: purchase.pricing_plan.credits_included,
        durationDays: purchase.pricing_plan.duration_days,
        bundleType: purchase.pricing_plan.bundle_type
      }
    }

    // Add payment evidence if exists
    if (attachments.length > 0) {
      // Get blob keys for presigned URL generation
      const blobKeys = attachments.map(attachment => attachment.blob.key)

      // Generate presigned URLs (7 days expiration)
      const presignedUrls = await idriveService.getBulkSignedUrls(blobKeys, 7 * 24 * 60 * 60)

      // Map presigned URLs to attachments
      purchaseData.paymentEvidence = attachments.map((attachment, index) => ({
        id: attachment.id,
        filename: attachment.blob.filename,
        url: presignedUrls[index],
        contentType: attachment.blob.content_type,
        uploadedAt: attachment.created_at
      }))
    }

    return purchaseData
  }
}
