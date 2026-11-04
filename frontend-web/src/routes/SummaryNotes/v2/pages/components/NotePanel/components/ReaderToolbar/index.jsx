import { PiSidebarSimple, PiStar, PiStarFill } from 'react-icons/pi'
import Breadcrumb from '@components/common/Breadcrumb'
import { useReaderFavorite } from './hooks/useReaderFavorite'
import ReadingControls from './components/ReadingControls'
import { Toolbar, CrumbArea, ToolbarActions, IconButton } from './ReaderToolbar.styles'

export default function ReaderToolbar({
  note, breadcrumbPath, isNavOpen, onToggleNav, readingPreferences,
}) {
  const { isFavorited, isToggling, handleToggle } = useReaderFavorite(note)
  const navLabel = isNavOpen ? 'Sembunyikan daftar materi' : 'Tampilkan daftar materi'

  return (
    <Toolbar>
      <IconButton $active={isNavOpen} onClick={onToggleNav} title={navLabel} aria-label={navLabel}>
        <PiSidebarSimple />
      </IconButton>

      <CrumbArea>
        <Breadcrumb items={breadcrumbPath.map(crumb => ({ label: crumb.name, key: crumb.id }))} />
      </CrumbArea>

      <ToolbarActions>
        <IconButton
          $warm={isFavorited}
          disabled={isToggling}
          onClick={handleToggle}
          title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          {isFavorited ? <PiStarFill /> : <PiStar />}
        </IconButton>

        <ReadingControls
          fontScale={readingPreferences.fontScale}
          canDecreaseFont={readingPreferences.canDecreaseFont}
          canIncreaseFont={readingPreferences.canIncreaseFont}
          onDecreaseFont={readingPreferences.decreaseFont}
          onIncreaseFont={readingPreferences.increaseFont}
        />
      </ToolbarActions>
    </Toolbar>
  )
}
