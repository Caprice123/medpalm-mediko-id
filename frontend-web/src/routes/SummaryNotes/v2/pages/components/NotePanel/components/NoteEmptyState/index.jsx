import { EmptyPanel, EmptyIcon, EmptyText } from './NoteEmptyState.styles'

export default function NoteEmptyState({ isEmptySubtopic }) {
  return (
    <EmptyPanel>
      <EmptyIcon>{isEmptySubtopic ? '📭' : '📖'}</EmptyIcon>
      <EmptyText>
        {isEmptySubtopic
          ? 'Belum ada ringkasan materi'
          : 'Pilih ringkasan untuk mulai membaca'}
      </EmptyText>
    </EmptyPanel>
  )
}
