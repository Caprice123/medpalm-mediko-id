import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import FileUpload from '@components/common/FileUpload'
import Dropdown from '@components/common/Dropdown'
import ClozeEditor from './components/ClozeEditor'
import OcclusionEditor from './components/OcclusionEditor'
import { useCardFormModal } from './hooks/useCardFormModal'

const TYPE_OPTIONS = [
  { value: 'basic', label: 'Basic (Tanya-Jawab)' },
  { value: 'cloze', label: 'Cloze (Isian)' },
  { value: 'occlusion', label: 'Occlusion (Gambar)' },
]

function CardFormModal({ nodeId, card, onClose, onSuccess, onSave, isSavingOverride }) {
  const isUploading = useSelector(state => state.common.loading?.isUploading)
  const {
    isEdit,
    form, set,
    setClozeAnswer, setOcclusionRegions,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  } = useCardFormModal({ nodeId, card, onSuccess, onSave, isSavingOverride })

  const imageUpload = (
    <div>
      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
        Gambar {form.type === 'occlusion' ? '*' : '(opsional)'}
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
  )

  const referencesEditor = (
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
  )

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
        <Dropdown
          label="Tipe Kartu"
          options={TYPE_OPTIONS}
          value={TYPE_OPTIONS.find(o => o.value === form.type)}
          onChange={opt => set('type', opt?.value ?? 'basic')}
          isClearable={false}
        />

        {form.type === 'basic' && (
          <>
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

            {imageUpload}

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
          </>
        )}

        {form.type === 'cloze' && (
          <>
            <ClozeEditor
              text={form.front}
              onTextChange={val => set('front', val)}
              answers={form.clozeAnswers}
              onAnswerChange={setClozeAnswer}
            />
            {imageUpload}
          </>
        )}

        {form.type === 'occlusion' && (
          <>
            {imageUpload}
            <OcclusionEditor
              imageUrl={form.imagePreviewUrl}
              regions={form.occlusionRegions}
              onChange={setOcclusionRegions}
            />
          </>
        )}

        {referencesEditor}
      </div>
    </Modal>
  )
}

export default CardFormModal
