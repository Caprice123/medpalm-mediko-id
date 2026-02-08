import { useSelector } from 'react-redux'
import EmptyState from '@components/common/EmptyState'
import { CalculatorSkeletonGrid } from '@components/common/SkeletonCard'
import {
  CalculatorGrid,
  CalculatorCard,
  CalculatorCardHeader,
  CalculatorCardTitle,
  CalculatorDescription,
  TagList,
  Tag,
  CalculatorStats,
  StatItem,
  StatLabel,
  StatValue,
} from './CalculatorList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { CalculatorRoute } from '../../../../routes'
import Button from '@components/common/Button'

function CalculatorList() {
  const { topics, loading } = useSelector(state => state.calculator)
  const navigate = useNavigate()

  // Loading state
  if (loading.isGetListCalculatorsLoading) {
    return <CalculatorSkeletonGrid count={6} />
  }

  // Empty state
  if (topics.length === 0) {
    return (
      <EmptyState
        icon="🧮"
        title="Tidak ada kalkulator ditemukan"
      />
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

  // Data state - render calculator grid
  return (
    <CalculatorGrid>
      {topics.map((calculator) => {
        // Get kategori tags
        const kategoriTags = calculator.tags?.filter(tag => tag.tagGroup?.name === 'kategori') || []

        return (
          <CalculatorCard key={calculator.id}>
            <CalculatorCardHeader>
              <CalculatorCardTitle>{calculator.title}</CalculatorCardTitle>
            </CalculatorCardHeader>

            <CalculatorDescription>
              {calculator.description || 'Kalkulator untuk membantu perhitungan Anda'}
            </CalculatorDescription>

            {/* Kategori Tags */}
            {kategoriTags.length > 0 && (
              <TagList>
                {kategoriTags.map((tag) => (
                  <Tag key={tag.id} kategori>
                    📊 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            <div style={{ flex: '1' }}></div>

            <CalculatorStats>
              <StatItem>
                <StatLabel>Input Fields</StatLabel>
                <StatValue>{calculator.fields?.length || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Diperbarui</StatLabel>
                <StatValue>{formatDate(calculator.updatedAt || calculator.updatedAt)}</StatValue>
              </StatItem>
            </CalculatorStats>

            <Button variant="primary" onClick={() => navigate(generatePath(CalculatorRoute.detailRoute, { id: calculator.uniqueId }))}>
              Gunakan Kalkulator
            </Button>
          </CalculatorCard>
        )
      })}
    </CalculatorGrid>
  )
}

export default CalculatorList
