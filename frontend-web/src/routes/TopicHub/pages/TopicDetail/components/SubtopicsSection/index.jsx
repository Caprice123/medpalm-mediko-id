import { useSelector } from 'react-redux'
import { PiArrowRight } from 'react-icons/pi'
import EmptyState from '@components/common/EmptyState'
import {
  Section, SectionHeading, SectionDescription,
  ItemGrid, ItemCard, ItemCardName, ItemCardArrow, SkeletonCard,
} from '../../TopicDetail.styles'

const SKELETON_COUNT = 8

export default function SubtopicsSection({ onSelectSubtopic }) {
  const { subtopics, loading } = useSelector(s => s.featureNodes)
  const isLoading = loading.isFetchingSubtopics

  return (
    <Section>
      <SectionHeading>Subtopik</SectionHeading>
      <SectionDescription>
        Urut dari embriologi dan anatomi hingga aplikasi klinis. Setiap subtopik berisi
        ringkasan materi, flashcard, dan bank soal.
      </SectionDescription>

      {isLoading ? (
        <ItemGrid>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)}
        </ItemGrid>
      ) : subtopics.length === 0 ? (
        <EmptyState
          title="Belum ada subtopik"
          description="Materi untuk topik ini sedang disiapkan."
        />
      ) : (
        <ItemGrid>
          {subtopics.map(sub => (
            <ItemCard key={sub.id} onClick={() => onSelectSubtopic(sub.slug)}>
              <ItemCardName>{sub.name}</ItemCardName>
              <ItemCardArrow><PiArrowRight size={16} /></ItemCardArrow>
            </ItemCard>
          ))}
        </ItemGrid>
      )}
    </Section>
  )
}
