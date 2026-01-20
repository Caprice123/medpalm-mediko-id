import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetActiveFeaturesService extends BaseService {
  static async call() {
    // Helper function to generate description based on access type
    const getAccessDescription = (accessType, cost) => {
      switch (accessType) {
        case 'subscription':
          return 'Requires active subscription'
        case 'credits':
          return `Requires ${cost} credits per use`
        case 'subscription_and_credits':
          return `Requires subscription + ${cost} credits per use`
        case 'free':
          return 'Free to use'
        default:
          return cost > 0 ? `Requires ${cost} credits per use` : 'Free to use'
      }
    }

    const featureConstants = await GetConstantsService.call([
        "exercise_feature_title",
        "exercise_feature_description",
        "exercise_credit_cost",
        "exercise_session_type",
        "exercise_access_type",
        "exercise_is_active",
        "flashcard_feature_title",
        "flashcard_feature_description",
        "flashcard_credit_cost",
        "flashcard_session_type",
        "flashcard_access_type",
        "flashcard_is_active",
        "summary_notes_feature_title",
        "summary_notes_feature_description",
        "summary_notes_credit_cost",
        "summary_notes_access_type",
        "summary_notes_is_active",
        "calculator_feature_title",
        "calculator_feature_description",
        "calculator_credit_cost",
        "calculator_access_type",
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
        "mcq_access_type",
        "mcq_is_active",
        "chatbot_feature_title",
        "chatbot_feature_description",
        "chatbot_access_type",
        "chatbot_is_active",
        "skripsi_feature_title",
        "skripsi_feature_description",
        "skripsi_access_type",
        "skripsi_is_active",
        "osce_practice_feature_title",
        "osce_practice_feature_description",
        "osce_practice_access_type",
        "osce_practice_is_active",
    ])

    const features = []

    // Exercise feature
    if (featureConstants.exercise_feature_title) {
      const cost = parseFloat(featureConstants.exercise_credit_cost) || 0
      const accessType = featureConstants.exercise_access_type || 'subscription'
      features.push({
        name: featureConstants.exercise_feature_title,
        description: featureConstants.exercise_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '🎓',
        sessionType: featureConstants.exercise_session_type,
        isActive: featureConstants.exercise_is_active
      })
    }

    // Flashcard feature
    if (featureConstants.flashcard_feature_title) {
      const cost = parseFloat(featureConstants.flashcard_credit_cost) || 0
      const accessType = featureConstants.flashcard_access_type || 'subscription'
      features.push({
        name: featureConstants.flashcard_feature_title,
        description: featureConstants.flashcard_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '🎴',
        sessionType: featureConstants.flashcard_session_type,
        isActive: featureConstants.flashcard_is_active
      })
    }

    // Summary Notes feature
    if (featureConstants.summary_notes_feature_title) {
      const cost = parseFloat(featureConstants.summary_notes_credit_cost) || 0
      const accessType = featureConstants.summary_notes_access_type || 'subscription'
      features.push({
        name: featureConstants.summary_notes_feature_title,
        description: featureConstants.summary_notes_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '📝',
        sessionType: 'summary_notes',
        isActive: featureConstants.summary_notes_is_active
      })
    }

    // Calculator feature
    if (featureConstants.calculator_feature_title) {
      const cost = parseFloat(featureConstants.calculator_credit_cost) || 0
      const accessType = featureConstants.calculator_access_type || 'subscription'
      features.push({
        name: featureConstants.calculator_feature_title,
        description: featureConstants.calculator_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '🧮',
        sessionType: "calculator",
        isActive: featureConstants.calculator_is_active
      })
    }

    // Anatomy Quiz feature
    if (featureConstants.anatomy_feature_title) {
      const cost = parseFloat(featureConstants.anatomy_credit_cost) || 0
      const accessType = featureConstants.anatomy_access_type || 'subscription'
      features.push({
        name: featureConstants.anatomy_feature_title,
        description: featureConstants.anatomy_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '🫀',
        sessionType: "anatomy",
        isActive: featureConstants.anatomy_is_active
      })
    }

    // Multiple Choice Quiz feature
    if (featureConstants.mcq_feature_title) {
      const cost = parseFloat(featureConstants.mcq_credit_cost) || 0
      const accessType = featureConstants.mcq_access_type || 'subscription'
      features.push({
        name: featureConstants.mcq_feature_title,
        description: featureConstants.mcq_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '📝',
        sessionType: featureConstants.mcq_session_type,
        isActive: featureConstants.mcq_is_active
      })
    }

    // Chatbot feature
    if (featureConstants.chatbot_feature_title) {
      const cost = 0 // Cost is per-mode, not per-feature
      const accessType = featureConstants.chatbot_access_type || 'subscription'
      features.push({
        name: featureConstants.chatbot_feature_title,
        description: featureConstants.chatbot_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '💬',
        sessionType: "chatbot",
        isActive: featureConstants.chatbot_is_active
      })
    }

    // Skripsi Builder feature
    if (featureConstants.skripsi_feature_title) {
      const cost = 0 // Cost is per-mode, not per-feature
      const accessType = featureConstants.skripsi_access_type || 'subscription'
      features.push({
        name: featureConstants.skripsi_feature_title,
        description: featureConstants.skripsi_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '📚',
        sessionType: "skripsi_builder",
        isActive: featureConstants.skripsi_is_active
      })
    }

    // OSCE Practice feature
    if (featureConstants.osce_practice_feature_title) {
      const cost = 0 // Cost is per-session
      const accessType = featureConstants.osce_practice_access_type || 'subscription'
      features.push({
        name: featureConstants.osce_practice_feature_title,
        description: featureConstants.osce_practice_feature_description,
        accessDescription: getAccessDescription(accessType, cost),
        cost,
        accessType,
        icon: '🩺',
        sessionType: "osce_practice",
        isActive: featureConstants.osce_practice_is_active
      })
    }

    return features
  }
}
