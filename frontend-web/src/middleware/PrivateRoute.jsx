import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getToken, getUserData } from '@utils/authToken'
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

  useEffect(() => {
    document.body.style.backgroundColor = '#f0fdfa'
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
