import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '@utils/authToken'
import { Navbar } from '../components/Navbar'

const PrivateRoute = () => {
  const token = getToken()

  // Redirect to sign-in if not authenticated
  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  // Render children if authenticated
  return (
    <div style={{ backgroundColor: "#f0fdfa", minHeight: "100vh" }}>
      <Navbar />
      <Outlet />
    </div>

  )
}

export default PrivateRoute
