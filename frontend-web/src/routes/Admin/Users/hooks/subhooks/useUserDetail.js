import { useDispatch } from 'react-redux'
import { adjustCredit, addSubscription, fetchUserDetail } from '../../../../../store/user/action'

export const useUserDetail = (setUiState) => {
  const dispatch = useDispatch()

  const onOpen = (user) => {
    // Open modal immediately
    setUiState(prev => ({
      ...prev,
      isUserDetailModalOpen: true
    }))

    // Fetch fresh user details - will update Redux detail state
    dispatch(fetchUserDetail(user.id))
  }

  const onClose = () => {
    setUiState(prev => ({
      ...prev,
      isUserDetailModalOpen: false
    }))
  }

  const handleAdjustCredit = async (userId, creditAmount, options = {}) => {
    dispatch(adjustCredit(userId, creditAmount, options))
  }

  const handleAddSubscription = async (userId, startDate, endDate) => {
    dispatch(addSubscription(userId, startDate, endDate))
  }

  return {
    onOpen,
    onClose,
    onAdjustCredit: handleAdjustCredit,
    onAddSubscription: handleAddSubscription
  }
}
