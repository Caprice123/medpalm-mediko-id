import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchRecentlyViewed } from '@store/summaryNotes/v2/userAction'
import NotesSidebar from './components/NotesSidebar'
import NotePanel from './components/NotePanel'
import { PageWrapper, SidebarWrapper, PanelWrapper } from './index.styles'

function SummaryNotesV2Page() {
  const { id: initialId } = useParams()
  const dispatch = useDispatch()
  const [selectedNoteId, setSelectedNoteId] = useState(initialId || null)
  const [emptySubtopicId, setEmptySubtopicId] = useState(null)
  const [isFullScreen, setIsFullScreen] = useState(false)
  useEffect(() => {
    dispatch(fetchRecentlyViewed())
  }, [dispatch])

  const handleSelectNote = (noteId) => {
    setEmptySubtopicId(null)
    setSelectedNoteId(noteId)
  }

  const handleSelectEmptyNode = (nodeId) => {
    setSelectedNoteId(null)
    setEmptySubtopicId(nodeId)
  }

  return (
    <PageWrapper>
      {!isFullScreen && (
        <SidebarWrapper>
          <NotesSidebar
            selectedNoteId={selectedNoteId}
            selectedEmptyNodeId={emptySubtopicId}
            onSelectNote={handleSelectNote}
            onSelectEmptyNode={handleSelectEmptyNode}
          />
        </SidebarWrapper>
      )}
      <PanelWrapper>
        <NotePanel
          noteId={selectedNoteId}
          isEmptySubtopic={!!emptySubtopicId}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen(p => !p)}
        />
      </PanelWrapper>
    </PageWrapper>
  )
}

export default SummaryNotesV2Page
