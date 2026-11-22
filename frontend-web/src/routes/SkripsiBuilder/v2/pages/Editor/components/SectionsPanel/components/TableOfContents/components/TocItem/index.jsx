import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaGripVertical, FaArrowUp, FaArrowDown, FaLock } from 'react-icons/fa'
import {
  Row, Grip, Jump, Number, Title, MoveActions, MoveButton,
} from './TocItem.styles'

// One line of the outline: grab it to move the section, click it to go there.
// The arrows do the same move one step at a time — a drag is quicker across a
// long report, but it needs a pointer, and it is not obvious it is possible.
const TocItem = ({ section, number, isActive, isFirst, isLast, onJump, onMove }) => {
  // The Referensi entry stays at the bottom: nothing to grab, nothing to step.
  const isLocked = Boolean(section.isReferenceSlot)

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: section.id, disabled: isLocked })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Row ref={setNodeRef} style={style} $active={isActive}>
      {isLocked ? (
        <Grip as="span" $locked title="Bagian Referensi selalu di akhir">
          <FaLock />
        </Grip>
      ) : (
        <Grip
          type="button"
          title="Geser untuk memindahkan bagian"
          aria-label="Geser untuk memindahkan bagian"
          {...attributes}
          {...listeners}
        >
          <FaGripVertical />
        </Grip>
      )}

      <Jump type="button" $active={isActive} onClick={() => onJump(section.id)}>
        <Number>{number}</Number>
        <Title>{section.title}</Title>
      </Jump>

      <MoveActions>
        <MoveButton
          type="button"
          title="Naikkan bagian"
          aria-label="Naikkan bagian"
          disabled={isFirst || isLocked}
          onClick={() => onMove(section.id, -1)}
        >
          <FaArrowUp />
        </MoveButton>
        <MoveButton
          type="button"
          title="Turunkan bagian"
          aria-label="Turunkan bagian"
          disabled={isLast || isLocked}
          onClick={() => onMove(section.id, 1)}
        >
          <FaArrowDown />
        </MoveButton>
      </MoveActions>
    </Row>
  )
}

export default TocItem
