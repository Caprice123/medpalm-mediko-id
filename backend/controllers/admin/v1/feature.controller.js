import { GetAdminFeaturesService } from '#services/feature/getAdminFeaturesService'

class AdminFeatureController {
  /**
   * Get features filtered by user permissions
   * GET /admin/v1/features
   */
  async index(req, res) {
    const user = req.user
    const features = await GetAdminFeaturesService.call(user)

    return res.status(200).json({
      data: features
    })
  }
}

export default new AdminFeatureController()
