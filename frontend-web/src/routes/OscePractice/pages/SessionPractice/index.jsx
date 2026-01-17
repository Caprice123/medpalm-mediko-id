import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Endpoints from '@config/endpoint'
import { postWithToken } from '@utils/requestUtils'
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
  const { sessionId } = useParams()
  const { userSessions } = useSelector(state => state.oscePractice)

  const [activeTab, setActiveTab] = useState('conversation')

  // Diagnosa state
  const [diagnosisUtama, setDiagnosisUtama] = useState('')
  const [diagnosisPembanding, setDiagnosisPembanding] = useState([])

  // Terapi state
  const [therapies, setTherapies] = useState([])

  const [isEndingSession, setIsEndingSession] = useState(false)

  // Find session data
  const session = userSessions.find(s => s.uniqueId === sessionId)

  const handleEndSession = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengakhiri sesi? Sesi akan dievaluasi dan Anda tidak bisa melanjutkan setelah ini.')) {
      return
    }

    try {
      setIsEndingSession(true)

      const route = Endpoints.api.osceEndSession(sessionId)
      const response = await postWithToken(route, {
        diagnoses: {
          utama: diagnosisUtama,
          pembanding: diagnosisPembanding,
        },
        therapies: therapies,
      })

      if (response.data.success) {
        // Navigate to results page
        navigate(`/osce-practice/session/${sessionId}/result`)
      }
    } catch (error) {
      console.error('Error ending session:', error)
      // Error is handled by the error handling in requestUtils
      setIsEndingSession(false)
    }
  }

  if (!session) {
    return (
      <Container>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Sesi Tidak Ditemukan</h2>
            <button onClick={() => navigate('/osce-practice')}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {/* Left Sidebar */}
      <SessionSidebar
        session={session}
        onEndSession={handleEndSession}
        isEndingSession={isEndingSession}
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

          {activeTab === 'supporting' && <SupportingDataTab />}

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
