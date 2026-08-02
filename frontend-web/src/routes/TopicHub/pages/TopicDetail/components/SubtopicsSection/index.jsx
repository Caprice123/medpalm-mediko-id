import { useSelector } from 'react-redux'
import { PiStackSimple } from 'react-icons/pi'
import {
  SubtopicsHeader, SubtopicsTitle, SubtopicsIcon, SubtopicsCount, SubtopicsSubtitle,
  SubtopicGrid, SubtopicCard, SubtopicName, SubtopicArrow,
  SkeletonCard, EmptyState,
} from './SubtopicsSection.styles'

export default function SubtopicsSection({ onSelectSubtopic }) {
  const { subtopics, loading } = useSelector(s => s.featureNodes)
  const isLoading = loading.isFetchingSubtopics

  return (
    <>
      <SubtopicsHeader>
        <SubtopicsTitle>
          <SubtopicsIcon><PiStackSimple size={20} /></SubtopicsIcon>
          Subtopik
        </SubtopicsTitle>
        {!isLoading && <SubtopicsCount>{subtopics.length}</SubtopicsCount>}
      </SubtopicsHeader>
      <SubtopicsSubtitle>
        Setiap subtopik berisi video, artikel, flashcards, dan bank soal terkait.
      </SubtopicsSubtitle>

      <SubtopicGrid>
        {isLoading
          ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
          : subtopics.length === 0
            ? <EmptyState>Belum ada sub-topik tersedia.</EmptyState>
            : subtopics.map(sub => (
              <SubtopicCard key={sub.id} onClick={() => onSelectSubtopic(sub.slug)}>
                <SubtopicName>{sub.name}</SubtopicName>
                <SubtopicArrow>⊙</SubtopicArrow>
              </SubtopicCard>
            ))
        }
      </SubtopicGrid>
    </>
  )
}
