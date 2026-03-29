import { useState } from "react"
import { Avatar, Container, Logo, StatusDivider, StatusItem, StatusSection, UserInfo, UserName, UserSection, HamburgerButton, MobileMenu, MobileMenuItem, MobileMenuDivider, CreditWrapper, CreditTooltip, TooltipRow, TooltipLabel, TooltipValue, MobileStatusRow, MobileCreditBreakdown, MobileCreditBreakdownRow } from "./Navbar.styles"
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Get user data
    useEffect(() => {
        const userData = getUserData()
        setUser(userData)
        dispatch(fetchUserStatus())
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


    return (
        <>
        <Container>
            <Logo>
                <Link to="/dashboard">
                    <img src="/icon.png" alt="MedPal Logo" style={{ height: "48px"}} />
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
              <CreditWrapper>
                <StatusItem>
                  <span>💎</span>
                  <span>
                    {parseFloat(userStatus?.creditBalance ?? 0).toFixed(2)} Credits
                    {(userStatus?.expiringBuckets ?? []).some(b => b.daysRemaining <= 7) && ' ⚠️'}
                  </span>
                </StatusItem>
                {(userStatus?.expiringBuckets?.length > 0 || userStatus?.permanentBalance > 0) && (
                  <CreditTooltip>
                    <TooltipRow>
                      <TooltipLabel>Permanent</TooltipLabel>
                      <TooltipValue>{parseFloat(userStatus?.permanentBalance ?? 0).toFixed(2)} cr</TooltipValue>
                    </TooltipRow>
                    {(userStatus?.expiringBuckets ?? []).map((b, i) => (
                      <TooltipRow key={i}>
                        <TooltipLabel>Expiring ({b.daysRemaining}d left)</TooltipLabel>
                        <TooltipValue $warn={b.daysRemaining <= 7}>{parseFloat(b.balance).toFixed(2)} cr</TooltipValue>
                      </TooltipRow>
                    ))}
                  </CreditTooltip>
                )}
              </CreditWrapper>
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
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
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
              <MobileStatusRow>
                {userStatus?.hasActiveSubscription && userStatus?.subscription && (
                  <StatusItem style={{ fontSize: '1rem' }}>
                    <span>⭐</span>
                    <span>
                      Active
                      {userStatus?.subscription?.daysRemaining < 14 && (
                        <> ({userStatus?.subscription?.daysRemaining} days left)</>
                      )}
                    </span>
                  </StatusItem>
                )}
                <StatusItem style={{ fontSize: '1rem' }}>
                  <span>💎</span>
                  <span>
                    {parseFloat(userStatus?.creditBalance ?? 0).toFixed(2)} Credits
                    {(userStatus?.expiringBuckets ?? []).some(b => b.daysRemaining <= 7) && ' ⚠️'}
                  </span>
                </StatusItem>
              </MobileStatusRow>
              {(userStatus?.permanentBalance > 0 || (userStatus?.expiringBuckets ?? []).length > 0) && (
                <MobileCreditBreakdown>
                  <MobileCreditBreakdownRow>
                    <span>Permanent</span>
                    <span>{parseFloat(userStatus?.permanentBalance ?? 0).toFixed(2)} cr</span>
                  </MobileCreditBreakdownRow>
                  {(userStatus?.expiringBuckets ?? []).map((b, i) => (
                    <MobileCreditBreakdownRow key={i} $warn={b.daysRemaining <= 7}>
                      <span>Expiring ({b.daysRemaining}d left)</span>
                      <span>{parseFloat(b.balance).toFixed(2)} cr</span>
                    </MobileCreditBreakdownRow>
                  ))}
                </MobileCreditBreakdown>
              )}
            </MobileMenuItem>

            <MobileMenuDivider />

            {(user?.role === 'admin' || user?.role === 'superadmin') && (
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