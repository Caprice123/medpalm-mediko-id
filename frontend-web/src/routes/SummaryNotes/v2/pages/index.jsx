import { useSummaryNotesPage } from './hooks/useSummaryNotesPage'
import { useResizableSidebar } from './hooks/useResizableSidebar'
import NotesSidebar from './components/NotesSidebar'
import NotePanel from './components/NotePanel'
import { PageShell, SidebarPane, ResizeHandle, NavScrim, ReaderPane } from './index.styles'

function SummaryNotesV2Page() {
  const {
    selectedNoteId, emptyNodeId, isNavOpen,
    selectNote, selectEmptyNode, toggleNav, closeNav,
  } = useSummaryNotesPage()
  const { width, isDragging, paneRef, handleDragStart, handleResetWidth } = useResizableSidebar()

  return (
    <PageShell>
      <NavScrim $open={isNavOpen} onClick={closeNav} />

      <SidebarPane ref={paneRef} $width={width} $open={isNavOpen} $dragging={isDragging}>
        <NotesSidebar
          selectedNoteId={selectedNoteId}
          selectedEmptyNodeId={emptyNodeId}
          onSelectNote={selectNote}
          onSelectEmptyNode={selectEmptyNode}
          onClose={closeNav}
        />
      </SidebarPane>

      {isNavOpen && (
        <ResizeHandle
          $active={isDragging}
          onPointerDown={handleDragStart}
          onDoubleClick={handleResetWidth}
          role="separator"
          aria-orientation="vertical"
          title="Geser untuk mengubah lebar — klik dua kali untuk atur ulang"
        />
      )}

      <ReaderPane>
        <NotePanel
          noteId={selectedNoteId}
          isEmptySubtopic={!!emptyNodeId}
          isNavOpen={isNavOpen}
          onToggleNav={toggleNav}
          onSelectNote={selectNote}
        />
      </ReaderPane>
    </PageShell>
  )
}

export default SummaryNotesV2Page
