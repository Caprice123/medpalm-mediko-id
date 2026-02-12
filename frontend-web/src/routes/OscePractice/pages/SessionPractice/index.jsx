import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  fetchSessionMessages,
  fetchPhysicalExamMessages,
  endOsceSession,
} from '@store/oscePractice/userAction'
import SessionSidebar from './components/SessionSidebar'
import ConversationTab from './components/ConversationTab'
import PhysicalExaminationTab from './components/PhysicalExaminationTab'
import DiagnosisTab from './components/DiagnosisTab'
import PsikiatriDiagnosisTab from './components/PsikiatriDiagnosisTab'
import TherapyTab from './components/TherapyTab'
import SupportingDataTab from './components/SupportingDataTab'
import EndSessionModal from './components/EndSessionModal'
import SessionSkeleton from './components/SessionSkeleton'
import {
  Container,
  MainContent,
  TabBar,
  Tab,
  TabContent,
  EmptyState,
  Content,
  MobileButtonWrapper,
} from './SessionPractice.styles'
import Button from '@components/common/Button'
import { getAvailableSttProvider } from '@utils/testDeepgramConnection'

const TABS = [
  { id: 'conversation', label: 'Percakapan' },
  { id: 'physical_exam', label: 'Pemeriksaan Fisik' },
  { id: 'supporting', label: 'Data Penunjang' },
  { id: 'diagnosis', label: 'Diagnosa' },
  { id: 'therapy', label: 'Terapi' },
]

function SessionPractice() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  const [activeTab, setActiveTab] = useState('conversation')

  // Check if session has psikiatri tag
  const isPsikiatri = sessionDetail?.tags?.some(tag =>
    tag.tagGroup?.name?.toLowerCase() === 'topic' &&
    tag.name?.toLowerCase() === 'psikiatri'
  ) || false

  // Diagnosa state - utama is array for psikiatri, string otherwise
  const [diagnosisUtama, setDiagnosisUtama] = useState(isPsikiatri ? [] : '')
  const [diagnosisPembanding, setDiagnosisPembanding] = useState([])

  // Terapi state
  const [therapies, setTherapies] = useState('')

  // Observations state (for interpretations)
  const [observations, setObservations] = useState([])
  const [interpretations, setInterpretations] = useState({})

  // End session modal state
  const [showEndSessionModal, setShowEndSessionModal] = useState(false)
  const [isAutoEnd, setIsAutoEnd] = useState(false) // true if triggered by timer

  // Track if we've completed fetching for this sessionId
  const [hasFetchedForSession, setHasFetchedForSession] = useState(false)

  // Track STT provider testing
  const [isTestingSttProvider, setIsTestingSttProvider] = useState(true)
  const [sttProvider, setSttProvider] = useState(null)

  // Test STT provider on mount
  useEffect(() => {
    const testProvider = async () => {
      setIsTestingSttProvider(true)
      try {
        const provider = await getAvailableSttProvider()
        setSttProvider(provider)
      } catch (err) {
        console.error('Error testing STT provider:', err)
        setSttProvider('whisper')
      } finally {
        setIsTestingSttProvider(false)
      }
    }

    testProvider()
  }, [])

  // Fetch session detail and all messages on mount (only once)
  useEffect(() => {
    if (sessionId) {
      setHasFetchedForSession(false) // Reset when sessionId changes

      // Fetch session detail and all messages in parallel
      Promise.all([
        dispatch(fetchSessionDetail(sessionId)),
        dispatch(fetchSessionMessages(sessionId)),
        dispatch(fetchPhysicalExamMessages(sessionId))
      ]).then(() => {
        setHasFetchedForSession(true) // Mark complete after all fetches
      })
    }
  }, [sessionId, dispatch])

  // Populate diagnoses, therapies, and observations from sessionDetail when it loads
  useEffect(() => {
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      // Populate diagnosis from new JSONB format
      if (sessionDetail.userAnswer?.diagnosis) {
        const diagnosis = sessionDetail.userAnswer.diagnosis
        // Handle both array and string format for utama
        if (Array.isArray(diagnosis.utama)) {
          setDiagnosisUtama(diagnosis.utama)
        } else {
          setDiagnosisUtama(diagnosis.utama || (isPsikiatri ? [] : ''))
        }
        setDiagnosisPembanding(diagnosis.pembanding || [])
      }

      // Populate therapy from new string format
      if (sessionDetail.userAnswer?.therapy !== undefined) {
        setTherapies(sessionDetail.userAnswer.therapy || '')
      }

      // Populate observations with interpretations
      if (sessionDetail.observationsLocked && sessionDetail.userAnswer?.observations) {
        setObservations(sessionDetail.userAnswer.observations || [])

        // Populate interpretations
        const interp = {}
        sessionDetail.userAnswer.observations.forEach(obs => {
          if (obs.notes) {
            interp[obs.snapshotId] = obs.notes
          }
        })
        setInterpretations(interp)
      }
    }
  }, [sessionDetail, sessionId, isPsikiatri])

  // Redirect based on session status - ONLY after fetch completes
  useEffect(() => {
    // Don't redirect if:
    // 1. Still loading
    // 2. Haven't completed fetching for this sessionId (prevents checking stale data)
    if (loading.isLoadingSessionDetail || !hasFetchedForSession) {
      return
    }

    // Only redirect if we have data and it's for the correct session
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      if (sessionDetail.status === 'created') {
        // Redirect to preparation page if session not started yet
        navigate(`/osce-practice/session/${sessionId}/preparation`, { replace: true })
      } else if (sessionDetail.status === 'completed') {
        // Redirect to result page if session already completed
        navigate(`/osce-practice/session/${sessionId}/result`, { replace: true })
      }
    }
  }, [sessionDetail, sessionId, navigate, loading.isLoadingSessionDetail, hasFetchedForSession])

  const handleEndSession = (autoEnd = false) => {
    setIsAutoEnd(autoEnd)
    setShowEndSessionModal(true)
  }

  const handleConfirmEndSession = async () => {
    // Build observations array with interpretations
    const observationsWithInterpretations = observations.map(obs => ({
      snapshotId: obs.snapshotId,
      name: obs.name,
      interpretation: interpretations[obs.snapshotId] || '',
    }))

    await dispatch(endOsceSession(
      sessionId,
      {
        diagnoses: {
          utama: diagnosisUtama,
          pembanding: diagnosisPembanding,
        },
        therapies: therapies,
        observations: observationsWithInterpretations,
      },
      () => {
        // Navigate to results page on success
        navigate(`/osce-practice/session/${sessionId}/result`)
      }
    ))
  }

  // Show loading state if session detail loading OR still testing STT provider
  if (loading.isLoadingSessionDetail || isTestingSttProvider) {
    return <SessionSkeleton />
  }

  return (
    <Container>
        <Content>

        {/* Left Sidebar */}
        <SessionSidebar
            session={sessionDetail}
            onEndSession={handleEndSession}
            isEndingSession={loading.isEndingSession}
        />

        {/* Main Content */}
        <MainContent>
            <TabBar>
            {TABS.map(tab => (
                <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                >
                {tab.label}
                </Tab>
            ))}
            </TabBar>

            <TabContent>
            {activeTab === 'conversation' && (
              <ConversationTab sttProvider={sttProvider} />
            )}

            {activeTab === 'physical_exam' && (
              <PhysicalExaminationTab sttProvider={sttProvider} />
            )}

            {activeTab === 'supporting' && (
                <SupportingDataTab
                observations={observations}
                setObservations={setObservations}
                interpretations={interpretations}
                setInterpretations={setInterpretations}
                />
            )}

            {activeTab === 'diagnosis' && (
              isPsikiatri ? (
                <PsikiatriDiagnosisTab
                  diagnosisUtama={diagnosisUtama}
                  setDiagnosisUtama={setDiagnosisUtama}
                  diagnosisPembanding={diagnosisPembanding}
                  setDiagnosisPembanding={setDiagnosisPembanding}
                />
              ) : (
                <DiagnosisTab
                  diagnosisUtama={diagnosisUtama}
                  setDiagnosisUtama={setDiagnosisUtama}
                  diagnosisPembanding={diagnosisPembanding}
                  setDiagnosisPembanding={setDiagnosisPembanding}
                />
              )
            )}

            {activeTab === 'therapy' && (
                <TherapyTab
                therapies={therapies}
                setTherapies={setTherapies}
                />
            )}
            </TabContent>
        </MainContent>

        {/* Mobile End Session Button */}
        <MobileButtonWrapper>
          <Button
            variant="danger"
            onClick={() => handleEndSession(false)}
            disabled={loading.isEndingSession}
            fullWidth
          >
            {loading.isEndingSession ? 'Mengevaluasi...' : 'Akhiri Sesi'}
          </Button>
        </MobileButtonWrapper>
        </Content>

        {/* End Session Modal */}
        <EndSessionModal
          isOpen={showEndSessionModal}
          onClose={() => setShowEndSessionModal(false)}
          onConfirm={handleConfirmEndSession}
          isProcessing={loading.isEndingSession}
          autoEnd={isAutoEnd}
        />
    </Container>
  )
}

export default SessionPractice
