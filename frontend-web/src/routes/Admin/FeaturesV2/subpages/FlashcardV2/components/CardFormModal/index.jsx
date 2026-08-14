import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import FileUpload from '@components/common/FileUpload'
import Dropdown from '@components/common/Dropdown'
import Loading from '@components/common/Loading'
import CardPreviewModal from '../CardPreviewModal'
import ClozeEditor from './components/ClozeEditor'
import OcclusionEditor from './components/OcclusionEditor'
import SummaryNoteTreePicker from './components/SummaryNoteTreePicker'
import { useCardFormModal } from './hooks/useCardFormModal'
import { useCardSummaryNoteLinks } from './hooks/useCardSummaryNoteLinks'
import { referencedClozeNumbers } from '../../utils/clozeTokens'

const TYPE_OPTIONS = [
  { value: 'basic', label: 'Basic (Tanya-Jawab)' },
  { value: 'cloze', label: 'Cloze (Isian)' },
  { value: 'occlusion', label: 'Occlusion (Gambar)' },
]

function CardFormModal({ nodeId, card, onClose, onSuccess, onSave, isSavingOverride }) {
  const isUploading = useSelector(state => state.common.loading?.isUploading)
  const {
    isEdit,
    isLoadingDetail,
    previewOpen, setPreviewOpen,
    form, set,
    setClozeAnswer, setOcclusionRegions,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  } = useCardFormModal({ nodeId, card, onSuccess, onSave, isSavingOverride })

  const {
    relations: linkedNotes,
    addNote,
    updateLabel,
    removeNote,
    isSyncing: isSyncingNotes,
  } = useCardSummaryNoteLinks(card?.id)

  const [notePickerOpen, setNotePickerOpen] = useState(false)
  const [labelDrafts, setLabelDrafts] = useState({})

  const commitLabel = (relation, value) => {
    setLabelDrafts(d => { const next = { ...d }; delete next[relation.id]; return next })
    if (value !== (relation.label || '')) updateLabel(relation.id, value)
  }

  const canPreviewCloze = form.type === 'cloze' && referencedClozeNumbers(form.front).length > 0

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

  const explanationEditor = (
    <>
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
          Penjelasan Singkat (opsional)
        </label>
        <Textarea
          value={form.explanationShort}
          onChange={e => set('explanationShort', e.target.value)}
          placeholder="Ringkasan singkat yang tampil langsung setelah jawaban dibuka"
          rows={2}
        />
      </div>
      <div>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
          Penjelasan Panjang (opsional)
        </label>
        <Textarea
          value={form.explanationLong}
          onChange={e => set('explanationLong', e.target.value)}
          placeholder="Penjelasan detail, ditampilkan saat pengguna klik 'Lihat Penjelasan Panjang'"
          rows={4}
        />
      </div>
    </>
  )

  const moduleLinksEditor = isEdit && (
    <div>
      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
        Modul Terkait (opsional)
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {linkedNotes.map(relation => (
          <div key={relation.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <TextInput
              value={labelDrafts[relation.id] ?? relation.label ?? ''}
              onChange={e => setLabelDrafts(d => ({ ...d, [relation.id]: e.target.value }))}
              onBlur={e => commitLabel(relation, e.target.value.trim())}
              placeholder="Label (mis. Modul Terkait)"
            />
            <TextInput value={relation.targetTitle || ''} disabled />
            <Button variant="danger" onClick={() => removeNote(relation.id)} disabled={isSyncingNotes}>Hapus</Button>
          </div>
        ))}
        <Button onClick={() => setNotePickerOpen(true)} disabled={isSyncingNotes}>+ Tambah Modul Terkait</Button>
      </div>
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
          <Button variant="primary" onClick={handleSubmit} disabled={isLoadingDetail || isSaving || isUploading}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      {isLoadingDetail ? (
        <Loading />
      ) : (
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
            <Button
              variant="secondary"
              disabled={!canPreviewCloze}
              onClick={() => setPreviewOpen(true)}
            >
              📖 Preview Flashcard
            </Button>
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

        {explanationEditor}
        {moduleLinksEditor}
        {referencesEditor}
      </div>
      )}

      {previewOpen && (
        <CardPreviewModal
          card={{
            type: form.type, front: form.front, back: form.back, clozeAnswers: form.clozeAnswers, occlusionRegions: form.occlusionRegions, imageUrl: form.imagePreviewUrl,
            explanationShort: form.explanationShort, explanationLong: form.explanationLong, references: form.references,
            linkedSummaryNotes: linkedNotes.map(r => ({ uniqueId: r.targetUniqueId, title: r.label || r.targetTitle })),
          }}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {notePickerOpen && (
        <SummaryNoteTreePicker
          onSelect={async (option) => {
            await addNote(option)
            setNotePickerOpen(false)
          }}
          onClose={() => setNotePickerOpen(false)}
        />
      )}
    </Modal>
  )
}

export default CardFormModal
