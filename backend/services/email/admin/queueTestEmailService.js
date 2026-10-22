import validator from 'validator'
import { ValidationError } from '#errors/validationError'
import { queueTestEmail } from '#jobs/queues/emailQueue'

/**
 * Queues a diagnostic email so an admin can confirm the email worker is
 * consuming its queue and the mail provider can deliver.
 */
export class QueueTestEmailService {
  static async call({ to, requestedBy }) {
    if (!to || typeof to !== 'string') {
      throw new ValidationError('Alamat email wajib diisi')
    }

    const address = to.trim()
    if (!validator.isEmail(address)) {
      throw new ValidationError('Format alamat email tidak valid')
    }

    const job = await queueTestEmail({ to: address, requestedBy })

    return { jobId: job.id, to: address }
  }
}

export default QueueTestEmailService
