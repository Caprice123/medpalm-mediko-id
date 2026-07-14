import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSummaryNoteDetailV2, fetchLinkedFlashcards, fetchLinkedMcq } from '@store/summaryNotes/v2/userAction'
import { fetchPublicConstants } from '@store/constant/userAction'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
import Button from '@components/common/Button'
import { NotePanelLoadingSkeleton } from './NotePanelLoadingSkeleton'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import {
  EmptyPanel, EmptyIcon, EmptyText,
  PanelContainer, TopBar, Breadcrumb, BreadcrumbItem, BreadcrumbSep, FullScreenBtn,
  PanelContent, NoteTitle, NoteDescription, EditorWrapper,
  ActionRow, Divider, SectionRow, SectionLabel, SectionLine,
  LinkedGroup, LinkedGroupLabel, LinkedCards, LinkedCard, LinkedCardTitle, LinkedCardArrow,
} from './NotePanel.styles'

function NotePanel({ noteId, isFullScreen, onToggleFullScreen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, loading, linkedFlashcards, linkedFlashcardsPagination, linkedMcq, linkedMcqPagination } = useSelector(s => s.summaryNotesV2)
  const constants = useSelector(s => s.constant.constants)

  useEffect(() => {
    dispatch(fetchPublicConstants(['flashcard_feature_title', 'mcq_feature_title']))
  }, [dispatch])

  useEffect(() => {
    if (noteId) {
      dispatch(fetchSummaryNoteDetailV2(noteId))
      dispatch(fetchLinkedFlashcards(noteId, 1))
      dispatch(fetchLinkedMcq(noteId, 1))
    }
  }, [noteId, dispatch])

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
        <EmptyText>Pilih ringkasan untuk mulai membaca</EmptyText>
      </EmptyPanel>
    )
  }

  if (loading.isNoteDetailLoading || !detail) {
    return (
      <PanelContainer>
        <NotePanelLoadingSkeleton />
      </PanelContainer>
    )
  }

  const flashcardLabel = constants?.flashcard_feature_title || 'Flashcard'
  const mcqLabel = constants?.mcq_feature_title || 'MCQ'

  const hasFlashcards = linkedFlashcards.length > 0 || !linkedFlashcardsPagination.isLastPage
  const hasMcq = linkedMcq.length > 0 || !linkedMcqPagination.isLastPage
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
        <SectionRow>
          <SectionLabel>📖 Ringkasan</SectionLabel>
          <SectionLine />
        </SectionRow>
        <NoteTitle>{detail.title}</NoteTitle>
        {detail.description && (
          <NoteDescription>{detail.description}</NoteDescription>
        )}

        <SectionRow style={{ marginBottom: '1.25rem' }}>
          <SectionLabel>📄 Konten</SectionLabel>
          <SectionLine />
        </SectionRow>

        {parsedContent?.some(block => block.type === 'embed') && <EmbedLoadingBanner />}

        <EditorWrapper>
          <BlockNoteEditor
            initialContent={parsedContent}
            editable={false}
          />
        </EditorWrapper>

        {detail.sourceDocument && (
          <>
            <SectionRow>
              <SectionLabel>📚 Referensi</SectionLabel>
              <SectionLine />
            </SectionRow>
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
            <SectionRow>
              <SectionLabel>📚 Sumber Belajar Terkait</SectionLabel>
              <SectionLine />
            </SectionRow>

            {hasFlashcards && (
              <LinkedGroup>
                <LinkedGroupLabel $type="flashcard">🃏 {flashcardLabel}</LinkedGroupLabel>
                <LinkedCards>
                  {linkedFlashcards.map(deck => (
                    <LinkedCard
                      key={deck.id}
                      $type="flashcard"
                      onClick={() => navigate(`/flashcards/${deck.uniqueId}`)}
                    >
                      <LinkedCardTitle>{deck.title}</LinkedCardTitle>
                      <LinkedCardArrow>→</LinkedCardArrow>
                    </LinkedCard>
                  ))}
                </LinkedCards>
                {!linkedFlashcardsPagination.isLastPage && (
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={loading.isLinkedFlashcardsLoading}
                    onClick={() => dispatch(fetchLinkedFlashcards(noteId, linkedFlashcardsPagination.page + 1))}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {loading.isLinkedFlashcardsLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
                  </Button>
                )}
              </LinkedGroup>
            )}

            {hasMcq && (
              <LinkedGroup>
                <LinkedGroupLabel $type="mcq">📝 {mcqLabel}</LinkedGroupLabel>
                <LinkedCards>
                  {linkedMcq.map(topic => (
                    <LinkedCard
                      key={topic.id}
                      $type="mcq"
                      onClick={() => navigate(`/multiple-choice/${topic.uniqueId}`)}
                    >
                      <LinkedCardTitle>{topic.title}</LinkedCardTitle>
                      <LinkedCardArrow>→</LinkedCardArrow>
                    </LinkedCard>
                  ))}
                </LinkedCards>
                {!linkedMcqPagination.isLastPage && (
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={loading.isLinkedMcqLoading}
                    onClick={() => dispatch(fetchLinkedMcq(noteId, linkedMcqPagination.page + 1))}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {loading.isLinkedMcqLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
                  </Button>
                )}
              </LinkedGroup>
            )}
          </>
        )}
      </PanelContent>
    </PanelContainer>
  )
}

export default NotePanel
