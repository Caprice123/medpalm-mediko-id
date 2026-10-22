import { QueueTestEmailService } from '#services/email/admin/queueTestEmailService'

class EmailTestController {
  async create(req, res) {
    const { to } = req.body

    const result = await QueueTestEmailService.call({
      to,
      requestedBy: req.user?.email,
    })

    return res.status(202).json({
      message: 'Test email masuk antrian. Pantau prosesnya di /admin/queues.',
      data: result,
    })
  }
}

export default new EmailTestController()
