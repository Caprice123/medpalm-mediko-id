import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import ConfirmationModal from '@components/common/ConfirmationModal'
import { useCitationRow } from './hooks/useCitationRow'
import {
  Row, Number, Body, Preview, TypeTag, Actions, Form, WideField, FormActions,
} from './CitationRow.styles'

const SOURCE_TYPE_OPTIONS = [
  { value: 'journal', label: 'Artikel jurnal' },
  { value: 'web', label: 'Sumber internet' },
]

// One source in the Referensi panel: how it will print, the marker to paste
// into a paragraph, and the form for the fields Crossref and PubMed could not
// fill in.
const CitationRow = ({ citation }) => {
  const {
    isEditing, startEditing, cancelEditing,
    draft, setField, setSourceType, submit, isSaving,
    isCopied, copyMarker,
    isConfirmingDelete, requestDelete, cancelDelete, confirmDelete, isDeleting,
  } = useCitationRow({ citation })

  const isJournal = citation.sourceType === 'journal'

  return (
    <Row>
      <Number>{citation.number}.</Number>

      <Body>
        <TypeTag $journal={isJournal}>{isJournal ? 'Jurnal' : 'Web'}</TypeTag>
        <Preview>{citation.preview}</Preview>

        {isEditing ? (
          <Form>
            <WideField>
              <TextInput
                label="Judul"
                value={draft.title}
                onChange={setField('title')}
                size="small"
              />
            </WideField>

            <WideField>
              <TextInput
                label="Penulis / lembaga"
                value={draft.authorsText}
                onChange={setField('authorsText')}
                placeholder="Guzman, Maria G; Harris, Eva"
                hint="Pisahkan dengan titik koma. Nama lembaga ditulis utuh."
                size="small"
              />
            </WideField>

            <TextInput
              label="Tahun"
              value={draft.publishedYear}
              onChange={setField('publishedYear')}
              placeholder="2015"
              size="small"
            />

            <TextInput
              label={isJournal ? 'Nama jurnal' : 'Nama situs'}
              value={draft.containerTitle}
              onChange={setField('containerTitle')}
              size="small"
            />

            <TextInput
              label="Penerbit"
              value={draft.publisher}
              onChange={setField('publisher')}
              size="small"
            />

            <TextInput
              label="Volume"
              value={draft.volume}
              onChange={setField('volume')}
              size="small"
            />

            <TextInput
              label="Nomor"
              value={draft.issue}
              onChange={setField('issue')}
              size="small"
            />

            <TextInput
              label="Halaman"
              value={draft.pages}
              onChange={setField('pages')}
              placeholder="453-65"
              size="small"
            />

            <WideField>
              <Dropdown
                label="Tipe sumber"
                options={SOURCE_TYPE_OPTIONS}
                value={SOURCE_TYPE_OPTIONS.find(option => option.value === draft.sourceType)}
                onChange={(option) => setSourceType(option?.value || 'web')}
                isClearable={false}
                usePortal
              />
            </WideField>

            <FormActions>
              <Button variant="primary" size="small" onClick={submit} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </Button>
              <Button variant="secondary" size="small" onClick={cancelEditing} disabled={isSaving}>
                Batal
              </Button>
            </FormActions>
          </Form>
        ) : (
          <Actions>
            {citation.marker && (
              <Button variant="secondary" size="small" onClick={copyMarker}>
                {isCopied ? 'Tersalin ✓' : `Salin penanda ${citation.marker}`}
              </Button>
            )}
            <Button variant="secondary" size="small" onClick={startEditing}>
              Ubah
            </Button>
            <Button variant="secondary" size="small" onClick={requestDelete}>
              Hapus
            </Button>
          </Actions>
        )}
      </Body>

      <ConfirmationModal
        isOpen={isConfirmingDelete}
        title="Hapus referensi"
        message={`"${citation.title}" akan dihapus dari daftar referensi laporan ini. Penanda yang sudah ditempel di paragraf tidak ikut terhapus.`}
        icon="🗑️"
        confirmText={isDeleting ? 'Menghapus...' : 'Ya, hapus'}
        cancelText="Batalkan"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Row>
  )
}

export default CitationRow
