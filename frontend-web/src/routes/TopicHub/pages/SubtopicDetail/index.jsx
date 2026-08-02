import { useNavigate, generatePath } from 'react-router-dom'
import { TopupRoute } from '@routes/Topup/routes'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { TopicHubRoute } from '../../routes'
import Breadcrumb from '@components/common/Breadcrumb'
import PreviewPanel from './components/PreviewPanel'
import SubtopicHeader from './components/SubtopicHeader'
import VideoPlayer from './components/VideoPlayer'
import ExplanationPanel from './components/ExplanationPanel'
import RelatedContentSection from './components/RelatedContentSection'
import AtlasModelsSection from './components/AtlasModelsSection'
import SubtopicNav from './components/SubtopicNav'
import { useSubtopicDetail } from './hooks/useSubtopicDetail'
import { Container } from './SubtopicDetail.styles'

export default function SubtopicDetailPage() {
  const navigate = useNavigate()
  const {
    topicSlug, subtopicSlug,
    topic, subtopic, siblings, stats, atlasModels, isLoading,
    panelTab, setPanelTab,
    currentIndex, prevSubtopic, nextSubtopic, embedSrc,
  } = useSubtopicDetail()

  const goTo = (slug) => navigate(generatePath(TopicHubRoute.subtopicRoute, { topicSlug, subtopicSlug: slug }))

  return (
    <>
      <Container>
        <Breadcrumb
          style={{ marginBottom: '1.5rem' }}
          items={[
            { label: 'Topik', onClick: () => navigate(TopicHubRoute.moduleRoute) },
            { label: topic?.name ?? topicSlug, onClick: () => navigate(generatePath(TopicHubRoute.detailRoute, { topicSlug })) },
            { label: subtopic?.name ?? subtopicSlug },
          ]}
        />

        <SubtopicHeader
          subtopic={subtopic}
          subtopicSlug={subtopicSlug}
          currentIndex={currentIndex}
          siblingsCount={siblings.length}
          isLoading={isLoading}
        />

        <VideoPlayer embedSrc={embedSrc} title={subtopic?.name} isLoading={isLoading} />

        <ExplanationPanel text={subtopic?.videoExplanation} isLoading={isLoading} />

        <RelatedContentSection
          subtopicName={subtopic?.name}
          stats={stats}
          isLoading={isLoading}
          onSelectTab={setPanelTab}
          onLockedClick={() => navigate(TopupRoute.moduleRoute)}
        />

        <AtlasModelsSection
          atlasModels={atlasModels}
          isLoading={isLoading}
          onSelectModel={uniqueId => navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug: topicSlug, uniqueId }))}
        />

        <SubtopicNav prevSubtopic={prevSubtopic} nextSubtopic={nextSubtopic} onNavigate={goTo} />
      </Container>

      <PreviewPanel
        open={panelTab !== null}
        onClose={() => setPanelTab(null)}
        activeTab={panelTab}
        onTabChange={setPanelTab}
        subtopic={subtopic}
        stats={stats}
      />
    </>
  )
}
