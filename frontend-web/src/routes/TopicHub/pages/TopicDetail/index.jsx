import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PiStackSimple } from 'react-icons/pi'
import { fetchUserSubtopics, fetchUserTopics, fetchUserTopicBySlug } from '@store/featureNodes'
import {
  Container, Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent,
  TopicHeader, TopicHeaderLeft, TopicIconBox, TopicMeta,
  ClassificationBadge, TopicName, TopicDescription, BackButton,
  SubtopicsHeader, SubtopicsTitle, SubtopicsIcon, SubtopicsCount, SubtopicsSubtitle,
  SubtopicGrid, SubtopicCard, SubtopicNumber, SubtopicName, SubtopicArrow,
  SkeletonCard, EmptyState,
} from './TopicDetail.styles'

const TOPIC_ROUTE = '/topik'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

export default function TopicDetailPage() {
  const { topicSlug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userTopics } = useSelector(s => s.featureNodes)
  const [topic, setTopic] = useState(null)
  const [subtopics, setSubtopics] = useState([])
  const [isLoadingTopic, setIsLoadingTopic] = useState(true)
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(true)

  useEffect(() => {
    const allTopics = [...(userTopics.primary || []), ...(userTopics.special || [])]
    const cached = allTopics.find(t => t.slug === topicSlug)

    if (cached) {
      setTopic(cached)
      setIsLoadingTopic(false)
    } else {
      setIsLoadingTopic(true)
      dispatch(fetchUserTopicBySlug(topicSlug))
        .then(data => setTopic(data))
        .finally(() => setIsLoadingTopic(false))
    }
  }, [dispatch, topicSlug, userTopics.primary.length, userTopics.special.length])

  useEffect(() => {
    if (!userTopics.primary.length && !userTopics.special.length) {
      dispatch(fetchUserTopics())
    }
  }, [dispatch, userTopics.primary.length, userTopics.special.length])

  useEffect(() => {
    setIsLoadingSubtopics(true)
    dispatch(fetchUserSubtopics(topicSlug))
      .then(data => setSubtopics(data || []))
      .finally(() => setIsLoadingSubtopics(false))
  }, [dispatch, topicSlug])

  const isLoading = isLoadingSubtopics

  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink onClick={() => navigate(TOPIC_ROUTE)}>Topik</BreadcrumbLink>
        <BreadcrumbSep>/</BreadcrumbSep>
        <BreadcrumbCurrent>{topic?.name ?? topicSlug}</BreadcrumbCurrent>
      </Breadcrumb>

      <TopicHeader>
        <TopicHeaderLeft>
          <TopicIconBox>{topic?.icon || '📚'}</TopicIconBox>
          <TopicMeta>
            {topic?.classification && (
              <ClassificationBadge>
                {CLASSIFICATION_LABELS[topic.classification] ?? topic.classification}
              </ClassificationBadge>
            )}
            <TopicName>{topic?.name ?? topicSlug}</TopicName>
            {topic?.description && <TopicDescription>{topic.description}</TopicDescription>}
          </TopicMeta>
        </TopicHeaderLeft>
        <BackButton onClick={() => navigate(TOPIC_ROUTE)}>
          ← Kembali
        </BackButton>
      </TopicHeader>

      <SubtopicsHeader>
        <SubtopicsTitle>
          <SubtopicsIcon><PiStackSimple size={20} /></SubtopicsIcon>
          Subtopik
        </SubtopicsTitle>
        {!isLoading && <SubtopicsCount>{subtopics.length}</SubtopicsCount>}
      </SubtopicsHeader>
      <SubtopicsSubtitle>
        Setiap subtopik berisi video, artikel, flashcards, dan bank soal terkait.
      </SubtopicsSubtitle>

      <SubtopicGrid>
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          : subtopics.length === 0
            ? <EmptyState>Belum ada sub-topik tersedia.</EmptyState>
            : subtopics.map((sub, i) => (
              <SubtopicCard key={sub.id} onClick={() => navigate(`${TOPIC_ROUTE}/${topicSlug}/${sub.slug}`)}>
                <SubtopicNumber>{i + 1}</SubtopicNumber>
                <SubtopicName>{sub.name}</SubtopicName>
                <SubtopicArrow>⊙</SubtopicArrow>
              </SubtopicCard>
            ))
        }
      </SubtopicGrid>
    </Container>
  )
}
