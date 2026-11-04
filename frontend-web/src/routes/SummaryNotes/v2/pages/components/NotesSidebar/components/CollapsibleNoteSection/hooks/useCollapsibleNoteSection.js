import { useSelector } from 'react-redux'
import { PiClockCounterClockwise, PiStarFill } from 'react-icons/pi'
import { useStoredOpen } from '../../../hooks/useStoredOpen'

const SOURCES = {
  favorites: {
    storageKey: 'summaryNotesV2_favOpen',
    Icon: PiStarFill,
    label: 'Favorit',
    select: s => (s.favorites.favoriteItems['summary_note'] || [])
      .map(item => ({ key: item.record_id, uniqueId: item.metadata?.uniqueId, title: item.metadata?.title })),
  },
  recent: {
    storageKey: 'summaryNotesV2_recentOpen',
    Icon: PiClockCounterClockwise,
    label: 'Terakhir Dilihat',
    select: s => (s.summaryNotesV2.recentlyViewed || [])
      .map(item => ({ key: item.id, uniqueId: item.metadata?.uniqueId, title: item.metadata?.title })),
  },
}

export function useCollapsibleNoteSection(source) {
  const config = SOURCES[source]
  const items = useSelector(config.select)
  const [isOpen, toggle] = useStoredOpen(config.storageKey)

  // Entries written before a note had its uniqueId recorded would render a row that
  // does nothing when clicked, so drop them rather than show a dead shortcut.
  const openableItems = items.filter(item => item.uniqueId && item.title)

  return { items: openableItems, isOpen, toggle, Icon: config.Icon, label: config.label }
}
