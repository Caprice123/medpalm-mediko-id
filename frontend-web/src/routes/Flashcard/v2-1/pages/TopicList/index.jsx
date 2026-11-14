import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import SessionPlayer from './components/SessionPlayer'
import { useTopicList, DUE_SESSION_BATCH_SIZE } from './hooks/useTopicList'
import TopicListHeader from './components/TopicListHeader'
import DueTodayPanel from './components/DueTodayPanel'
// import ProgressPanel from './components/ProgressPanel' — replaced by PerformanceCard below
import PerformanceCard from './components/PerformanceCard'
import TopicsSection from './components/TopicsSection'
import CustomSessionPanel from './components/CustomSessionPanel'
import { Container } from './TopicList.styles'

export default function TopicListPage() {
  const { loading } = useSelector(s => s.flashcardNodes)
  const flashcardFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'flashcard'))
  const {
    openTopicId, loadingTopicId,
    customOpen, setCustomOpen,
    sessionOrigin,
    handleStartAllDue, handleStartNodeDue, handleStartTopicSession,
    handleCustomSessionStarted, handleCloseSession,
    toggle,
    deepLinkSubtopicId,
    progressSubtopicsCache, loadProgressSubtopics,
  } = useTopicList()

  // scroll the deep-linked, now-expanded topic into view
  useEffect(() => {
    if (!deepLinkSubtopicId || openTopicId == null) return
    const el = document.getElementById(`topic-row-${openTopicId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [deepLinkSubtopicId, openTopicId])

  return (
    <Container>
      <TopicListHeader
        featureName={flashcardFeature?.name}
        featureDescription={flashcardFeature?.description}
        onOpenCustomSession={() => setCustomOpen(true)}
      />

      {/* a custom session plays directly under the button that opened it */}
      {sessionOrigin?.type === 'custom' && <SessionPlayer onClose={handleCloseSession} />}

      <DueTodayPanel
        onStartAll={handleStartAllDue}
        onStartNode={handleStartNodeDue}
        isStarting={loading.isStartingSession}
        batchSize={DUE_SESSION_BATCH_SIZE}
      />

      {sessionOrigin?.type === 'due' && <SessionPlayer onClose={handleCloseSession} />}

      {/* <ProgressPanel /> — replaced by PerformanceCard below */}
      <PerformanceCard
        subtopicsCache={progressSubtopicsCache}
        onRequestSubtopics={loadProgressSubtopics}
      />

      <TopicsSection
        openTopicId={openTopicId}
        loadingTopicId={loadingTopicId}
        toggle={toggle}
        onStartTopicSession={handleStartTopicSession}
        isStartingSession={loading.isStartingSession}
        deepLinkSubtopicId={deepLinkSubtopicId}
        sessionTopicId={sessionOrigin?.type === 'topic' ? sessionOrigin.topicId : null}
        onCloseSession={handleCloseSession}
      />

      {customOpen && (
        <CustomSessionPanel
          onClose={() => setCustomOpen(false)}
          onStarted={handleCustomSessionStarted}
        />
      )}
    </Container>
  )
}
