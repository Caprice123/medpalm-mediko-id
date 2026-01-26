import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateChatbotConstantsService extends BaseService {
  static async call({ constants }) {
    this.validate({ constants })

    // Update constants one by one
    const updates = Object.entries(constants).map(([key, value]) => {
      return prisma.constants.upsert({
        where: { key },
        update: { value: String(value), updated_at: new Date() },
        create: { key, value: String(value) }
      })
    })

    await prisma.$transaction(updates)

    return true
  }

  static validate({ constants }) {
    if (!constants || typeof constants !== 'object') {
      throw new ValidationError('Constants must be an object')
    }

    if (Object.keys(constants).length === 0) {
      throw new ValidationError('At least one constant must be provided')
    }

    // Validate that keys are chatbot-related
    const allowedKeys = [
      'chatbot_feature_title',
      'chatbot_feature_description',
      'chatbot_access_type',
      'chatbot_is_active',
      'chatbot_normal_mode_is_active',
      'chatbot_normal_mode_model',
      'chatbot_normal_mode_cost',
      'chatbot_normal_mode_system_prompt',
      'chatbot_validated_mode_is_active',
      'chatbot_validated_mode_search_count',
      'chatbot_validated_mode_model',
      'chatbot_validated_mode_cost',
      'chatbot_validated_mode_system_prompt',
      'chatbot_validated_search_count',
      'chatbot_validated_threshold',
      'chatbot_validated_rewrite_enabled',
      'chatbot_validated_rewrite_prompt',
      'chatbot_research_mode_is_active',
      'chatbot_research_mode_api_provider',
      'chatbot_research_mode_cost',
      'chatbot_research_mode_search_count',
      'chatbot_research_mode_system_prompt',
      'chatbot_max_messages_per_conversation',
      'chatbot_max_conversations_per_user',
      'chatbot_message_max_length',
      'chatbot_topic_max_length',
      'chatbot_rate_limit_per_minute',
      'chatbot_rate_limit_per_hour',
      'chatbot_auto_delete_enabled',
      'chatbot_auto_delete_days',
      'chatbot_auto_delete_apply_to_all'
    ]

    for (const key of Object.keys(constants)) {
      if (!allowedKeys.includes(key)) {
        throw new ValidationError(`Invalid constant key: ${key}`)
      }
    }
  }
}
