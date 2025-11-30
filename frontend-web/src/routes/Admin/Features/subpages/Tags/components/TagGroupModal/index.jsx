import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createTag } from '@store/tags/action'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  HintText,
  ModalFooter,
  Button,
  LoadingSpinner
} from './TagGroupModal.styles'

function TagGroupModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const [groupName, setGroupName] = useState('')
  const [firstTagName, setFirstTagName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!groupName.trim()) {
      alert('Nama grup tidak boleh kosong')
      return
    }

    if (!firstTagName.trim()) {
      alert('Nama tag pertama tidak boleh kosong')
      return
    }

    setLoading(true)
    try {
      // Create the first tag in this new group
      await dispatch(createTag({
        name: firstTagName.trim(),
        type: groupName.trim().toLowerCase()
      }))

      alert('Grup tag berhasil dibuat!')
      setGroupName('')
      setFirstTagName('')
      onSuccess()
    } catch (error) {
      console.error('Error creating tag group:', error)
      alert('Gagal membuat grup tag: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setGroupName('')
      setFirstTagName('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>➕ Buat Grup Tag Baru</ModalTitle>
          <CloseButton onClick={handleClose} disabled={loading}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>Nama Grup Tag *</Label>
              <Input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Contoh: Universitas, Semester, Topik"
                disabled={loading}
                autoFocus
              />
              <HintText>Nama grup akan otomatis dikonversi ke huruf kecil</HintText>
            </FormGroup>

            <FormGroup>
              <Label>Tag Pertama *</Label>
              <Input
                type="text"
                value={firstTagName}
                onChange={(e) => setFirstTagName(e.target.value)}
                placeholder="Contoh: UI, Semester 1, Kardio"
                disabled={loading}
              />
              <HintText>Anda bisa menambahkan tag lainnya setelah grup dibuat</HintText>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type="button" onClick={handleClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Membuat...
                </>
              ) : (
                '✓ Buat Grup Tag'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  )
}

export default TagGroupModal
