import prisma from '#prisma/client'
import { GetSkripsiSetsV2Service } from '#services/skripsi/v2/getSkripsiSetsV2Service'
import { CreateSkripsiSetV2Service } from '#services/skripsi/v2/createSkripsiSetV2Service'
import { GetSkripsiSetMembersV2Service } from '#services/skripsi/v2/getSkripsiSetMembersV2Service'
import { UpdateSkripsiSetMembersV2Service } from '#services/skripsi/v2/updateSkripsiSetMembersV2Service'
import { SkripsiSetMemberV2Serializer } from '#serializers/api/v2/skripsiSetMemberSerializer'
import { GetSkripsiSetV2Service } from '#services/skripsi/v2/getSkripsiSetV2Service'
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
    const { page, perPage, search } = req.query

    const result = await GetSkripsiSetsV2Service.call({
      userId: req.user.id,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      search,
    })

    return res.status(200).json({
      data: SkripsiSetListV2Serializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  // Creating a set also creates its tab row, from whichever tabs are enabled
  // in the constants, and stamps the chosen template's outline onto it as
  // sections — so the full set shape is returned and the client can open the
  // editor without a second read.
  async create(req, res) {
    const { title, description, templateId, workMode, caseText, members } = req.body

    const set = await CreateSkripsiSetV2Service.call({
      userId: req.user.id,
      title,
      description,
      templateId,
      workMode: workMode || 'manual',
      caseText,
      members,
    })

    return res.status(201).json({
      data: SkripsiSetV2Serializer.serialize(set),
    })
  }

  async show(req, res) {
    const set = await GetSkripsiSetV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
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

  // The group the report belongs to. Edited as one list, so it is written
  // back as one list rather than row by row.
  async members(req, res) {
    const members = await GetSkripsiSetMembersV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
    })

    return res.status(200).json({ data: SkripsiSetMemberV2Serializer.serialize(members) })
  }

  async updateMembers(req, res) {
    const members = await UpdateSkripsiSetMembersV2Service.call({
      setId: req.params.uniqueId,
      userId: req.user.id,
      members: req.body.members,
    })

    return res.status(200).json({ data: SkripsiSetMemberV2Serializer.serialize(members) })
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
