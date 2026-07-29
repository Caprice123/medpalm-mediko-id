import { GetActiveFeaturesV2Service } from '#services/feature/getActiveFeaturesV2Service'

class FeatureV2Controller {
  async index(req, res) {
    const features = await GetActiveFeaturesV2Service.call()
    return res.status(200).json({ data: features })
  }
}

export default new FeatureV2Controller()
