import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startFlashcardCustomSession, startFlashcardNodeDueSession } from '@store/flashcardNodes'
import AnkiPlayer from './components/AnkiPlayer'
import { useTopicList, DUE_SESSION_BATCH_SIZE } from './hooks/useTopicList'
import TopicListHeader from './components/TopicListHeader'
import DueTodayPanel from './components/DueTodayPanel'
import ProgressPanel from './components/ProgressPanel'
import TopicsSection from './components/TopicsSection'
import CustomSessionPanel from './components/CustomSessionPanel'
import { Container, DashboardRow } from './TopicList.styles'

export default function TopicListPage() {
  const dispatch = useDispatch()
  const { sessionCards, loading } = useSelector(s => s.flashcardNodes)
  const flashcardFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'flashcard'))
  const {
    openTopicId, loadingTopicId,
    customOpen, setCustomOpen,
    handleStartAllDue, handleCloseSession,
    toggle,
    deepLinkSubtopicId,
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

      <DashboardRow>
        <DueTodayPanel
          onStartAll={handleStartAllDue}
          onStartNode={(nodeId) => dispatch(startFlashcardNodeDueSession(nodeId))}
          isStarting={loading.isStartingSession}
          batchSize={DUE_SESSION_BATCH_SIZE}
        />
        <ProgressPanel />
      </DashboardRow>

      <TopicsSection
        openTopicId={openTopicId}
        loadingTopicId={loadingTopicId}
        toggle={toggle}
        onStartCustomSession={(nodeIds, count) => dispatch(startFlashcardCustomSession(nodeIds, count))}
        isStartingSession={loading.isStartingSession}
        deepLinkSubtopicId={deepLinkSubtopicId}
      />

      {sessionCards.length > 0 && (
        <AnkiPlayer
          deck={{ title: 'Sesi Belajar', cards: sessionCards }}
          onBack={handleCloseSession}
        />
      )}

      {customOpen && (
        <CustomSessionPanel onClose={() => setCustomOpen(false)} />
      )}
    </Container>
  )
}
