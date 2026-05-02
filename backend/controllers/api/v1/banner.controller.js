import { GetActiveBannersService } from '#services/banner/admin/GetActiveBannersService'
import { BannerSerializer } from '#serializers/api/v1/bannerSerializer'

class BannerController {
  async index(req, res) {
    const banners = await GetActiveBannersService.call()
    return res.status(200).json({ data: BannerSerializer.serializeList(banners) })
  }
}

export default new BannerController()
