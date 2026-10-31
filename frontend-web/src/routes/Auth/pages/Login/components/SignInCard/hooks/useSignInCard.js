import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@store/auth/action'
import { TopicHubRoute } from '@routes/TopicHub/routes'

export function useSignInCard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const constants = useSelector((state) => state.constant.constants)

  const handleGoogleSuccess = async (credentialResponse) => {
    await dispatch(
      login(credentialResponse.credential, () => navigate(TopicHubRoute.moduleRoute)),
    )
  }

  const handleGoogleError = () => {
    console.error('Google login failed')
  }

  return {
    title: constants.login_signin_title || 'Selamat Datang Kembali',
    subtitle:
      constants.login_signin_subtitle ||
      'Masuk untuk membuka seluruh materi dan progres belajarmu.',
    handleGoogleSuccess,
    handleGoogleError,
  }
}

export default useSignInCard
