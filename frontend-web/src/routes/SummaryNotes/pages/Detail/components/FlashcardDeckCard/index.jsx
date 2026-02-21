import { formatLocalDate } from '@utils/dateUtils'
import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import { FlashcardRoute } from '@routes/Flashcard/routes'
import {
  TagList,
  Tag,
  ResourceDescription,
  ResourceStats,
  StatItem,
  StatLabel,
  StatValue,
} from '../../Detail.styles'

function FlashcardDeckCard({ deck }) {
  const navigate = useNavigate()

  const universityTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
  const semesterTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []
  const topicTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
  const departmentTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'department') || []

  return (
    <Card shadow hoverable>
      <CardHeader title={deck.title} divider={false} />

      <CardBody padding="0 1.25rem 1.25rem 1.25rem">
        <ResourceDescription>
          {deck.description || 'Tidak ada deskripsi'}
        </ResourceDescription>

        {universityTags.length > 0 && (
          <TagList>
            {universityTags.map((tag) => (
              <Tag key={tag.id} university>🏛️ {tag.name}</Tag>
            ))}
          </TagList>
        )}

        {semesterTags.length > 0 && (
          <TagList>
            {semesterTags.map((tag) => (
              <Tag key={tag.id} semester>📚 {tag.name}</Tag>
            ))}
          </TagList>
        )}

        {topicTags.length > 0 && (
          <TagList>
            {topicTags.map((tag) => (
              <Tag key={tag.id} topic>📖 {tag.name}</Tag>
            ))}
          </TagList>
        )}

        {departmentTags.length > 0 && (
          <TagList>
            {departmentTags.map((tag) => (
              <Tag key={tag.id} department>🏥 {tag.name}</Tag>
            ))}
          </TagList>
        )}

        <ResourceStats>
          <StatItem>
            <StatLabel>Kartu</StatLabel>
            <StatValue>{deck.cardCount || 0}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Diperbarui</StatLabel>
            <StatValue>{formatLocalDate(deck.updatedAt)}</StatValue>
          </StatItem>
        </ResourceStats>

        <Button
          variant="primary"
          fullWidth
          onClick={() => navigate(`${FlashcardRoute.moduleRoute}/${deck.uniqueId}`)}
        >
          Mulai Belajar
        </Button>
      </CardBody>
    </Card>
  )
}

export default FlashcardDeckCard
