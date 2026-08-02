import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserSubtopicBySlug, fetchUserTopicBySlug, fetchUserTopics, fetchUserSubtopics, fetchNodeStats, fetchNodeAtlasModelRelations } from '@store/featureNodes'
import { TopupRoute } from '@routes/Topup/routes'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { generatePath } from 'react-router-dom'
import { PiCube } from 'react-icons/pi'
import PreviewPanel from './components/PreviewPanel'
import Breadcrumb from '@components/common/Breadcrumb'
import {
  Container,
  PageHeader, SubtopicName, ProgressLabel,
  VideoSection, VideoWrapper, VideoFrame,
  ExplanationSection, SectionLabel, ExplanationText,
  RelatedSection, RelatedSubtitle, RelatedGrid, RelatedCard,
  RelatedIconBox, RelatedInfo, RelatedLabel, RelatedCount, RelatedAction,
  AtlasSection, AtlasSectionSubtitle, AtlasGrid, AtlasCard, AtlasCardIcon, AtlasCardTitle, AtlasCardArrow,
  NavRow, NavButton, NavDirection, NavTitle,
  SkeletonTitle, SkeletonSubtitle, SkeletonVideo, SkeletonBlock,
} from './SubtopicDetail.styles'

const TOPIC_ROUTE = '/topic'

function checkFeatureLock(sessionType, features, userStatus) {
  const feature = features.find(f => f.sessionType === sessionType)
  if (!feature) return { isLocked: false, lockReason: '' }
  const userCredits = parseFloat(userStatus?.creditBalance || 0)
  const activeFeatureKeys = userStatus?.activeFeatureKeys || []
  const hasFeatureSubscription = activeFeatureKeys.some(f => f.feature === sessionType)
  const isFree = feature.accessType === 'free'
  const needsSubscription = feature.accessType === 'subscription' || feature.accessType === 'subscription_and_credits'
  const needsCredits = feature.accessType === 'credits' || feature.accessType === 'subscription_and_credits'
  const subscriptionMet = !needsSubscription || hasFeatureSubscription
  const creditsMet = !needsCredits || userCredits >= (feature.cost || 0)
  const canUse = (subscriptionMet && creditsMet) || isFree || hasFeatureSubscription
  const isLocked = !canUse && !isFree
  let lockReason = ''
  if (isLocked) {
    if (!subscriptionMet && !creditsMet) lockReason = `Perlu berlangganan & ${feature.cost} credits`
    else if (!subscriptionMet) lockReason = 'Perlu berlangganan'
    else lockReason = `Perlu ${feature.cost} credits`
  }
  return { isLocked, lockReason }
}

export default function SubtopicDetailPage() {
  const { topicSlug, subtopicSlug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userTopics } = useSelector(s => s.featureNodes)
  const { features } = useSelector(s => s.feature)
  const { userStatus } = useSelector(s => s.pricing)

  const [topic, setTopic] = useState(null)
  const [subtopic, setSubtopic] = useState(null)
  const [siblings, setSiblings] = useState([])
  const [stats, setStats] = useState(null)
  const [atlasModels, setAtlasModels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [panelTab, setPanelTab] = useState(null)

  useEffect(() => {
    if (!userTopics.primary.length && !userTopics.special.length) {
      dispatch(fetchUserTopics())
    }
  }, [dispatch, userTopics.primary.length, userTopics.special.length])

  useEffect(() => {
    const allTopics = [...(userTopics.primary || []), ...(userTopics.special || [])]
    const cached = allTopics.find(t => t.slug === topicSlug)
    if (cached) {
      setTopic(cached)
    } else {
      dispatch(fetchUserTopicBySlug(topicSlug)).then(data => setTopic(data))
    }
  }, [dispatch, topicSlug, userTopics.primary.length, userTopics.special.length])

  useEffect(() => {
    dispatch(fetchUserSubtopics(topicSlug)).then(data => setSiblings(data || []))
  }, [dispatch, topicSlug])

  useEffect(() => {
    setIsLoading(true)
    setSubtopic(null)
    setStats(null)
    setAtlasModels([])
    dispatch(fetchUserSubtopicBySlug(subtopicSlug))
      .then(data => {
        setSubtopic(data)
        if (data?.id) dispatch(fetchNodeStats(data.id)).then(setStats)
      })
      .finally(() => setIsLoading(false))
  }, [dispatch, subtopicSlug])

  useEffect(() => {
    if (!subtopic?.id || !features.length) return
    const atlasLock = checkFeatureLock('atlas', features, userStatus)
    const anatomyLock = checkFeatureLock('anatomy', features, userStatus)
    const atlasAccessible = !atlasLock.isLocked || !anatomyLock.isLocked
    if (!atlasAccessible) return
    dispatch(fetchNodeAtlasModelRelations(subtopicSlug)).then(setAtlasModels)
  }, [dispatch, subtopic?.id, subtopicSlug, features, userStatus])

  const currentIndex = siblings.findIndex(s => s.slug === subtopicSlug)
  const prevSubtopic = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextSubtopic = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null
  const embedSrc = subtopic?.videoEmbedUrl ?? null

  const goTo = (slug) => navigate(`${TOPIC_ROUTE}/${topicSlug}/${slug}`)

  return (
    <>
    <Container>
      <Breadcrumb
        style={{ marginBottom: '1.5rem' }}
        items={[
          { label: 'Topik', onClick: () => navigate(TOPIC_ROUTE) },
          { label: topic?.name ?? topicSlug, onClick: () => navigate(`${TOPIC_ROUTE}/${topicSlug}`) },
          { label: subtopic?.name ?? subtopicSlug },
        ]}
      />

      <PageHeader>
        {isLoading ? (
          <>
            <SkeletonTitle />
            <SkeletonSubtitle />
          </>
        ) : (
          <>
            <SubtopicName>{subtopic?.name ?? subtopicSlug}</SubtopicName>
            {siblings.length > 0 && currentIndex >= 0 && (
              <ProgressLabel>Subtopik {currentIndex + 1} dari {siblings.length}</ProgressLabel>
            )}
          </>
        )}
      </PageHeader>

      {isLoading ? (
        <SkeletonVideo />
      ) : embedSrc ? (
        <VideoSection>
          <VideoWrapper>
            <VideoFrame
              src={embedSrc}
              title={subtopic?.name}
              allow={import.meta.env.PROD ? 'autoplay; fullscreen' : 'fullscreen'}
              allowFullScreen
            />
          </VideoWrapper>
        </VideoSection>
      ) : null}

      {isLoading ? (
        <SkeletonBlock />
      ) : subtopic?.videoExplanation ? (
        <ExplanationSection>
          <SectionLabel>Penjelasan</SectionLabel>
          <ExplanationText>{subtopic.videoExplanation}</ExplanationText>
        </ExplanationSection>
      ) : null}

      {!isLoading && stats && (() => {
        const RELATED = [
          { sessionType: 'flashcard',     icon: '🗂️', label: 'Flashcard',  count: stats.flashcardCards, unit: 'kartu'   },
          { sessionType: 'mcq',           icon: '📝', label: 'Bank Soal',  count: stats.mcqQuestions,   unit: 'soal'    },
          { sessionType: 'summary_notes', icon: '📖', label: 'Artikel',    count: stats.summaryNotes,   unit: 'catatan' },
        ]
        const visibleRelated = RELATED.filter(r => r.count > 0)
        if (!visibleRelated.length) return null
        return (
          <RelatedSection>
            <SectionLabel>Pembelajaran Terkait</SectionLabel>
            <RelatedSubtitle>Flashcard, bank soal, dan artikel seputar {subtopic?.name}.</RelatedSubtitle>
            <RelatedGrid>
              {visibleRelated.map(({ sessionType, icon, label, count, unit }) => {
                const lock = checkFeatureLock(sessionType, features, userStatus)
                return (
                  <RelatedCard key={sessionType} $locked={lock.isLocked} onClick={() => lock.isLocked ? navigate(TopupRoute.moduleRoute) : setPanelTab(sessionType)}>
                    <RelatedIconBox>{icon}</RelatedIconBox>
                    <RelatedInfo>
                      <RelatedLabel>{label}</RelatedLabel>
                      <RelatedCount>{count} {unit}</RelatedCount>
                    </RelatedInfo>
                    <RelatedAction>{lock.isLocked ? '🔒' : '↗'}</RelatedAction>
                  </RelatedCard>
                )
              })}
            </RelatedGrid>
          </RelatedSection>
        )
      })()}

      {!isLoading && atlasModels.length > 0 && (
        <AtlasSection>
          <SectionLabel>Model 3D Anatomi</SectionLabel>
          <AtlasSectionSubtitle>Model 3D dibuka di halaman baru dengan navigasi kembali. Setiap model disertai kuis 3D terkait di bagian bawah.</AtlasSectionSubtitle>
          <AtlasGrid>
            {atlasModels.map(model => (
              <AtlasCard
                key={model.linkedUniqueId}
                onClick={() => navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug: topicSlug, uniqueId: model.linkedUniqueId }))}
              >
                <AtlasCardIcon><PiCube size={16} /></AtlasCardIcon>
                <AtlasCardTitle>{model.linkedTitle}</AtlasCardTitle>
                <AtlasCardArrow>→</AtlasCardArrow>
              </AtlasCard>
            ))}
          </AtlasGrid>
        </AtlasSection>
      )}

      {!isLoading && (prevSubtopic || nextSubtopic) && (
        <NavRow>
          <NavButton onClick={() => prevSubtopic && goTo(prevSubtopic.slug)} disabled={!prevSubtopic} $align="left">
            <NavDirection>← Sebelumnya</NavDirection>
            <NavTitle>{prevSubtopic?.name}</NavTitle>
          </NavButton>
          <NavButton onClick={() => nextSubtopic && goTo(nextSubtopic.slug)} disabled={!nextSubtopic} $align="right">
            <NavDirection>Berikutnya →</NavDirection>
            <NavTitle>{nextSubtopic?.name}</NavTitle>
          </NavButton>
        </NavRow>
      )}
    </Container>
    <PreviewPanel
      open={panelTab !== null}
      onClose={() => setPanelTab(null)}
      activeTab={panelTab}
      onTabChange={setPanelTab}
      subtopic={subtopic}
      stats={stats}
      features={features}
    />
    </>
  )
}
