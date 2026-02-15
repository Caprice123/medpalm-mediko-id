import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { checkFeaturePermission } from '#middleware/permission.middleware'

// Map permission feature names to sessionType and constants
const PERMISSION_TO_FEATURE_CONFIG = {
  'exercise': {
    sessionType: 'exercise',
    constants: [
      'exercise_feature_title',
      'exercise_feature_description',
      'exercise_credit_cost',
      'exercise_session_type',
      'exercise_access_type',
      'exercise_is_active'
    ],
    icon: '🎓'
  },
  'flashcard': {
    sessionType: 'flashcard',
    constants: [
      'flashcard_feature_title',
      'flashcard_feature_description',
      'flashcard_credit_cost',
      'flashcard_session_type',
      'flashcard_access_type',
      'flashcard_is_active'
    ],
    icon: '🎴'
  },
  'calculator': {
    sessionType: 'calculator',
    constants: [
      'calculator_feature_title',
      'calculator_feature_description',
      'calculator_credit_cost',
      'calculator_access_type',
      'calculator_is_active'
    ],
    icon: '🧮'
  },
  'anatomy': {
    sessionType: 'anatomy',
    constants: [
      'anatomy_feature_title',
      'anatomy_feature_description',
      'anatomy_credit_cost',
      'anatomy_access_type',
      'anatomy_is_active'
    ],
    icon: '🫀'
  },
  'mcq': {
    sessionType: 'mcq',
    constants: [
      'mcq_feature_title',
      'mcq_feature_description',
      'mcq_credit_cost',
      'mcq_session_type',
      'mcq_access_type',
      'mcq_is_active'
    ],
    icon: '📝'
  },
  'chatbot': {
    sessionType: 'chatbot',
    constants: [
      'chatbot_feature_title',
      'chatbot_feature_description',
      'chatbot_access_type',
      'chatbot_is_active'
    ],
    icon: '💬'
  },
  'skripsi': {
    sessionType: 'skripsi_builder',
    constants: [
      'skripsi_feature_title',
      'skripsi_feature_description',
      'skripsi_access_type',
      'skripsi_is_active'
    ],
    icon: '📚'
  },
  'oscePractice': {
    sessionType: 'osce_practice',
    constants: [
      'osce_practice_feature_title',
      'osce_practice_feature_description',
      'osce_practice_access_type',
      'osce_practice_is_active'
    ],
    icon: '🩺'
  },
  'summaryNotes': {
    sessionType: 'summary_notes',
    constants: [
      'summary_notes_feature_title',
      'summary_notes_feature_description',
      'summary_notes_credit_cost',
      'summary_notes_access_type',
      'summary_notes_is_active'
    ],
    icon: '📝'
  }
}

export class GetAdminFeaturesService extends BaseService {
  /**
   * Get features filtered by user permissions
   * Only fetches constants for features the user has permission to access
   * @param {object} user - Authenticated user object with permissions
   * @returns {array} Filtered features based on user permissions
   */
  static async call(user) {
    // If no user provided, return empty array
    if (!user) {
      return []
    }

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

    // Determine which features the user has permission to access
    const permittedFeatures = []
    const constantsToFetch = []

    for (const [permissionName, config] of Object.entries(PERMISSION_TO_FEATURE_CONFIG)) {
      // Check if user has permission for this feature
      if (user.role === 'superadmin' || checkFeaturePermission(user, permissionName)) {
        permittedFeatures.push({ permissionName, config })
        constantsToFetch.push(...config.constants)
      }
    }

    // If no permitted features, return empty array
    if (permittedFeatures.length === 0) {
      return []
    }

    // Fetch only the constants needed for permitted features
    const featureConstants = await GetConstantsService.call(constantsToFetch)

    // Build feature objects only for permitted features
    const features = []

    for (const { permissionName, config } of permittedFeatures) {
      const prefix = permissionName === 'oscePractice' ? 'osce_practice' :
                     permissionName === 'summaryNotes' ? 'summary_notes' :
                     permissionName === 'skripsi' ? 'skripsi' :
                     config.sessionType

      const titleKey = `${prefix}_feature_title`
      const descriptionKey = `${prefix}_feature_description`
      const creditCostKey = `${prefix}_credit_cost`
      const accessTypeKey = `${prefix}_access_type`
      const sessionTypeKey = `${prefix}_session_type`
      const isActiveKey = `${prefix}_is_active`

      // Only include if feature has a title
      if (featureConstants[titleKey]) {
        const cost = parseFloat(featureConstants[creditCostKey]) || 0
        const accessType = featureConstants[accessTypeKey] || 'subscription'

        features.push({
          name: featureConstants[titleKey],
          description: featureConstants[descriptionKey],
          accessDescription: getAccessDescription(accessType, cost),
          cost,
          accessType,
          icon: config.icon,
          sessionType: featureConstants[sessionTypeKey] || config.sessionType,
          isActive: featureConstants[isActiveKey]
        })
      }
    }

    return features
  }
}
