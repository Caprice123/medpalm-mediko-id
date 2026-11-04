import { PiCaretRight } from 'react-icons/pi'
import { useCollapsibleNoteSection } from './hooks/useCollapsibleNoteSection'
import {
  CollapsibleWrap, Header, HeaderIcon, HeaderLabel, HeaderCount,
  CollapseChevron, SectionListArea, NoteItemRow,
} from './CollapsibleNoteSection.styles'

export default function CollapsibleNoteSection({ source, selectedNoteId, onSelectNote }) {
  const { items, isOpen, toggle, Icon, label } = useCollapsibleNoteSection(source)

  if (items.length === 0) return null

  return (
    <CollapsibleWrap>
      <Header onClick={toggle} aria-expanded={isOpen}>
        <CollapseChevron $open={isOpen}><PiCaretRight /></CollapseChevron>
        <HeaderIcon $warm={source === 'favorites'}><Icon /></HeaderIcon>
        <HeaderLabel>{label}</HeaderLabel>
        <HeaderCount>{items.length}</HeaderCount>
      </Header>
      <SectionListArea $open={isOpen}>
        {items.map(item => (
          <NoteItemRow
            key={item.key}
            $selected={item.uniqueId === selectedNoteId}
            title={item.title}
            onClick={() => onSelectNote(item.uniqueId)}
          >
            {item.title}
          </NoteItemRow>
        ))}
      </SectionListArea>
    </CollapsibleWrap>
  )
}
