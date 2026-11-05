import { formatLocalDate } from '@utils/dateUtils'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import FilterComponent from '@components/common/Filter'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import { OsceTopicSkeletonGrid } from '@components/common/SkeletonCard'
import {
  PageContainer,
  Header,
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
import { useTopicSelection } from './hooks/useTopicSelection'

function TopicSelection() {
  const {
    userTopics, loading, pagination,
    searchQuery, setSearchQuery,
    topicTag, setTopicTag,
    batchTag, setBatchTag,
    topicTags, batchTags,
    handleSearch, handleSelectTopic, handlePageChange, handleBack,
  } = useTopicSelection()

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
                  onChange={(option) => setTopicTag(option?.value || '')}
                  placeholder="Filter berdasarkan topik..."
                />
              </FilterComponent.Group>

              <FilterComponent.Group>
                <FilterComponent.Label>Batch</FilterComponent.Label>
                <Dropdown
                  options={batchTags}
                  value={batchTag ? batchTags.find(t => t.value === batchTag) : null}
                  onChange={(option) => setBatchTag(option?.value || '')}
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

                    <div style={{ flex: '1' }}></div>

                    {topicTagsList.length > 0 && (
                      <TagList>
                        {topicTagsList.map((tag) => (
                          <Tag key={tag.id} university>
                            🏛️ {tag.name}
                          </Tag>
                        ))}
                      </TagList>
                    )}

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
                        <StatValue>{formatLocalDate(topic.createdAt)}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Durasi</StatLabel>
                        <StatValue>{topic.durationMinutes || 15} menit</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Updated</StatLabel>
                        <StatValue>{formatLocalDate(topic.updatedAt)}</StatValue>
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
