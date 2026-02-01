import prisma from '#prisma/client'
import { BaseService } from '../baseService.js'
import { ValidationError } from '#errors/validationError'

const VALID_ROLES = ['user', 'admin', 'superadmin', 'tutor']

export class UpdateUserRoleService extends BaseService {
  static async call(userId, newRole, requestingUserId) {
    // Validate role
    if (!VALID_ROLES.includes(newRole)) {
      throw new ValidationError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`)
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new ValidationError('User not found')
    }

    // Prevent users from changing their own role
    if (userId === requestingUserId) {
      throw new ValidationError('You cannot change your own role')
    }

    // Update user role
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        role: newRole,
        updated_at: new Date()
      }
    })

    return updatedUser
  }
}
