import { Navigate } from 'react-router-dom'
import { getToken } from '@utils/authToken'
import { Navbar } from '../components/Navbar'

const PrivateRoute = ({ children }) => {
  const token = getToken()

  // Redirect to sign-in if not authenticated
  if (!token) {
    return <Navigate to="/sign-in" replace />
  }

  // Render children if authenticated
  return (
    <>
      <Navbar />
      {children}
    </>

  )
}

export default PrivateRoute
