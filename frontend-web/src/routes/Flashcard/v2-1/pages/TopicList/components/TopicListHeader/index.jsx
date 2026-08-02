import Button from '@components/common/Button'
import { PageHeader, HeaderLeft, Title, Subtitle } from './TopicListHeader.styles'

export default function TopicListHeader({ featureName, featureDescription, onOpenCustomSession }) {
  return (
    <PageHeader>
      <HeaderLeft>
        <Title>{featureName || 'Flashcard'}</Title>
        <Subtitle>{featureDescription || 'Pilih topik untuk mulai belajar'}</Subtitle>
      </HeaderLeft>
      <Button variant="secondary" onClick={onOpenCustomSession}>
        Sesi Kustom
      </Button>
    </PageHeader>
  )
}
