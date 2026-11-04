import { PiBookOpenText, PiTrayArrowDown } from 'react-icons/pi'
import EmptyState from '@components/common/EmptyState'
import { EmptyPanel, EmptyGlyph } from './NoteEmptyState.styles'

export default function NoteEmptyState({ isEmptySubtopic, isNavOpen, onOpenNav }) {
  const { Icon, title, description } = isEmptySubtopic
    ? {
      Icon: PiTrayArrowDown,
      title: 'Belum ada ringkasan materi',
      description: 'Subtopik ini belum punya ringkasan. Pilih subtopik lain dari daftar materi.',
    }
    : {
      Icon: PiBookOpenText,
      title: 'Pilih ringkasan untuk mulai membaca',
      description: 'Buka topik di daftar materi, lalu pilih subtopik yang ingin kamu baca.',
    }

  return (
    <EmptyPanel>
      <EmptyState
        icon={<EmptyGlyph><Icon /></EmptyGlyph>}
        title={title}
        description={description}
        actionLabel={isNavOpen ? undefined : 'Buka Daftar Materi'}
        onAction={onOpenNav}
      />
    </EmptyPanel>
  )
}
