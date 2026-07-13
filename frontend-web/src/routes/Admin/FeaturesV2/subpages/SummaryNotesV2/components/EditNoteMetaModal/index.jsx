import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSummaryNote, fetchAdminSummaryNotes } from '@store/summaryNotes/adminAction'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { StatusToggle, StatusOption } from '../NoteDetailPage/NoteDetailPage.styles'

function EditNoteMetaModal({ note, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.summaryNotes)

  const [title, setTitle] = useState(note.title || '')
  const [description, setDescription] = useState(note.description || '')
  const [status, setStatus] = useState(
    note.isActive === false ? 'inactive' : (note.status || 'draft')
  )
  const [titleError, setTitleError] = useState('')

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Judul wajib diisi')
      return
    }
    setTitleError('')

    await dispatch(updateSummaryNote(note.uniqueId, {
      title: title.trim(),
      description: description.trim(),
      status: status === 'inactive' ? 'draft' : status,
      isActive: status !== 'inactive',
    }))

    dispatch(fetchAdminSummaryNotes({ perPage: 500 }))
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

        <div>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>
            Status
          </label>
          <StatusToggle>
            {['draft', 'testing', 'published'].map(s => (
              <StatusOption key={s} $checked={status === s}>
                <input
                  type="radio"
                  name="edit-note-meta-status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </StatusOption>
            ))}
          </StatusToggle>
        </div>
      </div>
    </Modal>
  )
}

export default EditNoteMetaModal
