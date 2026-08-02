import { EmptyPanel, EmptyIcon, EmptyText } from './NoteEmptyState.styles'

export default function NoteEmptyState({ emptyNodeName }) {
  return (
    <EmptyPanel>
      <EmptyIcon>{emptyNodeName ? '📭' : '📖'}</EmptyIcon>
      <EmptyText>
        {emptyNodeName
          ? `Belum ada ringkasan materi untuk "${emptyNodeName}"`
          : 'Pilih ringkasan untuk mulai membaca'}
      </EmptyText>
    </EmptyPanel>
  )
}
