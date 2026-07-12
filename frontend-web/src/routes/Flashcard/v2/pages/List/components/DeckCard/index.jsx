import { useNavigate, generatePath } from 'react-router-dom'
import { formatLocalDate } from '@utils/dateUtils'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { FlashcardRoute } from '../../../../../routes'
import { NodeRow, NodeChip, CardStats, StatItem, StatLabel, StatValue } from './DeckCard.styles'

export default function DeckCard({ deck }) {
  const navigate = useNavigate()
  const nodes = deck.nodes || []
  const rc = deck.reviewCounts

  const total = deck.cardCount || 0
  const reviewed = rc ? (rc.again + rc.hard + rc.good + rc.easy) : 0
  const notReviewed = total - reviewed

  const handleStart = () => {
    navigate(generatePath(FlashcardRoute.detailRoute, { id: deck.uniqueId }))
  }

  return (
    <Card shadow hoverable>
      <CardHeader title={deck.title} divider={false} />

      <CardBody padding="0 1.25rem 1.25rem 1.25rem">
        {deck.description && (
          <p style={{
            color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.5,
            marginBottom: '0.75rem', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {deck.description}
          </p>
        )}

        {nodes.length > 0 && (
          <NodeRow>
            {nodes.flatMap(n => {
              const chips = []
              if (n.departmentName) chips.push(
                <NodeChip key={`${n.id}-dept`} $type="department">🏥 {n.departmentName}</NodeChip>
              )
              if (n.nodeName) chips.push(
                <NodeChip key={`${n.id}-topic`} $type="topic">📚 {n.nodeName}</NodeChip>
              )
              return chips
            })}
          </NodeRow>
        )}
        <div style={{ flex: 1 }}></div>

        <CardStats>
          <StatItem>
            <StatLabel>Kartu</StatLabel>
            <StatValue>{total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Baru</StatLabel>
            <StatValue>{notReviewed}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Diperbarui</StatLabel>
            <StatValue>{deck.updatedAt ? formatLocalDate(deck.updatedAt) : '-'}</StatValue>
          </StatItem>
        </CardStats>

        <Button variant="primary" onClick={handleStart} style={{ width: '100%' }}>
          ▶ Mulai Belajar
        </Button>
      </CardBody>
    </Card>
  )
}
