import { BaseService } from '#services/baseService'
import { GetChatbotConfigService } from '#services/chatbot/getChatbotConfigService'
import { GetUserChatbotSettingsService } from '#services/chatbot/user/getUserChatbotSettingsService'
import { ValidationError } from '#errors/validationError'

// The V2 chat page needs the feature config and the signed-in user's own chat
// settings before it can render its composer at all. V1 asked for them as two
// separate requests on mount (`/config` then `/settings`), which left the mode
// selector briefly showing defaults that the settings call then corrected.
// This answers both in one read. Both V1 services stay untouched and still
// serve `/api/v1/chatbot/{config,settings}` for the archived V1 page.
export class GetChatbotBootstrapV2Service extends BaseService {
  static async call({ userId }) {
    this.validate({ userId })

    const [config, settings] = await Promise.all([
      GetChatbotConfigService.call(),
      GetUserChatbotSettingsService.call(userId),
    ])

    return { config, settings }
  }

  static validate({ userId }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('ID pengguna tidak valid')
    }
  }
}
