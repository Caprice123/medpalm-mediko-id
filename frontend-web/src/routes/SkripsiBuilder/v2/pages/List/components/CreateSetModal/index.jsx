import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { useCreateSetModal } from './hooks/useCreateSetModal'
import { Fields } from './CreateSetModal.styles'

// V1 built this form from bare <input>/<textarea> elements with inline style
// objects and hand-written labels, including onFocus/onBlur handlers that set
// borderColor by hand. The common components already carry the label, the
// required mark and the focus treatment.
const CreateSetModal = ({ isOpen, onClose }) => {
  const {
    form,
    setTitle,
    setDescription,
    canSubmit,
    isCreating,
    handleSubmit,
    handleClose,
  } = useCreateSetModal({ onClose })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Buat Set Baru"
      footer={(
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isCreating}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit || isCreating}>
            {isCreating ? 'Membuat...' : 'Buat Set'}
          </Button>
        </>
      )}
    >
      <Fields>
        <TextInput
          label="Judul Set"
          required
          value={form.title}
          onChange={setTitle}
          placeholder="Masukkan judul set skripsi"
        />
        <Textarea
          label="Deskripsi (Opsional)"
          value={form.description}
          onChange={setDescription}
          placeholder="Tambahkan deskripsi singkat"
          rows={3}
        />
      </Fields>
    </Modal>
  )
}

export default CreateSetModal
