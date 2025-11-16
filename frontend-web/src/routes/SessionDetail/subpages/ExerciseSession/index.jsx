import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchExerciseTopics } from '@store/exercise/action'
import { fetchCreditBalance } from '@store/credit/action'
import { startExerciseWithTopic, fetchSessionAttempts, createNewAttempt, fetchSessionAttemptDetail } from '@store/session/action'
import ExercisePlayer from './components/ExercisePlayer'
import SessionResults from './components/SessionResults'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  BackButton,
  Title,
  Subtitle,
  CreditBadge,
  TopicSelectionContainer,
  FilterSection,
  FilterGroup,
  FilterLabel,
  Select,
  TopicGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  TopicDescription,
  TagContainer,
  Tag,
  TopicFooter,
  QuestionCount,
  CostBadge,
  StartButton,
  EmptyState,
  LoadingContainer,
  LoadingSpinner
} from './ExerciseSessionSubpage.styles'

function ExerciseSessionSubpage({ sessionId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const sessionState = useSelector(state => state.session)
  const { sessionDetail, sessionAttempts: attempts, attemptDetail, loading, pagination } = sessionState
  const { topics, isLoading } = useSelector(state => state.exercise)
  const { balance } = useSelector(state => state.credit)
  const { isLoadingAttempts, isLoadingAttemptDetail } = loading

  const [currentView, setCurrentView] = useState('auto') // 'auto', 'results'
  const [selectedAttempt, setSelectedAttempt] = useState(null)
  const [completedAttemptId, setCompletedAttemptId] = useState(null)

  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })
  const [exerciseCost, setExerciseCost] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  // Step 1: Fetch attempts when we have the session detail or page changes
  useEffect(() => {
    if (sessionDetail?.id) {
      const offset = (currentPage - 1) * itemsPerPage
      dispatch(fetchSessionAttempts(sessionDetail.id, itemsPerPage, offset))
    }
  }, [dispatch, sessionDetail?.id, currentPage, itemsPerPage])

  // Step 2: Determine what data to fetch based on attempts
  useEffect(() => {
    if (!attempts || attempts.length === 0) return

    const activeAttempt = attempts.find(attempt => attempt.status === "active")

    if (activeAttempt) {
      // If there's an active attempt, fetch its detail for the exercise player
      dispatch(fetchSessionAttemptDetail(activeAttempt.id))
    } else if (attempts.length === 1 && attempts[0].status === 'not_started') {
      // If there's only 1 not_started attempt, fetch topics and credit balance
      dispatch(fetchExerciseTopics())
      dispatch(fetchCreditBalance())
    }
    // Otherwise (multiple attempts or completed), we don't need to fetch anything yet
  }, [dispatch, attempts])

  // Fetch attempt detail when viewing specific attempt results
  useEffect(() => {
    if (currentView === 'results' && selectedAttempt) {
      dispatch(fetchSessionAttemptDetail(selectedAttempt.id))
    }
  }, [dispatch, currentView, selectedAttempt])

  // Handle showing results after completing an attempt
  useEffect(() => {
    if (completedAttemptId && attempts && attempts.length > 0) {
      const completedAttempt = attempts.find(a => a.id === completedAttemptId)
      if (completedAttempt && completedAttempt.status === 'completed') {
        setSelectedAttempt(completedAttempt)
        setCurrentView('results')
        setCompletedAttemptId(null) // Clear the flag
      }
    }
  }, [completedAttemptId, attempts])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    dispatch(fetchExerciseTopics({ [filterType]: value }))
  }

  const handleStartTopic = async (topic) => {
    if (balance < exerciseCost) {
      alert('Kredit tidak mencukupi! Silakan isi ulang untuk melanjutkan.')
      navigate('/dashboard')
      return
    }

    try {
      const notStartedAttempt = attempts.find(a => a.status === 'not_started')
      if (notStartedAttempt) {
        await dispatch(startExerciseWithTopic(sessionId, notStartedAttempt.id, topic.id))
        // Refresh attempts to get updated status
        await dispatch(fetchSessionAttempts(sessionDetail.id))
      }
    } catch (error) {
      alert('Gagal memulai latihan: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  // Get unique universities and semesters for filters
  const universities = [...new Set(
    topics.flatMap(t => t.tags?.filter(tag => tag.type === 'university').map(tag => tag.name) || [])
  )]

  const semesters = [...new Set(
    topics.flatMap(t => t.tags?.filter(tag => tag.type === 'semester').map(tag => tag.name) || [])
  )].sort()

  const handleTryAgain = async () => {
    try {
      const newAttemptData = await dispatch(createNewAttempt(sessionId))
      // Refresh attempts list with current pagination
      const offset = (currentPage - 1) * itemsPerPage
      await dispatch(fetchSessionAttempts(sessionDetail.id, itemsPerPage, offset))
    } catch (error) {
      alert('Gagal membuat attempt baru: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleViewAttemptResults = (attempt) => {
    setSelectedAttempt(attempt)
    setCurrentView('results')
  }

  const handleViewAttemptsList = () => {
    setCurrentView('auto')
    setSelectedAttempt(null)
  }

  // Show loading state
  if (!sessionDetail || isLoadingAttempts) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  if (!attempts || attempts.length === 0) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat percobaan...
        </div>
      </LoadingContainer>
    )
  }

  // ===== VIEW LOGIC BASED ON FLOW =====

  // If viewing specific attempt results
  if (currentView === 'results' && selectedAttempt) {
    if (isLoadingAttemptDetail || !attemptDetail || !attemptDetail.questions?.length) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat hasil...
          </div>
        </LoadingContainer>
      )
    }

    return (
      <SessionResults
        attemptMetadata={selectedAttempt}
        attemptDetail={attemptDetail}
        onTryAgain={handleTryAgain}
        onViewHistory={handleViewAttemptsList}
      />
    )
  }

  const activeAttempt = attempts.find(a => a.status === 'active')

  // If there's an active attempt, show ExercisePlayer immediately
  if (activeAttempt) {
    if (!attemptDetail || !attemptDetail.questions?.length) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat soal...
          </div>
        </LoadingContainer>
      )
    }

    return (
      <ExercisePlayer
        attemptId={activeAttempt.id}
        onComplete={async (attemptId) => {
          // Fetch the attempt detail for results
          await dispatch(fetchSessionAttemptDetail(attemptId))

          // Refresh attempts to get updated status and metadata
          const offset = (currentPage - 1) * itemsPerPage
          await dispatch(fetchSessionAttempts(sessionDetail.id, itemsPerPage, offset))

          // Set flag to show results (useEffect will handle finding the attempt)
          setCompletedAttemptId(attemptId)
        }}
      />
    )
  }

  // If there's only 1 attempt and it's not_started, show topic selection
  if (attempts.length === 1 && attempts[0].status === 'not_started') {
    return (
      <Container>
        <Header>
          <div>
            <BackButton onClick={handleBackToDashboard}>
              ← Kembali ke Dashboard
            </BackButton>
            <Title>Pilih Topik Latihan</Title>
            <Subtitle>
              Pilih topik latihan soal untuk meningkatkan pemahaman Anda
            </Subtitle>
          </div>
          <CreditBadge>
            💎 {balance} Kredit
          </CreditBadge>
        </Header>

        <TopicSelectionContainer>
          <FilterSection>
            <FilterGroup>
              <FilterLabel>Universitas</FilterLabel>
              <Select
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              >
                <option value="">Semua Universitas</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Semester</FilterLabel>
              <Select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
              >
                <option value="">Semua Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </Select>
            </FilterGroup>
          </FilterSection>

          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>
                Memuat topik...
              </div>
            </LoadingContainer>
          ) : topics.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3>Belum Ada Topik</h3>
              <p>Belum ada topik latihan yang tersedia saat ini</p>
            </EmptyState>
          ) : (
            <TopicGrid>
              {topics.map((topic) => (
                <TopicCard key={topic.id}>
                  <TopicHeader>
                    <TopicTitle>{topic.title}</TopicTitle>
                    <TopicDescription>{topic.description || 'Tidak ada deskripsi'}</TopicDescription>
                  </TopicHeader>

                  <TagContainer>
                    {topic.tags && topic.tags.map((tag, index) => (
                      <Tag key={index} type={tag.type}>
                        {tag.name}
                      </Tag>
                    ))}
                  </TagContainer>

                  <TopicFooter>
                    <div>
                      <QuestionCount>
                        {topic.questionCount || topic.questions?.length || 0} Soal
                      </QuestionCount>
                      <CostBadge>
                        💎 {exerciseCost} kredit
                      </CostBadge>
                    </div>
                    <StartButton
                      onClick={() => handleStartTopic(topic)}
                      disabled={balance < exerciseCost}
                    >
                      Mulai Latihan
                    </StartButton>
                  </TopicFooter>
                </TopicCard>
              ))}
            </TopicGrid>
          )}
        </TopicSelectionContainer>
      </Container>
    )
  }

  // Otherwise, show list of all attempts
  return (
    <Container>
      <Header>
        <div>
          <Title>Riwayat Percobaan</Title>
          <Subtitle>
            Lihat semua percobaan latihan Anda
          </Subtitle>
        </div>
        <StartButton
          onClick={handleTryAgain}
          style={{
            alignSelf: 'flex-start',
            marginTop: '1rem'
          }}
        >
          🔄 Coba Lagi
        </StartButton>
      </Header>

      <TopicSelectionContainer>
        <TopicGrid>
          {attempts.map((attempt) => (
            <TopicCard
              key={attempt.id}
              onClick={() => {
                if (attempt.status === 'completed') {
                  handleViewAttemptResults(attempt)
                }
              }}
              style={{ cursor: attempt.status === 'completed' ? 'pointer' : 'default' }}
            >
              <TopicHeader>
                <TopicTitle>Percobaan #{attempt.attemptNumber}</TopicTitle>
              </TopicHeader>

              <TagContainer>
                <Tag type="status">
                  {attempt.status === 'completed' ? '✓ Selesai' :
                   attempt.status === 'active' ? '▶ Aktif' : '○ Belum dimulai'}
                </Tag>
                {attempt.status === 'completed' && (
                  <Tag type="score">
                    Skor: {attempt.correctQuestion}/{attempt.totalQuestion} ({attempt.score}%)
                  </Tag>
                )}
              </TagContainer>

              <TopicFooter>
                <div>
                  <QuestionCount>
                    {attempt.total_questions || 0} Soal
                  </QuestionCount>
                  <CostBadge>
                    💎 {attempt.credits_used} kredit
                  </CostBadge>
                </div>
                {attempt.status === 'completed' && (
                  <StartButton
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewAttemptResults(attempt)
                    }}
                  >
                    Lihat Hasil
                  </StartButton>
                )}
              </TopicFooter>
            </TopicCard>
          ))}
        </TopicGrid>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={isLoadingAttempts}
        />
      </TopicSelectionContainer>
    </Container>
  )
}

export default ExerciseSessionSubpage
