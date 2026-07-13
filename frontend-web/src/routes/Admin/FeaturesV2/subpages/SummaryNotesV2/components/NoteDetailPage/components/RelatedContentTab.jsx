import Button from '@components/common/Button'
import { useSummaryNoteRelations } from '../../../hooks/useSummaryNoteRelations'
import { useRelatedContent } from '../hooks/useRelatedContent'
import {
  RelationSection, RelationSectionTitle, RelationSectionCount,
  ContentCardGrid, ContentCard, ContentCardLinkedBadge,
  ContentCardTitle, ContentCardDescription,
  ContentCardMeta, ContentCardStat, ContentCardStatLabel, ContentCardStatValue,
  EmptyHint,
} from '../NoteDetailPage.styles'

function FlashcardCard({ item, linked, disabled, onToggle }) {
  return (
    <ContentCard $linked={linked} onClick={onToggle} disabled={disabled}>
      {linked && <ContentCardLinkedBadge>✓ Terpilih</ContentCardLinkedBadge>}
      <ContentCardTitle>{item.title}</ContentCardTitle>
      {item.description && <ContentCardDescription>{item.description}</ContentCardDescription>}
      <ContentCardMeta>
        <ContentCardStat>
          <ContentCardStatLabel>Kartu</ContentCardStatLabel>
          <ContentCardStatValue>{item.cardCount ?? 0}</ContentCardStatValue>
        </ContentCardStat>
      </ContentCardMeta>
    </ContentCard>
  )
}

function McqCard({ item, linked, disabled, onToggle }) {
  return (
    <ContentCard $linked={linked} onClick={onToggle} disabled={disabled}>
      {linked && <ContentCardLinkedBadge>✓ Terpilih</ContentCardLinkedBadge>}
      <ContentCardTitle>{item.title}</ContentCardTitle>
      {item.description && <ContentCardDescription>{item.description}</ContentCardDescription>}
      <ContentCardMeta>
        <ContentCardStat>
          <ContentCardStatLabel>Soal</ContentCardStatLabel>
          <ContentCardStatValue>{item.questionCount ?? 0}</ContentCardStatValue>
        </ContentCardStat>
        {item.quizTimeLimit && (
          <ContentCardStat>
            <ContentCardStatLabel>Waktu</ContentCardStatLabel>
            <ContentCardStatValue>{item.quizTimeLimit}m</ContentCardStatValue>
          </ContentCardStat>
        )}
      </ContentCardMeta>
    </ContentCard>
  )
}

function RelatedContentTab({ noteId }) {
  const {
    flashcardItems, mcqItems,
    flashcardRelations, mcqRelations,
    flashcardPagination, mcqPagination,
    isFlashcardLoading, isMcqLoading, isRelationsLoading,
    loadMoreFlashcard, loadMoreMcq,
    add, remove,
  } = useSummaryNoteRelations(noteId)

  const { linkedFlashcardIds, linkedMcqIds, handleToggleFlashcard, handleToggleMcq } =
    useRelatedContent({ flashcardRelations, mcqRelations, add, remove })

  return (
    <>
      <RelationSection>
        <RelationSectionTitle>
          Flashcard Deck
          {flashcardRelations.length > 0 && (
            <RelationSectionCount>{flashcardRelations.length} terpilih</RelationSectionCount>
          )}
        </RelationSectionTitle>

        {flashcardItems.length === 0 && !isFlashcardLoading ? (
          <EmptyHint>Tidak ada flashcard deck tersedia.</EmptyHint>
        ) : (
          <>
            <ContentCardGrid>
              {flashcardItems.map(item => (
                <FlashcardCard
                  key={item.id}
                  item={item}
                  linked={linkedFlashcardIds.has(item.id)}
                  disabled={isRelationsLoading}
                  onToggle={() => handleToggleFlashcard(item)}
                />
              ))}
            </ContentCardGrid>
            {!flashcardPagination?.isLastPage && (
              <Button
                variant="secondary"
                onClick={loadMoreFlashcard}
                disabled={isFlashcardLoading}
                style={{ marginTop: '0.75rem', width: '100%' }}
              >
                {isFlashcardLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
              </Button>
            )}
          </>
        )}
      </RelationSection>

      <RelationSection>
        <RelationSectionTitle>
          MCQ Topic
          {mcqRelations.length > 0 && (
            <RelationSectionCount>{mcqRelations.length} terpilih</RelationSectionCount>
          )}
        </RelationSectionTitle>

        {mcqItems.length === 0 && !isMcqLoading ? (
          <EmptyHint>Tidak ada MCQ topic tersedia.</EmptyHint>
        ) : (
          <>
            <ContentCardGrid>
              {mcqItems.map(item => (
                <McqCard
                  key={item.id}
                  item={item}
                  linked={linkedMcqIds.has(item.id)}
                  disabled={isRelationsLoading}
                  onToggle={() => handleToggleMcq(item)}
                />
              ))}
            </ContentCardGrid>
            {!mcqPagination?.isLastPage && (
              <Button
                variant="secondary"
                onClick={loadMoreMcq}
                disabled={isMcqLoading}
                style={{ marginTop: '0.75rem', width: '100%' }}
              >
                {isMcqLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
              </Button>
            )}
          </>
        )}
      </RelationSection>
    </>
  )
}

export default RelatedContentTab
