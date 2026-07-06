import { actions } from '@store/profile/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken } from '@utils/requestUtils'

const { setLoading, setProfile } = actions
const { setUserStatus } = pricingActions

export const fetchProfile = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchLoading', value: true }))
    const response = await getWithToken(Endpoints.api.profile)
    dispatch(setProfile(response.data.data))
  } finally {
    dispatch(setLoading({ key: 'isFetchLoading', value: false }))
  }
}

export const updateProfile = ({ phoneNumber, university }, onSuccess) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isUpdateLoading', value: true }))
    const response = await putWithToken(Endpoints.api.profile, { phoneNumber, university })
    const updatedProfile = response.data.data
    dispatch(setProfile(updatedProfile))

    // Sync profile into userStatus so the guard re-evaluates immediately
    const currentStatus = getState().pricing.userStatus
    dispatch(setUserStatus({
      ...currentStatus,
      profile: updatedProfile,
      isProfileComplete: updatedProfile.isComplete,
    }))

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateLoading', value: false }))
  }
}
