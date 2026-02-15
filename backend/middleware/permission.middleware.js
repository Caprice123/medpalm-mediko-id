import { AuthorizationError } from '#errors/authorizationError'

// Define valid tabs and features (simplified - just access, no CRUD)
const VALID_TABS = ['features', 'tags', 'pricingPlans', 'transactions', 'users']
const VALID_FEATURES = ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice', 'summaryNotes']

/**
 * Middleware to check if user has permission to access a specific tab
 * @param {string} requiredTab - The tab permission required (e.g., 'features', 'tags', 'users')
 */
export const requireTabPermission = (requiredTab) => {
  return (req, res, next) => {
    const user = req.user

    if (!user) {
      throw new AuthorizationError('Authentication required')
    }

    // Superadmin always has all permissions
    if (user.role === 'superadmin') {
      return next()
    }

    // Check if user has custom permissions
    if (user.permissions && user.permissions.tabs) {
        console.log(user.permissions.tabs)
        console.log(requiredTab)
      if (user.permissions.tabs.includes(requiredTab)) {
        return next()
      }
      throw new AuthorizationError(`Access denied. You don't have permission to access this tab.`)
    }

    // Default permissions based on role
    const defaultPerms = getDefaultPermissions(user.role)
    if (defaultPerms && defaultPerms.tabs.includes(requiredTab)) {
      return next()
    }

    throw new AuthorizationError(`Access denied. You don't have permission to access this tab.`)
  }
}

/**
 * Middleware to check if user has permission for a specific feature
 * @param {string} feature - The feature (e.g., 'exercise', 'flashcard', 'calculator')
 */
export const requireFeaturePermission = (feature) => {
  return (req, res, next) => {
    const user = req.user

    if (!user) {
      throw new AuthorizationError('Authentication required')
    }

    // Superadmin always has all permissions
    if (user.role === 'superadmin') {
      return next()
    }

    // Check if user has custom permissions
    if (user.permissions && user.permissions.features) {
      // Handle both old (object) and new (array) formats
      const hasPermission = Array.isArray(user.permissions.features)
        ? user.permissions.features.includes(feature)
        : user.permissions.features[feature] && user.permissions.features[feature].length > 0

      if (hasPermission) {
        return next()
      }
      throw new AuthorizationError(`Access denied. You don't have permission for the '${feature}' feature.`)
    }

    // Default permissions based on role
    const defaultPerms = getDefaultPermissions(user.role)
    if (defaultPerms && defaultPerms.features.includes(feature)) {
      return next()
    }

    throw new AuthorizationError(`Access denied. You don't have permission for the '${feature}' feature.`)
  }
}

/**
 * Helper function to get default permissions for a role
 */
function getDefaultPermissions(role) {
  if (role === 'superadmin') {
    return {
      tabs: VALID_TABS,
      features: VALID_FEATURES
    }
  }

  if (role === 'admin') {
    return {
      tabs: ['features', 'tags', 'pricingPlans', 'transactions'],
      features: ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice', 'summaryNotes']
    }
  }

  // Regular users and tutors have no admin permissions by default
  return null
}

/**
 * Helper function to check tab permission programmatically (for use in services)
 */
export const checkTabPermission = (user, tab) => {
  // Superadmin always has all permissions
  if (user.role === 'superadmin') {
    return true
  }

  // Check if user has custom permissions
  if (user.permissions && user.permissions.tabs) {
    return user.permissions.tabs.includes(tab)
  }

  // If no custom permissions, fall back to default permissions based on role
  const defaultPerms = getDefaultPermissions(user.role)
  if (!defaultPerms) return false

  return defaultPerms.tabs.includes(tab)
}

/**
 * Helper function to check feature permission programmatically (for use in services)
 */
export const checkFeaturePermission = (user, feature) => {
  // Superadmin always has all permissions
  if (user.role === 'superadmin') {
    return true
  }

  // Check if user has custom permissions
  if (user.permissions && user.permissions.features) {
    // Handle both old (object) and new (array) formats
    return Array.isArray(user.permissions.features)
      ? user.permissions.features.includes(feature)
      : user.permissions.features[feature] && user.permissions.features[feature].length > 0
  }

  // If no custom permissions, fall back to default permissions based on role
  const defaultPerms = getDefaultPermissions(user.role)
  if (!defaultPerms) return false

  return defaultPerms.features.includes(feature)
}
