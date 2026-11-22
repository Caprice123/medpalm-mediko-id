import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FaChevronDown, FaChevronRight, FaListUl } from 'react-icons/fa'
import TocItem from './components/TocItem'
import { useTableOfContents } from './hooks/useTableOfContents'
import {
  Outline, HeaderRow, ToggleRow, ToggleLabel, Count, List, Hint,
} from './TableOfContents.styles'

// The report's outline: where everything is, which part is on screen, and the
// one place sections are re-ordered as a whole rather than one step at a time.
//
// Beside the sheet when the pane can afford the column, across the top of it
// when it cannot — the same card either way. As a rail it is simply open;
// as a strip it collapses, because there the width it borrows is the width the
// prose was using.
const TableOfContents = ({ sections, isRail, onReorder, onMove }) => {
  const { isOpen, toggle, activeId, sensors, handleDragEnd, jumpTo } = useTableOfContents({
    sections,
    isRail,
    onReorder,
  })

  // Referensi is left out of the sortable list: it closes the report, so it is
  // neither draggable nor a place another section can be dropped onto.
  const sectionIds = sections
    .filter(section => !section.isReferenceSlot)
    .map(section => section.id)

  const referenceIndex = sections.findIndex(section => section.isReferenceSlot)
  const lastMovableIndex = referenceIndex === -1 ? sections.length - 1 : referenceIndex - 1

  return (
    <Outline $rail={isRail}>
      {isRail ? (
        <HeaderRow>
          <FaListUl />
          <ToggleLabel>Daftar Isi</ToggleLabel>
          <Count>{sections.length}</Count>
        </HeaderRow>
      ) : (
        <ToggleRow type="button" onClick={toggle} aria-expanded={isOpen}>
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          <FaListUl />
          <ToggleLabel>Daftar Isi</ToggleLabel>
          <Count>{sections.length} bagian</Count>
        </ToggleRow>
      )}

      {isOpen && (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              <List $rail={isRail}>
                {sections.map((section, index) => (
                  <TocItem
                    key={section.id}
                    section={section}
                    number={index + 1}
                    isActive={section.id === activeId}
                    isFirst={index === 0}
                    isLast={index >= lastMovableIndex}
                    onJump={jumpTo}
                    onMove={onMove}
                  />
                ))}
              </List>
            </SortableContext>
          </DndContext>

          <Hint>Geser ⠿ atau pakai ↑ ↓ untuk menukar urutan bagian.</Hint>
        </>
      )}
    </Outline>
  )
}

export default TableOfContents
