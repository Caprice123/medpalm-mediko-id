import { GetSkripsiSetsService } from '#services/skripsi/getSkripsiSetsService'
import { CreateSkripsiSetService } from '#services/skripsi/createSkripsiSetService'
import { GetSkripsiSetService } from '#services/skripsi/getSkripsiSetService'
import { UpdateSkripsiSetService } from '#services/skripsi/updateSkripsiSetService'
import { UpdateSetContentService } from '#services/skripsi/updateSetContentService'
import { DeleteSkripsiSetService } from '#services/skripsi/deleteSkripsiSetService'
import { GetSetResearchSettingsService } from '#services/skripsi/getSetResearchSettingsService'
import { UpdateSetResearchSettingsService } from '#services/skripsi/updateSetResearchSettingsService'
import { SkripsiSetListSerializer } from '#serializers/api/v1/skripsiSetListSerializer'
import { SkripsiSetSerializer } from '#serializers/api/v1/skripsiSetSerializer'
import { convertHtmlToDocxWithImages } from './htmlToDocx.controller.js'

async function resolveSet(req) {
  const prisma = (await import('#prisma/client')).default
  const set = await prisma.skripsi_sets.findFirst({
    where: { unique_id: req.params.uniqueId, is_deleted: false },
    select: { id: true }
  })
  if (!set) throw new Error('Set not found')
  return set
}

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
      data: SkripsiSetListSerializer.serialize(result.data),
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
      data: set,
      message: 'Skripsi set created successfully'
    })
  }

  // Get a specific skripsi set with tabs (WITHOUT messages - fetch messages separately per tab)
  async getSet(req, res) {
    const userId = req.user.id
    const setId = req.params.uniqueId

    const set = await GetSkripsiSetService.call({
      setId,
      userId,
      includeMessages: false // Don't include messages - fetch them separately per tab
    })

    return res.status(200).json({
      data: SkripsiSetSerializer.serialize(set)
    })
  }

  // Update a skripsi set
  async updateSet(req, res) {
    const userId = req.user.id
    const setId = req.params.uniqueId
    const { title, description } = req.body

    const set = await UpdateSkripsiSetService.call({
      setId,
      userId,
      title,
      description
    })

    return res.status(200).json({
      data: set,
      message: 'Skripsi set updated successfully'
    })
  }

  // Update set editor content
  async updateContent(req, res) {
    const userId = req.user.id
    const setId = req.params.uniqueId
    const { editorContent } = req.body

    const set = await UpdateSetContentService.call({
      setId,
      userId,
      editorContent
    })

    return res.status(200).json({
      data: set,
      message: 'Content saved successfully'
    })
  }

  // Get research domain settings for a set
  async getResearchSettings(req, res) {
    const set = await resolveSet(req)
    const settings = await GetSetResearchSettingsService.call(set.id)
    return res.status(200).json({ data: settings })
  }

  // Update research domain settings for a set
  async updateResearchSettings(req, res) {
    const userId = req.user.id
    const set = await resolveSet(req)
    const { selectedDomains, domainFilterEnabled } = req.body
    const settings = await UpdateSetResearchSettingsService.call(set.id, userId, {
      selectedDomains,
      domainFilterEnabled
    })
    return res.status(200).json({ data: settings })
  }

  // Delete a skripsi set
  async deleteSet(req, res) {
    const userId = req.user.id
    const setId = req.params.uniqueId

    const result = await DeleteSkripsiSetService.call({
      setId,
      userId
    })

    return res.status(200).json({
      ...result
    })
  }

  // Export set to Word document
  async exportToWord(req, res) {
    // Use the new reliable docx implementation
    req.body.fileName = req.body.title || 'document'
    return convertHtmlToDocxWithImages(req, res)
  }
}

export default new SkripsiSetsController()
