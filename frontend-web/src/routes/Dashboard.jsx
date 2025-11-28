import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { createSession } from '@store/session/action'
import { fetchFeatures } from '@store/feature/action'
import { getUserData } from '@utils/authToken'

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

const CatalogCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(6, 182, 212, 0.15);
    border-color: #06b6d4;
  }
`

const CardIcon = styled.div`
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

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

const CreditCost = styled.span`
  font-weight: 600;
  color: #06b6d4;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const UseButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
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

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux selectors
  const { balance } = useSelector(state => state.credit)
  const { features } = useSelector(state => state.feature)
  const { isLoadingFeatures } = useSelector(state => state.feature.loading)

  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const userData = getUserData()
    setUser(userData)

    // Fetch features
    fetchUserData()
  }, [dispatch])

  const fetchUserData = async () => {
    try {
      // Fetch features
      await dispatch(fetchFeatures())
    } catch (error) {
      console.error('Failed to fetch features:', error)
    }
  }

  const handleUseFeature = async (feature) => {
    try {
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

      // For other session types, create session and navigate to session detail
      const sessionData = await dispatch(createSession(sessionType))
      navigate(`/session/${sessionData.id}`)
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Gagal membuat sesi: ' + (error.message || 'Terjadi kesalahan'))
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
        ) : features.length > 0 ? (
          <CatalogGrid>
            {features.map((feature) => {
              // Check if feature is subscription-based (flashcard or exercise)
              const isSubscriptionBased = ['flashcard', 'exercise'].includes(feature.sessionType)

              return (
                <CatalogCard key={feature.id}>
                  <CardIcon>{feature.icon}</CardIcon>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                  <CardFooter>
                    {isSubscriptionBased ? (
                      <CreditCost style={{ color: '#10b981' }}>
                        🎯 Subscription Required
                      </CreditCost>
                    ) : (
                      <CreditCost>
                        💎 {feature.cost} kredit
                      </CreditCost>
                    )}
                    <UseButton
                      onClick={() => handleUseFeature(feature)}
                      disabled={!isSubscriptionBased && balance < feature.cost}
                    >
                      Gunakan Fitur
                    </UseButton>
                  </CardFooter>
                </CatalogCard>
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
