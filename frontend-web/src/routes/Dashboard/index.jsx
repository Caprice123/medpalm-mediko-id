import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { FeatureCardSkeletonGrid } from '@components/common/SkeletonCard'
import { fetchFeatures } from '@store/feature/userAction'
import { fetchActiveBanners } from '@store/banner/userAction'
import { getUserData } from '@utils/authToken'
import {
  DashboardContainer,
  MainContent,
  PageTitle,
  PageSubtitle,
  CatalogGrid,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeatureFooter,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateSubtext,
  RequirementBadge,
  CardWrapper,
  RequirementsList,
  RequirementItem,
  BannerCarousel,
  BannerCard,
  BannerText,
  BannerButtonPrimary,
} from './Dashboard.styles'
import { TopupRoute } from '../Topup/routes'
import { ExerciseRoute } from '../Exercise/routes'
import { FlashcardRoute } from '../Flashcard/routes'
import { CalculatorRoute } from '../Calculator/routes'
import { DiagnosticQuizRoute } from '../DiagnosticQuiz/routes'
import { AnatomyQuizRoute } from '../AnatomyQuiz/routes'
import { SummaryNotesRoute } from '../SummaryNotes/routes'
import { MultipleChoiceRoute } from '../MultipleChoice/routes'
import { ChatbotRoute } from '../Chatbot/routes'
import { SkripsiRoute } from '../SkripsiBuilder/routes'
import { OscePracticeRoute } from '../OscePractice/routes'
import { AtlasRoute } from '../Atlas/routes'
import { WebinarRoute } from '../Webinar/routes'
import { EventRoute } from '../Event/routes'
import { ChallengeRoute } from '../Challenge/routes'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = getUserData()
  const isNonUser = currentUser?.role !== 'user'

  // Redux selectors
  const { features } = useSelector(state => state.feature)
  const { isLoadingFeatures } = useSelector(state => state.feature.loading)
  const { userStatus } = useSelector(state => state.pricing)
  const { activeBanners } = useSelector(state => state.banner)

  // Filter only active features
  const activeFeatures = features.filter(feature => feature.isActive === true || feature.isActive === "true")

  useEffect(() => {
    dispatch(fetchFeatures())
    dispatch(fetchActiveBanners())
  }, [dispatch])


  const handleUseFeature = async (feature) => {
      // Determine session type based on feature
      const sessionType = feature.sessionType

      const sessionTypeRouteMappings = {
        'flashcard': FlashcardRoute.moduleRoute,
        'exercise': ExerciseRoute.moduleRoute,
        'calculator': CalculatorRoute.moduleRoute,
        'diagnostic': DiagnosticQuizRoute.moduleRoute,
        'anatomy': AnatomyQuizRoute.moduleRoute,
        'summary_notes': SummaryNotesRoute.moduleRoute,
        'mcq': MultipleChoiceRoute.moduleRoute,
        'chatbot': ChatbotRoute.moduleRoute,
        'skripsi_builder': SkripsiRoute.moduleRoute,
        'osce_practice': OscePracticeRoute.moduleRoute,
        'atlas': AtlasRoute.moduleRoute,
        'challenge': ChallengeRoute.moduleRoute,
      }
      
      // Navigate to the mapped route if it exists
      const route = sessionTypeRouteMappings[sessionType]
      if (route) {
        navigate(route)
        return
      }
  }

  return (
    <DashboardContainer>
      <MainContent>
        {isNonUser && activeBanners.length > 0 && (
          <BannerCarousel>
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
                  <BannerCard
                    $gradientStart={banner.gradientStart}
                    $gradientEnd={banner.gradientEnd}
                  >
                    <BannerText>
                      <h2>{banner.title}</h2>
                      {banner.description && <p>{banner.description}</p>}
                    </BannerText>
                    <BannerButtonPrimary
                      onClick={() => {
                        if (banner.redirectUrl.startsWith('http')) {
                          window.open(banner.redirectUrl, '_blank', 'noopener,noreferrer')
                        } else {
                          navigate(banner.redirectUrl)
                        }
                      }}
                    >
                      {banner.redirectLabel || 'Lihat Sekarang'}
                    </BannerButtonPrimary>
                  </BannerCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </BannerCarousel>
        )}

        <PageTitle>Fitur Pembelajaran</PageTitle>
        <PageSubtitle>Pilih fitur yang ingin Anda gunakan untuk memulai pembelajaran</PageSubtitle>

        {isLoadingFeatures ? (
          <FeatureCardSkeletonGrid count={6} />
        ) : activeFeatures.length > 0 ? (
          <CatalogGrid>
            {activeFeatures.map((feature) => {
              // Check user access
              const userCredits = parseFloat(userStatus?.creditBalance || 0)
              const activeFeatureKeys = userStatus?.activeFeatureKeys || []

              const hasFeatureSubscription = activeFeatureKeys.some(f => f.feature === feature.sessionType)

              // Determine requirements
              const needsSubscription = feature.accessType === 'subscription' ||
                                       feature.accessType === 'subscription_and_credits'
              const needsCredits = feature.accessType === 'credits' ||
                                  feature.accessType === 'subscription_and_credits'
              const isFree = feature.accessType === 'free'

              // Check if requirements are met
              const subscriptionMet = !needsSubscription || hasFeatureSubscription
              const creditsMet = !needsCredits || userCredits >= (feature.cost || 0)
              const canUse = (subscriptionMet && creditsMet) || isFree || hasFeatureSubscription

              // Determine button text and action
              const getButtonConfig = () => {
                if (isFree) return { text: 'Gunakan Fitur', variant: 'primary' }
                if (!canUse) return { text: 'Lihat Paket', variant: 'outline' }
                return { text: 'Gunakan Fitur', variant: 'primary' }
              }

              const buttonConfig = getButtonConfig()

              return (
                <CardWrapper key={feature.id} $locked={!canUse && !isFree}>
                  <Card shadow hoverable>
                    <CardBody>
                      <FeatureIcon>{feature.icon}</FeatureIcon>
                      <FeatureTitle>
                        {feature.name} {!canUse && !isFree && ' 🔒'}
                      </FeatureTitle>
                      <FeatureDescription>{feature.description}</FeatureDescription>
                      <div style={{flex: 1}}></div>

                      {/* Requirements Badge */}
                      {!isFree && (
                        <RequirementBadge $locked={!canUse}>
                          {canUse ? '✓ Akses Tersedia' : '⚠️ Perlu Akses'}
                        </RequirementBadge>
                      )}

                      {/* Requirements List */}
                      {!isFree && (
                        <RequirementsList>
                          {needsSubscription && (
                            <RequirementItem $met={subscriptionMet}>
                              <span>{subscriptionMet ? '✓' : '✗'}</span>
                              <span>
                                {subscriptionMet
                                  ? 'Berlangganan Aktif'
                                  : 'Perlu Berlangganan'}
                              </span>
                            </RequirementItem>
                          )}
                          {needsCredits && feature.cost > 0 && (
                            <RequirementItem $met={creditsMet}>
                              <span>{creditsMet ? '✓' : '✗'}</span>
                              <span>
                                {creditsMet
                                  ? `${feature.cost} Credits (Tersedia: ${userCredits.toFixed(2)})`
                                  : `${feature.cost} Credits (Anda: ${userCredits.toFixed(2)})`}
                              </span>
                            </RequirementItem>
                          )}
                        </RequirementsList>
                      )}

                      <FeatureFooter>
                        <Button
                          variant={buttonConfig.variant}
                          onClick={() => {
                            if (!canUse && !isFree) {
                              navigate(TopupRoute.moduleRoute)
                            } else {
                              handleUseFeature(feature)
                            }
                          }}
                          fullWidth
                        >
                          {buttonConfig.text}
                        </Button>
                      </FeatureFooter>
                    </CardBody>
                  </Card>
                </CardWrapper>
              )
            })}
          </CatalogGrid>
        ) : (
          <EmptyState>
            <EmptyStateIcon>📚</EmptyStateIcon>
            <EmptyStateText>Tidak ada fitur tersedia</EmptyStateText>
            <EmptyStateSubtext>Silakan hubungi administrator</EmptyStateSubtext>
          </EmptyState>
        )}

            <PageTitle style={{ marginTop: '2.5rem' }}>Layanan</PageTitle>
            <PageSubtitle>Akses layanan tambahan yang tersedia untuk Anda</PageSubtitle>
            <CatalogGrid>
              <CardWrapper>
                <Card shadow hoverable>
                  <CardBody>
                    <FeatureIcon>🎓</FeatureIcon>
                    <FeatureTitle>Webinar</FeatureTitle>
                    <FeatureDescription>
                      Ikuti webinar medis eksklusif dari para dokter dan spesialis terkemuka
                    </FeatureDescription>
                    <div style={{ flex: 1 }} />
                    <FeatureFooter>
                      <Button variant="primary" onClick={() => navigate(WebinarRoute.listRoute)} fullWidth>
                        Lihat Webinar
                      </Button>
                    </FeatureFooter>
                  </CardBody>
                </Card>
              </CardWrapper>
              <CardWrapper>
                <Card shadow hoverable>
                  <CardBody>
                    <FeatureIcon>🗓️</FeatureIcon>
                    <FeatureTitle>Events</FeatureTitle>
                    <FeatureDescription>
                      Daftar dan ikuti event medis eksklusif yang tersedia untukmu
                    </FeatureDescription>
                    <div style={{ flex: 1 }} />
                    <FeatureFooter>
                      <Button variant="primary" onClick={() => navigate(EventRoute.listRoute)} fullWidth>
                        Lihat Events
                      </Button>
                    </FeatureFooter>
                  </CardBody>
                </Card>
              </CardWrapper>
              <CardWrapper>
                <Card shadow hoverable>
                  <CardBody>
                    <FeatureIcon>🏆</FeatureIcon>
                    <FeatureTitle>Challenge</FeatureTitle>
                    <FeatureDescription>
                      Uji pengetahuanmu dan bersaing dengan pengguna lain dalam challenge eksklusif
                    </FeatureDescription>
                    <div style={{ flex: 1 }} />
                    <FeatureFooter>
                      <Button variant="primary" onClick={() => navigate(ChallengeRoute.listRoute)} fullWidth>
                        Lihat Challenge
                      </Button>
                    </FeatureFooter>
                  </CardBody>
                </Card>
              </CardWrapper>
            </CatalogGrid>
      </MainContent>
    </DashboardContainer>
  )
}

export default Dashboard
