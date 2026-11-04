import { useSelector } from 'react-redux'
import { PiCards, PiListNumbers, PiBookOpenText, PiLock, PiArrowUpRight } from 'react-icons/pi'
import {
  Section, SectionHeading, SectionDescription,
  ItemGrid, ItemCard, ItemCardIcon, ItemCardText, ItemCardName, ItemCardMeta, ItemCardAction,
} from '../../SubtopicDetail.styles'
import { checkFeatureLock } from '../../utils/checkFeatureLock'

/* Icons match the ones the sidebar already uses for these same three features
   (see AppLayout's FEATURE_ICONS), so a student meets one mark per feature
   across the product. They used to be emoji, which render at the mercy of the
   platform and carry no stroke weight of their own. */
const RELATED_DEFS = [
  { sessionType: 'flashcard',     Icon: PiCards,        label: 'Flashcard', unit: 'kartu' },
  { sessionType: 'mcq',           Icon: PiListNumbers,  label: 'Bank Soal', unit: 'soal' },
  { sessionType: 'summary_notes', Icon: PiBookOpenText, label: 'Artikel',   unit: 'catatan' },
]

export default function RelatedContentSection({ subtopicName, stats, isLoading, onSelectTab, onLockedClick }) {
  const { features } = useSelector(s => s.feature)
  const { userStatus } = useSelector(s => s.pricing)

  if (isLoading || !stats) return null

  const countBySessionType = {
    flashcard: stats.flashcardCards,
    mcq: stats.mcqQuestions,
    summary_notes: stats.summaryNotes,
  }
  const visibleRelated = RELATED_DEFS
    .map(def => ({ ...def, count: countBySessionType[def.sessionType] }))
    .filter(r => r.count > 0)

  if (!visibleRelated.length) return null

  return (
    <Section>
      <SectionHeading>Pembelajaran Terkait</SectionHeading>
      <SectionDescription>
        Flashcard, bank soal, dan artikel seputar {subtopicName}.
      </SectionDescription>

      <ItemGrid>
        {visibleRelated.map(({ sessionType, Icon, label, count, unit }) => {
          const lock = checkFeatureLock(sessionType, features, userStatus)
          return (
            <ItemCard
              key={sessionType}
              $locked={lock.isLocked}
              onClick={() => lock.isLocked ? onLockedClick() : onSelectTab(sessionType)}
            >
              <ItemCardIcon><Icon size={18} /></ItemCardIcon>
              <ItemCardText>
                <ItemCardName>{label}</ItemCardName>
                <ItemCardMeta>{count} {unit}</ItemCardMeta>
              </ItemCardText>
              <ItemCardAction>
                {lock.isLocked ? <PiLock size={16} /> : <PiArrowUpRight size={16} />}
              </ItemCardAction>
            </ItemCard>
          )
        })}
      </ItemGrid>
    </Section>
  )
}
