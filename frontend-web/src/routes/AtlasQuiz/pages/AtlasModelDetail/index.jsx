import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { PiMedal } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { fetchAtlasQuizAtlasModelDetail, fetchUserContentRelations } from '@store/atlasQuiz/userAction'
import { actions } from '@store/atlasQuiz/reducer'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'

function canUseFeature(sessionType, features, userStatus) {
  const feature = features.find(f => f.sessionType === sessionType)
  if (!feature || feature.accessType === 'free') return true
  const activeFeatureKeys = userStatus?.activeFeatureKeys || []
  return activeFeatureKeys.some(f => f.feature === sessionType)
}
import {
  PageWrapper, Inner,
  TopBar, Brand, BrandIcon, BrandTitle, BrandSubtitle, BackButton,
  Breadcrumb, BreadcrumbItem,
  ModelCard, ModelMeta, MetaTag, ModelTitle, ModelDescription,
  EmbedCard, EmbedFrame,
  SectionCard, SectionHeader, SectionTitle, SectionSubtitle,
  QuizGrid, QuizCard, QuizCardTop, QuizIconBox, QuizTitle, QuizCardBottom, TagPill,
  AdjacentNav, AdjacentCard, AdjacentCardEmpty, AdjacentLabel, AdjacentTitle, AdjacentEmptyText,
} from './AtlasModelDetail.styles'

const { setAtlasModelDetail } = actions

const DIFFICULTY_LABELS = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' }

const CLASSIFICATION_LABELS = {
  fisiologi: 'Fisiologi',
  patologi: 'Patologi',
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function AtlasModelDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug, uniqueId } = useParams()
  const { atlasModelDetail: detail, loading } = useSelector(s => s.atlasQuiz)
  const features = useSelector(s => s.feature.features)
  const userStatus = useSelector(s => s.pricing.userStatus)
  const isLoading = loading.isFetchingAtlasModelDetail
  const anatomyQuizAccessible = canUseFeature('anatomy', features, userStatus)

  const [linkedQuizzes, setLinkedQuizzes] = useState([])
  const [prevModel, setPrevModel] = useState(null)
  const [nextModel, setNextModel] = useState(null)

  useEffect(() => {
    dispatch(setAtlasModelDetail(null))
    setLinkedQuizzes([])
    setPrevModel(null)
    setNextModel(null)
    dispatch(fetchAtlasQuizAtlasModelDetail(slug, uniqueId))
  }, [dispatch, slug, uniqueId])

  useEffect(() => {
    if (!detail) return
    const id = detail.model.uniqueId

    if (anatomyQuizAccessible) {
      dispatch(fetchUserContentRelations({ sourceType: 'atlas_model', sourceUniqueId: id, targetType: 'anatomy_quiz', relationType: 'feature_relation' }))
        .then(links => setLinkedQuizzes(links))
    }

    dispatch(fetchUserContentRelations({ sourceType: 'atlas_model', sourceUniqueId: id, targetType: 'atlas_model' }))
      .then(links => {
        setPrevModel(links.find(l => l.relationType === 'prev') ?? null)
        setNextModel(links.find(l => l.relationType === 'next') ?? null)
      })
  }, [dispatch, detail?.model?.uniqueId, anatomyQuizAccessible])

  const handleRelatedModelClick = (relUniqueId) => {
    navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug, uniqueId: relUniqueId }))
  }

  const handleQuizClick = (quiz) => {
    navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: quiz.uniqueId }))
  }

  if (isLoading || !detail) return <Loading />

  const { model, module: mod, topicName } = detail

  const allQuizzes = linkedQuizzes.map(item => ({
    uniqueId: item.linkedUniqueId,
    title: item.linkedTitle,
    difficulty: item.difficulty,
    questionCount: item.questionCount,
    estimatedMinutes: item.estimatedMinutes,
  }))

  return (
    <PageWrapper>
      <Inner>
        <TopBar>
          <Brand>
            <BrandIcon>🧬</BrandIcon>
            <div>
              <BrandTitle>Atlas 3D &amp; Quiz Anatomi</BrandTitle>
              <BrandSubtitle>Eksplorasi atlas 3D dan latihan quiz anatomi interaktif.</BrandSubtitle>
            </div>
          </Brand>
          <BackButton onClick={() => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug }))}>
            ← Kembali
          </BackButton>
        </TopBar>

        <Breadcrumb>
          <BreadcrumbItem $clickable onClick={() => navigate(AtlasQuizRoute.homeRoute)}>
            Atlas Quiz
          </BreadcrumbItem>
          <span>/</span>
          <BreadcrumbItem $clickable onClick={() => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug }))}>
            {topicName}
          </BreadcrumbItem>
          {mod && (
            <>
              <span>/</span>
              <BreadcrumbItem>{mod.name}</BreadcrumbItem>
            </>
          )}
          <span>/</span>
          <BreadcrumbItem $active>{model.title}</BreadcrumbItem>
        </Breadcrumb>

        <ModelCard>
          {mod && (
            <ModelMeta>
              <MetaTag $type="module">{mod.name}</MetaTag>
              {mod.classification && (
                <MetaTag $type={mod.classification}>
                  {CLASSIFICATION_LABELS[mod.classification] ?? mod.classification}
                </MetaTag>
              )}
            </ModelMeta>
          )}
          <ModelTitle>{model.title}</ModelTitle>
          {model.description && <ModelDescription>{model.description}</ModelDescription>}
        </ModelCard>

        <EmbedCard>
          <EmbedFrame
            src={model.embedUrl}
            title={model.title}
            allowFullScreen
            allow="fullscreen"
          />
        </EmbedCard>

        {allQuizzes.length > 0 && (
          <SectionCard>
            <SectionHeader>
              <SectionTitle><PiMedal size={18} /> Quiz Anatomi Terkait</SectionTitle>
              <SectionSubtitle>Latihan identifikasi struktur berbasis model 3D.</SectionSubtitle>
            </SectionHeader>
            <QuizGrid>
              {allQuizzes.map(quiz => (
                <QuizCard key={quiz.uniqueId} onClick={() => handleQuizClick(quiz)}>
                  <QuizCardTop>
                    <QuizIconBox><PiMedal size={16} /></QuizIconBox>
                    <QuizTitle>{quiz.title}</QuizTitle>
                  </QuizCardTop>
                  <QuizCardBottom>
                    {quiz.difficulty && (
                      <TagPill $variant={quiz.difficulty}>
                        {DIFFICULTY_LABELS[quiz.difficulty] ?? quiz.difficulty}
                      </TagPill>
                    )}
                    {quiz.questionCount > 0 && (
                      <TagPill $variant="meta">{quiz.questionCount} struktur</TagPill>
                    )}
                    {quiz.estimatedMinutes > 0 && (
                      <TagPill $variant="meta">⏱ {quiz.estimatedMinutes}m</TagPill>
                    )}
                  </QuizCardBottom>
                </QuizCard>
              ))}
            </QuizGrid>
          </SectionCard>
        )}
        <AdjacentNav>
          {prevModel ? (
            <AdjacentCard onClick={() => handleRelatedModelClick(prevModel.linkedUniqueId)}>
              <AdjacentLabel>◀ Sebelumnya</AdjacentLabel>
              <AdjacentTitle>{prevModel.linkedTitle}</AdjacentTitle>
            </AdjacentCard>
          ) : (
            <AdjacentCardEmpty />
          )}

          {nextModel ? (
            <AdjacentCard $right onClick={() => handleRelatedModelClick(nextModel.linkedUniqueId)}>
              <AdjacentLabel>Berikutnya ▶</AdjacentLabel>
              <AdjacentTitle>{nextModel.linkedTitle}</AdjacentTitle>
            </AdjacentCard>
          ) : (
            <AdjacentCardEmpty $right />
          )}
        </AdjacentNav>
      </Inner>
    </PageWrapper>
  )
}

export default AtlasModelDetailPage
