import { useCollapsibleNoteSection } from './hooks/useCollapsibleNoteSection'
import { CollapsibleWrap, SectionListArea, Header, HeaderLabel, CollapseChevron, NoteItemRow } from './CollapsibleNoteSection.styles'

export default function CollapsibleNoteSection({ source, selectedNoteId, onSelectNote }) {
  const { items, isOpen, toggle, icon, label } = useCollapsibleNoteSection(source)

  if (items.length === 0) return null

  return (
    <CollapsibleWrap>
      <Header onClick={toggle}>
        <HeaderLabel>{icon} {label}</HeaderLabel>
        <CollapseChevron $open={isOpen}>▶</CollapseChevron>
      </Header>
      <SectionListArea $open={isOpen}>
        {items.map(item => (
          <NoteItemRow
            key={item.key}
            $selected={item.uniqueId === selectedNoteId}
            onClick={() => onSelectNote(item.uniqueId)}
          >
            {item.title}
          </NoteItemRow>
        ))}
      </SectionListArea>
    </CollapsibleWrap>
  )
}
