import { useState } from "react"
import { Avatar, Container, Logo, StatusDivider, StatusItem, StatusSection, UserInfo, UserName, UserSection, HamburgerButton, MobileMenu, MobileMenuItem, MobileMenuDivider } from "./Navbar.styles"
import { useEffect } from "react"
import { logout } from '@store/auth/action'
import { fetchUserStatus } from '@store/pricing/action'
import { getUserData } from '@utils/authToken'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
// import CreditPurchase from '@components/CreditPurchase'
import Button from '@components/common/Button'

export const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userStatus } = useSelector(state => state.pricing)
    const [user, setUser] = useState(null)
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Get user data
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            // Fetch user status (subscription + credits)
            await dispatch(fetchUserStatus())
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
    navigate('/topup')
  }

  const handlePurchaseSuccess = async () => {
    // Refresh user data after successful purchase
    await dispatch(fetchUserStatus())
  }


    return (
        <>
        <Container>
            <Logo>
                <Link to="/dashboard">
                    <img src="/icon.png" alt="MedPalm Logo" style={{ height: "48px"}} />
                </Link>
            </Logo>

            {/* Desktop Navigation */}
            <UserSection>
            <StatusSection>
              {userStatus?.hasActiveSubscription && userStatus?.subscription && (
                <>
                  <StatusItem>
                    <span>⭐</span>
                    <span>
                      Active
                      {userStatus?.subscription?.daysRemaining < 14 && (
                        <> ({userStatus?.subscription?.daysRemaining} days left)</>
                      )}
                    </span>
                  </StatusItem>
                  <StatusDivider />
                </>
              )}
              <StatusItem>
                <span>💎</span>
                <span>{userStatus?.creditBalance ?? 0} Credits</span>
              </StatusItem>
            </StatusSection>
            {user && (
                <UserInfo>
                {user.picture ? (
                    <Avatar src={user.picture} alt={user.name} />
                ) : (
                    <Avatar as="div">
                    {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                )}
                </UserInfo>
            )}
            {user?.role === 'admin' && (
                <Button onClick={() => navigate('/admin')} variant="primary" size="small">
                Admin
                </Button>
            )}
            <Button variant="outline" onClick={handleTopUp} size="small">
                Top Up
            </Button>
            <Button variant="outline" onClick={handleLogout} size="small">
                Keluar
            </Button>
            </UserSection>

            {/* Mobile Hamburger Button */}
            <HamburgerButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? '✕' : '☰'}
            </HamburgerButton>
        </Container>

        {/* Mobile Menu */}
        <MobileMenu $isOpen={mobileMenuOpen}>
            {user && (
                <MobileMenuItem>
                    <UserInfo>
                    {user.picture ? (
                        <Avatar src={user.picture} alt={user.name} />
                    ) : (
                        <Avatar as="div">
                        {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    )}
                    <UserName>{user.name}</UserName>
                    </UserInfo>
                </MobileMenuItem>
            )}

            <MobileMenuDivider />

            <MobileMenuItem className="status-wrapper">
              {userStatus?.hasActiveSubscription && userStatus?.subscription && (
                <StatusItem style={{ fontSize: '1rem', flex: 1 }}>
                  <span>⭐</span>
                  <span>
                    Active
                    {userStatus?.subscription?.daysRemaining < 14 && (
                      <> ({userStatus?.subscription?.daysRemaining} days left)</>
                    )}
                  </span>
                </StatusItem>
              )}

              <StatusItem style={{ fontSize: '1rem', flex: 1 }}>
                <span>💎</span>
                <span>{userStatus?.creditBalance ?? 0} Credits</span>
              </StatusItem>
            </MobileMenuItem>

            <MobileMenuDivider />

            {user?.role === 'admin' && (
                <MobileMenuItem>
                    <Button
                        variant="primary"
                        onClick={() => {
                            navigate('/admin')
                            setMobileMenuOpen(false)
                        }}
                        fullWidth
                    >
                        Admin Panel
                    </Button>
                </MobileMenuItem>
            )}

            <MobileMenuItem>
                <Button
                    variant="outline"
                    onClick={() => {
                        navigate('/topup')
                        setMobileMenuOpen(false)
                    }}
                    fullWidth
                >
                    Top Up Credits
                </Button>
            </MobileMenuItem>

            <MobileMenuItem>
                <Button
                    variant="outline"
                    onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                    }}
                    fullWidth
                >
                    Keluar
                </Button>
            </MobileMenuItem>
        </MobileMenu>

        {/* Credit Purchase Modal */}
        {/* <CreditPurchase
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            onPurchaseSuccess={handlePurchaseSuccess}
        /> */}
        </>
    )
}