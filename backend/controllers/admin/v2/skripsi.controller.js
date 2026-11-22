import { GetSkripsiTemplatesAdminV2Service } from '#services/skripsi/admin/v2/getSkripsiTemplatesAdminV2Service'
import { GetSkripsiTemplateAdminV2Service } from '#services/skripsi/admin/v2/getSkripsiTemplateAdminV2Service'
import { CreateSkripsiTemplateV2Service } from '#services/skripsi/admin/v2/createSkripsiTemplateV2Service'
import { UpdateSkripsiTemplateV2Service } from '#services/skripsi/admin/v2/updateSkripsiTemplateV2Service'
import { DeleteSkripsiTemplateV2Service } from '#services/skripsi/admin/v2/deleteSkripsiTemplateV2Service'
import { SkripsiTemplateAdminV2Serializer } from '#serializers/admin/v2/skripsiTemplateSerializer'

class SkripsiAdminV2Controller {
  async indexTemplates(req, res) {
    const { page, perPage, search } = req.query

    const result = await GetSkripsiTemplatesAdminV2Service.call({ page, perPage, search })

    return res.status(200).json({
      data: SkripsiTemplateAdminV2Serializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  // One template with its outline: what the edit form opens on, and the only
  // read that carries sections.
  async showTemplate(req, res) {
    const template = await GetSkripsiTemplateAdminV2Service.call({ id: req.params.id })

    return res.status(200).json({ data: SkripsiTemplateAdminV2Serializer.serializeOne(template) })
  }

  async createTemplate(req, res) {
    const { name, description, position, isActive, sections } = req.body

    const template = await CreateSkripsiTemplateV2Service.call({
      name,
      description,
      position,
      isActive,
      sections,
    })

    return res.status(201).json({ data: SkripsiTemplateAdminV2Serializer.serializeOne(template) })
  }

  async updateTemplate(req, res) {
    const { name, description, position, isActive, sections } = req.body

    const template = await UpdateSkripsiTemplateV2Service.call({
      id: req.params.id,
      name,
      description,
      position,
      isActive,
      sections,
    })

    return res.status(200).json({ data: SkripsiTemplateAdminV2Serializer.serializeOne(template) })
  }

  async destroyTemplate(req, res) {
    await DeleteSkripsiTemplateV2Service.call({ id: req.params.id })

    return res.status(200).json({ data: { success: true } })
  }

}

export default new SkripsiAdminV2Controller()
