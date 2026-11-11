import prisma from '#prisma/client'
import { GetSkripsiSetsService } from '#services/skripsi/getSkripsiSetsService'
import { CreateSkripsiSetService } from '#services/skripsi/createSkripsiSetService'
import { GetSkripsiSetService } from '#services/skripsi/getSkripsiSetService'
import { UpdateSkripsiSetService } from '#services/skripsi/updateSkripsiSetService'
import { UpdateSetContentService } from '#services/skripsi/updateSetContentService'
import { DeleteSkripsiSetService } from '#services/skripsi/deleteSkripsiSetService'
import { GetSetResearchSettingsService } from '#services/skripsi/getSetResearchSettingsService'
import { UpdateSetResearchSettingsService } from '#services/skripsi/updateSetResearchSettingsService'
import { GetSkripsiBootstrapV2Service } from '#services/skripsi/v2/getSkripsiBootstrapV2Service'
import { SkripsiSetListV2Serializer } from '#serializers/api/v2/skripsiSetListSerializer'
import { SkripsiSetV2Serializer } from '#serializers/api/v2/skripsiSetSerializer'
import { NotFoundError } from '#errors/notFoundError'

// A set is addressed by its uniqueId in the URL but by its numeric id in the
// settings tables, so the two research-settings routes resolve it first. The
// `is_deleted` guard is what stops a soft-deleted set being reachable by id.
async function resolveSetId(uniqueId) {
  const set = await prisma.skripsi_sets.findFirst({
    where: { unique_id: uniqueId, is_deleted: false },
    select: { id: true },
  })

  if (!set) {
    throw new NotFoundError('Set tidak ditemukan')
  }

  return set.id
}

class SkripsiSetsV2Controller {
  // Config plus the first page of sets in one read, replacing V1's two calls
  // on mount.
  async bootstrap(req, res) {
    const { perPage } = req.query

    const result = await GetSkripsiBootstrapV2Service.call({
      userId: req.user.id,
      perPage: parseInt(perPage) || 20,
    })

    return res.status(200).json({ data: result })
  }

  async index(req, res) {
    const { page, perPage } = req.query

    const result = await GetSkripsiSetsService.call({
      userId: req.user.id,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
    })

    return res.status(200).json({
      data: SkripsiSetListV2Serializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  // Creating a set also creates its tab row, from whichever tabs are enabled
  // in the constants — so the full set shape is returned, tabs included, and
  // the client can open the editor without a second read.
  async create(req, res) {
    const { title, description } = req.body

    const set = await CreateSkripsiSetService.call({
      userId: req.user.id,
      title,
      description,
    })

    return res.status(201).json({
      data: SkripsiSetV2Serializer.serialize(set),
    })
  }

  async show(req, res) {
    const set = await GetSkripsiSetService.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      // Each tab pages its own messages in, so loading them here would pull
      // every conversation in the set on open.
      includeMessages: false,
    })

    return res.status(200).json({
      data: SkripsiSetV2Serializer.serialize(set),
    })
  }

  async update(req, res) {
    const { title, description } = req.body

    const set = await UpdateSkripsiSetService.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      title,
      description,
    })

    return res.status(200).json({
      data: SkripsiSetListV2Serializer.serializeOne(set),
    })
  }

  // The editor autosaves, so this is called far more often than the rest and
  // stays a separate route from `update` rather than a full set write.
  async updateContent(req, res) {
    await UpdateSetContentService.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      editorContent: req.body.editorContent,
    })

    return res.status(200).json({ data: { success: true } })
  }

  async destroy(req, res) {
    await DeleteSkripsiSetService.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
    })

    return res.status(200).json({ data: { success: true } })
  }

  // Research settings belong to the set, not the user: two sets can search
  // different journals and year ranges.
  async getResearchSettings(req, res) {
    const setId = await resolveSetId(req.params.uniqueId)
    const settings = await GetSetResearchSettingsService.call(setId, req.user.id)

    return res.status(200).json({ data: settings })
  }

  async updateResearchSettings(req, res) {
    const setId = await resolveSetId(req.params.uniqueId)
    const {
      selectedDomains,
      customDomains,
      domainFilterEnabled,
      selectedJournals,
      customJournals,
      latestYears,
      yearFrom,
      yearTo,
    } = req.body

    const settings = await UpdateSetResearchSettingsService.call(setId, req.user.id, {
      selectedDomains,
      customDomains,
      domainFilterEnabled,
      selectedJournals,
      customJournals,
      latestYears,
      yearFrom,
      yearTo,
    })

    return res.status(200).json({ data: settings })
  }
}

export default new SkripsiSetsV2Controller()
