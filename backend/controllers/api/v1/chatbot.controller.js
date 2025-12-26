import { GetChatbotConfigService } from '#services/chatbot/getChatbotConfigService'

class ChatbotController {
  // Get chatbot configuration (available modes, costs, etc.)
  async getConfig(req, res) {
    const config = await GetChatbotConfigService.call()

    return res.status(200).json({
      success: true,
      data: config
    })
  }
}

export default new ChatbotController()
