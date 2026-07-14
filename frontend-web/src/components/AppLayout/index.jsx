import { useState, useEffect, useRef } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getUserData } from '@utils/authToken'
import { fetchFeatures } from '@store/feature/userAction'
import { logout } from '@store/auth/action'
import { formatLocalDate } from '@utils/dateUtils'
import { ProfileRoute } from '@routes/Profile/routes'
import {
  PiBookOpenText, PiCube, PiChatText, PiStethoscope,
  PiClipboardText, PiListNumbers, PiCards, PiFlask,
  PiCalculator, PiMagnifyingGlass, PiFileText, PiTrophy,
  PiVideoCamera, PiCalendarCheck, PiCreditCard, PiWrench,
  PiUser, PiSignOut,
} from 'react-icons/pi'

const FEATURE_ICONS = {
  summary_notes:   PiBookOpenText,
  atlas:           PiCube,
  chatbot:         PiChatText,
  osce_practice:   PiStethoscope,
  exercise:        PiClipboardText,
  mcq:             PiListNumbers,
  flashcard:       PiCards,
  anatomy:         PiFlask,
  calculator:      PiCalculator,
  diagnostic:      PiMagnifyingGlass,
  skripsi_builder: PiFileText,
  challenge:       PiTrophy,
}
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
  SidebarLockIcon,
  SidebarTooltip,
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
  SidebarOuter,
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

const HAMBURGER_POS_KEY = 'hamburger-btn-pos'
const QUICK_ACCESS_KEY = 'medpal_recently_used'

function trackFeatureVisit(entry) {
  try {
    const saved = JSON.parse(localStorage.getItem(QUICK_ACCESS_KEY) || '[]')
    const updated = [entry, ...saved.filter(f => f.sessionType !== entry.sessionType)].slice(0, 6)
    localStorage.setItem(QUICK_ACCESS_KEY, JSON.stringify(updated))
  } catch {}
}

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

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 900)
  const [collapsed, setCollapsed] = useState({ fitur: false, layanan: false, akun: false })
  const [detailOpen, setDetailOpen] = useState({ credits: false, subs: false })
  const [lockTooltip, setLockTooltip] = useState(null)

  const currentPosRef = useRef({ top: 16, left: 16 })
  const dragRef = useRef(null)
  const wasDraggingRef = useRef(false)
  const hamburgerRef = useRef(null)

  useEffect(() => {
    const el = hamburgerRef.current
    if (!el) return

    // Restore saved position directly to DOM (bypasses React style prop)
    const saved = localStorage.getItem(HAMBURGER_POS_KEY)
    if (saved) currentPosRef.current = JSON.parse(saved)
    el.style.top = currentPosRef.current.top + 'px'
    el.style.left = currentPosRef.current.left + 'px'

    const startDrag = (x, y) => {
      dragRef.current = {
        startX: x, startY: y,
        startTop: currentPosRef.current.top,
        startLeft: currentPosRef.current.left,
        isDragging: false,
      }
    }

    const moveDrag = (x, y) => {
      if (!dragRef.current) return
      const dx = x - dragRef.current.startX
      const dy = y - dragRef.current.startY
      if (!dragRef.current.isDragging && Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      dragRef.current.isDragging = true
      const newTop = Math.max(0, Math.min(window.innerHeight - 44, dragRef.current.startTop + dy))
      const newLeft = Math.max(0, Math.min(window.innerWidth - 44, dragRef.current.startLeft + dx))
      currentPosRef.current = { top: newTop, left: newLeft }
      el.style.top = newTop + 'px'
      el.style.left = newLeft + 'px'
    }

    const endDrag = () => {
      if (!dragRef.current) return
      wasDraggingRef.current = dragRef.current.isDragging
      if (dragRef.current.isDragging) {
        localStorage.setItem(HAMBURGER_POS_KEY, JSON.stringify(currentPosRef.current))
      }
      dragRef.current = null
    }

    // Touch handlers (real mobile)
    const onTouchStart = (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)
    const onTouchMove = (e) => { e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY) }
    const onTouchEnd = () => endDrag()

    // Mouse handlers (desktop browser / DevTools simulation without touch conversion)
    const onMouseDown = (e) => {
      e.preventDefault()
      startDrag(e.clientX, e.clientY)
      const onMouseMove = (e) => moveDrag(e.clientX, e.clientY)
      const onMouseUp = () => {
        endDrag()
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('mousedown', onMouseDown)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  useEffect(() => {
    if (features.length === 0) dispatch(fetchFeatures())
  }, [dispatch, features.length])

  useEffect(() => {
    // if (isUser) return
    const isMobile = window.innerWidth <= 900
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const activeFeatures = features.filter(f => f.isActive === true || f.isActive === 'true')

  const services = [
    { Icon: PiVideoCamera, name: 'Webinar', route: WebinarRoute.listRoute },
    { Icon: PiCalendarCheck, name: 'Events', route: EventRoute.listRoute },
    ...(isNonUser ? [{ Icon: PiTrophy, name: 'Challenge', route: ChallengeRoute.homeRoute }] : []),
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
        <FloatingHamburger
            ref={hamburgerRef}
            $open={sidebarOpen}
            onClick={() => { if (!wasDraggingRef.current) setSidebarOpen(o => !o); wasDraggingRef.current = false }}
            style={{ touchAction: 'none' }}
        >
        <span /><span /><span />
        </FloatingHamburger>
        <MobileOverlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <SidebarOuter $open={sidebarOpen}>
        <ToggleButton onClick={() => setSidebarOpen(o => !o)} title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}>
          {sidebarOpen ? '◀' : '▶'}
        </ToggleButton>
        <Sidebar $open={sidebarOpen}>
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
                  let isLocked = false
                  let lockReason = ''
                //   if (isUser) {
                    const userCredits = parseFloat(userStatus?.creditBalance || 0)
                    const activeFeatureKeys = userStatus?.activeFeatureKeys || []
                    const hasFeatureSubscription = activeFeatureKeys.some(f => f.feature === feature.sessionType)
                    const needsSubscription = feature.accessType === 'subscription' || feature.accessType === 'subscription_and_credits'
                    const needsCredits = feature.accessType === 'credits' || feature.accessType === 'subscription_and_credits'
                    const isFree = feature.accessType === 'free'
                    const subscriptionMet = !needsSubscription || hasFeatureSubscription
                    const creditsMet = !needsCredits || userCredits >= (feature.cost || 0)
                    const canUse = (subscriptionMet && creditsMet) || isFree || hasFeatureSubscription
                    isLocked = !canUse && !isFree
                    if (isLocked) {
                      if (!subscriptionMet && !creditsMet) lockReason = `Perlu berlangganan & ${feature.cost} credits`
                      else if (!subscriptionMet) lockReason = 'Perlu berlangganan'
                      else lockReason = `Perlu ${feature.cost} credits`
                    }
                //   }
                  const FeatureIcon = FEATURE_ICONS[feature.sessionType]
                  return (
                    <SidebarItem
                      key={feature.id}
                      $active={route ? isActive(route) : false}
                      onClick={() => {
                        if (isLocked) return navigateTo(TopupRoute.moduleRoute)
                        if (route) {
                          trackFeatureVisit({ sessionType: feature.sessionType, icon: feature.icon, name: feature.name, route })
                          navigateTo(route)
                        }
                      }}
                      onMouseEnter={isLocked ? (e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setLockTooltip({ text: lockReason, x: rect.right + 10, y: rect.top + rect.height / 2 })
                      } : undefined}
                      onMouseLeave={isLocked ? () => setLockTooltip(null) : undefined}
                    >
                      <SidebarItemIcon>
                        {FeatureIcon ? <FeatureIcon size={18} /> : feature.icon}
                      </SidebarItemIcon>
                      <SidebarItemName>{feature.name}</SidebarItemName>
                      {isLocked && <SidebarLockIcon>🔒</SidebarLockIcon>}
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
                {services.map(({ Icon, name, route }) => (
                  <SidebarItem key={name} $active={isActive(route)} onClick={() => navigateTo(route)}>
                    <SidebarItemIcon><Icon size={18} /></SidebarItemIcon>
                    <SidebarItemName>{name}</SidebarItemName>
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
                  <SidebarItemIcon><PiCreditCard size={18} /></SidebarItemIcon>
                  <SidebarItemName>Top Up Credits</SidebarItemName>
                </SidebarItem>
                {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
                  <SidebarItem $active={isActive('/admin')} onClick={() => navigateTo('/admin')}>
                    <SidebarItemIcon><PiWrench size={18} /></SidebarItemIcon>
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
                          {endDate ? formatLocalDate(endDate) : '∞'}
                        </StatDetailValue>
                      </StatDetailRow>
                    )
                  })}
                </StatDetails>
              </StatSection>
            )}
            <FooterActions>
              <FooterActionButton onClick={() => navigateTo(ProfileRoute.setupRoute)}>
                <PiUser size={14} /> Profil
              </FooterActionButton>
              <FooterActionButton $danger onClick={handleLogout}>
                <PiSignOut size={14} /> Keluar
              </FooterActionButton>
            </FooterActions>
          </SidebarFooter>
        </SidebarInner>
      </Sidebar>
      </SidebarOuter>

      <ContentArea>
        <Outlet />
      </ContentArea>
      {lockTooltip && (
        <SidebarTooltip style={{ top: lockTooltip.y, left: lockTooltip.x }}>
          {lockTooltip.text}
        </SidebarTooltip>
      )}
    </LayoutWrapper>
  )
}

export default AppLayout
