import { getUserData } from './authToken'

/**
 * Check if user has permission to access a tab
 * @param {string} tab - Tab name (e.g., 'features', 'tags', 'pricingPlans', 'transactions', 'users')
 * @returns {boolean}
 */
export const hasTabPermission = (tab) => {
  const user = getUserData()

  if (!user) return false

  // Superadmin always has all permissions
  if (user.role === 'superadmin') return true

  // If user has custom permissions, check them
  if (user.permissions && user.permissions.tabs) {
    return user.permissions.tabs.includes(tab)
  }

  // Default permissions based on role
  if (user.role === 'admin') {
    return ['features', 'tags', 'pricingPlans', 'transactions'].includes(tab)
  }

  return false
}

/**
 * Check if user has access to a specific feature
 * @param {string} feature - Feature name (e.g., 'exercise', 'flashcard', 'calculator')
 * @returns {boolean}
 */
export const hasFeaturePermission = (feature) => {
  const user = getUserData()

  if (!user) return false

  // Superadmin always has all permissions
  if (user.role === 'superadmin') return true

  // If user has custom permissions, check them
  if (user.permissions && user.permissions.features) {
    // Handle both old (object) and new (array) formats
    if (Array.isArray(user.permissions.features)) {
      // New format: array of feature names
      return user.permissions.features.includes(feature)
    } else {
      // Old format: object with feature names as keys
      return user.permissions.features[feature] && user.permissions.features[feature].length > 0
    }
  }

  // Default permissions for admin role
  if (user.role === 'admin') {
    const defaultFeatures = ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice', 'summaryNotes']
    return defaultFeatures.includes(feature)
  }

  return false
}

/**
 * Get all tabs user has access to
 * @returns {string[]}
 */
export const getUserTabs = () => {
  const user = getUserData()

  if (!user) return []

  const allTabs = ['features', 'tags', 'pricingPlans', 'transactions', 'users']

  return allTabs.filter(tab => hasTabPermission(tab))
}

/**
 * Get all features user has access to
 * @returns {string[]}
 */
export const getUserFeatures = () => {
  const user = getUserData()

  if (!user) return []

  const allFeatures = ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice', 'summaryNotes']

  // Superadmin has all features
  if (user.role === 'superadmin') {
    return allFeatures
  }

  // Check custom permissions
  if (user.permissions && user.permissions.features) {
    // Handle both old (object) and new (array) formats
    if (Array.isArray(user.permissions.features)) {
      // New format: array of feature names
      return user.permissions.features
    } else {
      // Old format: object with feature names as keys
      return Object.keys(user.permissions.features).filter(
        key => user.permissions.features[key] && user.permissions.features[key].length > 0
      )
    }
  }

  // Default permissions for admin role
  if (user.role === 'admin') {
    return ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice', 'summaryNotes']
  }

  return []
}
