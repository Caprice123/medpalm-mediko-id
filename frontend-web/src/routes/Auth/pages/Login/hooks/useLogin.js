import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchPublicConstants } from '@store/constant/userAction'
import { useLiveHomeStats } from '@hooks/useLiveHomeStats'

// Every constant the page renders. The admin edits these under Global
// Settings → "Halaman Login"; nothing on the landing page reads them.
const LOGIN_CONSTANT_KEYS = [
  'home_hero_badge',
  'home_hero_subtitle',
  'home_hero_slides',
  'login_signin_title',
  'login_signin_subtitle',
]

// The fetches are owned by the page because two sibling components read out of
// the slices afterwards — each selects only what it renders.
export function useLogin() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPublicConstants(LOGIN_CONSTANT_KEYS))
  }, [dispatch])

  // Counts come over the same public endpoint the landing uses, and keep
  // ticking while the page is open.
  useLiveHomeStats()
}

export default useLogin
