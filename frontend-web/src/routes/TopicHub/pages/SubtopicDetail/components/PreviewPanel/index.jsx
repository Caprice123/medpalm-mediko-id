import { useEffect } from 'react'
import {
  Backdrop, Drawer, DrawerHeader, DrawerTitle, CloseBtn,
  TabBar, TabBtn, PanelContent,
} from './PreviewPanel.styles'
import SummaryNotesTab from './components/SummaryNotesTab'
import FlashcardTab from './components/FlashcardTab'
import McqTab from './components/McqTab'

const TABS = [
  { key: 'flashcard',     statKey: 'flashcardCards', label: 'Flashcard' },
  { key: 'mcq',           statKey: 'mcqQuestions',   label: 'Bank Soal' },
  { key: 'summary_notes', statKey: 'summaryNotes',   label: 'Artikel' },
]

export default function PreviewPanel({ open, onClose, activeTab, onTabChange, subtopic, stats }) {
  // lock the body while the drawer is open so the page underneath can't scroll
  useEffect(() => {
    if (!open) return
    const prevHeight = document.body.style.height
    const prevOverflow = document.body.style.overflow
    document.body.style.height = '100vh'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.height = prevHeight
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) return null

  const visibleTabs = TABS.filter(t => (stats?.[t.statKey] ?? 0) > 0)

  return (
    <>
      <Backdrop onClick={onClose} />
      <Drawer>
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
