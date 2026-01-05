import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class AttachPaymentEvidenceService extends BaseService {
  static async call(userId, purchaseId, blobId) {
    // Verify purchase belongs to user
    const purchase = await prisma.user_purchases.findFirst({
      where: {
        id: parseInt(purchaseId),
        user_id: userId
      }
    })

    if (!purchase) {
      return this.error('Purchase not found', 404)
    }

    // Only allow uploading evidence for manual payment method
    if (purchase.payment_method !== 'manual') {
      return this.error('Payment evidence can only be uploaded for manual payments', 400)
    }

    // Only allow uploading evidence for pending payments
    if (purchase.payment_status !== 'pending') {
      return this.error('Payment evidence can only be uploaded for pending payments', 400)
    }

    // Verify blob exists
    const blob = await prisma.blobs.findUnique({
      where: { id: parseInt(blobId) }
    })

    if (!blob) {
      return this.error('Blob not found', 404)
    }

      // Create attachment linking the blob to the purchase
      const attachment = await prisma.attachments.create({
        data: {
          name: 'payment_evidence',
          record_type: 'user_purchases',
          record_id: purchase.id,
          blob_id: parseInt(blobId)
        }
      })

      // Update payment status to waiting_approval
      await prisma.user_purchases.update({
        where: { id: purchase.id },
        data: {
          payment_status: 'waiting_approval',
          updated_at: new Date()
        }
      })

      return {
        attachmentId: attachment.id,
        filename: blob.filename,
        url: blob.key
      }
  }
}
