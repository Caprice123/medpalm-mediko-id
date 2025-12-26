import { GetSkripsiSetsService } from '../../../services/skripsi/getSkripsiSetsService.js'
import { CreateSkripsiSetService } from '../../../services/skripsi/createSkripsiSetService.js'
import { GetSkripsiSetService } from '../../../services/skripsi/getSkripsiSetService.js'
import { UpdateSkripsiSetService } from '../../../services/skripsi/updateSkripsiSetService.js'
import { UpdateSetContentService } from '../../../services/skripsi/updateSetContentService.js'
import { DeleteSkripsiSetService } from '../../../services/skripsi/deleteSkripsiSetService.js'

class SkripsiSetsController {
  // Get all skripsi sets for a user
  async getSets(req, res) {
    const userId = req.user.id
    const { page, perPage } = req.query

    const result = await GetSkripsiSetsService.call({
      userId,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Create a new skripsi set
  async createSet(req, res) {
    const userId = req.user.id
    const { title, description } = req.body

    const set = await CreateSkripsiSetService.call({
      userId,
      title,
      description
    })

    return res.status(201).json({
      success: true,
      data: set,
      message: 'Skripsi set created successfully'
    })
  }

  // Get a specific skripsi set with tabs and messages
  async getSet(req, res) {
    const userId = req.user.id
    const setId = parseInt(req.params.id)

    const set = await GetSkripsiSetService.call({
      setId,
      userId
    })

    return res.status(200).json({
      success: true,
      data: set
    })
  }

  // Update a skripsi set
  async updateSet(req, res) {
    const userId = req.user.id
    const setId = parseInt(req.params.id)
    const { title, description } = req.body

    const set = await UpdateSkripsiSetService.call({
      setId,
      userId,
      title,
      description
    })

    return res.status(200).json({
      success: true,
      data: set,
      message: 'Skripsi set updated successfully'
    })
  }

  // Update set editor content
  async updateContent(req, res) {
    const userId = req.user.id
    const setId = parseInt(req.params.id)
    const { editorContent } = req.body

    const set = await UpdateSetContentService.call({
      setId,
      userId,
      editorContent
    })

    return res.status(200).json({
      success: true,
      data: set,
      message: 'Content saved successfully'
    })
  }

  // Delete a skripsi set
  async deleteSet(req, res) {
    const userId = req.user.id
    const setId = parseInt(req.params.id)

    const result = await DeleteSkripsiSetService.call({
      setId,
      userId
    })

    return res.status(200).json({
      success: true,
      ...result
    })
  }
}

export default new SkripsiSetsController()
