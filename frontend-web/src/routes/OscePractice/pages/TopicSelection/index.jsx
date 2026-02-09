import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOsceTopics, createOsceSession } from '@store/oscePractice/userAction'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import FilterComponent from '@components/common/Filter'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import { OsceTopicSkeletonGrid } from '@components/common/SkeletonCard'
import {
  PageContainer,
  Header,
  BackButton,
  Title,
  Subtitle,
  SearchSection,
  TopicsGrid,
  TopicCard,
  CardHeader,
  CardTitle,
  CardDescription,
  TagList,
  Tag,
  CardStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  EmptyState,
  Container,
} from './TopicSelection.styles'

function TopicSelection() {
  const { userTopics, loading } = useSelector(state => state.oscePractice)
  const { tags } = useSelector(state => state.tags)
  const [searchQuery, setSearchQuery] = useState('')
  const [topicTag, setTopicTag] = useState('')
  const [batchTag, setBatchTag] = useState('')
  const [pagination, setPagination] = useState({ page: 1, isLastPage: false })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === "topic")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const batchTags = useMemo(() => {
    return tags?.find(tag => tag.name === "batch")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const loadTopics = useCallback((params = {}) => {
    dispatch(fetchUserOsceTopics(params)).then((result) => {
      if (result?.pagination) {
        setPagination(result.pagination)
      }
    })
  }, [dispatch])

  useEffect(() => {
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["topic", "batch"]}))
    dispatch(fetchTags())
    loadTopics({ page: 1 })
  }, [])

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    loadTopics({ search: searchQuery, topicTag, batchTag, page: 1 })
  }

  const handleSelectTopic = async (topicId) => {
    await dispatch(createOsceSession(topicId, (session) => {
      // Navigate to session preparation page
      navigate(`/osce-practice/session/${session.uniqueId}/preparation`)
    }))
  }

  const handlePageChange = (newPage) => {
    loadTopics({ search: searchQuery, topicTag, batchTag, page: newPage })
  }

  const handleBack = () => {
    navigate('/osce-practice')
  }

  return (
    <PageContainer>
        <Container>
            <Header>
                <div>
                <Button variant="secondary" onClick={handleBack}>
                    ← Kembali
                </Button>
                </div>
            </Header>

            <SearchSection>
                <form onSubmit={handleSearch}>
                <FilterComponent>
                    <FilterComponent.Group>
                    <TextInput
                        label="Pencarian"
                        placeholder="Cari topik berdasarkan judul, deskripsi, atau skenario..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    </FilterComponent.Group>

                    <FilterComponent.Group>
                    <FilterComponent.Label>Topik</FilterComponent.Label>
                    <Dropdown
                        options={topicTags}
                        value={topicTag ? topicTags.find(t => t.value === topicTag) : null}
                        onChange={(option) => setTopicTag(option?.value || "")}
                        placeholder="Filter berdasarkan topik..."
                    />
                    </FilterComponent.Group>

                    <FilterComponent.Group>
                    <FilterComponent.Label>Batch</FilterComponent.Label>
                    <Dropdown
                        options={batchTags}
                        value={batchTag ? batchTags.find(t => t.value === batchTag) : null}
                        onChange={(option) => setBatchTag(option?.value || "")}
                        placeholder="Filter berdasarkan batch..."
                    />
                    </FilterComponent.Group>
                </FilterComponent>

                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'flex-end',
                    marginTop: '1rem'
                }}>
                    <Button
                    variant="primary"
                    type="submit"
                    disabled={loading.isLoadingUserTopics}
                    >
                    🔍 Cari
                    </Button>
                </div>
                </form>
            </SearchSection>

            {loading.isLoadingUserTopics ? (
                <OsceTopicSkeletonGrid count={6} />
            ) : userTopics.length === 0 ? (
                <EmptyState>
                <div style={{ fontSize: '3rem' }}>🔍</div>
                <p>
                    {searchQuery ? 'Tidak ada topik yang sesuai dengan pencarian' : 'Belum ada topik tersedia'}
                </p>
                </EmptyState>
            ) : (
                <>
                <TopicsGrid>
                    {userTopics.map((topic) => {
                    // Filter tags by tag_group
                    const topicTagsList = topic.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
                    const batchTagsList = topic.tags?.filter(tag => tag.tagGroup?.name === 'batch') || []

                    return (
                        <TopicCard key={topic.id}>
                        <CardHeader>
                            <CardTitle>{topic.title}</CardTitle>
                        </CardHeader>

                        <CardDescription>
                            {topic.description || 'Tidak ada deskripsi'}
                        </CardDescription>

                        <div style={{ flex: "1" }}></div>

                        {/* Topic Tags */}
                        {topicTagsList.length > 0 && (
                            <TagList>
                            {topicTagsList.map((tag) => (
                                <Tag key={tag.id} university>
                                🏛️ {tag.name}
                                </Tag>
                            ))}
                            </TagList>
                        )}

                        {/* Batch Tags */}
                        {batchTagsList.length > 0 && (
                            <TagList>
                            {batchTagsList.map((tag) => (
                                <Tag key={tag.id} semester>
                                📚 {tag.name}
                                </Tag>
                            ))}
                            </TagList>
                        )}

                        <CardStats>
                            <StatItem>
                            <StatLabel>Created</StatLabel>
                            <StatValue>
                                {new Date(topic.createdAt).toLocaleDateString("id-ID")}
                            </StatValue>
                            </StatItem>
                            <StatItem>
                            <StatLabel>Durasi</StatLabel>
                            <StatValue>
                                {topic.durationMinutes || 15} menit
                            </StatValue>
                            </StatItem>
                            <StatItem>
                            <StatLabel>Updated</StatLabel>
                            <StatValue>
                                {new Date(topic.updatedAt).toLocaleDateString("id-ID")}
                            </StatValue>
                            </StatItem>
                        </CardStats>

                        <CardActions>
                            <Button
                            variant="primary"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleSelectTopic(topic.uniqueId)
                            }}
                            fullWidth
                            disabled={loading.isCreatingSession}
                            >
                            {loading.isCreatingSession ? 'Membuat...' : 'Mulai Sesi'}
                            </Button>
                        </CardActions>
                        </TopicCard>
                    )
                    })}
                </TopicsGrid>

                {!loading.isLoadingUserTopics && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                      <Pagination
                        currentPage={pagination.page}
                        isLastPage={pagination.isLastPage}
                        onPageChange={handlePageChange}
                        isLoading={loading.isLoadingUserTopics}
                        variant="admin"
                        language="id"
                      />
                  </div>
                )}
                </>
            )}
        </Container>
    </PageContainer>
  )
}

export default TopicSelection
