import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSelector } from 'react-redux'
import { AttachmentsList, AttachmentsSection, HelpText } from '../components/CreateTopicModal/CreateTopicModal.styles'
import FileUpload from '../../../../../../../../components/common/FileUpload'
import SortableAttachmentItem from './SortableAttachmentItem'
import { memo } from 'react'

const AttachmentSection = ({ attachments, handleMultipleFilesSelect, handleRemoveAttachment, handleDragEnd }) => {
  const { loading } = useSelector(state => state.common)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    )

  return (
    <AttachmentsSection>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            Attachments (Images)
        </label>
        <HelpText style={{ marginBottom: '0.75rem' }}>
            Upload supporting images for this OSCE case (e.g., X-rays, ECG, lab results). Max 5MB per image. Drag to reorder.
        </HelpText>

        <FileUpload
            onFileSelect={handleMultipleFilesSelect}
            isUploading={loading.isUploadingImage}
            acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
            acceptedTypesLabel="JPEG atau PNG"
            maxSizeMB={5}
            uploadText="Klik untuk upload gambar"
            multiple
        />

        {attachments.length > 0 && (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
            <SortableContext
                items={attachments.map((att, idx) => att.blobId || idx)}
                strategy={verticalListSortingStrategy}
            >
                <AttachmentsList>
                {attachments.map((attachment, index) => (
                    <SortableAttachmentItem
                    key={attachment.blobId || index}
                    attachment={attachment}
                    index={index}
                    onRemove={handleRemoveAttachment}
                    />
                ))}
                </AttachmentsList>
            </SortableContext>
            </DndContext>
        )}
    </AttachmentsSection>
  )
}

export default memo(AttachmentSection, (prevProps, nextProps) => {
    // Deep comparison of attachments array
    const prevAttachments = prevProps.attachments
    const nextAttachments = nextProps.attachments

    if (prevAttachments.length !== nextAttachments.length) return false

    return prevAttachments.every((prev, index) => {
        const next = nextAttachments[index]
        return prev.blobId === next.blobId &&
               prev.filename === next.filename &&
               prev.order === next.order
    })
})