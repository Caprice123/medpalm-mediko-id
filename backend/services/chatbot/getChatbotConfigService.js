import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetChatbotConfigService extends BaseService {
  static async call() {
    const constantKeys = [
      'chatbot_is_active',
      'chatbot_normal_enabled',
      'chatbot_validated_enabled',
      'chatbot_research_enabled',
      'chatbot_normal_cost',
      'chatbot_validated_cost',
      'chatbot_research_cost',
      'chatbot_normal_user_information',
      'chatbot_validated_user_information',
      'chatbot_research_user_information'
    ]

    const constantsMap = await GetConstantsService.call({ keys: constantKeys })

    console.log(constantsMap)
    console.log(parseFloat(constantsMap.chatbot_research_cost))
    return {
      is_active: constantsMap.chatbot_is_active === 'true',
      availableModes: {
        normal: constantsMap.chatbot_normal_enabled === 'true',
        validated: constantsMap.chatbot_validated_enabled === 'true',
        research: constantsMap.chatbot_research_enabled === 'true'
      },
      costs: {
        normal: parseFloat(constantsMap.chatbot_normal_cost),
        validated: parseFloat(constantsMap.chatbot_validated_cost),
        research: parseFloat(constantsMap.chatbot_research_cost)
      },
      userInformation: {
        normal: constantsMap.chatbot_normal_user_information || '',
        validated: constantsMap.chatbot_validated_user_information || '',
        research: constantsMap.chatbot_research_user_information || ''
      }
    }
  }
}
