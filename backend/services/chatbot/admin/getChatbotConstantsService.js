import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetChatbotConstantsService extends BaseService {
  static async call() {
    const constantKeys = [
      // Basic settings
      'chatbot_feature_title',
      'chatbot_feature_description',
      'chatbot_access_type',
      'chatbot_is_active',

      // Normal Mode settings
      'chatbot_normal_mode_is_active',
      'chatbot_normal_mode_model',
      'chatbot_normal_mode_cost',
      'chatbot_normal_mode_system_prompt',

      // Validated Search Mode settings
      'chatbot_validated_mode_is_active',
      'chatbot_validated_mode_search_count',
      'chatbot_validated_mode_model',
      'chatbot_validated_mode_cost',
      'chatbot_validated_mode_system_prompt',
      'chatbot_validated_rewrite_enabled',
      'chatbot_validated_rewrite_prompt',

      // Research Mode settings
      'chatbot_research_mode_is_active',
      'chatbot_research_mode_api_provider',
      'chatbot_research_mode_cost',
      'chatbot_research_mode_search_count',
      'chatbot_research_mode_system_prompt',

      // Conversation settings
      'chatbot_max_messages_per_conversation',
      'chatbot_max_conversations_per_user',
      'chatbot_message_max_length',
      'chatbot_topic_max_length',

      // Rate limiting
      'chatbot_rate_limit_per_minute',
      'chatbot_rate_limit_per_hour',

      // Auto-delete settings
      'chatbot_auto_delete_enabled',
      'chatbot_auto_delete_days',
      'chatbot_auto_delete_apply_to_all'
    ]

    const constants = await prisma.constants.findMany({
      where: {
        key: { in: constantKeys }
      }
    })

    // Transform to key-value object
    const constantsMap = {}
    constants.forEach(constant => {
      constantsMap[constant.key] = constant.value
    })

    return constantsMap
  }
}
