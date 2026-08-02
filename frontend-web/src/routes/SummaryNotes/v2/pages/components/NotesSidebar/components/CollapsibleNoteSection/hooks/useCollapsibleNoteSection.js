import { useSelector } from 'react-redux'
import { useStoredOpen } from '../../../hooks/useStoredOpen'

const SOURCES = {
  favorites: {
    storageKey: 'summaryNotesV2_favOpen',
    icon: '⭐',
    label: 'Favorit',
    select: s => (s.favorites.favoriteItems['summary_note'] || [])
      .map(item => ({ key: item.record_id, uniqueId: item.metadata?.uniqueId, title: item.metadata?.title })),
  },
  recent: {
    storageKey: 'summaryNotesV2_recentOpen',
    icon: '🕐',
    label: 'Terakhir Dilihat',
    select: s => (s.summaryNotesV2.recentlyViewed || [])
      .map(item => ({ key: item.id, uniqueId: item.metadata?.uniqueId, title: item.metadata?.title })),
  },
}

export function useCollapsibleNoteSection(source) {
  const config = SOURCES[source]
  const items = useSelector(config.select)
  const [isOpen, toggle] = useStoredOpen(config.storageKey)

  return { items, isOpen, toggle, icon: config.icon, label: config.label }
}
