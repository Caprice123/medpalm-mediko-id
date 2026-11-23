import { GetSkripsiTemplatesV2Service } from '#services/skripsi/v2/getSkripsiTemplatesV2Service'
import { CreateUserSkripsiTemplateV2Service } from '#services/skripsi/v2/createUserSkripsiTemplateV2Service'
import { DeleteUserSkripsiTemplateV2Service } from '#services/skripsi/v2/deleteUserSkripsiTemplateV2Service'
import { SkripsiTemplateV2Serializer } from '#serializers/api/v2/skripsiTemplateSerializer'

class SkripsiTemplatesV2Controller {
  // The picker on "Buat laporan baru": the admin-managed templates plus the
  // student's own, searchable and paged - the catalogue is whatever an admin
  // has published, and every row carries its section list for the card.
  async index(req, res) {
    const { page, perPage, search } = req.query

    const { data, pagination } = await GetSkripsiTemplatesV2Service.call({
      userId: req.user.id,
      page: page ? parseInt(page) : undefined,
      perPage: perPage ? parseInt(perPage) : undefined,
      search,
    })

    return res.status(200).json({
      data: SkripsiTemplateV2Serializer.serialize(data, req.user.id),
      pagination,
    })
  }

  // "Simpan sebagai template saya" from the editor: the open report's outline,
  // saved for the next one.
  async create(req, res) {
    const { setId, name } = req.body

    const template = await CreateUserSkripsiTemplateV2Service.call({
      userId: req.user.id,
      setId,
      name,
    })

    return res.status(201).json({
      data: SkripsiTemplateV2Serializer.serializeOne(template, req.user.id),
    })
  }

  async destroy(req, res) {
    await DeleteUserSkripsiTemplateV2Service.call({
      userId: req.user.id,
      templateId: req.params.id,
    })

    return res.status(200).json({ data: { success: true } })
  }
}

export default new SkripsiTemplatesV2Controller()
