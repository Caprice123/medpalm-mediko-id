import { GetActiveFeaturesService } from '#services/feature/getActiveFeatures'

class FeatureController {
  /**
   * Get all active features
   * GET /api/v1/features
   */
  async index(req, res) {
    const features = await GetActiveFeaturesService.call()

    return res.status(200).json({
      data: features
    })
  }
}

export default new FeatureController()
