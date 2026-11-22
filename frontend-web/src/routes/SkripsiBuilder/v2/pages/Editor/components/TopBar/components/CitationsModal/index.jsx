import { useSelector } from 'react-redux'
import { FaListOl } from 'react-icons/fa'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import ConfirmationModal from '@components/common/ConfirmationModal'
import CitationRow from './components/CitationRow'
import { useCitationsModal } from './hooks/useCitationsModal'
import {
  Toolbar, Summary, TargetNote, StylePicker, EmptyHint, List, Warning,
} from './CitationsModal.styles'

const NUMERIC_STYLES = ['vancouver', 'ieee']

// Everything kept from the Searcher, and the button that writes it all into the
// report's reference section.
//
// The list opens before anything is generated on purpose: a journal article
// comes back from Crossref complete, but a guideline or a faculty PDF arrives
// without an author, and generating straight from the button would quietly
// produce a daftar pustaka with holes in it. This is where those get fixed.
const CitationsModal = ({ isOpen, onClose }) => {
  const citations = useSelector(state => state.skripsiV2.citations)
  const styles = useSelector(state => state.skripsiV2.citationStyles)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingCitations)

  const {
    style, setStyle, target, isGenerating, handleGenerate,
    isConfirmingOverwrite, confirmOverwrite, cancelOverwrite,
  } = useCitationsModal({ onClose })

  const selected = styles.find(option => option.value === style) || null

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Referensi terkumpul"
        size="large"
        footer={<Button variant="secondary" onClick={onClose}>Tutup</Button>}
      >
        <Toolbar>
          <Summary>
            {isFetching && citations.length === 0
              ? 'Memuat referensi...'
              : `${citations.length} sumber tersimpan`}
            {target && (
              <TargetNote>Akan ditulis ke bagian &quot;{target.title}&quot;</TargetNote>
            )}
          </Summary>

          <StylePicker>
            <Dropdown
              options={styles}
              value={selected}
              onChange={(option) => setStyle(option?.value || style)}
              isClearable={false}
              usePortal
            />
          </StylePicker>

          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating || citations.length === 0 || !target}
          >
            <FaListOl /> {isGenerating ? 'Menyusun...' : 'Tulis daftar pustaka'}
          </Button>
        </Toolbar>

        {citations.length === 0 ? (
          <EmptyHint>
            Belum ada sumber. Cari di tab Research, lalu klik &quot;Simpan ke referensi&quot;
            pada hasil yang dipakai — yang tersimpan muncul di sini dan bisa disusun
            jadi daftar pustaka.
          </EmptyHint>
        ) : (
          <>
            <List>
              {citations.map(citation => (
                <CitationRow key={citation.id} citation={citation} />
              ))}
            </List>

            {NUMERIC_STYLES.includes(style) && (
              <Warning>
                Penanda seperti [1] ditempel sebagai teks biasa. Kalau ada referensi yang
                dihapus atau diurutkan ulang, nomor yang sudah ada di paragraf tidak ikut
                berubah — periksa lagi sebelum dikumpulkan.
              </Warning>
            )}
          </>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmingOverwrite}
        title="Ganti isi bagian referensi"
        message={`Bagian "${target?.title ?? ''}" sudah ada isinya. Daftar pustaka yang ditulis akan menggantinya, termasuk teks yang kamu tulis sendiri di situ.`}
        icon="📚"
        confirmText={isGenerating ? 'Menyusun...' : 'Ya, ganti'}
        cancelText="Batalkan"
        onConfirm={confirmOverwrite}
        onCancel={cancelOverwrite}
      />
    </>
  )
}

export default CitationsModal
