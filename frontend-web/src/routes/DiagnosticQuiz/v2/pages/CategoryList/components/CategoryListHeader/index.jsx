import Button from '@components/common/Button'
import { PageHeader, HeaderLeft, Title, Subtitle } from './CategoryListHeader.styles'

export default function CategoryListHeader({ featureName, featureDescription, onOpenCustomSession }) {
  return (
    <PageHeader>
      <HeaderLeft>
        <Title>{featureName || 'Bank Soal'}</Title>
        <Subtitle>{featureDescription || 'Latihan soal dengan sistem pengulangan adaptif'}</Subtitle>
      </HeaderLeft>
      <Button variant="secondary" onClick={onOpenCustomSession}>
        Sesi Kustom
      </Button>
    </PageHeader>
  )
}
