import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeCard, updateNodeCard } from '@store/nodeCards'
import { upload } from '@store/common/action'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import FileUpload from '@components/common/FileUpload'

function CardFormModal({ nodeId, card, onClose, onSuccess, onSave, isSavingOverride }) {
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
    references: [],
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        front: card.front,
        back: card.back,
        blobId: card.imageBlobId ?? null,
        imagePreviewUrl: card.imageUrl ?? null,
        imageFilename: null,
        references: Array.isArray(card.references) ? card.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
      })
    }
  }, [isEdit, card])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addReference = () => setForm(f => ({ ...f, references: [...f.references, { label: '', url: '' }] }))
  const setReference = (index, key, val) =>
    setForm(f => {
      const references = [...f.references]
      references[index] = { ...references[index], [key]: val }
      return { ...f, references }
    })
  const removeReference = (index) => setForm(f => ({ ...f, references: f.references.filter((_, i) => i !== index) }))

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
    const payload = {
      front: form.front,
      back: form.back,
      blobId: form.blobId,
      references: form.references
        .filter(r => r.label.trim() || r.url.trim())
        .map(r => ({ label: r.label.trim(), url: r.url.trim() || undefined })),
    }
    if (onSave) {
      onSave(payload, onSuccess)
    } else if (isEdit) {
      dispatch(updateNodeCard(nodeId, card.id, payload, onSuccess))
    } else {
      dispatch(addNodeCard(nodeId, payload, onSuccess))
    }
  }

  const isSaving = isSavingOverride ?? (isEdit ? loading.isUpdatingCard : loading.isAddingCard)
  const isUploading = commonLoading?.isUploading

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Edit Kartu' : 'Tambah Kartu Baru'}
      size="medium"
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

        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
            Referensi (opsional)
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {form.references.map((ref, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <TextInput value={ref.label} onChange={e => setReference(i, 'label', e.target.value)} placeholder="Nama sumber" />
                <TextInput value={ref.url} onChange={e => setReference(i, 'url', e.target.value)} placeholder="Link (opsional)" />
                <Button variant="danger" onClick={() => removeReference(i)}>Hapus</Button>
              </div>
            ))}
            <Button onClick={addReference}>+ Tambah Referensi</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CardFormModal
