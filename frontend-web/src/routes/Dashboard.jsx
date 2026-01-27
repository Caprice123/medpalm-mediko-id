import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Card, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { fetchFeatures } from '@store/feature/action'

const DashboardContainer = styled.div`
  min-height: calc(100vh - 63px);
  background: #f0fdfa;
`

const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

const PageSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.05rem;
`

const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

// Using common Card component - no custom card needed

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`

const FeatureFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

const EmptyStateText = styled.div`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`

const EmptyStateSubtext = styled.div`
  font-size: 0.875rem;
`

const RequirementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: ${props => props.$locked ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$locked ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.$locked ? '#fecaca' : '#bbf7d0'};
`

const LockIcon = styled.span`
  font-size: 1rem;
`

const CardWrapper = styled.div`
  position: relative;
  opacity: ${props => props.$locked ? '0.65' : '1'};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: ${props => props.$locked ? '0.75' : '1'};
  }
`

const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
`

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$met ? '#16a34a' : '#dc2626'};

  span:first-child {
    font-size: 1rem;
  }
`

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
        navigate("/chatbot")
        return
      }

      if (sessionType === "skripsi_builder") {
        navigate("/skripsi/sets")
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
          <EmptyState>
            <EmptyStateIcon>⏳</EmptyStateIcon>
            <EmptyStateText>Memuat fitur...</EmptyStateText>
          </EmptyState>
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
