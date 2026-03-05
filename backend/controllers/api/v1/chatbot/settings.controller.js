import { GetUserChatbotSettingsService } from '#services/chatbot/user/getUserChatbotSettingsService'
import { UpdateUserChatbotSettingsService } from '#services/chatbot/user/updateUserChatbotSettingsService'

class ChatbotSettingsController {
  async getSettings(req, res) {
    const userId = req.user.id
    const settings = await GetUserChatbotSettingsService.call(userId)
    return res.status(200).json({ data: settings })
  }

  async updateSettings(req, res) {
    const userId = req.user.id
    const { selectedDomains, domainFilterEnabled } = req.body
    const settings = await UpdateUserChatbotSettingsService.call(userId, {
      selectedDomains,
      domainFilterEnabled
    })
    return res.status(200).json({ data: settings })
  }
}

export default new ChatbotSettingsController()
