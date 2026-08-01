import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, generatePath } from 'react-router-dom'
import { fetchSummaryNoteDetailV2, fetchNoteAnatomyQuizRelations } from '@store/summaryNotes/v2/userAction'
import { fetchNodeStats } from '@store/featureNodes'
import { fetchPublicConstants } from '@store/constant/userAction'
import { AtlasQuizRoute } from '@routes/AtlasQuiz/routes'
import { FlashcardRoute } from '@routes/Flashcard/routes'
import { MultipleChoiceRoute } from '@routes/MultipleChoice/routes'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
import Button from '@components/common/Button'
import { NotePanelLoadingSkeleton } from './NotePanelLoadingSkeleton'
import EmbedLoadingBanner from '@components/common/EmbedLoadingBanner'
import {
  EmptyPanel, EmptyIcon, EmptyText,
  PanelContainer, TopBar, Breadcrumb, BreadcrumbItem, BreadcrumbSep, FullScreenBtn,
  PanelContent, NoteTitle, NoteDescription, EditorWrapper,
  SectionRow, SectionLabel, SectionLine,
  LinkedGroup, LinkedGroupLabel, LinkedGroupHint,
  RelatedList, RelatedRow, RelatedIcon, RelatedInfo, RelatedTitle, RelatedSubtitle, RelatedBadge, RelatedArrow,
} from './NotePanel.styles'

function NotePanel({ noteId, emptyNodeName, isFullScreen, onToggleFullScreen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, loading } = useSelector(s => s.summaryNotesV2)
  const constants = useSelector(s => s.constant.constants)

  const [nodeStats, setNodeStats] = useState(null)
  const [anatomyQuizzes, setAnatomyQuizzes] = useState([])

  useEffect(() => {
    dispatch(fetchPublicConstants(['flashcard_feature_title', 'mcq_feature_title']))
  }, [dispatch])

  useEffect(() => {
    if (noteId) {
      dispatch(fetchSummaryNoteDetailV2(noteId))
    }
  }, [noteId, dispatch])

  const nodeInfo = detail?.nodes?.[0] ?? null
  const nodeId = nodeInfo?.nodeId ?? null
  const topicSlug = nodeInfo?.path?.[0]?.slug ?? null
  const topicName = nodeInfo?.path?.[0]?.name ?? null
  const subtopicSlug = nodeInfo?.nodeSlug ?? null
  const subtopicName = nodeInfo?.nodeName ?? null

  useEffect(() => {
    if (!nodeId) {
      setNodeStats(null)
      return
    }
    dispatch(fetchNodeStats(nodeId)).then(setNodeStats)
  }, [nodeId, dispatch])

  // Anatomy quiz links live on the summary note itself (content_relations),
  // not on the node — matches what's editable in the admin's "Konten Terkait" tab.
  useEffect(() => {
    if (!detail?.uniqueId) {
      setAnatomyQuizzes([])
      return
    }
    dispatch(fetchNoteAnatomyQuizRelations(detail.uniqueId)).then(setAnatomyQuizzes)
  }, [detail?.uniqueId, dispatch])

  const parsedContent = useMemo(() => {
    if (!detail?.content) return null
    try {
      return typeof detail.content === 'string' ? JSON.parse(detail.content) : detail.content
    } catch {
      return null
    }
  }, [detail?.content])

  const breadcrumbPath = nodeInfo?.path || []

  if (!noteId) {
    return (
      <EmptyPanel>
        <EmptyIcon>{emptyNodeName ? '📭' : '📖'}</EmptyIcon>
        <EmptyText>
          {emptyNodeName
            ? `Belum ada ringkasan materi untuk "${emptyNodeName}"`
            : 'Pilih ringkasan untuk mulai membaca'}
        </EmptyText>
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

  const goToSubtopic = () => {
    if (topicSlug && subtopicSlug) navigate(`/topik/${topicSlug}/${subtopicSlug}`)
  }

  const hasTopic = !!topicName
  const hasFlashcards = (nodeStats?.flashcardCards ?? 0) > 0
  const hasMcq = (nodeStats?.mcqQuestions ?? 0) > 0
  const hasAnatomyQuizzes = anatomyQuizzes.length > 0
  const hasLinkedResources = hasTopic || hasFlashcards || hasMcq || hasAnatomyQuizzes

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
              <SectionLabel>📚 Terkait</SectionLabel>
              <SectionLine />
            </SectionRow>

            {hasTopic && (
              <LinkedGroup>
                <LinkedGroupLabel>Topik Terkait</LinkedGroupLabel>
                <LinkedGroupHint>Lihat materi subtopik ini di halaman Materi.</LinkedGroupHint>
                <RelatedList>
                  <RelatedRow $type="topic" onClick={goToSubtopic}>
                    <RelatedIcon>📁</RelatedIcon>
                    <RelatedInfo>
                      <RelatedTitle>{topicName}</RelatedTitle>
                    </RelatedInfo>
                    <RelatedBadge $type="topic">Topik</RelatedBadge>
                    <RelatedArrow>→</RelatedArrow>
                  </RelatedRow>
                </RelatedList>
              </LinkedGroup>
            )}

            {hasFlashcards && (
              <LinkedGroup>
                <LinkedGroupLabel>Related Flashcards</LinkedGroupLabel>
                <LinkedGroupHint>Kartu-kartu terkait untuk membantu retensi jangka panjang.</LinkedGroupHint>
                <RelatedList>
                  <RelatedRow
                    $type="flashcard"
                    onClick={() => navigate(`${FlashcardRoute.moduleRoute}?subtopic=${encodeURIComponent(subtopicName)}`)}
                  >
                    <RelatedIcon>🃏</RelatedIcon>
                    <RelatedInfo>
                      <RelatedTitle>{subtopicName}</RelatedTitle>
                      <RelatedSubtitle>{nodeStats.flashcardCards} kartu</RelatedSubtitle>
                    </RelatedInfo>
                    <RelatedBadge $type="flashcard">{flashcardLabel}</RelatedBadge>
                    <RelatedArrow>→</RelatedArrow>
                  </RelatedRow>
                </RelatedList>
              </LinkedGroup>
            )}

            {hasMcq && (
              <LinkedGroup>
                <LinkedGroupLabel>Related Preclinical Questions</LinkedGroupLabel>
                <LinkedGroupHint>Soal-soal {mcqLabel} untuk uji pemahamanmu.</LinkedGroupHint>
                <RelatedList>
                  <RelatedRow
                    $type="mcq"
                    onClick={() => navigate(`${MultipleChoiceRoute.moduleRoute}?subtopic=${encodeURIComponent(subtopicName)}`)}
                  >
                    <RelatedIcon>📝</RelatedIcon>
                    <RelatedInfo>
                      <RelatedTitle>{subtopicName}</RelatedTitle>
                      <RelatedSubtitle>{nodeStats.mcqQuestions} soal</RelatedSubtitle>
                    </RelatedInfo>
                    <RelatedBadge $type="mcq">{mcqLabel}</RelatedBadge>
                    <RelatedArrow>→</RelatedArrow>
                  </RelatedRow>
                </RelatedList>
              </LinkedGroup>
            )}

            {hasAnatomyQuizzes && (
              <LinkedGroup>
                <LinkedGroupLabel>Related 3D Anatomy Quizzes</LinkedGroupLabel>
                <LinkedGroupHint>Latihan identifikasi struktur pada model 3D anatomi.</LinkedGroupHint>
                <RelatedList>
                  {anatomyQuizzes.map(quiz => (
                    <RelatedRow
                      key={quiz.linkedUniqueId}
                      $type="anatomy"
                      onClick={() => navigate(generatePath(AtlasQuizRoute.anatomyQuizRoute, { slug: topicSlug, uniqueId: quiz.linkedUniqueId }))}
                    >
                      <RelatedIcon>🧠</RelatedIcon>
                      <RelatedInfo>
                        <RelatedTitle>{quiz.linkedTitle}</RelatedTitle>
                        {quiz.description && <RelatedSubtitle>{quiz.description}</RelatedSubtitle>}
                      </RelatedInfo>
                      <RelatedArrow>→</RelatedArrow>
                    </RelatedRow>
                  ))}
                </RelatedList>
              </LinkedGroup>
            )}
          </>
        )}
      </PanelContent>
    </PanelContainer>
  )
}

export default NotePanel
