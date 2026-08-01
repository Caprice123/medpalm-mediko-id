import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchRecentlyViewed } from '@store/summaryNotes/v2/userAction'
import CurriculumSidebar from './components/CurriculumSidebar'
import NotePanel from './components/NotePanel'
import { PageWrapper, SidebarWrapper, PanelWrapper, MobileOverlay } from './index.styles'

function SummaryNotesV2Page() {
  const { id: initialId } = useParams()
  const dispatch = useDispatch()
  const [selectedNoteId, setSelectedNoteId] = useState(initialId || null)
  const [emptySubtopic, setEmptySubtopic] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  useEffect(() => {
    dispatch(fetchRecentlyViewed())
  }, [dispatch])

  const handleSelectNote = (noteId) => {
    setEmptySubtopic(null)
    setSelectedNoteId(noteId)
  }

  const handleSelectEmptyNode = (node) => {
    setSelectedNoteId(null)
    setEmptySubtopic(node)
  }

  return (
    <PageWrapper>
      {!isFullScreen && (
        <SidebarWrapper>
          <CurriculumSidebar
            selectedNoteId={selectedNoteId}
            selectedEmptyNodeId={emptySubtopic?.id ?? null}
            onSelectNote={handleSelectNote}
            onSelectEmptyNode={handleSelectEmptyNode}
          />
        </SidebarWrapper>
      )}
      <PanelWrapper>
        <NotePanel
          noteId={selectedNoteId}
          emptyNodeName={emptySubtopic?.name ?? null}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen(p => !p)}
        />
      </PanelWrapper>
    </PageWrapper>
  )
}

export default SummaryNotesV2Page
