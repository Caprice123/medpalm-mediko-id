import prisma from '#prisma/client'
import { BaseService } from '../baseService.js'
import { ValidationError } from '#errors/validationError'

// Define valid tabs and features (simplified - just access, no CRUD)
const VALID_TABS = ['features', 'tags', 'pricingPlans', 'transactions', 'users']
const VALID_FEATURES = ['exercise', 'flashcard', 'calculator', 'anatomy', 'mcq', 'chatbot', 'skripsi', 'oscePractice', 'summaryNotes']

export class UpdateUserPermissionsService extends BaseService {
  static async call(userId, permissions, requestingUserId) {
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new ValidationError('User not found')
    }

    // Prevent users from changing their own permissions
    if (userId === requestingUserId) {
      throw new ValidationError('You cannot change your own permissions')
    }

    // Validate permissions structure
    if (permissions && typeof permissions === 'object') {
      // Validate tabs
      if (permissions.tabs && Array.isArray(permissions.tabs)) {
        const invalidTabs = permissions.tabs.filter(tab => !VALID_TABS.includes(tab))
        if (invalidTabs.length > 0) {
          throw new ValidationError(`Invalid tabs: ${invalidTabs.join(', ')}. Valid tabs are: ${VALID_TABS.join(', ')}`)
        }
      }

      // Validate features (now just an array)
      if (permissions.features && Array.isArray(permissions.features)) {
        const invalidFeatures = permissions.features.filter(feature => !VALID_FEATURES.includes(feature))
        if (invalidFeatures.length > 0) {
          throw new ValidationError(`Invalid features: ${invalidFeatures.join(', ')}. Valid features are: ${VALID_FEATURES.join(', ')}`)
        }
      }
    }

    // Update user permissions
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        permissions: permissions || null,
        updated_at: new Date()
      }
    })

    return updatedUser
  }

  // Helper method to get default permissions for a role
  static getDefaultPermissions(role) {
    if (role === 'superadmin') {
      return {
        tabs: VALID_TABS,
        features: VALID_FEATURES
      }
    }

    if (role === 'admin') {
      return {
        tabs: ['features', 'tags', 'pricingPlans', 'transactions'],
        features: VALID_FEATURES // All features accessible
      }
    }

    // Regular users and tutors have no admin permissions
    return null
  }

  // Helper method to check if user has permission for a tab
  static hasTabPermission(user, tab) {
    // Superadmin always has all permissions
    if (user.role === 'superadmin') {
      return true
    }

    // If user has custom permissions, check them
    if (user.permissions && user.permissions.tabs) {
      return user.permissions.tabs.includes(tab)
    }

    // If no custom permissions, fall back to default permissions based on role
    const defaultPerms = this.getDefaultPermissions(user.role)
    if (!defaultPerms) return false

    return defaultPerms.tabs.includes(tab)
  }

  // Helper method to check if user has permission for a feature
  static hasFeaturePermission(user, feature) {
    // Superadmin always has all permissions
    if (user.role === 'superadmin') {
      return true
    }

    // If user has custom permissions, check them
    if (user.permissions && user.permissions.features) {
      return user.permissions.features.includes(feature)
    }

    // If no custom permissions, fall back to default permissions based on role
    const defaultPerms = this.getDefaultPermissions(user.role)
    if (!defaultPerms) return false

    return defaultPerms.features.includes(feature)
  }
}
