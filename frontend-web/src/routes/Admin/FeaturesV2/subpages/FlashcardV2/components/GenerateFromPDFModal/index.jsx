import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateFlashcardsFromPDF } from '@store/flashcard/adminAction'
import { fetchV2Deck, updateV2Deck, attachSourcePdf } from '@store/flashcard/v2/adminAction'
import { upload } from '@store/common/action'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import NumberInput from '@components/common/NumberInput'
import styled from 'styled-components'

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`

const StatusText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
  text-align: center;
`

export default function GenerateFromPDFModal({ deck, existingCards, onClose }) {
  const dispatch = useDispatch()
  const { loading: flashcardLoading } = useSelector(state => state.flashcard)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [pdfBlob, setPdfBlob] = useState(null)
  const [cardCount, setCardCount] = useState('10')

  const isUploading = commonLoading?.isUploading
  const isGenerating = flashcardLoading?.isGeneratingCards
  const isSaving = flashcardLoading?.isUpdatingDeck
  const isBusy = isUploading || isGenerating || isSaving

  const handlePdfUpload = async (file) => {
    const result = await dispatch(upload(file, 'flashcard-pdf'))
    setPdfBlob({ id: result.blobId, filename: result.filename })
  }

  const handleGenerate = async () => {
    if (!pdfBlob?.id) {
      alert('Pilih file PDF terlebih dahulu')
      return
    }

    const count = Math.min(50, Math.max(1, parseInt(cardCount) || 10))

    const result = await dispatch(generateFlashcardsFromPDF(null, count, pdfBlob.id))
    if (!result?.cards?.length) {
      alert('Gagal menghasilkan kartu dari PDF')
      return
    }

    const existingPayload = existingCards.map((c, i) => ({
      front: c.front,
      back: c.back,
      blobId: c.image?.id || null,
      order: i,
    }))

    const generatedPayload = result.cards.map((c, i) => ({
      front: c.front,
      back: c.back,
      blobId: null,
      order: existingCards.length + i,
    }))

    await dispatch(updateV2Deck(deck.uniqueId, { cards: [...existingPayload, ...generatedPayload] }))
    await dispatch(attachSourcePdf(deck.uniqueId, pdfBlob.id))
    await dispatch(fetchV2Deck(deck.uniqueId))
    onClose()
  }

  const statusLabel = isUploading ? 'Mengupload PDF...'
    : isGenerating ? 'Menghasilkan kartu dengan AI...'
    : isSaving ? 'Menyimpan kartu...'
    : null

  return (
    <Modal
      isOpen
      onClose={isBusy ? undefined : onClose}
      title="Generate Kartu dari PDF"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isBusy}>Batal</Button>
          <Button variant="primary" onClick={handleGenerate} disabled={isBusy || !pdfBlob}>
            {isGenerating || isSaving ? 'Memproses...' : 'Generate & Simpan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>File PDF *</Label>
        <FileUpload
          file={pdfBlob ? { name: pdfBlob.filename || 'dokumen.pdf', type: 'application/pdf' } : null}
          onFileSelect={handlePdfUpload}
          onRemove={() => setPdfBlob(null)}
          isUploading={isUploading}
          acceptedTypes={['application/pdf']}
          acceptedTypesLabel="PDF"
          maxSizeMB={20}
          uploadText="Klik untuk upload file PDF"
          disabled={isBusy}
        />
      </FormSection>

      <FormSection>
        <NumberInput
          label="Jumlah Kartu"
          value={cardCount}
          onChange={e => setCardCount(e.target.value)}
          min={1}
          max={50}
          allowNegative={false}
          disabled={isBusy}
          hint="Antara 1–50 kartu"
        />
      </FormSection>

      {statusLabel && <StatusText>{statusLabel}</StatusText>}
    </Modal>
  )
}
