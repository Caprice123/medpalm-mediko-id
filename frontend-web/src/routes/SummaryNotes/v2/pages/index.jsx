import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchRecentlyViewed } from '@store/summaryNotes/v2/userAction'
import CurriculumSidebar from './components/CurriculumSidebar'
import NotePanel from './components/NotePanel'
import { PageWrapper, SidebarWrapper, PanelWrapper } from './index.styles'

function SummaryNotesV2Page() {
  const { id: initialId } = useParams()
  const dispatch = useDispatch()
  const [selectedNoteId, setSelectedNoteId] = useState(initialId || null)
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    dispatch(fetchRecentlyViewed())
  }, [dispatch])

  return (
    <PageWrapper>
      {!isFullScreen && (
        <SidebarWrapper>
          <CurriculumSidebar
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
          />
        </SidebarWrapper>
      )}
      <PanelWrapper>
        <NotePanel
          noteId={selectedNoteId}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setIsFullScreen(p => !p)}
        />
      </PanelWrapper>
    </PageWrapper>
  )
}

export default SummaryNotesV2Page
