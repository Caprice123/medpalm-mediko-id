import { useNavigate, generatePath } from 'react-router-dom'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { TopicHubRoute } from '../../routes'
import Breadcrumb from '@components/common/Breadcrumb'
import { useTopicDetail } from './hooks/useTopicDetail'
import TopicInfo from './components/TopicInfo'
import SubtopicsSection from './components/SubtopicsSection'
import AtlasModelsSection from './components/AtlasModelsSection'
import { Container } from './TopicDetail.styles'

export default function TopicDetailPage() {
  const navigate = useNavigate()
  const { topicSlug, topic } = useTopicDetail()

  return (
    <Container>
      <Breadcrumb
        style={{ marginBottom: '1.75rem' }}
        items={[
          { label: 'Topik', onClick: () => navigate(TopicHubRoute.moduleRoute) },
          { label: topic?.name ?? topicSlug },
        ]}
      />

      <TopicInfo
        topic={topic}
        topicSlug={topicSlug}
        onBack={() => navigate(TopicHubRoute.moduleRoute)}
      />

      <SubtopicsSection
        onSelectSubtopic={slug => navigate(generatePath(TopicHubRoute.subtopicRoute, { topicSlug, subtopicSlug: slug }))}
      />

      <AtlasModelsSection
        onSelectModel={uniqueId => navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug: topicSlug, uniqueId }))}
      />
    </Container>
  )
}
