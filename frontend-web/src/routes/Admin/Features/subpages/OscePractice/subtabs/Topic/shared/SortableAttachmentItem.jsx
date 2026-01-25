import { useSortable } from "@dnd-kit/sortable"
import { AttachmentItem, DragHandle } from "../components/CreateTopicModal/CreateTopicModal.styles"
import { PhotoProvider, PhotoView } from "react-photo-view"
import FileUpload from "../../../../../../../../components/common/FileUpload"
import Button from '@components/common/Button'
import { CSS } from "@dnd-kit/utilities"
import { useMemo } from "react"

function SortableAttachmentItem({ attachment, index, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attachment.blobId || index })

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }), [transform, transition, isDragging])

  return (
    <AttachmentItem ref={setNodeRef} style={style}>
      <DragHandle {...attributes} {...listeners}>
        ⋮⋮
      </DragHandle>
        <PhotoProvider>
          <FileUpload
            file={attachment.blobId ? {
              name: attachment.filename || 'File name',
              type: 'image/*',
              size: attachment.size
            } : null}
            onRemove={() => onRemove(index)}
            actions={
            <>
                {attachment.url && (
                <PhotoView src={attachment.url}>
                    <Button variant="primary" type="button">
                    👁️ Preview
                    </Button>
                </PhotoView>
                )}
            </>
            }
          />
        </PhotoProvider>
    </AttachmentItem>
  )
}

export default SortableAttachmentItem
