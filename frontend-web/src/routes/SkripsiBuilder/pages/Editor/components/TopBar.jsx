import React, { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@store/store'
import { updateSetInfo } from '@store/skripsi/action'
import { FaArrowLeft, FaSave, FaFileWord, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import {
  TopBar as StyledTopBar,
  BackButton,
  SetTitleWrapper,
  SetTitle,
  SetTitleInput,
  EditButton,
  TopActions,
  SaveButton,
  ExportButton
} from '../Editor.styles'

const TopBar = memo(({ currentSet, hasUnsavedChanges, isSavingContent, onSave, onExportWord }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('Anda memiliki perubahan yang belum disimpan. Lanjutkan?')
      if (!confirm) return
    }
    navigate('/skripsi/sets')
  }

  const handleStartEditTitle = () => {
    setEditedTitle(currentSet.title)
    setIsEditingTitle(true)
  }

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false)
    setEditedTitle('')
  }

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) {
      alert('Judul tidak boleh kosong')
      return
    }

    try {
      await dispatch(updateSetInfo(currentSet.id, editedTitle.trim(), currentSet.description))
      setIsEditingTitle(false)
      setEditedTitle('')
    } catch (error) {
      console.error('Failed to update title:', error)
      alert('Gagal mengubah judul')
    }
  }

  const handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle()
    } else if (e.key === 'Escape') {
      handleCancelEditTitle()
    }
  }

  return (
    <StyledTopBar>
      <BackButton onClick={handleBackClick}>
        <FaArrowLeft /> Kembali
      </BackButton>
      {isEditingTitle ? (
        <SetTitleWrapper>
          <SetTitleInput
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleTitleKeyPress}
            autoFocus
            placeholder="Masukkan judul set..."
          />
          <EditButton onClick={handleSaveTitle} $variant="success">
            <FaCheck />
          </EditButton>
          <EditButton onClick={handleCancelEditTitle} $variant="danger">
            <FaTimes />
          </EditButton>
        </SetTitleWrapper>
      ) : (
        <SetTitleWrapper>
          <SetTitle>{currentSet.title}</SetTitle>
          <EditButton onClick={handleStartEditTitle}>
            <FaEdit />
          </EditButton>
        </SetTitleWrapper>
      )}
      <TopActions>
        <SaveButton onClick={onSave} disabled={!hasUnsavedChanges || isSavingContent}>
          <FaSave /> {isSavingContent ? 'Menyimpan...' : 'Simpan'}
        </SaveButton>
        <ExportButton onClick={onExportWord}>
          <FaFileWord /> Export Word
        </ExportButton>
      </TopActions>
    </StyledTopBar>
  )
})

TopBar.displayName = 'TopBar'

export default TopBar
