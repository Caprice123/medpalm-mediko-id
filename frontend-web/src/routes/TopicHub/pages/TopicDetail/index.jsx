import { useNavigate, generatePath } from 'react-router-dom'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { TopicHubRoute } from '../../routes'
import Breadcrumb from '@components/common/Breadcrumb'
import EmptyState from '@components/common/EmptyState'
import { useTopicDetail } from './hooks/useTopicDetail'
import TopicInfo from './components/TopicInfo'
import SubtopicsSection from './components/SubtopicsSection'
import AtlasModelsSection from './components/AtlasModelsSection'
import { Container } from './TopicDetail.styles'

export default function TopicDetailPage() {
  const navigate = useNavigate()
  const { topicSlug, topic, error, retry } = useTopicDetail()

  return (
    <Container>
      {/* The breadcrumb is the way back. The header used to carry a second
          "Kembali" button beside it, pointing at the same place. */}
      <Breadcrumb
        style={{ marginBottom: '1.75rem' }}
        items={[
          { label: 'Topik', onClick: () => navigate(TopicHubRoute.moduleRoute) },
          { label: topic?.name ?? topicSlug },
        ]}
      />

      <TopicInfo topic={topic} />

      {error ? (
        <EmptyState
          icon="⚠️"
          title="Gagal memuat subtopik"
          description="Periksa koneksi internetmu, lalu coba lagi."
          actionLabel="Coba Lagi"
          onAction={retry}
        />
      ) : (
        <>
          <SubtopicsSection
            onSelectSubtopic={slug => navigate(generatePath(TopicHubRoute.subtopicRoute, { topicSlug, subtopicSlug: slug }))}
          />

          <AtlasModelsSection
            onSelectModel={uniqueId => navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug: topicSlug, uniqueId }))}
          />
        </>
      )}
    </Container>
  )
}
