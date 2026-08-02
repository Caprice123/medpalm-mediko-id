import { NotePanelLoadingSkeleton } from './NotePanelLoadingSkeleton'
import { useNotePanel } from './hooks/useNotePanel'
import NoteEmptyState from './components/NoteEmptyState'
import NoteHeader from './components/NoteHeader'
import NoteContent from './components/NoteContent'
import NoteReferenceSection from './components/NoteReferenceSection'
import LinkedResourcesSection from './components/LinkedResourcesSection'
import { PanelContainer, PanelContent } from './NotePanel.styles'

function NotePanel({ noteId, emptyNodeName, isFullScreen, onToggleFullScreen }) {
  const {
    detail, isLoading, parsedContent, breadcrumbPath,
    topicSlug, topicName, subtopicSlug, subtopicName,
    nodeStats, anatomyQuizzes,
    flashcardLabel, mcqLabel,
    hasTopic, hasFlashcards, hasMcq, hasAnatomyQuizzes, hasLinkedResources,
  } = useNotePanel(noteId)

  if (!noteId) {
    return <NoteEmptyState emptyNodeName={emptyNodeName} />
  }

  if (isLoading || !detail) {
    return (
      <PanelContainer>
        <NotePanelLoadingSkeleton />
      </PanelContainer>
    )
  }

  return (
    <PanelContainer>
      <NoteHeader
        breadcrumbPath={breadcrumbPath}
        title={detail.title}
        isFullScreen={isFullScreen}
        onToggleFullScreen={onToggleFullScreen}
      />

      <PanelContent>
        <NoteContent title={detail.title} description={detail.description} parsedContent={parsedContent} />

        <NoteReferenceSection sourceDocument={detail.sourceDocument} />

        {hasLinkedResources && (
          <LinkedResourcesSection
            topicSlug={topicSlug}
            topicName={topicName}
            subtopicSlug={subtopicSlug}
            subtopicName={subtopicName}
            nodeStats={nodeStats}
            anatomyQuizzes={anatomyQuizzes}
            flashcardLabel={flashcardLabel}
            mcqLabel={mcqLabel}
            hasTopic={hasTopic}
            hasFlashcards={hasFlashcards}
            hasMcq={hasMcq}
            hasAnatomyQuizzes={hasAnatomyQuizzes}
          />
        )}
      </PanelContent>
    </PanelContainer>
  )
}

export default NotePanel
