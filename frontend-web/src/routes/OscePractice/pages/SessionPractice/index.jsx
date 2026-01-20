import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  endOsceSession,
} from '@store/oscePractice/userAction'
import SessionSidebar from './components/SessionSidebar'
import ConversationTab from './components/ConversationTab'
import DiagnosisTab from './components/DiagnosisTab'
import TherapyTab from './components/TherapyTab'
import SupportingDataTab from './components/SupportingDataTab'
import {
  Container,
  MainContent,
  TabBar,
  Tab,
  TabContent,
  EmptyState,
} from './SessionPractice.styles'

const TABS = [
  { id: 'conversation', label: 'Percakapan' },
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

  // Diagnosa state
  const [diagnosisUtama, setDiagnosisUtama] = useState('')
  const [diagnosisPembanding, setDiagnosisPembanding] = useState([])

  // Terapi state
  const [therapies, setTherapies] = useState([])

  // Observations state (for interpretations)
  const [observations, setObservations] = useState([])
  const [interpretations, setInterpretations] = useState({})

  // Fetch session detail on mount
  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionDetail(sessionId))
    }
  }, [sessionId, dispatch])

  // Populate diagnoses, therapies, and observations from sessionDetail when it loads
  useEffect(() => {
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      // Populate diagnoses
      if (sessionDetail.diagnoses && sessionDetail.diagnoses.length > 0) {
        const utama = sessionDetail.diagnoses.find(d => d.type === 'utama')
        const pembanding = sessionDetail.diagnoses.filter(d => d.type === 'pembanding')

        if (utama) setDiagnosisUtama(utama.diagnosis)
        if (pembanding.length > 0) {
          setDiagnosisPembanding(pembanding.map(d => d.diagnosis))
        }
      }

      // Populate therapies
      if (sessionDetail.therapies && sessionDetail.therapies.length > 0) {
        setTherapies(sessionDetail.therapies.map(t => t.therapy))
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
  }, [sessionDetail, sessionId])

  // Redirect based on session status
  useEffect(() => {
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      if (sessionDetail.status === 'created') {
        // Redirect to preparation page if session not started yet
        navigate(`/osce-practice/session/${sessionId}/preparation`, { replace: true })
      } else if (sessionDetail.status === 'completed') {
        // Redirect to result page if session already completed
        navigate(`/osce-practice/session/${sessionId}/result`, { replace: true })
      }
    }
  }, [sessionDetail, sessionId, navigate])

  const handleEndSession = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengakhiri sesi? Sesi akan dievaluasi dan Anda tidak bisa melanjutkan setelah ini.')) {
      return
    }

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
      (response) => {
        // Navigate to results page on success
        if (response.success) {
          navigate(`/osce-practice/session/${sessionId}/result`)
        }
      }
    ))
  }

  // Show loading state or if session detail not loaded yet
  if (loading.isLoadingSessionDetail) {
    return (
      <Container>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Memuat Sesi...</h2>
            <p>Mohon tunggu sebentar</p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
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
          {activeTab === 'conversation' && <ConversationTab />}

          {activeTab === 'supporting' && (
            <SupportingDataTab
              observations={observations}
              setObservations={setObservations}
              interpretations={interpretations}
              setInterpretations={setInterpretations}
            />
          )}

          {activeTab === 'diagnosis' && (
            <DiagnosisTab
              diagnosisUtama={diagnosisUtama}
              setDiagnosisUtama={setDiagnosisUtama}
              diagnosisPembanding={diagnosisPembanding}
              setDiagnosisPembanding={setDiagnosisPembanding}
            />
          )}

          {activeTab === 'therapy' && (
            <TherapyTab
              therapies={therapies}
              setTherapies={setTherapies}
            />
          )}
        </TabContent>
      </MainContent>
    </Container>
  )
}

export default SessionPractice
