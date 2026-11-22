import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Loading from '@components/common/Loading'
import { useTemplateFormModal } from './hooks/useTemplateFormModal'
import {
  Fields, SectionsHeader, SectionsTitle, SectionList, SectionRow,
  RowActions, IconButton, Hint,
} from './TemplateFormModal.styles'

// Add or edit one report template. The section list here is the outline every
// report created from this template starts with.
const TemplateFormModal = ({ isOpen, template, onClose }) => {
  const {
    form,
    isLoading,
    setName,
    setDescription,
    setSectionTitle,
    addSection,
    removeSection,
    moveSection,
    isSaving,
    handleSubmit,
  } = useTemplateFormModal({ isOpen, template, onClose })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template ? 'Ubah Template' : 'Tambah Template'}
      size="large"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving || isLoading}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      )}
    >
      {isLoading ? <Loading text="Memuat template..." /> : (
      <Fields>
        <TextInput
          label="Nama template"
          required
          value={form.name}
          onChange={setName}
          placeholder="Mis. Laporan PBL Standar"
        />

        <Textarea
          label="Deskripsi"
          value={form.description}
          onChange={setDescription}
          placeholder="Satu baris penjelasan, tampil di bawah nama template"
          rows={2}
        />

        <div>
          <SectionsHeader>
            <SectionsTitle>Bagian laporan</SectionsTitle>
            <Button variant="secondary" size="small" onClick={addSection}>
              <FaPlus /> Tambah bagian
            </Button>
          </SectionsHeader>

          <Hint>Bagian Referensi otomatis ditambahkan paling bawah setiap laporan, jadi tidak perlu ditulis di sini.</Hint>

          <SectionList>
            {form.sections.map((section, index) => (
              <SectionRow key={index}>
                <TextInput
                  value={section.title}
                  onChange={setSectionTitle(index)}
                  placeholder={`Bagian ${index + 1}`}
                  size="small"
                />

                <RowActions>
                  <IconButton
                    type="button"
                    title="Naikkan"
                    aria-label="Naikkan bagian"
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                  >
                    <FaArrowUp />
                  </IconButton>
                  <IconButton
                    type="button"
                    title="Turunkan"
                    aria-label="Turunkan bagian"
                    disabled={index === form.sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    <FaArrowDown />
                  </IconButton>
                  <IconButton
                    type="button"
                    $danger
                    title="Hapus bagian"
                    aria-label="Hapus bagian"
                    onClick={() => removeSection(index)}
                  >
                    <FaTrash />
                  </IconButton>
                </RowActions>
              </SectionRow>
            ))}
          </SectionList>
        </div>
      </Fields>
      )}
    </Modal>
  )
}

export default TemplateFormModal
