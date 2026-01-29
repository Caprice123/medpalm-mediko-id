import React from 'react'
import styled from 'styled-components'
import Button from '@components/common/Button'

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const DialogBox = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`

const DialogTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`

const DialogMessage = styled.p`
  margin: 0 0 24px 0;
  color: #6b7280;
  line-height: 1.5;
`

const DialogActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const UnsavedChangesDialog = ({ isOpen, onSaveAndLeave, onLeaveWithoutSaving, onCancel, isSaving }) => {
  if (!isOpen) return null

  return (
    <DialogOverlay onClick={onCancel}>
      <DialogBox onClick={(e) => e.stopPropagation()}>
        <DialogTitle>⚠️ Perubahan Belum Disimpan</DialogTitle>
        <DialogMessage>
          Anda memiliki perubahan yang belum disimpan. Apa yang ingin Anda lakukan?
        </DialogMessage>
        <DialogActions>
          <Button variant="danger" onClick={onLeaveWithoutSaving} disabled={isSaving}>
            Tinggalkan Tanpa Menyimpan
          </Button>
          <Button variant="primary" onClick={onSaveAndLeave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan & Tinggalkan'}
          </Button>
        </DialogActions>
      </DialogBox>
    </DialogOverlay>
  )
}

export default UnsavedChangesDialog
