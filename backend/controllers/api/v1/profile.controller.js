import { ValidationError } from '#errors/validationError'
import { GetProfileService } from '#services/profile/getProfileService'
import { UpdateProfileService } from '#services/profile/updateProfileService'

class ProfileController {
  async getProfile(req, res) {
    const userId = req.user.id
    const profile = await GetProfileService.call(userId)

    return res.status(200).json({
      data: profile ? {
        phoneNumber: profile.phone_number,
        university: profile.university,
        isComplete: profile.is_complete,
      } : null
    })
  }

  async updateProfile(req, res) {
    const userId = req.user.id
    const { phoneNumber, university } = req.body

    if (!phoneNumber || !university) {
      throw new ValidationError('Phone number and university are required')
    }

    const profile = await UpdateProfileService.call(userId, { phoneNumber, university })

    return res.status(200).json({
      data: {
        phoneNumber: profile.phone_number,
        university: profile.university,
        isComplete: profile.is_complete,
      }
    })
  }
}

export default new ProfileController()
