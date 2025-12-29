import getSkripsiConstantsService from '#services/skripsi/admin/getSkripsiConstantsService'
import updateSkripsiConstantService from '#services/skripsi/admin/updateSkripsiConstantService'
import { GetAdminSkripsiSetsService } from '#services/skripsi/admin/getAdminSkripsiSetsService'
import getAdminSkripsiSetService from '#services/skripsi/admin/getAdminSkripsiSetService'
import getAdminSkripsiSetTabsService from '#services/skripsi/admin/getAdminSkripsiSetTabsService'
import deleteAdminSkripsiSetService from '#services/skripsi/admin/deleteAdminSkripsiSetService'
import { SkripsiSetSerializer } from '#serializers/admin/v1/skripsiSetSerializer'
import { SkripsiSetListSerializer } from '#serializers/admin/v1/skripsiSetListSerializer'

class SkripsiController {
  async getConstants(req, res) {
    const result = await getSkripsiConstantsService()

    res.status(200).json({
      message: 'Constants retrieved successfully',
      data: result.constants,
      raw: result.raw
    })
  }

  async updateConstant(req, res) {
    const { key, value } = req.body

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Key is required'
      })
    }

    if (value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      })
    }

    const constant = await updateSkripsiConstantService(key, value)

    res.status(200).json({
      message: 'Constant updated successfully',
      data: constant
    })
  }

  async updateMultipleConstants(req, res) {
    const { constants } = req.body

    if (!constants || typeof constants !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Constants object is required'
      })
    }

    const results = []
    const errors = []

    for (const [key, value] of Object.entries(constants)) {
      try {
        const constant = await updateSkripsiConstantService(key, value)
        results.push(constant)
      } catch (error) {
        errors.push({ key, error: error.message })
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some constants failed to update',
        data: results,
        errors
      })
    }

    res.status(200).json({
      message: 'Constants updated successfully',
      data: results
    })
  }

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
      message: 'Skripsi set deleted successfully'
    })
  }
}

export default new SkripsiController()
