import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeCard, updateNodeCard } from '@store/nodeCards'
import { upload } from '@store/common/action'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'

function CardFormModal({ nodeId, card, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeCards)
  const { loading: commonLoading } = useSelector(state => state.common)

  const isEdit = !!card
  const [form, setForm] = useState({
    front: '',
    back: '',
    blobId: null,
    imagePreviewUrl: null,
    imageFilename: null,
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        front: card.front,
        back: card.back,
        blobId: card.imageBlobId ?? null,
        imagePreviewUrl: card.imageUrl ?? null,
        imageFilename: null,
      })
    }
  }, [isEdit, card])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'flashcard-v2'))
    setForm(f => ({ ...f, blobId: result.blobId, imagePreviewUrl: result.url, imageFilename: result.filename }))
  }

  const handleRemoveImage = () => setForm(f => ({ ...f, blobId: null, imagePreviewUrl: null, imageFilename: null }))

  const handleSubmit = () => {
    if (!form.front.trim() || !form.back.trim()) {
      alert('Front dan back wajib diisi')
      return
    }
    const payload = { front: form.front, back: form.back, blobId: form.blobId }
    if (isEdit) {
      dispatch(updateNodeCard(nodeId, card.id, payload, onSuccess))
    } else {
      dispatch(addNodeCard(nodeId, payload, onSuccess))
    }
  }

  const isSaving = isEdit ? loading.isUpdatingCard : loading.isAddingCard
  const isUploading = commonLoading?.isUploading

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Kartu' : 'Tambah Kartu Baru'}
      size="small"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving || isUploading}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Front *
          </label>
          <Textarea
            value={form.front}
            onChange={e => set('front', e.target.value)}
            placeholder="Pertanyaan atau istilah"
            rows={3}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Gambar (opsional)
          </label>
          <FileUpload
            file={form.blobId ? { name: form.imageFilename || 'Gambar kartu', type: 'image/jpeg' } : null}
            onFileSelect={handleImageUpload}
            onRemove={handleRemoveImage}
            isUploading={isUploading}
            acceptedTypes={['image/*']}
            acceptedTypesLabel="PNG, JPG, GIF"
            maxSizeMB={5}
            uploadText="Klik untuk upload gambar"
            actions={form.imagePreviewUrl
              ? <Button variant="primary" size="small" onClick={() => window.open(form.imagePreviewUrl, '_blank')}>Lihat</Button>
              : null
            }
          />
        </div>

        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Back *
          </label>
          <Textarea
            value={form.back}
            onChange={e => set('back', e.target.value)}
            placeholder="Jawaban atau definisi"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  )
}

export default CardFormModal
