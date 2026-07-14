import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createSummaryNoteV2 } from '@store/summaryNotes/v2/adminAction'
import { createNodeRecord, fetchNodeRecords } from '@store/featureNodes'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { FormSection, Label, StatusToggle, StatusOption } from '../NoteDetailPage/NoteDetailPage.styles'

function CreateNoteModalV2({ nodeId, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.summaryNotesV2)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('draft')
  const [titleError, setTitleError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Judul wajib diisi')
      return
    }
    setTitleError('')
    const note = await dispatch(createSummaryNoteV2({
      title: title.trim(),
      description: description.trim(),
      status,
      content: JSON.stringify([]),
      isActive: true,
      tagIds: [],
      blobId: null,
      flashcardDeckIds: [],
      mcqTopicIds: [],
    }))
    if (nodeId && note?.id) {
      await dispatch(createNodeRecord({ nodeId, recordType: 'summary_note', recordId: note.id }))
      dispatch(fetchNodeRecords('summary_note'))
    }
    onClose(note)
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Buat Ringkasan Baru"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading.isCreating}>
            {loading.isCreating ? 'Menyimpan...' : 'Buat Ringkasan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <TextInput
          label="Judul"
          required
          value={title}
          onChange={e => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError('') }}
          placeholder="Masukkan judul ringkasan"
          error={titleError}
        />
      </FormSection>

      <FormSection>
        <Textarea
          label="Deskripsi"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Deskripsi singkat tentang ringkasan ini"
          rows={3}
        />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <StatusToggle>
          {['draft', 'testing', 'published'].map(s => (
            <StatusOption key={s} $checked={status === s} onClick={() => setStatus(s)}>
              <input
                type="radio"
                name="create-note-status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
              />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </StatusOption>
          ))}
        </StatusToggle>
      </FormSection>
    </Modal>
  )
}

export default CreateNoteModalV2
