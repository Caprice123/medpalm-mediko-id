import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { PiCube } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { fetchUserContentRelations } from '@store/atlasQuiz/userAction'
import { useAnatomyQuizDetail } from './hooks/useAnatomyQuizDetail'
import Breadcrumb from '@components/common/Breadcrumb'
import {
  PageWrapper, Inner,
  TopBar, Brand, BrandIcon, BrandTitle, BrandSubtitle, BackButton,
  ModelCard, ModelMeta, MetaTag, ModelTitle, ModelDescription,
  EmbedCard, EmbedFrame,
  SectionCard, SectionHeader, SectionTitle, SectionSubtitle,
  ModelsGrid, ModelItemCard, ModelItemTop, ModelItemIcon, ModelItemTitle, ModelItemSubtitle,
  AdjacentNav, AdjacentCard, AdjacentCardEmpty, AdjacentLabel, AdjacentTitle,
} from './AnatomyQuizDetail.styles'

const DIFFICULTY_LABELS = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' }

const CLASSIFICATION_LABELS = {
  fisiologi: 'Fisiologi',
  patologi: 'Patologi',
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function canUseFeature(sessionType, features, userStatus) {
  const feature = features.find(f => f.sessionType === sessionType)
  if (!feature || feature.accessType === 'free') return true
  const activeFeatureKeys = userStatus?.activeFeatureKeys || []
  return activeFeatureKeys.some(f => f.feature === sessionType)
}

function AnatomyQuizDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug, uniqueId } = useParams()
  const { detail, isLoading } = useAnatomyQuizDetail(slug, uniqueId)
  const features = useSelector(s => s.feature.features)
  const userStatus = useSelector(s => s.pricing.userStatus)
  const atlasAccessible = canUseFeature('atlas', features, userStatus)

  const [linkedAtlasModels, setLinkedAtlasModels] = useState([])
  const [prevQuiz, setPrevQuiz] = useState(null)
  const [nextQuiz, setNextQuiz] = useState(null)

  useEffect(() => {
    if (!detail) return
    setPrevQuiz(null)
    setNextQuiz(null)
    setLinkedAtlasModels([])
  }, [detail?.quiz?.uniqueId])

  useEffect(() => {
    if (!detail) return
    const id = detail.quiz.uniqueId

    if (atlasAccessible) {
      dispatch(fetchUserContentRelations({ sourceType: 'anatomy_quiz', sourceUniqueId: id, targetType: 'atlas_model', relationType: 'feature_relation' }))
        .then(links => setLinkedAtlasModels(links))
    }

    dispatch(fetchUserContentRelations({ sourceType: 'anatomy_quiz', sourceUniqueId: id, targetType: 'anatomy_quiz' }))
      .then(links => {
        setPrevQuiz(links.find(l => l.relationType === 'prev') ?? null)
        setNextQuiz(links.find(l => l.relationType === 'next') ?? null)
      })
  }, [dispatch, detail?.quiz?.uniqueId, atlasAccessible])

  if (isLoading || !detail) return <Loading />

  const { quiz, module: mod, topicName } = detail

  const allAtlasModels = linkedAtlasModels.map(item => ({
    uniqueId: item.linkedUniqueId,
    title: item.linkedTitle,
    description: item.description,
    moduleName: null,
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

        <Breadcrumb style={{ marginBottom: '1.25rem' }} items={[
          { label: 'Atlas Quiz', onClick: () => navigate(AtlasQuizRoute.homeRoute) },
          { label: topicName, onClick: () => navigate(generatePath(AtlasQuizRoute.detailRoute, { slug })) },
          ...(mod ? [{ label: mod.name }] : []),
          { label: quiz.title },
        ]} />

        <ModelCard>
          {mod && (
            <ModelMeta>
              <MetaTag $type="module">{mod.name}</MetaTag>
              {mod.classification && (
                <MetaTag $type={mod.classification}>
                  {CLASSIFICATION_LABELS[mod.classification] ?? mod.classification}
                </MetaTag>
              )}
              {quiz.difficulty && (
                <MetaTag $type={quiz.difficulty}>
                  {DIFFICULTY_LABELS[quiz.difficulty] ?? quiz.difficulty}
                </MetaTag>
              )}
              {quiz.questionCount > 0 && (
                <MetaTag $type="meta">{quiz.questionCount} struktur</MetaTag>
              )}
              {quiz.estimatedMinutes > 0 && (
                <MetaTag $type="meta">⏱ {quiz.estimatedMinutes}m</MetaTag>
              )}
            </ModelMeta>
          )}
          <ModelTitle>{quiz.title}</ModelTitle>
          {quiz.description && <ModelDescription>{quiz.description}</ModelDescription>}
        </ModelCard>

        {quiz.embedUrl && (
          <EmbedCard>
            <EmbedLoadingBanner />
            <EmbedFrame src={quiz.embedUrl} title={quiz.title} allowFullScreen allow="fullscreen" />
          </EmbedCard>
        )}

        {allAtlasModels.length > 0 && (
          <SectionCard>
            <SectionHeader>
              <SectionTitle><PiCube size={18} /> Atlas 3D Terkait</SectionTitle>
              <SectionSubtitle>Model 3D anatomi yang berkaitan dengan quiz ini.</SectionSubtitle>
            </SectionHeader>
            <ModelsGrid>
              {allAtlasModels.map(m => (
                <ModelItemCard
                  key={m.uniqueId}
                  onClick={() => navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug, uniqueId: m.uniqueId }))}
                >
                  <ModelItemTop>
                    <ModelItemIcon><PiCube size={16} /></ModelItemIcon>
                    <div>
                      <ModelItemTitle>{m.title}</ModelItemTitle>
                      {m.moduleName && <ModelItemSubtitle>{m.moduleName}</ModelItemSubtitle>}
                    </div>
                  </ModelItemTop>
                </ModelItemCard>
              ))}
            </ModelsGrid>
          </SectionCard>
        )}

        <AdjacentNav>
          {prevQuiz ? (
            <AdjacentCard onClick={() => navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: prevQuiz.linkedUniqueId }))}>
              <AdjacentLabel>◀ Sebelumnya</AdjacentLabel>
              <AdjacentTitle>{prevQuiz.linkedTitle}</AdjacentTitle>
            </AdjacentCard>
          ) : (
            <AdjacentCardEmpty />
          )}

          {nextQuiz ? (
            <AdjacentCard $right onClick={() => navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug, uniqueId: nextQuiz.linkedUniqueId }))}>
              <AdjacentLabel>Berikutnya ▶</AdjacentLabel>
              <AdjacentTitle>{nextQuiz.linkedTitle}</AdjacentTitle>
            </AdjacentCard>
          ) : (
            <AdjacentCardEmpty $right />
          )}
        </AdjacentNav>

      </Inner>
    </PageWrapper>
  )
}

export default AnatomyQuizDetailPage
