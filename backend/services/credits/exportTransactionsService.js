import { BaseService } from '../baseService.js'
import prisma from '#prisma/client'
import * as XLSX from 'xlsx'
import moment from 'moment-timezone'
import { UserPurchaseSerializer } from '../../serializers/userPurchaseSerializer.js'

const BATCH_SIZE = 100
const TIMEZONE = 'Asia/Jakarta'

export class ExportTransactionsService extends BaseService {
  static buildWhere(query) {
    const { code, id, email, status, type, startDate, endDate } = query
    const where = {}
    if (status) where.payment_status = status
    if (type) where.bundle_type = type
    if (id) where.id = parseInt(id)
    if (code) where.pricing_plan = { code: { contains: code, mode: 'insensitive' } }
    if (email) where.user = { email: { contains: email, mode: 'insensitive' } }
    if (startDate || endDate) {
      where.created_at = {}
      if (startDate) where.created_at.gte = moment.tz(startDate, 'YYYY-MM-DD', TIMEZONE).startOf('day').toDate()
      if (endDate) where.created_at.lte = moment.tz(endDate, 'YYYY-MM-DD', TIMEZONE).endOf('day').toDate()
    }
    return where
  }

  static async fetchAllInBatches(where) {
    const results = []
    let lastId = 0

    while (true) {
      const batch = await prisma.user_purchases.findMany({
        where: { ...where, id: { gt: lastId } },
        include: { user: true, pricing_plan: true },
        orderBy: { id: 'asc' },
        take: BATCH_SIZE,
      })

      if (batch.length === 0) break
      results.push(...batch)
      lastId = batch[batch.length - 1].id
      if (batch.length < BATCH_SIZE) break
    }

    return results
  }

  static buildWorkbook(transactions) {
    const wb = XLSX.utils.book_new()

    // Group by email, collect unique phones and universities
    const byEmail = {}
    for (const t of transactions) {
      const email = t.user?.email || ''
      if (!byEmail[email]) byEmail[email] = { phones: new Set(), universities: new Set() }
      if (t.phoneNumber) byEmail[email].phones.add(t.phoneNumber)
      if (t.university) byEmail[email].universities.add(t.university)
    }

    const rows = [['Email', 'No. HP', 'Universitas']]
    for (const [email, { phones, universities }] of Object.entries(byEmail)) {
      rows.push([
        email,
        [...phones].join(', '),
        [...universities].join(', '),
      ])
    }

    const sheet = XLSX.utils.aoa_to_sheet(rows)
    sheet['!cols'] = [{ wch: 35 }, { wch: 30 }, { wch: 40 }]
    XLSX.utils.book_append_sheet(wb, sheet, 'Data')

    return wb
  }

  static async call(query) {
    const where = this.buildWhere(query)
    const raw = await this.fetchAllInBatches(where)
    const transactions = UserPurchaseSerializer.serialize(raw)
    const wb = this.buildWorkbook(transactions)
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  }
}
