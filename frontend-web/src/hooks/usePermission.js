import { useMemo } from 'react'
import { getUserData } from '@utils/authToken'

/**
 * Custom hook to check user permissions (simplified - tab/feature level only)
 * @returns {object} Permission checking functions
 */
export const usePermission = () => {
  const user = getUserData()

  const permissions = useMemo(() => {
    /**
     * Check if user has access to a specific tab
     * @param {string} tab - Tab name (e.g., 'features', 'tags', 'pricingPlans')
     * @returns {boolean}
     */
    const hasTab = (tab) => {
      if (!user) return false

      // Superadmin always has all permissions
      if (user.role === 'superadmin') return true

      // Check custom permissions
      if (user.permissions && user.permissions.tabs) {
        return user.permissions.tabs.includes(tab)
      }

      // Default permissions for admin role
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
    const hasFeature = (feature) => {
      if (!user) return false

      // Superadmin always has all permissions
      if (user.role === 'superadmin') return true

      // Check custom permissions
      if (user.permissions && user.permissions.features) {
        return user.permissions.features.includes(feature)
      }

      // Default permissions for admin role
      if (user.role === 'admin') {
        const defaultFeatures = ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice']
        return defaultFeatures.includes(feature)
      }

      return false
    }

    return { hasTab, hasFeature }
  }, [user])

  return {
    ...permissions,
    user
  }
}
