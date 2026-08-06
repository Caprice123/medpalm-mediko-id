import { useDispatch, useSelector } from 'react-redux'
import { startDiagnosticCustomSession, startDiagnosticNodeDueSession } from '@store/diagnosticNodes'
import QuizPlayer from './components/QuizPlayer'
import CategoryListHeader from './components/CategoryListHeader'
import DueTodayPanel from './components/DueTodayPanel'
// import ProgressPanel from './components/ProgressPanel' — replaced by PerformanceCard below
import PerformanceCard from './components/PerformanceCard'
import TopicGroupSection from './components/TopicGroupSection'
import CustomSessionPanel from './components/CustomSessionPanel'
import { useCategoryList, DUE_SESSION_BATCH_SIZE } from './hooks/useCategoryList'
import { Container, EmptyWrap } from './CategoryList.styles'

export default function CategoryListPage() {
  const dispatch = useDispatch()
  const { sessionCards, loading, primaryTopics, specialTopics } = useSelector(s => s.diagnosticNodes)
  const diagnosticFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'diagnostic'))
  const {
    openTopicId, loadingTopicId,
    customOpen, setCustomOpen,
    handleStartAllDue, handleCloseSession,
    toggle,
    progressSubmodulesCache, loadProgressSubmodules,
  } = useCategoryList()

  const isLoading = loading.isFetchingCategories

  return (
    <Container>
      <CategoryListHeader
        featureName={diagnosticFeature?.name}
        featureDescription={diagnosticFeature?.description}
        onOpenCustomSession={() => setCustomOpen(true)}
      />

      <DueTodayPanel
        onStartAll={handleStartAllDue}
        onStartNode={(nodeId) => dispatch(startDiagnosticNodeDueSession(nodeId))}
        isStarting={loading.isStartingSession}
        batchSize={DUE_SESSION_BATCH_SIZE}
      />

      {/* <ProgressPanel /> — replaced by PerformanceCard below */}
      <PerformanceCard
        submodulesCache={progressSubmodulesCache}
        onRequestSubmodules={loadProgressSubmodules}
      />

      <TopicGroupSection
        title="Modul Primer"
        classification="primary"
        openTopicId={openTopicId}
        loadingTopicId={loadingTopicId}
        toggle={toggle}
        onStartCustomSession={(nodeIds, count) => dispatch(startDiagnosticCustomSession(nodeIds, count))}
        isStartingSession={loading.isStartingSession}
      />

      <TopicGroupSection
        title="Modul Spesialis"
        classification="special"
        openTopicId={openTopicId}
        loadingTopicId={loadingTopicId}
        toggle={toggle}
        onStartCustomSession={(nodeIds, count) => dispatch(startDiagnosticCustomSession(nodeIds, count))}
        isStartingSession={loading.isStartingSession}
      />

      {!isLoading && primaryTopics.length === 0 && specialTopics.length === 0 && (
        <EmptyWrap>Belum ada soal tersedia.</EmptyWrap>
      )}

      {sessionCards.length > 0 && (
        <QuizPlayer cards={sessionCards} onBack={handleCloseSession} />
      )}

      {customOpen && (
        <CustomSessionPanel onClose={() => setCustomOpen(false)} />
      )}
    </Container>
  )
}
