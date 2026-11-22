import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import { useSectionReferenceModal } from './hooks/useSectionReferenceModal'
import {
  Hint, SearchRow, OptionList, Option, OptionIndex, OptionTitle, EmptyHint,
} from './SectionReferenceModal.styles'

// Picks which section this one points at. One click inserts the reference and
// closes: there is nothing to confirm, and the chip can be deleted like any
// other character if it was the wrong one.
const SectionReferenceModal = ({ isOpen, currentSectionId, onSelect, onClose }) => {
  const { options, search, setSearch, hasOtherSections } = useSectionReferenceModal({
    isOpen,
    currentSectionId,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rujuk bagian lain"
      size="small"
      footer={<Button variant="secondary" onClick={onClose}>Batal</Button>}
    >
      <Hint>
        Rujukan disisipkan di posisi kursor dan ikut terbawa ke export Word.
        Namanya mengikuti bagian yang dirujuk kalau judulnya diubah.
      </Hint>

      {hasOtherSections && (
        <SearchRow>
          <TextInput
            value={search}
            onChange={setSearch}
            placeholder="Cari bagian..."
            size="small"
          />
        </SearchRow>
      )}

      {options.length === 0 ? (
        <EmptyHint>
          {hasOtherSections
            ? 'Tidak ada bagian yang cocok.'
            : 'Laporan ini belum punya bagian lain untuk dirujuk.'}
        </EmptyHint>
      ) : (
        <OptionList>
          {options.map(section => (
            <Option
              key={section.id}
              type="button"
              onClick={() => onSelect(section)}
            >
              <OptionIndex>{section.number}</OptionIndex>
              <OptionTitle>{section.title}</OptionTitle>
            </Option>
          ))}
        </OptionList>
      )}
    </Modal>
  )
}

export default SectionReferenceModal
