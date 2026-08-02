import { useEffect, useState } from 'react'
import { useNavigate, useParams, generatePath } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PiStackSimple, PiCube } from 'react-icons/pi'
import { fetchUserSubtopics, fetchUserTopics, fetchUserTopicBySlug, fetchTopicAtlasModels } from '@store/featureNodes'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import Breadcrumb from '@components/common/Breadcrumb'
import {
  Container,
  TopicHeader, TopicHeaderLeft, TopicIconBox, TopicMeta,
  ClassificationBadge, TopicName, TopicDescription, BackButton,
  SubtopicsHeader, SubtopicsTitle, SubtopicsIcon, SubtopicsCount, SubtopicsSubtitle,
  SubtopicGrid, SubtopicCard, SubtopicNumber, SubtopicName, SubtopicArrow,
  AtlasSection, AtlasSectionHeader, AtlasSectionTitle, AtlasSectionIcon, AtlasSectionSubtitle,
  AtlasModuleGroup, AtlasModuleHeader, AtlasModuleTag, AtlasModuleTitle,
  AtlasGrid, AtlasCard, AtlasCardIcon, AtlasCardTitle, AtlasCardArrow,
  SkeletonCard, EmptyState,
} from './TopicDetail.styles'

const TOPIC_ROUTE = '/topic'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

export default function TopicDetailPage() {
  const { topicSlug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [topic, setTopic] = useState(null)
  const [subtopics, setSubtopics] = useState([])
  const [atlasGroups, setAtlasGroups] = useState([])
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(true)

  useEffect(() => {
      dispatch(fetchUserTopicBySlug(topicSlug))
        .then(data => setTopic(data))
  }, [dispatch, topicSlug])

  useEffect(() => {
    setIsLoadingSubtopics(true)
    dispatch(fetchUserSubtopics(topicSlug))
      .then(data => setSubtopics(data || []))
      .finally(() => setIsLoadingSubtopics(false))
  }, [dispatch, topicSlug])

  useEffect(() => {
    if (!topic?.id) return
    dispatch(fetchTopicAtlasModels(topic.id)).then(data => setAtlasGroups(data || []))
  }, [dispatch, topic?.id])

  const isLoading = isLoadingSubtopics

  return (
    <Container>
      <Breadcrumb
        style={{ marginBottom: '1.75rem' }}
        items={[
          { label: 'Topik', onClick: () => navigate(TOPIC_ROUTE) },
          { label: topic?.name ?? topicSlug },
        ]}
      />

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

      {atlasGroups.length > 0 && (
        <AtlasSection>
          <AtlasSectionHeader>
            <AtlasSectionTitle>
              <AtlasSectionIcon><PiCube size={20} /></AtlasSectionIcon>
              Model 3D Anatomi
            </AtlasSectionTitle>
          </AtlasSectionHeader>
          <AtlasSectionSubtitle>
            Model 3D dibuka di halaman baru dengan navigasi kembali. Setiap model disertai kuis 3D terkait di bagian bawah.
          </AtlasSectionSubtitle>

          {atlasGroups.map(group => (
            <AtlasModuleGroup key={group.moduleId}>
              <AtlasModuleHeader>
                <AtlasModuleTitle>3D Model {group.moduleName}</AtlasModuleTitle>
              </AtlasModuleHeader>
              <AtlasGrid>
                {group.models.map(model => (
                  <AtlasCard
                    key={model.uniqueId}
                    onClick={() => navigate(generatePath(AtlasQuizRoute.atlasModelRoute, { slug: topicSlug, uniqueId: model.uniqueId }))}
                  >
                    <AtlasCardIcon><PiCube size={16} /></AtlasCardIcon>
                    <AtlasCardTitle>{model.title}</AtlasCardTitle>
                    <AtlasCardArrow>→</AtlasCardArrow>
                  </AtlasCard>
                ))}
              </AtlasGrid>
            </AtlasModuleGroup>
          ))}
        </AtlasSection>
      )}
    </Container>
  )
}
