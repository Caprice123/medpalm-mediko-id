import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getToken, getUserData } from '@utils/authToken'
import { palette } from '../theme/palette'
import { fetchUserStatus } from '@store/pricing/action'
import { Navbar } from '../components/Navbar'

const PrivateRoute = () => {
  const token = getToken()
  const dispatch = useDispatch()
//   const currentUser = getUserData()
//   const isUser = currentUser?.role === 'user'

  useEffect(() => {
    if (token) dispatch(fetchUserStatus())
  }, [dispatch, token])

  // The app sits on its own wash rather than the landing page's near-white, so
  // the body colour is swapped while a signed-in route is mounted and restored
  // on the way out. The value comes from the palette, never a literal — an
  // inline style here outranks GlobalStyles, so a hardcoded hex would silently
  // override the theme.
  useEffect(() => {
    document.body.style.backgroundColor = palette.surfaceApp
    return () => { document.body.style.backgroundColor = '' }
  }, [])

  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <>
      {/* {isUser && <Navbar />} */}
      <Outlet />
    </>
  )
}

export default PrivateRoute
