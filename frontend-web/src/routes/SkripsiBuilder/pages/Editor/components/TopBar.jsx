import React, { useState, memo } from 'react'
import { useAppDispatch } from '@store/store'
import { updateSetInfo } from '@store/skripsi/action'
import { FaArrowLeft, FaEdit, FaCheck, FaTimes, FaSave, FaFileWord } from 'react-icons/fa'
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
import Button from '@components/common/Button'

const TopBar = memo(({ currentSet, hasUnsavedChanges, isSavingContent, onSave, onExportWord, onBackClick }) => {
  const dispatch = useAppDispatch()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

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
      <Button onClick={onBackClick}>
        <FaArrowLeft /> Kembali
      </Button>
      {isEditingTitle ? (
        <SetTitleWrapper>
          <SetTitleInput
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleTitleKeyPress}
            autoFocus
            placeholder="Masukkan judul set..."
          />
          <Button onClick={handleSaveTitle} variant="secondary">
            <FaCheck />
          </Button>
          <Button onClick={handleCancelEditTitle} variant="danger">
            <FaTimes />
          </Button>
        </SetTitleWrapper>
      ) : (
        <SetTitleWrapper>
          <SetTitle>{currentSet.title}</SetTitle>
          <Button variant="secondary" onClick={handleStartEditTitle}>
            <FaEdit />
          </Button>
        </SetTitleWrapper>
      )}
      <TopActions>
        <Button variant="secondary" onClick={onSave} disabled={!hasUnsavedChanges || isSavingContent}>
          <FaSave /> {isSavingContent ? 'Menyimpan...' : 'Simpan'}
        </Button>
        <Button variant="primary" onClick={onExportWord}>
          <FaFileWord /> Export Word
        </Button>
      </TopActions>
    </StyledTopBar>
  )
})

TopBar.displayName = 'TopBar'

export default TopBar
