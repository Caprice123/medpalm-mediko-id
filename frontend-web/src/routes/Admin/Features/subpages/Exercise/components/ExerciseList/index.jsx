import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminExerciseTopics } from '@store/exercise/adminAction'
import { actions } from '@store/exercise/reducer'
import Pagination from '@components/common/Pagination'
import EmptyState from '@components/common/EmptyState'
import {
  LoadingOverlay,
  TopicsGrid,
  TopicCard,
  TopicCardHeader,
  TopicCardTitle,
  StatusBadge,
  TopicDescription,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  TagList,
  Tag
} from './ExerciseList.styles'
import Button from "@components/common/Button"

function ExerciseList({ onEdit, onDelete, onCreateFirst }) {
  const dispatch = useDispatch()
  const { topics, loading, pagination } = useSelector((state) => state.exercise)
  console.log(topics)

  const handlePageChange = (newPage) => {
    dispatch(actions.setPage(newPage))
    dispatch(fetchAdminExerciseTopics())
  }

  // Loading state
  if (loading?.isTopicsLoading) {
    return <LoadingOverlay>Loading exercise topics...</LoadingOverlay>
  }

  // Empty state
  if (!topics || topics.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Belum Ada Topik"
        actionLabel={onCreateFirst && "Buat Topik Pertama"}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
    )
  }

  // Data state - render topics grid
  return (
    <>
      <TopicsGrid>
        {topics.map(topic => {
          // Filter tags by tag_group
          const universityTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
          const semesterTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

          return (
            <TopicCard key={topic.id}>
              <TopicCardHeader>
                <TopicCardTitle>{topic.title}</TopicCardTitle>
                <StatusBadge published={topic.status === 'published'}>
                  {topic.status === 'published' ? 'Published' : 'Draft'}
                </StatusBadge>
              </TopicCardHeader>

              <TopicDescription>
                {topic.description || 'Tidak ada deskripsi'}
              </TopicDescription>

            <div style={{flex: "1"}}></div>

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

              <TopicStats>
                <StatItem>
                  <StatLabel>Soal</StatLabel>
                  <StatValue>{topic.questionCount || 0}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Created</StatLabel>
                  <StatValue>
                    {new Date(topic.createdAt).toLocaleDateString("id-ID")}
                  </StatValue>
                </StatItem>
              </TopicStats>

              <CardActions>
                <Button variant="secondary" fullWidth onClick={() => onEdit(topic)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => onDelete(topic.id)}
                  disabled={loading?.isDeletingTopic}
                >
                  Delete
                </Button>
              </CardActions>
            </TopicCard>
          )
        })}
      </TopicsGrid>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.totalCount || 0}
        itemsPerPage={pagination.perPage}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default ExerciseList
