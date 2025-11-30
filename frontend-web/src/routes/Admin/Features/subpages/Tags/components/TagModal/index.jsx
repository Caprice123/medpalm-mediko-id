import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createTag, updateTagAction } from '@store/tags/action'
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
  GroupDisplay,
  HintText,
  ModalFooter,
  Button,
  LoadingSpinner
} from './TagModal.styles'

function TagModal({ isOpen, onClose, onSuccess, groupType, tag }) {
  const dispatch = useDispatch()
  const [tagName, setTagName] = useState('')
  const [loading, setLoading] = useState(false)

  const isEdit = !!tag

  useEffect(() => {
    if (tag) {
      setTagName(tag.name)
    } else {
      setTagName('')
    }
  }, [tag])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!tagName.trim()) {
      alert('Nama tag tidak boleh kosong')
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        await dispatch(updateTagAction(tag.id, {
          name: tagName.trim(),
          type: groupType
        }))
        alert('Tag berhasil diupdate!')
      } else {
        await dispatch(createTag({
          name: tagName.trim(),
          type: groupType
        }))
        alert('Tag berhasil ditambahkan!')
      }

      setTagName('')
      onSuccess()
    } catch (error) {
      console.error('Error saving tag:', error)
      alert('Gagal menyimpan tag: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setTagName('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isEdit ? '✏️ Edit Tag' : '➕ Tambah Tag'}
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={loading}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>Grup Tag</Label>
              <GroupDisplay>{groupType}</GroupDisplay>
              <HintText>Tag akan ditambahkan ke grup ini</HintText>
            </FormGroup>

            <FormGroup>
              <Label>Nama Tag *</Label>
              <Input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Contoh: UI, Semester 1, Kardio"
                disabled={loading}
                autoFocus
              />
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
                  {isEdit ? 'Menyimpan...' : 'Menambahkan...'}
                </>
              ) : (
                isEdit ? '✓ Simpan' : '✓ Tambah Tag'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  )
}

export default TagModal
