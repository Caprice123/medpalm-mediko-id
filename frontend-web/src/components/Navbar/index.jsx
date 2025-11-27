import { useState } from "react"
import { Avatar, Button, Container, Logo, StatusDivider, StatusItem, StatusSection, UserInfo, UserName, UserSection } from "./Navbar.styles"
import { useEffect } from "react"
import { logout } from '@store/auth/action'
import { fetchCreditBalance } from '@store/credit/action'
import { fetchUserStatus } from '@store/pricing/action'
import { getUserData } from '@utils/authToken'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import CreditPurchase from '@components/CreditPurchase'

export const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { balance } = useSelector(state => state.credit)
    const { userStatus } = useSelector(state => state.pricing)
    const [user, setUser] = useState(null)
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

    // Get user data
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Fetch user status (subscription + credits)
            await dispatch(fetchUserStatus())
            // Also fetch credit balance for backward compatibility
            await dispatch(fetchCreditBalance())
          } catch (error) {
            console.error('Failed to fetch user data:', error)
          }
        }

        const userData = getUserData()
        setUser(userData)
        fetchUserData()
    }, [dispatch])
    

    // Handle logout
    
  const handleLogout = () => {
    const onSuccess = () => {
      navigate('/sign-in')
    }
    dispatch(logout(onSuccess))
  }

  
  const handleTopUp = () => {
    setIsPurchaseModalOpen(true)
  }

  const handlePurchaseSuccess = async () => {
    // Refresh user data after successful purchase
    await dispatch(fetchUserStatus())
    await dispatch(fetchCreditBalance())
  }


    return (
        <>
        <Container>
            <Logo>
                <Link to="/dashboard">
                    <span>🏥</span>
                    <span>MedPalm</span>
                </Link>
            </Logo>
            <UserSection>
            <StatusSection>
              {userStatus?.hasActiveSubscription && userStatus?.subscription && (
                <>
                  <StatusItem>
                    <span>⭐</span>
                    <span>{userStatus?.subscription?.pricing_plan?.name || 'Premium'}</span>
                  </StatusItem>
                  <StatusDivider />
                </>
              )}
              <StatusItem>
                <span>💎</span>
                <span>{userStatus?.creditBalance ?? balance}</span>
              </StatusItem>
            </StatusSection>
            {user && (
                <UserInfo>
                {user.picture ? (
                    <Avatar src={user.picture} alt={user.name} />
                ) : (
                    <Avatar as="div" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0e7490, #14b8a6)',
                    color: 'white',
                    fontWeight: '600'
                    }}>
                    {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                )}
                {/* <UserName>{user.name}</UserName> */}
                </UserInfo>
            )}
            {user?.role === 'admin' && (
                <Button onClick={() => navigate('/admin')}>
                Admin
                </Button>
            )}
            <Button variant="outline" onClick={handleTopUp}>
                Top Up
            </Button>
            <Button variant="outline" onClick={handleLogout}>
                Keluar
            </Button>
            </UserSection>
        </Container>

        {/* Credit Purchase Modal */}
        <CreditPurchase
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            onPurchaseSuccess={handlePurchaseSuccess}
        />
        </>
    )
}