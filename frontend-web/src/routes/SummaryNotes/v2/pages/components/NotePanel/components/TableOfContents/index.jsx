import { PiCaretRight } from 'react-icons/pi'
import { useTableOfContents } from './hooks/useTableOfContents'
import {
  TocRail, TocHeader, TocHeaderChevron, TocHeaderLabel, TocHeaderCount, TocList, TocItem,
} from './TableOfContents.styles'

export default function TableOfContents({ outline, activeHeadingId, onJumpTo }) {
  const { isOpen, toggle } = useTableOfContents()

  return (
    <TocRail aria-label="Daftar isi">
      <TocHeader onClick={toggle} aria-expanded={isOpen}>
        <TocHeaderChevron $open={isOpen}><PiCaretRight /></TocHeaderChevron>
        <TocHeaderLabel>Di halaman ini</TocHeaderLabel>
        <TocHeaderCount>{outline.length}</TocHeaderCount>
      </TocHeader>

      <TocList $open={isOpen}>
        {outline.map(heading => (
          <TocItem
            key={heading.id}
            $level={heading.level}
            $active={heading.id === activeHeadingId}
            onClick={() => onJumpTo(heading.id)}
            title={heading.text}
          >
            {heading.text}
          </TocItem>
        ))}
      </TocList>
    </TocRail>
  )
}
