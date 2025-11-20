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

    return features
  }
}
