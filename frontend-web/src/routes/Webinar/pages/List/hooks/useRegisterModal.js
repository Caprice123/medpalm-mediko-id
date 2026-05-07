import { useDispatch, useSelector } from 'react-redux'
import { registerWebinar } from '@store/webinar/userAction'

export function useRegisterModal({ webinar, onSuccess, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)

  const handleSubmit = () => {
    dispatch(registerWebinar(
      webinar.uniqueId,
      [],
      () => { if (onSuccess) onSuccess(); onClose() }
    ))
  }

  return {
    isRegisterLoading: loading.isRegisterLoading,
    handleSubmit,
  }
}
