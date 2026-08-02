import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from '@components/common/Loading'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { useAtlasModelDetail } from './hooks/useAtlasModelDetail'
import DetailHeader from './components/DetailHeader'
import ModelInfoCard from './components/ModelInfoCard'
import ModelEmbed from './components/ModelEmbed'
import RelatedQuizzesSection from './components/RelatedQuizzesSection'
import AdjacentModelNav from './components/AdjacentModelNav'
import { PageWrapper, Inner } from './AtlasModelDetail.styles'

function AtlasModelDetailPage() {
  const navigate = useNavigate()
  const { slug, uniqueId } = useParams()
  const isLoading = useSelector(s => s.atlasQuiz.loading.isFetchingAtlasModelDetail)
  const { atlasModelDetail, allQuizzes, prevModel, nextModel } = useAtlasModelDetail(slug, uniqueId)

  const handleRelatedModelClick = (relUniqueId) => {
    navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug, uniqueId: relUniqueId }))
  }

  const handleQuizClick = (quiz) => {
    navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: quiz.uniqueId }))
  }

  if (isLoading || !atlasModelDetail) return <Loading />

  const { model, module: mod, topicName } = atlasModelDetail

  return (
    <PageWrapper>
      <Inner>
        <DetailHeader
          onBack={() => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug }))}
          breadcrumbItems={[
            { label: 'Atlas Quiz', onClick: () => navigate(AtlasQuizRoute.homeRoute) },
            { label: topicName, onClick: () => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug })) },
            ...(mod ? [{ label: mod.name }] : []),
            { label: model.title },
          ]}
        />

        <ModelInfoCard mod={mod} model={model} />

        <ModelEmbed src={model.embedUrl} title={model.title} />

        <RelatedQuizzesSection quizzes={allQuizzes} onQuizClick={handleQuizClick} />

        <AdjacentModelNav prevModel={prevModel} nextModel={nextModel} onNavigate={handleRelatedModelClick} />
      </Inner>
    </PageWrapper>
  )
}

export default AtlasModelDetailPage
