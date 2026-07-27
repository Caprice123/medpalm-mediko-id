import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserSubtopicBySlug, fetchUserTopicBySlug, fetchUserTopics, fetchUserSubtopics, fetchNodeStats } from '@store/featureNodes'
import { TopupRoute } from '@routes/Topup/routes'
import PreviewPanel from './components/PreviewPanel'
import {
  Container, Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent,
  PageHeader, SubtopicName, ProgressLabel,
  VideoSection, VideoWrapper, VideoFrame,
  ExplanationSection, SectionLabel, ExplanationText,
  RelatedSection, RelatedSubtitle, RelatedGrid, RelatedCard,
  RelatedIconBox, RelatedInfo, RelatedLabel, RelatedCount, RelatedAction,
  NavRow, NavButton, NavDirection, NavTitle,
  SkeletonTitle, SkeletonSubtitle, SkeletonVideo, SkeletonBlock,
} from './SubtopicDetail.styles'

const TOPIC_ROUTE = '/topik'

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
    dispatch(fetchUserSubtopicBySlug(subtopicSlug))
      .then(data => {
        setSubtopic(data)
        if (data?.id) dispatch(fetchNodeStats(data.id)).then(setStats)
      })
      .finally(() => setIsLoading(false))
  }, [dispatch, subtopicSlug])

  const currentIndex = siblings.findIndex(s => s.slug === subtopicSlug)
  const prevSubtopic = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextSubtopic = currentIndex >= 0 && currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null
  const embedSrc = subtopic?.videoEmbedUrl ?? null

  const goTo = (slug) => navigate(`${TOPIC_ROUTE}/${topicSlug}/${slug}`)

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => navigate(TOPIC_ROUTE)}>Topik</BreadcrumbLink>
        <BreadcrumbSep>/</BreadcrumbSep>
        <BreadcrumbLink onClick={() => navigate(`${TOPIC_ROUTE}/${topicSlug}`)}>
          {topic?.name ?? topicSlug}
        </BreadcrumbLink>
        <BreadcrumbSep>/</BreadcrumbSep>
        <BreadcrumbCurrent>{subtopic?.name ?? subtopicSlug}</BreadcrumbCurrent>
      </Breadcrumb>

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
              allow="autoplay; fullscreen"
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
          { sessionType: 'flashcard',    route: `/flashcards?nodeId=${subtopic.id}`,      count: stats.flashcardCards, unit: 'kartu' },
          { sessionType: 'mcq',          route: `/multiple-choice?nodeId=${subtopic.id}`, count: stats.mcqQuestions,   unit: 'soal' },
          { sessionType: 'summary_notes',route: `/summary-notes?nodeId=${subtopic.id}`,   count: stats.summaryNotes,   unit: 'catatan' },
        ]
        return (
          <RelatedSection>
            <SectionLabel>Pembelajaran Terkait</SectionLabel>
            <RelatedSubtitle>Flashcard, bank soal, dan ringkasan seputar {subtopic?.name}.</RelatedSubtitle>
            <RelatedGrid>
              {RELATED.map(({ sessionType, route, count, unit }) => {
                const feature = features.find(f => f.sessionType === sessionType)
                if (!feature) return null
                const lock = checkFeatureLock(sessionType, features, userStatus)
                return (
                  <RelatedCard key={sessionType} $locked={lock.isLocked} onClick={() => lock.isLocked ? navigate(TopupRoute.moduleRoute) : setPanelTab(sessionType)}>
                    <RelatedIconBox>{feature.icon}</RelatedIconBox>
                    <RelatedInfo>
                      <RelatedLabel>{feature.name}</RelatedLabel>
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
      <PreviewPanel
        open={panelTab !== null}
        onClose={() => setPanelTab(null)}
        activeTab={panelTab}
        onTabChange={setPanelTab}
        subtopic={subtopic}
        stats={stats}
        features={features}
      />
    </Container>
  )
}
