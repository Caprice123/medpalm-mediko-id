import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ProfileRoute } from '@routes/Profile/routes'

/**
 * Redirects to /profile/setup when the user's profile is not complete.
 * isProfileComplete === null means status hasn't loaded yet — allow through
 * so we don't flash a redirect before data arrives.
 */
const ProfileGuard = () => {
  const { isProfileComplete, isStatusLoading } = useSelector(state => ({
    isProfileComplete: state.pricing.userStatus.isProfileComplete,
    isStatusLoading: state.pricing.loading.isStatusLoading,
  }))

  // Still loading — render children; redirect will happen after status arrives
  if (isStatusLoading || isProfileComplete === null) {
    return <Outlet />
  }

  if (isProfileComplete === false) {
    return <Navigate to={ProfileRoute.setupRoute} replace />
  }

  return <Outlet />
}

export default ProfileGuard
