import { GetAdminSkripsiSetsService } from '#services/skripsi/admin/getAdminSkripsiSetsService'
import getAdminSkripsiSetService from '#services/skripsi/admin/getAdminSkripsiSetService'
import getAdminSkripsiSetTabsService from '#services/skripsi/admin/getAdminSkripsiSetTabsService'
import deleteAdminSkripsiSetService from '#services/skripsi/admin/deleteAdminSkripsiSetService'
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
    const { id } = req.params

    const set = await getAdminSkripsiSetService(parseInt(id))

    res.status(200).json({
      data: SkripsiSetSerializer.serialize(set)
    })
  }

  async getSetTabs(req, res) {
    const { id } = req.params

    const tabs = await getAdminSkripsiSetTabsService(parseInt(id))

    res.status(200).json({
      data: tabs
    })
  }

  async destroy(req, res) {
    const { id } = req.params

    await deleteAdminSkripsiSetService(parseInt(id))

    res.status(200).json({
      data: {
        success: true
      }
    })
  }
}

export default new SkripsiController()
