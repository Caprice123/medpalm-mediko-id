import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { FeatureCardSkeletonGrid } from '@components/common/SkeletonCard'
import { fetchFeatures } from '@store/feature/action'
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
  RequirementItem
} from './Dashboard.styles'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux selectors
  const { features } = useSelector(state => state.feature)
  const { isLoadingFeatures } = useSelector(state => state.feature.loading)
  const { userStatus } = useSelector(state => state.pricing)

  // Filter only active features
  const activeFeatures = features.filter(feature => feature.isActive === true || feature.isActive === "true")

  useEffect(() => {
    // Fetch features
    dispatch(fetchFeatures())
  }, [dispatch])

  const handleUseFeature = async (feature) => {
      // Determine session type based on feature
      const sessionType = feature.sessionType

      // For flashcard, navigate to dedicated flashcard page
      if (sessionType === 'flashcard') {
        navigate('/flashcards')
        return
      }

      // For exercise, navigate to dedicated exercise page
      if (sessionType === 'exercise') {
        navigate('/exercises')
        return
      }

      if (sessionType === 'calculator') {
        navigate('/calculators')
        return
      }

      if (sessionType === 'anatomy') {
        navigate('/anatomy-quiz')
        return
      }

      if (sessionType === 'summary_notes') {
        navigate('/summary-notes')
        return
      }

      if (sessionType === 'mcq') {
        navigate('/multiple-choice')
        return
      }

      if (sessionType == "chatbot") {
        navigate("/chat-assistant")
        return
      }

      if (sessionType === "skripsi_builder") {
        navigate("/sets")
        return
      }

      if (sessionType == "osce_practice") {
        navigate("/osce-practice")
        return
      }

      // For calculator, navigate to dedicated calculator page
      if (!sessionType) {
        navigate('/calculators')
        return
      }
  }

  return (
    <DashboardContainer>
      <MainContent>
        <PageTitle>Fitur Pembelajaran</PageTitle>
        <PageSubtitle>Pilih fitur yang ingin Anda gunakan untuk memulai pembelajaran</PageSubtitle>

        {isLoadingFeatures ? (
          <FeatureCardSkeletonGrid count={6} />
        ) : activeFeatures.length > 0 ? (
          <CatalogGrid>
            {activeFeatures.map((feature) => {
              // Check user access
              const hasActiveSubscription = userStatus?.hasActiveSubscription || false
              const userCredits = userStatus?.creditBalance || 0

              // Determine requirements
              const needsSubscription = feature.accessType === 'subscription' ||
                                       feature.accessType === 'subscription_and_credits'
              const needsCredits = feature.accessType === 'credits' ||
                                  feature.accessType === 'subscription_and_credits'
              const isFree = feature.accessType === 'free'

              // Check if requirements are met
              const subscriptionMet = !needsSubscription || hasActiveSubscription
              const creditsMet = !needsCredits || userCredits >= (feature.cost || 0)
              const canUse = (subscriptionMet && creditsMet) || isFree

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
                          {needsCredits && (
                            <RequirementItem $met={creditsMet}>
                              <span>{creditsMet ? '✓' : '✗'}</span>
                              <span>
                                {creditsMet
                                  ? `${feature.cost || 0} Credits (Tersedia: ${userCredits})`
                                  : `${feature.cost || 0} Credits (Anda: ${userCredits})`}
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
                              navigate('/pricing')
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
      </MainContent>
    </DashboardContainer>
  )
}

export default Dashboard
