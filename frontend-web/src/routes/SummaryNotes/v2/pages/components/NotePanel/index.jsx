import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNoteDetailV2 } from '@store/summaryNotes/v2/userAction'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
import Button from '@components/common/Button'
import { SummaryNoteDetailSkeleton } from '@components/common/SkeletonCard'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import DeckCard from '@routes/Flashcard/v2/pages/List/components/DeckCard'
import McqTopicCard from '@routes/SummaryNotes/pages/Detail/components/McqTopicCard'
import {
  EmptyPanel, EmptyIcon, EmptyText,
  PanelContainer, TopBar, Breadcrumb, BreadcrumbItem, BreadcrumbSep, FullScreenBtn,
  PanelContent, NoteTitle, NoteDescription, MetaRow, MetaChip,
  ActionRow, Divider, SectionTitle, ToggleButtons, ToggleButton, ResourceGrid,
} from './NotePanel.styles'

function NotePanel({ noteId, isFullScreen, onToggleFullScreen }) {
  const dispatch = useDispatch()
  const { detail, loading } = useSelector(s => s.summaryNotesV2)
  const [activeResourceType, setActiveResourceType] = useState('flashcards')

  useEffect(() => {
    if (noteId) {
      dispatch(fetchSummaryNoteDetailV2(noteId))
    }
  }, [noteId, dispatch])

  useEffect(() => {
    if (detail?.flashcardDecks?.length === 0 && detail?.mcqTopics?.length > 0) {
      setActiveResourceType('mcq')
    } else {
      setActiveResourceType('flashcards')
    }
  }, [detail?.id])

  const parsedContent = useMemo(() => {
    if (!detail?.content) return null
    try {
      return typeof detail.content === 'string' ? JSON.parse(detail.content) : detail.content
    } catch {
      return null
    }
  }, [detail?.content])

  const breadcrumbPath = detail?.nodes?.[0]?.path || []

  if (!noteId) {
    return (
      <EmptyPanel>
        <EmptyIcon>📖</EmptyIcon>
        <EmptyText>Pilih ringkasan dari sidebar untuk mulai membaca</EmptyText>
      </EmptyPanel>
    )
  }

  if (loading.isNoteDetailLoading || !detail) {
    return (
      <PanelContainer>
        <SummaryNoteDetailSkeleton />
      </PanelContainer>
    )
  }

  const hasFlashcards = detail.flashcardDecks?.length > 0
  const hasMcq = detail.mcqTopics?.length > 0
  const hasLinkedResources = hasFlashcards || hasMcq

  return (
    <PanelContainer>
      <TopBar>
        <Breadcrumb>
          {breadcrumbPath.map((crumb, i) => (
            <span key={crumb.id} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              {i > 0 && <BreadcrumbSep>/</BreadcrumbSep>}
              <BreadcrumbItem>{crumb.name}</BreadcrumbItem>
            </span>
          ))}
          {breadcrumbPath.length > 0 && <BreadcrumbSep>/</BreadcrumbSep>}
          <BreadcrumbItem>{detail.title}</BreadcrumbItem>
        </Breadcrumb>
        <FullScreenBtn onClick={onToggleFullScreen}>
          {isFullScreen ? '⊠ Keluar Layar Penuh' : '⊡ Layar Penuh'}
        </FullScreenBtn>
      </TopBar>

      <PanelContent>
        <NoteTitle>{detail.title}</NoteTitle>

        {detail.description && (
          <NoteDescription>{detail.description}</NoteDescription>
        )}

        <MetaRow>
          {detail.departmentTags?.map(tag => (
            <MetaChip key={tag.id} $teal>🏥 {tag.name}</MetaChip>
          ))}
          {detail.semesterTags?.map(tag => (
            <MetaChip key={tag.id}>📚 {tag.name}</MetaChip>
          ))}
          {detail.universityTags?.map(tag => (
            <MetaChip key={tag.id}>🏛️ {tag.name}</MetaChip>
          ))}
        </MetaRow>

        {parsedContent?.some(block => block.type === 'embed') && <EmbedLoadingBanner />}

        <BlockNoteEditor
          initialContent={parsedContent}
          editable={false}
        />

        {detail.sourceDocument && (
          <>
            <Divider />
            <SectionTitle>📚 Referensi</SectionTitle>
            <FileUpload
              file={{
                name: detail.sourceDocument.filename,
                type: detail.sourceDocument.contentType,
                size: detail.sourceDocument.byteSize,
              }}
              actions={
                <Button
                  variant="primary"
                  size="small"
                  as="a"
                  href={detail.sourceDocument.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat Dokumen
                </Button>
              }
            />
          </>
        )}

        {hasLinkedResources && (
          <>
            <Divider />
            <SectionTitle>📚 Sumber Belajar Terkait</SectionTitle>
            <ToggleButtons>
              <ToggleButton
                $active={activeResourceType === 'flashcards'}
                onClick={() => setActiveResourceType('flashcards')}
                disabled={!hasFlashcards}
              >
                🃏 Flashcards ({detail.flashcardDecks?.length || 0})
              </ToggleButton>
              <ToggleButton
                $active={activeResourceType === 'mcq'}
                onClick={() => setActiveResourceType('mcq')}
                disabled={!hasMcq}
              >
                📝 MCQ ({detail.mcqTopics?.length || 0})
              </ToggleButton>
            </ToggleButtons>

            {activeResourceType === 'flashcards' && hasFlashcards && (
              <ResourceGrid>
                {detail.flashcardDecks.map(deck => (
                  <DeckCard key={deck.id} deck={deck} />
                ))}
              </ResourceGrid>
            )}

            {activeResourceType === 'mcq' && hasMcq && (
              <ResourceGrid>
                {detail.mcqTopics.map(topic => (
                  <McqTopicCard key={topic.id} topic={topic} />
                ))}
              </ResourceGrid>
            )}
          </>
        )}
      </PanelContent>
    </PanelContainer>
  )
}

export default NotePanel
