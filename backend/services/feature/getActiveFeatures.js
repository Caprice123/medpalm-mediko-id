import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class GetActiveFeaturesService extends BaseService {
  static async call() {

    const featureConstants = await GetConstantsService.call([
        "exercise_feature_title",
        "exercise_feature_description",
        "exercise_credit_cost",
        "exercise_session_type",
        "exercise_is_active",
        "flashcard_feature_title",
        "flashcard_feature_description",
        "flashcard_credit_cost",
        "flashcard_session_type",
        "flashcard_is_active",
        "summary_notes_feature_title",
        "summary_notes_feature_description",
        "summary_notes_credit_cost",
        "summary_notes_is_active",
        "calculator_feature_title",
        "calculator_feature_description",
        "calculator_credit_cost",
        "calculator_is_active",
        "anatomy_feature_title",
        "anatomy_feature_description",
        "anatomy_credit_cost",
        "anatomy_access_type",
        "anatomy_is_active",
        "mcq_feature_title",
        "mcq_feature_description",
        "mcq_credit_cost",
        "mcq_session_type",
        "mcq_is_active",
        "chatbot_feature_title",
        "chatbot_feature_description",
        "chatbot_access_type",
        "chatbot_is_active",
        "skripsi_feature_title",
        "skripsi_feature_description",
        "skripsi_access_type",
        "skripsi_is_active",
    ])

    const features = []

    // Exercise feature
    if (featureConstants.exercise_feature_title) {
      features.push({
        name: featureConstants.exercise_feature_title,
        description: featureConstants.exercise_feature_description,
        cost: parseFloat(featureConstants.exercise_credit_cost) || 0,
        icon: '🎓',
        sessionType: featureConstants.exercise_session_type,
        isActive: featureConstants.exercise_is_active
      })
    }

    // Flashcard feature
    if (featureConstants.flashcard_feature_title) {
      features.push({
        name: featureConstants.flashcard_feature_title,
        description: featureConstants.flashcard_feature_description,
        cost: parseFloat(featureConstants.flashcard_credit_cost) || 0,
        icon: '🎴',
        sessionType: featureConstants.flashcard_session_type,
        isActive: featureConstants.flashcard_is_active
      })
    }

    // Summary Notes feature
    if (featureConstants.summary_notes_feature_title) {
      features.push({
        name: featureConstants.summary_notes_feature_title,
        description: featureConstants.summary_notes_feature_description,
        cost: parseFloat(featureConstants.summary_notes_credit_cost) || 0,
        icon: '📝',
        sessionType: 'summary_notes',
        isActive: featureConstants.summary_notes_is_active
      })
    }

    // Calculator feature
    if (featureConstants.calculator_feature_title) {
      features.push({
        name: featureConstants.calculator_feature_title,
        description: featureConstants.calculator_feature_description,
        cost: parseFloat(featureConstants.calculator_credit_cost) || 0,
        icon: '🧮',
        sessionType: "calculator",
        isActive: featureConstants.calculator_is_active
      })
    }

    // Anatomy Quiz feature
    if (featureConstants.anatomy_feature_title && featureConstants.anatomy_is_active === 'true') {
      features.push({
        name: featureConstants.anatomy_feature_title,
        description: featureConstants.anatomy_feature_description,
        cost: parseFloat(featureConstants.anatomy_credit_cost) || 0,
        icon: '🫀',
        accessType: featureConstants.anatomy_access_type || 'subscription',
        sessionType: "anatomy",
        isActive: featureConstants.anatomy_is_active
      })
    }

    // Multiple Choice Quiz feature
    if (featureConstants.mcq_feature_title) {
      features.push({
        name: featureConstants.mcq_feature_title,
        description: featureConstants.mcq_feature_description,
        cost: parseFloat(featureConstants.mcq_credit_cost) || 0,
        icon: '📝',
        sessionType: featureConstants.mcq_session_type,
        isActive: featureConstants.mcq_is_active
      })
    }

    // Chatbot feature
    if (featureConstants.chatbot_feature_title && featureConstants.chatbot_is_active === 'true') {
      features.push({
        name: featureConstants.chatbot_feature_title,
        description: featureConstants.chatbot_feature_description,
        cost: 0, // Cost is per-mode, not per-feature
        icon: '💬',
        accessType: featureConstants.chatbot_access_type || 'subscription',
        sessionType: "chatbot",
        isActive: featureConstants.chatbot_is_active
      })
    }

    // Skripsi Builder feature
    if (featureConstants.skripsi_feature_title && featureConstants.skripsi_is_active === 'true') {
      features.push({
        name: featureConstants.skripsi_feature_title,
        description: featureConstants.skripsi_feature_description,
        cost: 0, // Cost is per-mode, not per-feature
        icon: '📚',
        accessType: featureConstants.skripsi_access_type || 'subscription',
        sessionType: "skripsi_builder",
        isActive: featureConstants.skripsi_is_active
      })
    }

    return features
  }
}
