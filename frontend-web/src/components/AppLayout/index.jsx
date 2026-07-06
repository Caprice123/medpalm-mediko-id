import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserData } from '@utils/authToken'
import { fetchFeatures } from '@store/feature/userAction'
import { logout } from '@store/auth/action'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { ProfileRoute } from '@routes/Profile/routes'
import {
  LayoutWrapper,
  FloatingHamburger,
  MobileCloseButton,
  MobileOverlay,
  Sidebar,
  SidebarInner,
  SidebarLogo,
  SidebarNav,
  SidebarGroup,
  SidebarGroupHeader,
  ChevronIcon,
  SidebarGroupItems,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemName,
  SidebarFooter,
  UserRow,
  UserAvatar,
  UserName,
  StatSection,
  StatHeader,
  StatHeaderLeft,
  StatChevron,
  StatDetails,
  StatDetailRow,
  StatDetailLabel,
  StatDetailValue,
  FooterActions,
  FooterActionButton,
  ContentArea,
  ToggleButton,
} from './AppLayout.styles'
import { ExerciseRoute } from '@routes/Exercise/routes'
import { FlashcardRoute } from '@routes/Flashcard/routes'
import { CalculatorRoute } from '@routes/Calculator/routes'
import { DiagnosticQuizRoute } from '@routes/DiagnosticQuiz/routes'
import { AnatomyQuizRoute } from '@routes/AnatomyQuiz/routes'
import { SummaryNotesRoute } from '@routes/SummaryNotes/routes'
import { MultipleChoiceRoute } from '@routes/MultipleChoice/routes'
import { ChatbotRoute } from '@routes/Chatbot/routes'
import { SkripsiRoute } from '@routes/SkripsiBuilder/routes'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import { AtlasRoute } from '@routes/Atlas/routes'
import { WebinarRoute } from '@routes/Webinar/routes'
import { EventRoute } from '@routes/Event/routes'
import { ChallengeRoute } from '@routes/Challenge/routes'
import { TopupRoute } from '@routes/Topup/routes'

const SESSION_ROUTES = {
  flashcard: FlashcardRoute.moduleRoute,
  exercise: ExerciseRoute.moduleRoute,
  calculator: CalculatorRoute.moduleRoute,
  diagnostic: DiagnosticQuizRoute.moduleRoute,
  anatomy: AnatomyQuizRoute.moduleRoute,
  summary_notes: SummaryNotesRoute.moduleRoute,
  mcq: MultipleChoiceRoute.moduleRoute,
  chatbot: ChatbotRoute.moduleRoute,
  skripsi_builder: SkripsiRoute.moduleRoute,
  osce_practice: OscePracticeRoute.moduleRoute,
  atlas: AtlasRoute.moduleRoute,
  challenge: ChallengeRoute.moduleRoute,
}

function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const currentUser = getUserData()
  const isUser = currentUser?.role === 'user'
  const isNonUser = !isUser

  const { features } = useSelector(state => state.feature)
  const { userStatus } = useSelector(state => state.pricing)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState({ fitur: false, layanan: false, akun: false })
  const [detailOpen, setDetailOpen] = useState({ credits: false, subs: false })

  useEffect(() => {
    if (features.length === 0) dispatch(fetchFeatures())
  }, [dispatch, features.length])

  useEffect(() => {
    if (isUser) return
    const isMobile = window.innerWidth <= 900
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen, isUser])

  const activeFeatures = features.filter(f => f.isActive === true || f.isActive === 'true')

  const services = [
    { icon: '🎓', name: 'Webinar', route: WebinarRoute.listRoute },
    { icon: '🗓️', name: 'Events', route: EventRoute.listRoute },
    ...(isNonUser ? [{ icon: '🏆', name: 'Challenge', route: ChallengeRoute.homeRoute }] : []),
  ]

  const navigateTo = (route) => {
    navigate(route)
    if (window.innerWidth <= 900) setSidebarOpen(false)
  }

  const isActive = (route) => route === '/dashboard'
    ? pathname === '/dashboard'
    : pathname.startsWith(route)

  const handleLogout = () => dispatch(logout(() => navigate('/sign-in')))

  const toggleGroup = (key) => setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleDetail = (key) => setDetailOpen(prev => ({ ...prev, [key]: !prev[key] }))

  const creditBalance = parseFloat(userStatus?.creditBalance ?? 0).toFixed(2)
  const permanentBalance = parseFloat(userStatus?.permanentBalance ?? 0).toFixed(2)
  const expiringBuckets = userStatus?.expiringBuckets ?? []
  const hasExpiringWarning = expiringBuckets.some(b => b.daysRemaining <= 7)
  const hasCreditDetails = expiringBuckets.length > 0 || parseFloat(permanentBalance) > 0

  const featureLabels = Object.fromEntries(features.map(f => [f.sessionType, f.name]))
  const activeSubs = (userStatus?.activeFeatureKeys ?? []).filter(({ feature }) => featureLabels[feature])
  const hasSubWarning = activeSubs.some(s => {
    if (!s.endDate) return false
    return Math.ceil((new Date(s.endDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 7
  })

  return (
    <LayoutWrapper>
      {isNonUser && (
        <>
          <FloatingHamburger $open={sidebarOpen} onClick={() => setSidebarOpen(o => !o)}>
            <span /><span /><span />
          </FloatingHamburger>
          <MobileOverlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
          <ToggleButton $open={sidebarOpen} onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}>
            {sidebarOpen ? '◀' : '▶'}
          </ToggleButton>
        </>
      )}

      {isNonUser && <Sidebar $open={sidebarOpen}>
        <SidebarInner>
          <MobileCloseButton onClick={() => setSidebarOpen(false)}>✕</MobileCloseButton>
          <SidebarLogo onClick={() => navigateTo('/dashboard')}>
            <img src="/icon.png" alt="MedPal" />
          </SidebarLogo>
          <SidebarNav>
            <SidebarGroup>
              <SidebarGroupHeader onClick={() => toggleGroup('fitur')}>
                <span>Fitur Pembelajaran</span>
                <ChevronIcon $collapsed={collapsed.fitur}>▼</ChevronIcon>
              </SidebarGroupHeader>
              <SidebarGroupItems $collapsed={collapsed.fitur}>
                {activeFeatures.map(feature => {
                  const route = SESSION_ROUTES[feature.sessionType]
                  return (
                    <SidebarItem
                      key={feature.id}
                      $active={route ? isActive(route) : false}
                      onClick={() => { if (route) navigateTo(route) }}
                    >
                      <SidebarItemIcon>{feature.icon}</SidebarItemIcon>
                      <SidebarItemName>{feature.name}</SidebarItemName>
                    </SidebarItem>
                  )
                })}
              </SidebarGroupItems>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupHeader onClick={() => toggleGroup('layanan')}>
                <span>Layanan</span>
                <ChevronIcon $collapsed={collapsed.layanan}>▼</ChevronIcon>
              </SidebarGroupHeader>
              <SidebarGroupItems $collapsed={collapsed.layanan}>
                {services.map(service => (
                  <SidebarItem key={service.name} $active={isActive(service.route)} onClick={() => navigateTo(service.route)}>
                    <SidebarItemIcon>{service.icon}</SidebarItemIcon>
                    <SidebarItemName>{service.name}</SidebarItemName>
                  </SidebarItem>
                ))}
              </SidebarGroupItems>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupHeader onClick={() => toggleGroup('akun')}>
                <span>Akun</span>
                <ChevronIcon $collapsed={collapsed.akun}>▼</ChevronIcon>
              </SidebarGroupHeader>
              <SidebarGroupItems $collapsed={collapsed.akun}>
                <SidebarItem $active={isActive(TopupRoute.moduleRoute)} onClick={() => navigateTo(TopupRoute.moduleRoute)}>
                  <SidebarItemIcon>💳</SidebarItemIcon>
                  <SidebarItemName>Top Up Credits</SidebarItemName>
                </SidebarItem>
                {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                  <SidebarItem $active={isActive('/admin')} onClick={() => navigateTo('/admin')}>
                    <SidebarItemIcon>🛠️</SidebarItemIcon>
                    <SidebarItemName>Admin Panel</SidebarItemName>
                  </SidebarItem>
                )}
              </SidebarGroupItems>
            </SidebarGroup>
          </SidebarNav>

          <SidebarFooter>
            <UserRow>
              <UserAvatar>
                {currentUser?.picture
                  ? <img src={currentUser.picture} alt={currentUser.name} />
                  : currentUser?.name?.charAt(0).toUpperCase()}
              </UserAvatar>
              <UserName>{currentUser?.name}</UserName>
            </UserRow>

            {/* Credits */}
            <StatSection>
              <StatHeader onClick={() => hasCreditDetails && toggleDetail('credits')}>
                <StatHeaderLeft>
                  <span>💎</span>
                  <span>{creditBalance} Credits {hasExpiringWarning && '⚠️'}</span>
                </StatHeaderLeft>
                {hasCreditDetails && <StatChevron $open={detailOpen.credits}>▼</StatChevron>}
              </StatHeader>
              <StatDetails $open={detailOpen.credits}>
                <StatDetailRow>
                  <StatDetailLabel>Permanent</StatDetailLabel>
                  <StatDetailValue>{permanentBalance} cr</StatDetailValue>
                </StatDetailRow>
                {expiringBuckets.map((b, i) => (
                  <StatDetailRow key={i} $warn={b.daysRemaining <= 7}>
                    <StatDetailLabel>Exp. ({b.daysRemaining}d left)</StatDetailLabel>
                    <StatDetailValue>{parseFloat(b.balance).toFixed(2)} cr</StatDetailValue>
                  </StatDetailRow>
                ))}
              </StatDetails>
            </StatSection>

            {/* Subscriptions */}
            {activeSubs.length > 0 && (
              <StatSection>
                <StatHeader onClick={() => toggleDetail('subs')}>
                  <StatHeaderLeft>
                    <span>⭐</span>
                    <span>Active {hasSubWarning && '⚠️'}</span>
                  </StatHeaderLeft>
                  <StatChevron $open={detailOpen.subs}>▼</StatChevron>
                </StatHeader>
                <StatDetails $open={detailOpen.subs}>
                  {activeSubs.map(({ feature, endDate }) => {
                    const daysLeft = endDate
                      ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
                      : null
                    return (
                      <StatDetailRow key={feature} $warn={daysLeft !== null && daysLeft <= 7}>
                        <StatDetailLabel>{featureLabels[feature]}</StatDetailLabel>
                        <StatDetailValue>
                          {endDate ? formatJakartaDateLong(endDate) : '∞'}
                        </StatDetailValue>
                      </StatDetailRow>
                    )
                  })}
                </StatDetails>
              </StatSection>
            )}
            <FooterActions>
              <FooterActionButton onClick={() => navigateTo(ProfileRoute.setupRoute)}>
                👤 Profil
              </FooterActionButton>
              <FooterActionButton $danger onClick={handleLogout}>
                🚪 Keluar
              </FooterActionButton>
            </FooterActions>
          </SidebarFooter>
        </SidebarInner>
      </Sidebar>}

      <ContentArea>
        <Outlet />
      </ContentArea>
    </LayoutWrapper>
  )
}

export default AppLayout
