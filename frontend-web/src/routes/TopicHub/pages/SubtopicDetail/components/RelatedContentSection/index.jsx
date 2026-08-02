import { useSelector } from 'react-redux'
import { SectionLabel } from '../../SubtopicDetail.styles'
import { checkFeatureLock } from '../../utils/checkFeatureLock'
import {
  RelatedSection, RelatedSubtitle, RelatedGrid, RelatedCard,
  RelatedIconBox, RelatedInfo, RelatedLabel, RelatedCount, RelatedAction,
} from './RelatedContentSection.styles'

const RELATED_DEFS = [
  { sessionType: 'flashcard',     icon: '🗂️', label: 'Flashcard', unit: 'kartu' },
  { sessionType: 'mcq',           icon: '📝', label: 'Bank Soal', unit: 'soal' },
  { sessionType: 'summary_notes', icon: '📖', label: 'Artikel',   unit: 'catatan' },
]

export default function RelatedContentSection({ subtopicName, stats, isLoading, onSelectTab, onLockedClick }) {
  const { features } = useSelector(s => s.feature)
  const { userStatus } = useSelector(s => s.pricing)

  if (isLoading || !stats) return null

  const statCountBySessionType = {
    flashcard: stats.flashcardCards,
    mcq: stats.mcqQuestions,
    summary_notes: stats.summaryNotes,
  }
  const visibleRelated = RELATED_DEFS
    .map(def => ({ ...def, count: statCountBySessionType[def.sessionType] }))
    .filter(r => r.count > 0)

  if (!visibleRelated.length) return null

  return (
    <RelatedSection>
      <SectionLabel>Pembelajaran Terkait</SectionLabel>
      <RelatedSubtitle>Flashcard, bank soal, dan artikel seputar {subtopicName}.</RelatedSubtitle>
      <RelatedGrid>
        {visibleRelated.map(({ sessionType, icon, label, count, unit }) => {
          const lock = checkFeatureLock(sessionType, features, userStatus)
          return (
            <RelatedCard
              key={sessionType}
              $locked={lock.isLocked}
              onClick={() => lock.isLocked ? onLockedClick() : onSelectTab(sessionType)}
            >
              <RelatedIconBox>{icon}</RelatedIconBox>
              <RelatedInfo>
                <RelatedLabel>{label}</RelatedLabel>
                <RelatedCount>{count} {unit}</RelatedCount>
              </RelatedInfo>
              <RelatedAction>{lock.isLocked ? '🔒' : '↗'}</RelatedAction>
            </RelatedCard>
          )
        })}
      </RelatedGrid>
    </RelatedSection>
  )
}
