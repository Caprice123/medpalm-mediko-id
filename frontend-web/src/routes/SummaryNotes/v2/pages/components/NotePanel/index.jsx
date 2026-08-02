import { useSelector } from 'react-redux'
import { NotePanelLoadingSkeleton } from './NotePanelLoadingSkeleton'
import { useNotePanel } from './hooks/useNotePanel'
import NoteEmptyState from './components/NoteEmptyState'
import NoteHeader from './components/NoteHeader'
import NoteContent from './components/NoteContent'
import NoteReferenceSection from './components/NoteReferenceSection'
import LinkedResourcesSection from './components/LinkedResourcesSection'
import { PanelContainer, PanelContent } from './NotePanel.styles'

function NotePanel({ noteId, isEmptySubtopic, isFullScreen, onToggleFullScreen }) {
  const isLoading = useSelector(s => s.summaryNotesV2.loading.isNoteDetailLoading)
  const {
    detail, parsedContent, breadcrumbPath,
    topicSlug, topicName, subtopicSlug, subtopicName,
  } = useNotePanel(noteId)

  if (!noteId) {
    return <NoteEmptyState isEmptySubtopic={isEmptySubtopic} />
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

        <LinkedResourcesSection
          topicSlug={topicSlug}
          topicName={topicName}
          subtopicSlug={subtopicSlug}
          subtopicName={subtopicName}
        />
      </PanelContent>
    </PanelContainer>
  )
}

export default NotePanel
