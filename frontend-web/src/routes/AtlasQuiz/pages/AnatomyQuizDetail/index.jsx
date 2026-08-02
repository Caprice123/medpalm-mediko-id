import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from '@components/common/Loading'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { useAnatomyQuizDetail } from './hooks/useAnatomyQuizDetail'
import DetailHeader from './components/DetailHeader'
import QuizInfoCard from './components/QuizInfoCard'
import QuizEmbed from './components/QuizEmbed'
import RelatedAtlasModelsSection from './components/RelatedAtlasModelsSection'
import AdjacentQuizNav from './components/AdjacentQuizNav'
import { PageWrapper, Inner } from './AnatomyQuizDetail.styles'

function AnatomyQuizDetailPage() {
  const navigate = useNavigate()
  const { slug, uniqueId } = useParams()
  const isLoading = useSelector(s => s.atlasQuiz.loading.isFetchingAnatomyQuizDetail)
  const { anatomyQuizDetail, allAtlasModels, prevQuiz, nextQuiz } = useAnatomyQuizDetail(slug, uniqueId)

  const handleModelClick = (model) => {
    navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug, uniqueId: model.uniqueId }))
  }

  const handleAdjacentNavigate = (relUniqueId) => {
    navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: relUniqueId }))
  }

  if (isLoading || !anatomyQuizDetail) return <Loading />

  const { quiz, module: mod, topicName } = anatomyQuizDetail

  return (
    <PageWrapper>
      <Inner>
        <DetailHeader
          onBack={() => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug }))}
          breadcrumbItems={[
            { label: 'Atlas Quiz', onClick: () => navigate(AtlasQuizRoute.homeRoute) },
            { label: topicName, onClick: () => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug })) },
            ...(mod ? [{ label: mod.name }] : []),
            { label: quiz.title },
          ]}
        />

        <QuizInfoCard mod={mod} quiz={quiz} />

        <QuizEmbed src={quiz.embedUrl} title={quiz.title} />

        <RelatedAtlasModelsSection models={allAtlasModels} onModelClick={handleModelClick} />

        <AdjacentQuizNav prevQuiz={prevQuiz} nextQuiz={nextQuiz} onNavigate={handleAdjacentNavigate} />
      </Inner>
    </PageWrapper>
  )
}

export default AnatomyQuizDetailPage
