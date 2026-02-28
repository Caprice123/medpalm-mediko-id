import { useSelector } from 'react-redux'
import EmptyState from '@components/common/EmptyState'
import { formatLocalDate } from '@utils/dateUtils'
import {
  LoadingOverlay,
  ModelsGrid,
  ModelCard,
  ModelCardHeader,
  ModelCardTitle,
  StatusBadge,
  ModelDescription,
  ModelStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  TagList,
  Tag
} from './AtlasList.styles'
import Button from '@components/common/Button'

function AtlasList({ onEdit, onCreateFirst }) {
  const { models, loading } = useSelector(state => state.atlas)

  if (loading?.isGetListAtlasLoading) {
    return <LoadingOverlay>Loading atlas models...</LoadingOverlay>
  }

  if (models.length === 0) {
    return (
      <EmptyState
        icon="🧬"
        title="No atlas models found"
        actionLabel={onCreateFirst && 'Create Your First Atlas Model'}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
    )
  }

  return (
    <ModelsGrid>
      {models.map(model => (
        <ModelCard key={model.id}>
          <ModelCardHeader>
            <ModelCardTitle>{model.title}</ModelCardTitle>
            <StatusBadge published={model.status === 'published'}>
              {model.status === 'published' ? 'Published' : 'Draft'}
            </StatusBadge>
          </ModelCardHeader>

          <ModelDescription>
            {model.description || 'Tidak ada deskripsi'}
          </ModelDescription>

          <div style={{ flex: '1' }} />

          {model.topicTags && model.topicTags.length > 0 && (
            <TagList>
              {model.topicTags.map(tag => (
                <Tag key={tag.id}>🏷️ {tag.name}</Tag>
              ))}
            </TagList>
          )}

          {model.subtopicTags && model.subtopicTags.length > 0 && (
            <TagList>
              {model.subtopicTags.map(tag => (
                <Tag key={tag.id}>📌 {tag.name}</Tag>
              ))}
            </TagList>
          )}

          <ModelStats>
            <StatItem>
              <StatLabel>Created</StatLabel>
              <StatValue>{formatLocalDate(model.createdAt)}</StatValue>
            </StatItem>
          </ModelStats>

          <CardActions>
            <Button variant="secondary" fullWidth onClick={() => onEdit(model)}>
              Edit
            </Button>
          </CardActions>
        </ModelCard>
      ))}
    </ModelsGrid>
  )
}

export default AtlasList
