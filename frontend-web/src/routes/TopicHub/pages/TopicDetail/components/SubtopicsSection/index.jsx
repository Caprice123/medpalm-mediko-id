import { useSelector } from 'react-redux'
import { PiArrowRight } from 'react-icons/pi'
import EmptyState from '@components/common/EmptyState'
import {
  Section, SectionHeading, SectionDescription,
  ItemGrid, ItemCard, ItemCardIcon, ItemCardName, ItemCardArrow, SkeletonCard,
} from '../../TopicDetail.styles'
import { firstIcon } from '@utils/iconUtils'

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
          {subtopics.map(sub => {
            const icon = firstIcon(sub.icon)
            return (
              <ItemCard key={sub.id} onClick={() => onSelectSubtopic(sub.slug)}>
                {/* Decorative: the name beside it already identifies the
                    sub-topic, so the emoji is hidden from screen readers. */}
                {icon && <ItemCardIcon aria-hidden="true">{icon}</ItemCardIcon>}
                <ItemCardName>{sub.name}</ItemCardName>
                <ItemCardArrow><PiArrowRight size={16} /></ItemCardArrow>
              </ItemCard>
            )
          })}
        </ItemGrid>
      )}
    </Section>
  )
}
