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
        "flashcard_feature_title",
        "flashcard_feature_description",
        "flashcard_credit_cost",
        "flashcard_session_type",
        "summary_notes_feature_title",
        "summary_notes_feature_description",
        "summary_notes_credit_cost",
        "calculator_feature_title",
        "calculator_feature_description",
        "calculator_credit_cost",
        "anatomy_feature_title",
        "anatomy_feature_description",
        "anatomy_credit_cost",
        "anatomy_access_type",
        "anatomy_is_active",
        "mcq_feature_title",
        "mcq_feature_description",
        "mcq_credit_cost",
        "mcq_session_type"
    ])

    const features = []

    // Exercise feature
    if (featureConstants.exercise_feature_title) {
      features.push({
        name: featureConstants.exercise_feature_title,
        description: featureConstants.exercise_feature_description,
        cost: parseInt(featureConstants.exercise_credit_cost) || 0,
        icon: '🎓',
        sessionType: featureConstants.exercise_session_type
      })
    }

    // Flashcard feature
    if (featureConstants.flashcard_feature_title) {
      features.push({
        name: featureConstants.flashcard_feature_title,
        description: featureConstants.flashcard_feature_description,
        cost: parseInt(featureConstants.flashcard_credit_cost) || 0,
        icon: '🎴',
        sessionType: featureConstants.flashcard_session_type
      })
    }

    // Summary Notes feature
    if (featureConstants.summary_notes_feature_title) {
      features.push({
        name: featureConstants.summary_notes_feature_title,
        description: featureConstants.summary_notes_feature_description,
        cost: parseInt(featureConstants.summary_notes_credit_cost) || 0,
        icon: '📝',
        sessionType: 'summary_notes'
      })
    }

    // Calculator feature
    if (featureConstants.calculator_feature_title) {
      features.push({
        name: featureConstants.calculator_feature_title,
        description: featureConstants.calculator_feature_description,
        cost: parseInt(featureConstants.calculator_credit_cost) || 0,
        icon: '🧮',
        sessionType: "calculator",
      })
    }

    // Anatomy Quiz feature
    if (featureConstants.anatomy_feature_title && featureConstants.anatomy_is_active === 'true') {
      features.push({
        name: featureConstants.anatomy_feature_title,
        description: featureConstants.anatomy_feature_description,
        cost: parseInt(featureConstants.anatomy_credit_cost) || 0,
        icon: '🫀',
        accessType: featureConstants.anatomy_access_type || 'subscription',
        sessionType: "anatomy",
      })
    }

    // Multiple Choice Quiz feature
    if (featureConstants.mcq_feature_title) {
      features.push({
        name: featureConstants.mcq_feature_title,
        description: featureConstants.mcq_feature_description,
        cost: parseInt(featureConstants.mcq_credit_cost) || 0,
        icon: '📝',
        sessionType: featureConstants.mcq_session_type
      })
    }

    return features
  }
}
