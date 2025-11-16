import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '@config/colors'
import { logout } from '@store/auth/action'
import { fetchCreditBalance, fetchCreditTransactions, deductCredits } from '@store/credit/action'
import { createSession, fetchSessions } from '@store/session/action'
import { fetchFeatures } from '@store/feature/action'
import { getUserData } from '@utils/authToken'
import CreditPurchase from '@components/CreditPurchase'

const DashboardContainer = styled.div`
  min-height: 100vh;
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
  color: #0891b2;
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
    box-shadow: 0 10px 25px rgba(14, 116, 144, 0.15);
    border-color: #0891b2;
  }
`

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(8, 145, 178, 0.1);
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
  color: #0891b2;
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
  color: #0891b2;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const UseButton = styled.button`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
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
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 95vh;
  }
`

const ModalHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 16px 16px 0 0;
`

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

const ModalBody = styled.div`
  padding: 2rem;
`

// Session History Styles
const SessionsSection = styled.div`
  margin-bottom: 3rem;
`

const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`

const CreateSessionButton = styled.button`
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 116, 144, 0.3);
  }
`

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const SessionCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #0891b2;
    box-shadow: 0 4px 12px rgba(14, 116, 144, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const SessionIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(8, 145, 178, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const SessionInfo = styled.div`
  flex: 1;
`

const SessionName = styled.div`
  font-weight: 600;
  color: #0891b2;
  margin-bottom: 0.25rem;
`

const SessionDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`

const SessionCredit = styled.div`
  font-weight: 600;
  color: #0891b2;
  white-space: nowrap;
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
  const { sessions } = useSelector(state => state.session)
  const { isLoadingSessions } = useSelector(state => state.session.loading)
  const { features } = useSelector(state => state.feature)
  const { isLoadingFeatures } = useSelector(state => state.feature.loading)

  const [user, setUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  console.log(sessions)
  useEffect(() => {
    // Get user data from localStorage
    const userData = getUserData()
    setUser(userData)

    // Fetch user credit balance, sessions, and features
    fetchUserData()
  }, [dispatch])

  const fetchUserData = async () => {
    try {
      // Fetch credit balance
      await dispatch(fetchCreditBalance())

      // Fetch sessions from actual session endpoint
      await dispatch(fetchSessions())

      // Fetch features
      await dispatch(fetchFeatures())
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const handleLogout = () => {
    const onSuccess = () => {
      navigate('/sign-in')
    }
    dispatch(logout(onSuccess))
  }

  const handleUseFeature = async (feature) => {
    // Close modal
    setIsModalOpen(false)

    try {
      // Create session and first attempt
      const sessionData = await dispatch(createSession('exercise'))

      // Navigate to first attempt detail page
      navigate(`/session/${sessionData.id}`)
    } catch (error) {
      console.error('Failed to create session:', error)
      alert('Gagal membuat sesi: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const formatDate = (date) => {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    console.log(date)
    return new Date(date).toLocaleDateString('id-ID', options)
  }

  return (
    <DashboardContainer>
      <MainContent>
        {/* Session History Section */}
        <SessionsSection>
          <SectionHeaderRow>
            <div>
              <PageTitle>Riwayat Sesi</PageTitle>
              <PageSubtitle>Lihat semua sesi pembelajaran yang telah Anda akses</PageSubtitle>
            </div>
            <CreateSessionButton onClick={() => setIsModalOpen(true)}>
              <span>+</span>
              Buat Sesi Baru
            </CreateSessionButton>
          </SectionHeaderRow>

          {isLoadingSessions ? (
            <EmptyState>
              <EmptyStateIcon>⏳</EmptyStateIcon>
              <EmptyStateText>Memuat riwayat sesi...</EmptyStateText>
            </EmptyState>
          ) : sessions.length > 0 ? (
            <SessionsList>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  onClick={() => navigate(`/session/${session.id}`)}
                >
                  <SessionIcon>📚</SessionIcon>
                  <SessionInfo>
                    <SessionName>{session.title || 'Untitled'}</SessionName>
                    <SessionDate>{formatDate(session.createdAt)}</SessionDate>
                  </SessionInfo>
                  {/* <SessionCredit>-{session.credits_used} kredit</SessionCredit> */}
                </SessionCard>
              ))}
            </SessionsList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>📋</EmptyStateIcon>
              <EmptyStateText>Belum ada sesi</EmptyStateText>
              <EmptyStateSubtext>Klik "Buat Sesi Baru" untuk memulai pembelajaran pertama Anda</EmptyStateSubtext>
            </EmptyState>
          )}
        </SessionsSection>
      </MainContent>

      {/* Feature Catalog Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Pilih Fitur Pembelajaran</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              {isLoadingFeatures ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Memuat fitur...
                </div>
              ) : (
                <CatalogGrid>
                  {features.map((feature) => (
                    <CatalogCard key={feature.id}>
                      <CardIcon>{feature.icon}</CardIcon>
                      <CardTitle>{feature.name}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                      <CardFooter>
                        <CreditCost>
                          💎 {feature.cost} kredit
                        </CreditCost>
                        <UseButton
                          onClick={() => handleUseFeature(feature)}
                          disabled={balance < feature.cost}
                        >
                          Gunakan Fitur
                        </UseButton>
                      </CardFooter>
                    </CatalogCard>
                  ))}
                </CatalogGrid>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  )
}

export default Dashboard
