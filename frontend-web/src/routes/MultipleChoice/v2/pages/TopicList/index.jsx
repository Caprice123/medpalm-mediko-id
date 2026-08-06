import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTopicList } from './hooks/useTopicList'
import TopicListHeader from './components/TopicListHeader'
import PerformanceCard from './components/PerformanceCard'
import TopicListSection from './components/TopicListSection'
import CustomSessionPanel from './components/CustomSessionPanel'
import McqSession from './components/Session'
import { Container } from './TopicList.styles'

export default function BankSoalPage() {
  const { sessionQuestions, loading } = useSelector(s => s.mcqNodes)
  const mcqFeature = useSelector(s => s.feature.features.find(f => f.sessionType === 'mcq'))
  const {
    openId, subtopicsCache, loadingIds,
    customOpen, setCustomOpen,
    handleCloseSession,
    toggle, handleStart, loadSubtopics, loadMoreSubtopics,
    deepLinkSubtopicId,
  } = useTopicList()

  // scroll the deep-linked, now-expanded topic into view
  useEffect(() => {
    if (!deepLinkSubtopicId || !openId) return
    const el = document.getElementById(`topic-row-${openId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [deepLinkSubtopicId, openId])

  return (
    <Container>
      <TopicListHeader
        featureName={mcqFeature?.name}
        featureDescription={mcqFeature?.description}
        onOpenCustomSession={() => setCustomOpen(true)}
      />

      <PerformanceCard
        subtopicsCache={subtopicsCache}
        onRequestSubtopics={loadSubtopics}
      />

      <TopicListSection
        openId={openId}
        loadingIds={loadingIds}
        subtopicsCache={subtopicsCache}
        toggle={toggle}
        onLoadMoreSubtopics={loadMoreSubtopics}
        onStart={handleStart}
        isStarting={loading.isStartingSession}
        deepLinkSubtopicId={deepLinkSubtopicId}
      />

      {sessionQuestions.length > 0 && (
        <McqSession onClose={handleCloseSession} />
      )}

      {customOpen && (
        <CustomSessionPanel onClose={() => setCustomOpen(false)} />
      )}
    </Container>
  )
}
