import {
  Backdrop, Drawer, ResizeHandle, DrawerHeader, DrawerTitle, CloseBtn,
  TabBar, TabBtn, PanelContent,
} from './PreviewPanel.styles'
import usePreviewPanel from './hooks/usePreviewPanel'
import SummaryNotesTab from './components/SummaryNotesTab'
import FlashcardTab from './components/FlashcardTab'
import McqTab from './components/McqTab'

const TABS = [
  { key: 'flashcard',     statKey: 'flashcardCards', label: 'Flashcard' },
  { key: 'mcq',           statKey: 'mcqQuestions',   label: 'Bank Soal' },
  { key: 'summary_notes', statKey: 'summaryNotes',   label: 'Artikel' },
]

export default function PreviewPanel({ open, onClose, activeTab, onTabChange, subtopic, stats }) {
  const { width, isResizing, startResize, resetWidth } = usePreviewPanel({ open })

  if (!open) return null

  const visibleTabs = TABS.filter(t => (stats?.[t.statKey] ?? 0) > 0)

  return (
    <>
      <Backdrop onClick={onClose} />
      <Drawer $width={width}>
        {/* drag the left edge to resize; double-click snaps back to the default width */}
        <ResizeHandle
          $active={isResizing}
          onPointerDown={startResize}
          onDoubleClick={resetWidth}
          title="Geser untuk mengubah lebar panel"
        />

        <DrawerHeader>
          <DrawerTitle>{subtopic?.name} · Sumber Belajar</DrawerTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </DrawerHeader>

        <TabBar>
          {visibleTabs.map(({ key, label }) => (
            <TabBtn key={key} $active={activeTab === key} onClick={() => onTabChange(key)}>
              {label}
            </TabBtn>
          ))}
        </TabBar>

        {/* key={activeTab} remounts the tab on switch, so each tab's own hook
            resets its state naturally instead of needing a manual reset effect */}
        <PanelContent key={activeTab}>
          {activeTab === 'summary_notes' && <SummaryNotesTab subtopic={subtopic} />}
          {activeTab === 'flashcard' && <FlashcardTab subtopic={subtopic} flashcardMax={stats?.flashcardCards ?? 0} />}
          {activeTab === 'mcq' && <McqTab subtopic={subtopic} mcqMax={stats?.mcqQuestions ?? 0} />}
        </PanelContent>
      </Drawer>
    </>
  )
}
