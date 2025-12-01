import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTag, updateTag } from '@store/tags/action'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 16px 16px 0 0;
`

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const AddTagForm = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
`

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TagsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
`

const TagCard = styled.div`
  background: white;
  border: 2px solid ${props => props.type === 'university'
    ? 'rgba(59, 130, 246, 0.3)'
    : 'rgba(139, 92, 246, 0.3)'};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px ${props => props.type === 'university'
      ? 'rgba(59, 130, 246, 0.2)'
      : 'rgba(139, 92, 246, 0.2)'};
  }
`

const TagName = styled.div`
  font-weight: 600;
  color: ${props => props.type === 'university' ? '#1e40af' : '#6d28d9'};
  flex: 1;
`

const TagActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.danger ? '#fee2e2' : '#f3f4f6'};
    color: ${props => props.danger ? '#dc2626' : '#374151'};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
`

function TagManagementModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const tags = useSelector(state => state.tags.tags)

  const [newTagName, setNewTagName] = useState('')
  const [newTagType, setNewTagType] = useState('university')
  const [editingTagId, setEditingTagId] = useState(null)
  const [editingTagName, setEditingTagName] = useState('')

  const universityTags = tags.filter(tag => tag.type === 'university')
  const semesterTags = tags.filter(tag => tag.type === 'semester')

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      alert('Nama tag tidak boleh kosong')
      return
    }

    try {
      await dispatch(createTag({ name: newTagName, type: newTagType }))
      setNewTagName('')
      alert(`Tag "${newTagName}" berhasil ditambahkan`)
    } catch (error) {
      alert('Gagal menambahkan tag: ' + error.message)
    }
  }

  const handleEditTag = (tag) => {
    setEditingTagId(tag.id)
    setEditingTagName(tag.name)
  }

  const handleSaveEdit = async (tagId, tagType) => {
    if (!editingTagName.trim()) {
      alert('Nama tag tidak boleh kosong')
      return
    }

    try {
      await dispatch(updateTag(tagId, { name: editingTagName, type: tagType }))
      alert(`Tag berhasil diupdate menjadi "${editingTagName}"`)
      setEditingTagId(null)
      setEditingTagName('')
    } catch (error) {
      alert('Gagal mengupdate tag: ' + error.message)
    }
  }

  const handleDeleteTag = async (tagId, tagName) => {
    alert('Delete functionality is not available. Please use the Tags management page.')
    // Delete functionality removed - use Tags management page instead
  }

  const handleCancelEdit = () => {
    setEditingTagId(null)
    setEditingTagName('')
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>🏷️ Kelola Tag</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>➕ Tambah Tag Baru</SectionTitle>
            <AddTagForm>
              <Input
                type="text"
                placeholder="Nama tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Select
                value={newTagType}
                onChange={(e) => setNewTagType(e.target.value)}
              >
                <option value="university">Universitas</option>
                <option value="semester">Semester</option>
              </Select>
              <AddButton onClick={handleAddTag} disabled={!newTagName.trim()}>
                Tambah
              </AddButton>
            </AddTagForm>
          </Section>

          <Section>
            <SectionTitle>🎓 Universitas ({universityTags.length})</SectionTitle>
            {universityTags.length > 0 ? (
              <TagsList>
                {universityTags.map(tag => (
                  <TagCard key={tag.id} type="university">
                    {editingTagId === tag.id ? (
                      <>
                        <Input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          style={{ marginRight: '0.5rem' }}
                          autoFocus
                        />
                        <TagActions>
                          <IconButton onClick={() => handleSaveEdit(tag.id, tag.type)}>
                            ✓
                          </IconButton>
                          <IconButton onClick={handleCancelEdit}>
                            ✕
                          </IconButton>
                        </TagActions>
                      </>
                    ) : (
                      <>
                        <TagName type="university">{tag.name}</TagName>
                        <TagActions>
                          <IconButton onClick={() => handleEditTag(tag)}>
                            ✏️
                          </IconButton>
                          <IconButton
                            danger
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                          >
                            🗑️
                          </IconButton>
                        </TagActions>
                      </>
                    )}
                  </TagCard>
                ))}
              </TagsList>
            ) : (
              <EmptyState>Belum ada universitas</EmptyState>
            )}
          </Section>

          <Section>
            <SectionTitle>📚 Semester ({semesterTags.length})</SectionTitle>
            {semesterTags.length > 0 ? (
              <TagsList>
                {semesterTags.map(tag => (
                  <TagCard key={tag.id} type="semester">
                    {editingTagId === tag.id ? (
                      <>
                        <Input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          style={{ marginRight: '0.5rem' }}
                          autoFocus
                        />
                        <TagActions>
                          <IconButton onClick={() => handleSaveEdit(tag.id, tag.type)}>
                            ✓
                          </IconButton>
                          <IconButton onClick={handleCancelEdit}>
                            ✕
                          </IconButton>
                        </TagActions>
                      </>
                    ) : (
                      <>
                        <TagName type="semester">{tag.name}</TagName>
                        <TagActions>
                          <IconButton onClick={() => handleEditTag(tag)}>
                            ✏️
                          </IconButton>
                          <IconButton
                            danger
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                          >
                            🗑️
                          </IconButton>
                        </TagActions>
                      </>
                    )}
                  </TagCard>
                ))}
              </TagsList>
            ) : (
              <EmptyState>Belum ada semester</EmptyState>
            )}
          </Section>
        </ModalBody>
      </Modal>
    </Overlay>
  )
}

export default TagManagementModal
