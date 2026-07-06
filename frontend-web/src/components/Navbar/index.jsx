import { useState, useEffect, useRef } from "react"
import {
  Avatar, Container, Logo, StatusDivider, StatusItem, StatusSection,
  UserInfo, UserName, UserSection, HamburgerButton, MobileMenu,
  MobileMenuItem, MobileMenuDivider, CreditWrapper, CreditTooltip,
  TooltipRow, TooltipLabel, TooltipValue, MobileStatusRow,
  MobileCreditBreakdown, MobileCreditBreakdownRow, SubscriptionWrapper,
  SubscriptionTooltip, AvatarWrapper, AvatarDropdown, AvatarDropdownUser,
  AvatarDropdownUserName, AvatarDropdownUserEmail, AvatarDropdownItem,
} from "./Navbar.styles"
import { logout } from '@store/auth/action'
import { fetchUserStatus } from '@store/pricing/action'
import { fetchFeatures } from '@store/feature/action'
import { getUserData } from '@utils/authToken'
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Button from '@components/common/Button'
import { formatLocalDate } from '@utils/dateUtils'
import { ProfileRoute } from '@routes/Profile/routes'

export const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userStatus } = useSelector(state => state.pricing)
    const appFeatures = useSelector(state => state.feature.features)
    const [user, setUser] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
    const avatarRef = useRef(null)

    useEffect(() => {
        const userData = getUserData()
        setUser(userData)
        dispatch(fetchUserStatus())
        if (appFeatures.length === 0) dispatch(fetchFeatures())
    }, [dispatch])

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        const onSuccess = () => navigate('/sign-in')
        dispatch(logout(onSuccess))
    }

    const handleTopUp = () => navigate('/topup')

    const handleGoToProfile = () => {
        setAvatarMenuOpen(false)
        navigate(ProfileRoute.setupRoute)
    }

    const handleLogoutFromDropdown = () => {
        setAvatarMenuOpen(false)
        handleLogout()
    }

    // Subscription expiry calculations
    const featureLabels = Object.fromEntries(appFeatures.map(f => [f.sessionType, f.name]))
    const fmt = (d) => d ? formatLocalDate(d) : 'Tidak ada batas'
    const now = new Date()
    const getDaysRemaining = (endDate) => {
        if (!endDate) return null
        return Math.ceil((new Date(endDate) - now) / (1000 * 60 * 60 * 24))
    }
    const subs = (userStatus?.activeFeatureKeys || [])
        .filter(({ feature }) => featureLabels[feature])
        .map(({ feature, endDate }) => ({
            feature,
            endDate,
            daysRemaining: getDaysRemaining(endDate),
        }))
    const hasExpiringSoon = subs.some(s => s.daysRemaining !== null && s.daysRemaining <= 7)

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
              {(userStatus?.activeFeatureKeys?.length > 0) && (
                <>
                  <SubscriptionWrapper>
                    <StatusItem>
                      <span>⭐</span>
                      <span>
                        Active
                        {hasExpiringSoon && ' ⚠️'}
                      </span>
                    </StatusItem>
                    {subs.length > 0 && (
                      <SubscriptionTooltip>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          Feature Access
                        </div>
                        {subs.map(({ feature, endDate }) => (
                          <TooltipRow key={feature}>
                            <TooltipLabel>{featureLabels[feature]}</TooltipLabel>
                            <TooltipValue style={{ fontSize: '0.72rem' }}>
                              hingga {fmt(endDate)}
                            </TooltipValue>
                          </TooltipRow>
                        ))}
                      </SubscriptionTooltip>
                    )}
                  </SubscriptionWrapper>
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

            <Button variant="outline" onClick={handleTopUp} size="small">
                Top Up
            </Button>

            {/* Avatar with dropdown */}
            {user && (
                <AvatarWrapper ref={avatarRef} onClick={() => setAvatarMenuOpen(o => !o)}>
                    <UserInfo>
                    {user.picture ? (
                        <Avatar src={user.picture} alt={user.name} />
                    ) : (
                        <Avatar as="div">
                        {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    )}
                    </UserInfo>
                    <AvatarDropdown $open={avatarMenuOpen}>
                        <AvatarDropdownUser>
                            <AvatarDropdownUserName>{user.name}</AvatarDropdownUserName>
                            <AvatarDropdownUserEmail>{user.email}</AvatarDropdownUserEmail>
                        </AvatarDropdownUser>
                        <AvatarDropdownItem onClick={handleGoToProfile}>
                            👤 Edit Profil
                        </AvatarDropdownItem>
                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                            <AvatarDropdownItem onClick={() => { setAvatarMenuOpen(false); navigate('/admin') }}>
                                🛠️ Admin Panel
                            </AvatarDropdownItem>
                        )}
                        <AvatarDropdownItem $danger onClick={handleLogoutFromDropdown}>
                            🚪 Keluar
                        </AvatarDropdownItem>
                    </AvatarDropdown>
                </AvatarWrapper>
            )}
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
                {(userStatus?.hasActiveSubscription || userStatus?.activeFeatureKeys?.length > 0) && (
                  <StatusItem style={{ fontSize: '1rem' }}>
                    <span>⭐</span>
                    <span>
                      Active
                      {hasExpiringSoon && ' ⚠️'}
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
                        navigate(ProfileRoute.setupRoute)
                        setMobileMenuOpen(false)
                    }}
                    fullWidth
                >
                    👤 Edit Profil
                </Button>
            </MobileMenuItem>

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
        </>
    )
}
