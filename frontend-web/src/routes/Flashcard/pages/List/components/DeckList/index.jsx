import { useSelector } from 'react-redux'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  DeckGrid,
  DeckDescription,
  TagList,
  Tag,
  DeckStats,
  StatItem,
  StatLabel,
  StatValue
} from './DeckList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { FlashcardRoute } from '../../../../routes'

function DeckList() {
    const { decks, loading } = useSelector(state => state.flashcard)
    const navigate = useNavigate()

  // Loading state - show skeleton when loading OR when we don't know loading state yet
  if (loading.isGetListDecksLoading || (decks.length === 0 && loading.isGetListDecksLoading !== false)) {
    return <LearningContentSkeletonGrid count={6} statsCount={2} />
  }

  // Empty state - only show when we're sure loading is complete
  if (decks.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>🎴</EmptyStateIcon>
        <EmptyStateText>Tidak ada deck flashcard ditemukan</EmptyStateText>
      </EmptyState>
    )
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  // Data state - render deck grid
  return (
    <DeckGrid>
      {decks.map((deck) => {
        // Get tag groups
        const universityTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
        const semesterTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

        return (
          <Card key={deck.id} shadow hoverable>
            <CardHeader title={deck.title} divider={false} />

            <CardBody padding="0 1.25rem 1.25rem 1.25rem">
              <DeckDescription>
                {deck.description || 'Tidak ada deskripsi'}
              </DeckDescription>

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

              <DeckStats>
                <StatItem>
                  <StatLabel>Kartu</StatLabel>
                  <StatValue>{deck.cardCount || deck.cards?.length || 0}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Diperbarui</StatLabel>
                  <StatValue>{formatDate(deck.updatedAt || deck.updatedAt)}</StatValue>
                </StatItem>
              </DeckStats>

              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(generatePath(FlashcardRoute.detailRoute, { id: deck.id }))}
              >
                Mulai Belajar
              </Button>
            </CardBody>
          </Card>
        )
      })}
    </DeckGrid>
  )
}

export default DeckList
