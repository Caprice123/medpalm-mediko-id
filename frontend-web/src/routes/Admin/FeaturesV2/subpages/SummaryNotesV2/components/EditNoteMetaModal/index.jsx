import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSummaryNoteV2, fetchAdminSummaryNotesV2 } from '@store/summaryNotes/v2/adminAction'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'

function EditNoteMetaModal({ note, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.summaryNotesV2)

  const [title, setTitle] = useState(note.title || '')
  const [description, setDescription] = useState(note.description || '')
  const [titleError, setTitleError] = useState('')

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Judul wajib diisi')
      return
    }
    setTitleError('')

    await dispatch(updateSummaryNoteV2(note.uniqueId, {
      title: title.trim(),
      description: description.trim(),
      status: 'published',
      isActive: true,
    }))

    dispatch(fetchAdminSummaryNotesV2({ perPage: 500 }))
    onClose()
  }

  const isSaving = loading?.isUpdating

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Edit Ringkasan"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <TextInput
          label="Judul"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Masukkan judul ringkasan"
          error={titleError}
        />

        <Textarea
          label="Deskripsi"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Deskripsi singkat tentang ringkasan ini"
          rows={3}
        />
      </div>
    </Modal>
  )
}

export default EditNoteMetaModal
