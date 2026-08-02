import Breadcrumb from '@components/common/Breadcrumb'
import { TopBar, FullScreenBtn } from './NoteHeader.styles'

export default function NoteHeader({ breadcrumbPath, title, isFullScreen, onToggleFullScreen }) {
  return (
    <TopBar>
      <Breadcrumb items={[
        ...breadcrumbPath.map(crumb => ({ label: crumb.name, key: crumb.id })),
        { label: title },
      ]} />
      <FullScreenBtn onClick={onToggleFullScreen}>
        {isFullScreen ? '⊠ Keluar Layar Penuh' : '⊡ Layar Penuh'}
      </FullScreenBtn>
    </TopBar>
  )
}
