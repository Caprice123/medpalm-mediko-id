import { GetAdminSkripsiSetsService } from '#services/skripsi/admin/getAdminSkripsiSetsService'
import getAdminSkripsiSetService from '#services/skripsi/admin/getAdminSkripsiSetService'
import getAdminSkripsiSetTabsService from '#services/skripsi/admin/getAdminSkripsiSetTabsService'
import deleteAdminSkripsiSetService from '#services/skripsi/admin/deleteAdminSkripsiSetService'
import { GetSkripsiResearchDomainsService } from '#services/skripsi/admin/getResearchDomainsService'
import { CreateSkripsiResearchDomainService } from '#services/skripsi/admin/createResearchDomainService'
import { UpdateSkripsiResearchDomainService } from '#services/skripsi/admin/updateResearchDomainService'
import { DeleteSkripsiResearchDomainService } from '#services/skripsi/admin/deleteResearchDomainService'
import { GetSkripsiJournalNamesService } from '#services/skripsi/admin/getSkripsiJournalNamesService'
import { CreateSkripsiJournalNameService } from '#services/skripsi/admin/createSkripsiJournalNameService'
import { UpdateSkripsiJournalNameService } from '#services/skripsi/admin/updateSkripsiJournalNameService'
import { DeleteSkripsiJournalNameService } from '#services/skripsi/admin/deleteSkripsiJournalNameService'
import { SkripsiSetSerializer } from '#serializers/admin/v1/skripsiSetSerializer'
import { SkripsiSetListSerializer } from '#serializers/admin/v1/skripsiSetListSerializer'

class SkripsiController {
  async index(req, res) {
    const { page, perPage, userId, search } = req.query

    const result = await GetAdminSkripsiSetsService.call({
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      userId: userId ? parseInt(userId) : undefined,
      search
    })

    return res.status(200).json({
      data: SkripsiSetListSerializer.serialize(result.data),
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const set = await getAdminSkripsiSetService(uniqueId)

    res.status(200).json({
      data: SkripsiSetSerializer.serialize(set)
    })
  }

  async getSetTabs(req, res) {
    const { uniqueId } = req.params

    const tabs = await getAdminSkripsiSetTabsService(uniqueId)

    res.status(200).json({
      data: tabs
    })
  }

  async destroy(req, res) {
    const { uniqueId } = req.params

    await deleteAdminSkripsiSetService(uniqueId)

    res.status(200).json({
      data: {
        success: true
      }
    })
  }

  // ---- Research Domains ----

  async getResearchDomains(req, res) {
    const { page = 1, perPage = 12, search = '' } = req.query
    const result = await GetSkripsiResearchDomainsService.call({
      page: parseInt(page),
      perPage: parseInt(perPage),
      search
    })
    return res.status(200).json({ data: result })
  }

  async createResearchDomain(req, res) {
    const { domain } = req.body
    const created = await CreateSkripsiResearchDomainService.call({ domain })
    return res.status(201).json({ data: created })
  }

  async updateResearchDomain(req, res) {
    const { id } = req.params
    const { is_active } = req.body
    const updated = await UpdateSkripsiResearchDomainService.call({ id, is_active })
    return res.status(200).json({ data: updated })
  }

  async deleteResearchDomain(req, res) {
    const { id } = req.params
    await DeleteSkripsiResearchDomainService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }

  // ---- Journal Names ----

  async getJournals(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const result = await GetSkripsiJournalNamesService.call({ page: parseInt(page), perPage: parseInt(perPage), search })
    return res.status(200).json({ data: result })
  }

  async createJournal(req, res) {
    const { name } = req.body
    const journal = await CreateSkripsiJournalNameService.call({ name })
    return res.status(201).json({ data: journal })
  }

  async updateJournal(req, res) {
    const { id } = req.params
    const { name, is_active } = req.body
    const journal = await UpdateSkripsiJournalNameService.call({ id, name, is_active })
    return res.status(200).json({ data: journal })
  }

  async deleteJournal(req, res) {
    const { id } = req.params
    await DeleteSkripsiJournalNameService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new SkripsiController()
