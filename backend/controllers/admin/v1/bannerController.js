import { CreateBannerService } from '#services/banner/admin/CreateBannerService'
import { GetBannersService } from '#services/banner/admin/GetBannersService'
import { GetBannerDetailService } from '#services/banner/admin/GetBannerDetailService'
import { UpdateBannerService } from '#services/banner/admin/UpdateBannerService'
import { DeleteBannerService } from '#services/banner/admin/DeleteBannerService'
import { BannerSerializer } from '#serializers/admin/v1/bannerSerializer'

class AdminBannerController {
  async index(req, res) {
    const { page, perPage, search } = req.query
    const result = await GetBannersService.call({ page, perPage, search })
    return res.status(200).json({
      data: BannerSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }

  async create(req, res) {
    const { title, description, redirectUrl, redirectLabel, gradientStart, gradientEnd, isActive, order, imageBlobId } = req.body
    const banner = await CreateBannerService.call({ title, description, redirectUrl, redirectLabel, gradientStart, gradientEnd, isActive, order, imageBlobId })
    return res.status(201).json({ data: BannerSerializer.serialize(banner) })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const banner = await GetBannerDetailService.call(uniqueId)
    return res.status(200).json({ data: BannerSerializer.serialize(banner) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, redirectUrl, redirectLabel, gradientStart, gradientEnd, isActive, order, imageBlobId } = req.body
    const banner = await UpdateBannerService.call({ uniqueId, title, description, redirectUrl, redirectLabel, gradientStart, gradientEnd, isActive, order, imageBlobId })
    return res.status(200).json({ data: BannerSerializer.serialize(banner) })
  }

  async delete(req, res) {
    const { uniqueId } = req.params
    await DeleteBannerService.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }
}

export default new AdminBannerController()
