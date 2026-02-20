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
  Content,
  MobileButtonWrapper,
} from './SessionPractice.styles'
import Button from '@components/common/Button'
import { useSessionPractice } from './hooks/useSessionPractice'

const TABS = [
  { id: 'conversation', label: 'Percakapan' },
  { id: 'physical_exam', label: 'Pemeriksaan Fisik' },
  { id: 'supporting', label: 'Data Penunjang' },
  { id: 'diagnosis', label: 'Diagnosa' },
  { id: 'therapy', label: 'Terapi' },
]

function SessionPractice() {
  const {
    sessionDetail, loading,
    activeTab, setActiveTab,
    isPsikiatri,
    diagnosisUtama, setDiagnosisUtama,
    diagnosisPembanding, setDiagnosisPembanding,
    therapies, setTherapies,
    observations, setObservations,
    interpretations, setInterpretations,
    showEndSessionModal, setShowEndSessionModal,
    isAutoEnd,
    isTestingSttProvider,
    sttProvider,
    handleEndSession,
    handleConfirmEndSession,
  } = useSessionPractice()

  if (loading.isLoadingSessionDetail || isTestingSttProvider) {
    return <SessionSkeleton />
  }

  return (
    <Container>
      <Content>
        <SessionSidebar
          session={sessionDetail}
          onEndSession={handleEndSession}
          isEndingSession={loading.isEndingSession}
        />

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
