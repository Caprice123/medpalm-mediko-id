import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import Loading from '@components/common/Loading'
import Pagination from '@components/Pagination'
import { fetchAdminMcqTopics } from '@store/mcq/action'
import { actions } from '@store/mcq/reducer'
import {
  FilterSection,
  SelectedItemsPreview,
  SelectedItemsLabel,
  SelectedChips,
  SelectedChip,
  RemoveChipButton,
  EmptySelectedMessage,
  SearchInput,
  Content,
  TopicsGrid,
  TopicCard,
  CheckboxContainer,
  CardHeader,
  CardTitle,
  StatusBadge,
  CardDescription,
  TagList,
  Tag,
  CardStats,
  StatItem,
  StatLabel,
  StatValue,
  Footer,
  SelectedItems
} from './McqSelectorModal.styles'

const McqSelectorModal = ({ isOpen, onClose, onSelect, initialSelected = [] }) => {
  const dispatch = useDispatch()
  const { topics, loading, filter, pagination } = useSelector(state => state.mcq)
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelected.map(item => item.id)))

  useEffect(() => {
    if (isOpen) {
      // Reset to first page and fetch
      dispatch(actions.setPage(1))
      dispatch(fetchAdminMcqTopics())
      setSelectedIds(new Set(initialSelected.map(item => item.id)))
    }
  }, [isOpen, dispatch, initialSelected])

  const handleSearchChange = (e) => {
    dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))
  }

  const handleSearchSubmit = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchAdminMcqTopics())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminMcqTopics())
  }

  const handleToggleItem = (topic) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(topic.id)) {
      newSelected.delete(topic.id)
    } else {
      newSelected.add(topic.id)
    }
    setSelectedIds(newSelected)
  }

  const handleDone = () => {
    const selected = topics.filter(topic => selectedIds.has(topic.id))
    onSelect(selected)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="fullscreen"
      title="Pilih MCQ Topic"
      footer={
        <Footer>
          <SelectedItems>
            {selectedIds.size > 0 ? (
              `${selectedIds.size} MCQ topic dipilih`
            ) : (
              'Belum ada MCQ topic yang dipilih'
            )}
          </SelectedItems>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleDone}>
              Selesai
            </Button>
          </div>
        </Footer>
      }
    >
      <FilterSection>
        {/* Selected Items Preview */}
        {selectedIds.size > 0 && (
          <SelectedItemsPreview>
            <SelectedItemsLabel>
              Dipilih ({selectedIds.size})
            </SelectedItemsLabel>
            <SelectedChips>
              {topics
                .filter(topic => selectedIds.has(topic.id))
                .map((topic) => (
                  <SelectedChip key={topic.id}>
                    {topic.title} ({topic.questionCount || topic.question_count || 0} soal)
                    <RemoveChipButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleItem(topic)
                      }}
                    >
                      ✕
                    </RemoveChipButton>
                  </SelectedChip>
                ))}
            </SelectedChips>
          </SelectedItemsPreview>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SearchInput
            type="text"
            placeholder="Cari MCQ topic..."
            value={filter.search}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          <Button variant="primary" onClick={handleSearchSubmit}>
            🔍
          </Button>
        </div>
      </FilterSection>

      <Content>
        {loading.isTopicsLoading ? (
          <Loading type="oval" size="large" text="Memuat MCQ topics..." />
        ) : topics.length === 0 ? (
          <EmptyState
            icon="📝"
            title={filter.search ? 'Tidak ada MCQ topic yang cocok' : 'Belum ada MCQ topic'}
            description={filter.search ? 'Coba gunakan kata kunci lain' : 'Belum ada MCQ topic yang tersedia'}
          />
        ) : (
          <>
            <TopicsGrid>
              {topics.map((topic) => {
              // Filter tags by type
              const universityTags = topic.universityTags || []
              const semesterTags = topic.semesterTags || []
              const isSelected = selectedIds.has(topic.id)

              return (
                <TopicCard
                  key={topic.id}
                  selected={isSelected}
                  onClick={() => handleToggleItem(topic)}
                >
                  <CheckboxContainer checked={isSelected} />

                  <CardHeader>
                    <CardTitle>{topic.title}</CardTitle>
                    <StatusBadge status={topic.status}>
                      {topic.status === 'published' ? 'Published' : topic.status === 'testing' ? 'Testing' : 'Draft'}
                    </StatusBadge>
                  </CardHeader>

                  <CardDescription>
                    {topic.description || 'Tidak ada deskripsi'}
                  </CardDescription>

                  {/* University Tags */}
                  {universityTags.length > 0 && (
                    <TagList>
                      {universityTags.map((tag) => (
                        <Tag key={tag.id} university>
                          🏛️ {tag.name}
                        </Tag>
                      ))}
                    </TagList>
                  )}

                  {/* Semester Tags */}
                  {semesterTags.length > 0 && (
                    <TagList>
                      {semesterTags.map((tag) => (
                        <Tag key={tag.id} semester>
                          📚 {tag.name}
                        </Tag>
                      ))}
                    </TagList>
                  )}

                  <CardStats>
                    <StatItem>
                      <StatLabel>Questions</StatLabel>
                      <StatValue>{topic.question_count || topic.questionCount || 0}</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Time Limit</StatLabel>
                      <StatValue>
                        {topic.quiz_time_limit || topic.quizTimeLimit ? `${topic.quiz_time_limit || topic.quizTimeLimit}m` : 'No limit'}
                      </StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Pass Score</StatLabel>
                      <StatValue>{topic.passing_score || topic.passingScore || 0}%</StatValue>
                    </StatItem>
                  </CardStats>
                </TopicCard>
              )
            })}
            </TopicsGrid>

            {/* Pagination - only show if more than 1 page */}
            {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
              <div style={{ marginTop: '2rem' }}>
                <Pagination
                  currentPage={pagination.page}
                  isLastPage={pagination.isLastPage}
                  onPageChange={handlePageChange}
                  isLoading={loading.isTopicsLoading}
                  variant="admin"
                  language="id"
                />
              </div>
            )}
          </>
        )}
      </Content>
    </Modal>
  )
}

export default McqSelectorModal
