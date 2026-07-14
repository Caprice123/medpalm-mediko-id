import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { getUserData } from '@utils/authToken'
import { fetchActiveBanners } from '@store/banner/userAction'
import { fetchWebinars } from '@store/webinar/userAction'
import { fetchEvents } from '@store/event/userAction'
import { formatJakartaDateTimeFull, formatJakartaDateLong } from '@utils/dateUtils'
import { ProfileRoute } from '@routes/Profile/routes'
import { TopupRoute } from '@routes/Topup/routes'
import { WebinarRoute } from '@routes/Webinar/routes'
import { EventRoute } from '@routes/Event/routes'
import {
  PageWrapper, Hero, HeroInner, HeroLeft, HeroRight,
  HeroDate, HeroGreeting, HeroSub, StatPill,
  HeroBanner, BannerCard, BannerText, BannerBtn,
  Content,
  ChecklistBanner, ChecklistLabel, ChecklistSteps, ChecklistStep,
  Section, SectionHeader, SectionTitle, SectionLink, SectionLinks,
  QuickGrid, QuickItem, QuickItemIcon, QuickItemName, QuickEmpty,
  UpcomingGrid, UpcomingCard, UpcomingEmpty, UpcomingType, UpcomingTitle, UpcomingMeta, UpcomingAction,
  StatusGrid, StatusBox, StatusLabel, StatusBig, StatusBreakdown, StatusBreakdownRow,
  StatusActionRow, StatusActionBtn,
} from './DashboardV2.styles'

const QUICK_ACCESS_KEY = 'medpal_recently_used'
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function trackFeatureVisit(entry) {
  try {
    const saved = JSON.parse(localStorage.getItem(QUICK_ACCESS_KEY) || '[]')
    const updated = [entry, ...saved.filter(f => f.sessionType !== entry.sessionType)].slice(0, 6)
    localStorage.setItem(QUICK_ACCESS_KEY, JSON.stringify(updated))
  } catch {}
}

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 4 && h < 12) return 'Selamat pagi'
  if (h >= 12 && h < 15) return 'Selamat siang'
  if (h >= 15 && h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

function getDateLabel() {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function DashboardV2() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = getUserData()
  const isUser = currentUser?.role === 'user'

  const { features } = useSelector(state => state.feature)
  const { userStatus } = useSelector(state => state.pricing)
  const { activeBanners } = useSelector(state => state.banner)
  const { webinars } = useSelector(state => state.webinar)
  const { events } = useSelector(state => state.event)

  const [recentFeatures, setRecentFeatures] = useState(() => {
    try { return JSON.parse(localStorage.getItem(QUICK_ACCESS_KEY) || '[]').slice(0, 4) }
    catch { return [] }
  })

  useEffect(() => {
    dispatch(fetchActiveBanners())
    dispatch(fetchWebinars({ perPage: 4 }))
    dispatch(fetchEvents({ perPage: 4 }))
    try {
      setRecentFeatures(JSON.parse(localStorage.getItem(QUICK_ACCESS_KEY) || '[]').slice(0, 4))
    } catch {}
  }, [dispatch])

  const creditBalance = parseFloat(userStatus?.creditBalance ?? 0)
  const permanentBalance = parseFloat(userStatus?.permanentBalance ?? 0)
  const expiringBuckets = userStatus?.expiringBuckets ?? []
  const isProfileComplete = userStatus?.isProfileComplete === true
  const activeFeatureKeys = userStatus?.activeFeatureKeys ?? []

  const featureLabels = Object.fromEntries(features.map(f => [f.sessionType, f.name]))

  const showChecklist = isUser && !isProfileComplete
  const checklistSteps = [
    { label: 'Profil', done: isProfileComplete, action: () => navigate(ProfileRoute.setupRoute) },
    { label: 'Credits', done: creditBalance > 0 || activeFeatureKeys.length > 0, action: () => navigate(TopupRoute.moduleRoute) },
  ]

  const upcomingWebinars = webinars.slice(0, 2)
  const upcomingEvents = events.slice(0, 2)

  return (
    <PageWrapper>
      <Hero $hasBanner={activeBanners.length > 0}>
        <HeroInner>
          <HeroLeft>
            <HeroDate>{getDateLabel()}</HeroDate>
            <HeroGreeting>{getGreeting()}, {currentUser?.name?.split(' ')[0] ?? 'Sobat'} 👋</HeroGreeting>
            <HeroSub>Semangat belajar hari ini!</HeroSub>
          </HeroLeft>
          <HeroRight>
            <StatPill $clickable onClick={() => navigate(TopupRoute.moduleRoute)}>
              💎 {creditBalance.toFixed(2)}
            </StatPill>
            {activeFeatureKeys.length > 0 && (
              <StatPill>⭐ {activeFeatureKeys.length} aktif</StatPill>
            )}
          </HeroRight>
        </HeroInner>

        {activeBanners.length > 0 && (
          <HeroBanner>
            <Swiper
              modules={[Autoplay, EffectFade, Pagination]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
            >
              {activeBanners.map(banner => (
                <SwiperSlide key={banner.uniqueId}>
                  <BannerCard $gradientStart={banner.gradientStart} $gradientEnd={banner.gradientEnd}>
                    <BannerText>
                      <h2>{banner.title}</h2>
                      {banner.description && <p>{banner.description}</p>}
                    </BannerText>
                    <BannerBtn
                      onClick={() => {
                        if (banner.redirectUrl.startsWith('http')) {
                          window.open(banner.redirectUrl, '_blank', 'noopener,noreferrer')
                        } else {
                          navigate(banner.redirectUrl)
                        }
                      }}
                    >
                      {banner.redirectLabel || 'Lihat Sekarang'}
                    </BannerBtn>
                  </BannerCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </HeroBanner>
        )}
      </Hero>

      <Content>

        {showChecklist && (
          <ChecklistBanner>
            <ChecklistLabel>
              <strong>Selesaikan pengaturan akun</strong> agar bisa mengakses semua fitur
            </ChecklistLabel>
            <ChecklistSteps>
              {checklistSteps.map((step, i) => (
                <ChecklistStep key={i} $done={step.done} onClick={step.done ? undefined : step.action}>
                  {step.done ? '✓' : '○'} {step.label}
                </ChecklistStep>
              ))}
            </ChecklistSteps>
          </ChecklistBanner>
        )}

        <Section>
          <SectionHeader>
            <SectionTitle>Akses Cepat</SectionTitle>
          </SectionHeader>
          {recentFeatures.length > 0 ? (
            <QuickGrid>
              {recentFeatures.map(f => (
                <QuickItem
                  key={f.sessionType}
                  onClick={() => {
                    trackFeatureVisit(f)
                    navigate(f.route)
                  }}
                >
                  <QuickItemIcon>{f.icon}</QuickItemIcon>
                  <QuickItemName>{f.name}</QuickItemName>
                </QuickItem>
              ))}
            </QuickGrid>
          ) : (
            <QuickEmpty>
              Kunjungi fitur dari sidebar untuk akses cepat di sini 🚀
            </QuickEmpty>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Agenda Mendatang</SectionTitle>
            <SectionLinks>
              <SectionLink onClick={() => navigate(WebinarRoute.listRoute)}>Webinar →</SectionLink>
              <SectionLink onClick={() => navigate(EventRoute.listRoute)}>Event →</SectionLink>
            </SectionLinks>
          </SectionHeader>
          {upcomingWebinars.length === 0 && upcomingEvents.length === 0 ? (
            <UpcomingEmpty>Tidak ada agenda mendatang saat ini.</UpcomingEmpty>
          ) : (
            <UpcomingGrid>
              {upcomingWebinars.map(w => (
                <UpcomingCard key={w.uniqueId} onClick={() => navigate(WebinarRoute.listRoute)}>
                  <UpcomingType>🎓 Webinar</UpcomingType>
                  <UpcomingTitle>{w.title}</UpcomingTitle>
                  {w.startAt && (
                    <UpcomingMeta>📅 {formatJakartaDateTimeFull(w.startAt)}</UpcomingMeta>
                  )}
                  {w.speakers?.length > 0 && (
                    <UpcomingMeta>🎤 {w.speakers.map(s => s.name).filter(Boolean).join(', ')}</UpcomingMeta>
                  )}
                  <UpcomingAction>Lihat Detail →</UpcomingAction>
                </UpcomingCard>
              ))}
              {upcomingEvents.map(ev => (
                <UpcomingCard key={ev.code} onClick={() => navigate(EventRoute.listRoute)}>
                  <UpcomingType>🗓️ Event</UpcomingType>
                  <UpcomingTitle>{ev.title}</UpcomingTitle>
                  {ev.registrationStartAt && (
                    <UpcomingMeta>📅 Pendaftaran: {formatJakartaDateTimeFull(ev.registrationStartAt)}</UpcomingMeta>
                  )}
                  <UpcomingAction>Lihat Detail →</UpcomingAction>
                </UpcomingCard>
              ))}
            </UpcomingGrid>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Status Akun</SectionTitle>
          </SectionHeader>
          <StatusGrid>
            <StatusBox>
              <StatusLabel>💎 Credits</StatusLabel>
              <StatusBig>{creditBalance.toFixed(2)}</StatusBig>
              <StatusBreakdown>
                {permanentBalance > 0 && (
                  <StatusBreakdownRow>
                    <span>Permanent</span>
                    <span>{permanentBalance.toFixed(2)} cr</span>
                  </StatusBreakdownRow>
                )}
                {expiringBuckets.map((b, i) => (
                  <StatusBreakdownRow key={i} $warn={b.daysRemaining <= 7}>
                    <span>Exp. ({b.daysRemaining}d tersisa)</span>
                    <span>{parseFloat(b.balance).toFixed(2)} cr</span>
                  </StatusBreakdownRow>
                ))}
              </StatusBreakdown>
              <StatusActionRow>
                <StatusActionBtn onClick={() => navigate(TopupRoute.moduleRoute)}>Top Up →</StatusActionBtn>
              </StatusActionRow>
            </StatusBox>

            <StatusBox>
              <StatusLabel>⭐ Berlangganan</StatusLabel>
              {activeFeatureKeys.length === 0 ? (
                <StatusBig $muted>Tidak ada</StatusBig>
              ) : (
                <>
                  <StatusBig>{activeFeatureKeys.length} aktif</StatusBig>
                  <StatusBreakdown>
                    {activeFeatureKeys.map(({ feature, endDate }, i) => {
                      const daysLeft = endDate
                        ? Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
                        : null
                      return (
                        <StatusBreakdownRow key={i} $warn={daysLeft !== null && daysLeft <= 7}>
                          <span>{featureLabels[feature] || feature}</span>
                          <span>{endDate ? formatJakartaDateLong(endDate) : '∞'}</span>
                        </StatusBreakdownRow>
                      )
                    })}
                  </StatusBreakdown>
                </>
              )}
              <StatusActionRow>
                <StatusActionBtn onClick={() => navigate(TopupRoute.moduleRoute)}>Lihat Paket →</StatusActionBtn>
              </StatusActionRow>
            </StatusBox>
          </StatusGrid>
        </Section>
      </Content>
    </PageWrapper>
  )
}

export default DashboardV2
