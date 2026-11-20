import { useSelector } from 'react-redux'
import { PiArrowRight } from 'react-icons/pi'
import EmptyState from '@components/common/EmptyState'
import SearchField from '@routes/TopicHub/components/SearchField'
import {
  Section, SectionHeading, SectionDescription,
  ItemGrid, ItemCard, ItemCardIcon, ItemCardName, ItemCardArrow, SkeletonCard,
} from '../../TopicDetail.styles'
import { SearchRow } from './SubtopicsSection.styles'
import { firstIcon } from '@utils/iconUtils'

const SKELETON_COUNT = 8

export default function SubtopicsSection({
  onSelectSubtopic, searchQuery, onSearchChange, onSearchSubmit, onSearchClear, appliedQuery,
}) {
  const { subtopics, loading } = useSelector(s => s.featureNodes)
  const isLoading = loading.isFetchingSubtopics
  // The list on screen outlives a re-query (see TopicGroupSection) — skeletons
  // only stand in when there is nothing to keep.
  const showSkeletons = isLoading && subtopics.length === 0

  return (
    <Section>
      <SectionHeading>Subtopik</SectionHeading>
      <SectionDescription>
        Urut dari embriologi dan anatomi hingga aplikasi klinis. Setiap subtopik berisi
        ringkasan materi, flashcard, dan bank soal.
      </SectionDescription>

      {/* Hidden only when the topic genuinely has no subtopics to search. It
          stays put once a query is on, so a search that matched nothing can
          still be cleared from the field it was typed into. */}
      {(appliedQuery || subtopics.length > 0 || isLoading) && (
        <SearchRow>
          <SearchField
            value={searchQuery}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
            onClear={onSearchClear}
            placeholder="Cari subtopik..."
          />
        </SearchRow>
      )}

      {showSkeletons ? (
        <ItemGrid>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)}
        </ItemGrid>
      ) : subtopics.length > 0 ? (
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
      ) : appliedQuery ? (
        <EmptyState
          icon="🔍"
          title="Subtopik tidak ditemukan"
          description={`Tidak ada subtopik yang cocok dengan "${appliedQuery}".`}
          actionLabel="Hapus Pencarian"
          actionVariant="secondary"
          onAction={onSearchClear}
        />
      ) : (
        <EmptyState
          title="Belum ada subtopik"
          description="Materi untuk topik ini sedang disiapkan."
        />
      )}
    </Section>
  )
}
