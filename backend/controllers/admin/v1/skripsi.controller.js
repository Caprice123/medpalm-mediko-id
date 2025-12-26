import getSkripsiConstantsService from '../../../services/skripsi/admin/getSkripsiConstantsService.js'
import updateSkripsiConstantService from '../../../services/skripsi/admin/updateSkripsiConstantService.js'
import { GetAdminSkripsiSetsService } from '../../../services/skripsi/admin/getAdminSkripsiSetsService.js'
import getAdminSkripsiSetService from '../../../services/skripsi/admin/getAdminSkripsiSetService.js'
import getAdminSkripsiSetTabsService from '../../../services/skripsi/admin/getAdminSkripsiSetTabsService.js'
import deleteAdminSkripsiSetService from '../../../services/skripsi/admin/deleteAdminSkripsiSetService.js'

export const getConstants = async (req, res) => {
  try {
    const result = await getSkripsiConstantsService()

    res.status(200).json({
      success: true,
      message: 'Constants retrieved successfully',
      data: result.constants,
      raw: result.raw
    })
  } catch (error) {
    console.error('Get constants error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get constants'
    })
  }
}

export const updateConstant = async (req, res) => {
  try {
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
      success: true,
      message: 'Constant updated successfully',
      data: constant
    })
  } catch (error) {
    console.error('Update constant error:', error)
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update constant'
    })
  }
}

export const updateMultipleConstants = async (req, res) => {
  try {
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
      success: true,
      message: 'Constants updated successfully',
      data: results
    })
  } catch (error) {
    console.error('Update multiple constants error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update constants'
    })
  }
}

// Skripsi Sets Management
export const getSets = async (req, res) => {
  try {
    const { page, perPage, userId, search } = req.query

    const result = await GetAdminSkripsiSetsService.call({
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      userId: userId ? parseInt(userId) : undefined,
      search
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('Get sets error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get sets'
    })
  }
}

export const getSet = async (req, res) => {
  try {
    const { id } = req.params

    const set = await getAdminSkripsiSetService(parseInt(id))

    res.status(200).json({
      success: true,
      data: set
    })
  } catch (error) {
    console.error('Get set error:', error)
    res.status(error.message === 'Skripsi set not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to get set'
    })
  }
}

export const getSetTabs = async (req, res) => {
  try {
    const { id } = req.params

    const tabs = await getAdminSkripsiSetTabsService(parseInt(id))

    res.status(200).json({
      success: true,
      data: tabs
    })
  } catch (error) {
    console.error('Get set tabs error:', error)
    res.status(error.message === 'Skripsi set not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to get set tabs'
    })
  }
}

export const deleteSet = async (req, res) => {
  try {
    const { id } = req.params

    await deleteAdminSkripsiSetService(parseInt(id))

    res.status(200).json({
      success: true,
      message: 'Skripsi set deleted successfully'
    })
  } catch (error) {
    console.error('Delete set error:', error)
    res.status(error.message === 'Skripsi set not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to delete set'
    })
  }
}
