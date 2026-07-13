import { ToggleFavoriteService } from '#services/favorites/toggleFavoriteService'
import { GetFavoritesService } from '#services/favorites/getFavoritesService'

class FavoritesController {
  async index(req, res) {
    const { recordType } = req.query
    const records = await GetFavoritesService.call({ userId: req.user.id, recordType })
    res.json({ data: records })
  }

  async toggle(req, res) {
    const { recordType, recordId } = req.body
    const result = await ToggleFavoriteService.call({ userId: req.user.id, recordType, recordId })
    res.json({ data: result })
  }
}

export default new FavoritesController()
