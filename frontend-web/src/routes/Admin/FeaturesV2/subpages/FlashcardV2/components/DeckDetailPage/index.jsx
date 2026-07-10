import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchV2Deck, updateV2Deck } from '@store/flashcard/v2/adminAction'
import { upload } from '@store/common/action'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import Table from '@components/common/Table'
import {
  Container, Header, HeaderLeft, Title,
  CardActions, EmptyText,
} from '../../FlashcardV2.styles'
import { DeckSubHeader } from './DeckDetailPage.styles'

function DeckDetailPage({ deck, onBack }) {
  const dispatch = useDispatch()
  const { detail, loading: flashcardLoading } = useSelector(state => state.flashcard)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [cardModal, setCardModal] = useState({ open: false, mode: 'create', index: -1 })
  const [form, setForm] = useState({ front: '', back: '', imageBlobId: null, imagePreviewUrl: null, imageFilename: null })

  const cards = detail?.uniqueId === deck.uniqueId ? (detail.cards || []) : []
  const isLoading = flashcardLoading?.isGetDetailFlashcardDeckLoading
  const isSaving = flashcardLoading?.isUpdatingDeck
  const isUploading = commonLoading?.isUploading

  useEffect(() => {
    dispatch(fetchV2Deck(deck.uniqueId))
  }, [deck.uniqueId, dispatch])

  const openAdd = () => {
    setForm({ front: '', back: '', imageBlobId: null, imagePreviewUrl: null, imageFilename: null })
    setCardModal({ open: true, mode: 'create', index: -1 })
  }

  const openEdit = (card, index) => {
    setForm({
      front: card.front,
      back: card.back,
      imageBlobId: card.image?.id || null,
      imagePreviewUrl: card.imageUrl || null,
      imageFilename: card.image?.filename || null,
    })
    setCardModal({ open: true, mode: 'edit', index })
  }

  const closeModal = () => setCardModal({ open: false, mode: 'create', index: -1 })

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'flashcard'))
    setForm(p => ({ ...p, imageBlobId: result.blobId, imagePreviewUrl: result.url, imageFilename: result.filename }))
  }

  const toPayload = (arr) =>
    arr.map((c, i) => ({
      front: c.front,
      back: c.back,
      blobId: c.image?.id || null,
      order: i,
    }))

  const saveCards = async (newCards) => {
    await dispatch(updateV2Deck(deck.uniqueId, { cards: newCards }))
    dispatch(fetchV2Deck(deck.uniqueId))
  }

  const handleDeleteCard = async (index) => {
    if (!window.confirm('Hapus kartu ini?')) return
    const newCards = toPayload(cards.filter((_, i) => i !== index))
    await saveCards(newCards)
  }

  const handleSaveCard = async () => {
    if (!form.front.trim() || !form.back.trim()) {
      alert('Front dan back wajib diisi')
      return
    }
    let newCards
    if (cardModal.mode === 'create') {
      newCards = [
        ...toPayload(cards),
        { front: form.front, back: form.back, blobId: form.imageBlobId, order: cards.length },
      ]
    } else {
      newCards = cards.map((c, i) =>
        i === cardModal.index
          ? { front: form.front, back: form.back, blobId: form.imageBlobId, order: i }
          : { front: c.front, back: c.back, blobId: c.image?.id || null, order: i }
      )
    }
    await saveCards(newCards)
    closeModal()
  }

  const columns = [
    { header: '#', width: '48px', render: (_, idx) => idx + 1 },
    {
      header: 'Front',
      render: (c) => (
        <div>
          {c.imageUrl && (
            <img
              src={c.imageUrl}
              alt="front"
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, display: 'block', marginBottom: 4 }}
            />
          )}
          <span>{c.front}</span>
        </div>
      ),
    },
    { header: 'Back', render: (c) => c.back },
    {
      header: 'Aksi',
      width: '140px',
      render: (c, idx) => (
        <CardActions>
          <Button onClick={() => openEdit(c, idx)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDeleteCard(idx)}>Hapus</Button>
        </CardActions>
      ),
    },
  ]

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>{deck.title} — Kelola Kartu</Title>
        </HeaderLeft>
      </Header>

      <DeckSubHeader>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {isLoading ? 'Memuat kartu...' : `${cards.length} kartu`}
        </span>
        <Button variant="primary" onClick={openAdd} disabled={isLoading}>
          + Tambah Kartu
        </Button>
      </DeckSubHeader>

      <Table
        columns={columns}
        data={cards}
        loading={isLoading}
        emptyText="Belum ada kartu"
        emptySubtext='Klik "+ Tambah Kartu" untuk memulai.'
      />

      {cardModal.open && (
        <Modal
          isOpen
          onClose={closeModal}
          title={cardModal.mode === 'create' ? 'Tambah Kartu' : 'Edit Kartu'}
          footer={
            <Button variant="primary" onClick={handleSaveCard} disabled={isSaving || isUploading}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
                Front *
              </label>
              <Textarea
                value={form.front}
                onChange={e => setForm(p => ({ ...p, front: e.target.value }))}
                placeholder="Pertanyaan atau istilah"
                rows={3}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.375rem' }}>
                Gambar (opsional)
              </label>
              <FileUpload
                file={form.imageBlobId ? { name: form.imageFilename || 'Gambar kartu', type: 'image/jpeg' } : null}
                onFileSelect={handleImageUpload}
                onRemove={() => setForm(p => ({ ...p, imageBlobId: null, imagePreviewUrl: null, imageFilename: null }))}
                isUploading={isUploading}
                acceptedTypes={['image/*']}
                acceptedTypesLabel="PNG, JPG, GIF"
                maxSizeMB={5}
                uploadText="Klik untuk upload gambar"
                actions={
                  form.imagePreviewUrl
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
                onChange={e => setForm(p => ({ ...p, back: e.target.value }))}
                placeholder="Jawaban atau definisi"
                rows={3}
              />
            </div>
          </div>
        </Modal>
      )}
    </Container>
  )
}

export default DeckDetailPage
