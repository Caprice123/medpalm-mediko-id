import { useSelector } from 'react-redux'
import { TrustGrid, TrustItem, TrustValue, TrustLabel } from './TrustCard.styles'

const formatCount = (value) =>
  typeof value === 'number' ? `${value.toLocaleString('id-ID')}+` : null

function TrustCard() {
  // Display-only data, so it is read here rather than threaded down from useHome.
  const trust = useSelector((state) => state.home.stats.trust)

  // All three are counted from the database. The app-store download figures
  // this card used to show could only ever be maintained by hand, so they were
  // replaced with numbers that keep themselves current.
  const items = [
    { label: 'Member tergabung', value: formatCount(trust?.memberCount) },
    { label: 'Soal & flashcard', value: formatCount(trust?.practiceCount) },
    { label: 'Materi & model 3D', value: formatCount(trust?.materialCount) },
  ]

  return (
    <TrustGrid>
      {items.map((item) => (
        <TrustItem key={item.label}>
          <TrustValue>{item.value || '—'}</TrustValue>
          <TrustLabel>{item.label}</TrustLabel>
        </TrustItem>
      ))}
    </TrustGrid>
  )
}

export default TrustCard
