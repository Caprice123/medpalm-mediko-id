import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags, createTag, updateTagAction, deleteTag } from '@store/tags/action'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  IconLarge,
  Title,
  Subtitle,
  ActionsRow,
  ActionButton,
  Content,
  GroupsContainer,
  GroupCard,
  GroupHeader,
  GroupTitle,
  GroupBadge,
  CollapseIcon,
  GroupActions,
  IconButton,
  GroupContent,
  TagsGrid,
  TagItem,
  TagName,
  TagActions,
  EmptyGroupState,
  EmptyIcon,
  EmptyText,
  LoadingState
} from './Tags.styles'
import TagGroupModal from './components/TagGroupModal'
import TagModal from './components/TagModal'

function Tags({ onBack }) {
  const dispatch = useDispatch()
  const { tags, loading } = useSelector(state => state.tags)

  const [expandedGroups, setExpandedGroups] = useState({})
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)

  useEffect(() => {
    dispatch(fetchTags())
  }, [dispatch])

  // Group tags by type
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = []
    }
    acc[tag.type].push(tag)
    return acc
  }, {})

  const groupNames = Object.keys(groupedTags).sort()

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const handleCreateGroup = () => {
    setSelectedGroup(null)
    setIsGroupModalOpen(true)
  }

  const handleAddTagToGroup = (groupName) => {
    setSelectedGroup(groupName)
    setSelectedTag(null)
    setIsTagModalOpen(true)
  }

  const handleEditTag = (tag) => {
    setSelectedTag(tag)
    setSelectedGroup(tag.type)
    setIsTagModalOpen(true)
  }

  const handleDeleteTag = async (tagId) => {
    if (confirm('Apakah Anda yakin ingin menghapus tag ini?')) {
      try {
        await dispatch(deleteTag(tagId))
        alert('Tag berhasil dihapus')
      } catch (error) {
        console.error('Error deleting tag:', error)
        alert('Gagal menghapus tag')
      }
    }
  }

  const handleGroupModalSuccess = () => {
    setIsGroupModalOpen(false)
    dispatch(fetchTags())
  }

  const handleTagModalSuccess = () => {
    setIsTagModalOpen(false)
    dispatch(fetchTags())
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <HeaderContent>
          <TitleSection>
            <IconLarge>🏷️</IconLarge>
            <div>
              <Title>Kelola Tag</Title>
              <Subtitle>Buat grup tag dan kelola tag untuk mengorganisir konten</Subtitle>
            </div>
          </TitleSection>
          <ActionsRow>
            <ActionButton onClick={handleCreateGroup}>
              <span>+</span>
              Buat Grup Tag
            </ActionButton>
          </ActionsRow>
        </HeaderContent>
      </Header>

      <Content>
        {loading.isTagsLoading ? (
          <LoadingState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div>Memuat tag...</div>
          </LoadingState>
        ) : groupNames.length === 0 ? (
          <EmptyGroupState>
            <EmptyIcon>🏷️</EmptyIcon>
            <EmptyText>Belum ada grup tag. Klik "Buat Grup Tag" untuk memulai.</EmptyText>
          </EmptyGroupState>
        ) : (
          <GroupsContainer>
            {groupNames.map(groupName => {
              const groupTags = groupedTags[groupName]
              const isExpanded = expandedGroups[groupName]

              return (
                <GroupCard key={groupName} isExpanded={isExpanded}>
                  <GroupHeader onClick={() => toggleGroup(groupName)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <CollapseIcon isExpanded={isExpanded}>
                        ▶
                      </CollapseIcon>
                      <GroupTitle>{groupName}</GroupTitle>
                      <GroupBadge>{groupTags.length} tag</GroupBadge>
                    </div>
                    <GroupActions onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        onClick={() => handleAddTagToGroup(groupName)}
                        title="Tambah tag ke grup ini"
                      >
                        +
                      </IconButton>
                    </GroupActions>
                  </GroupHeader>

                  {isExpanded && (
                    <GroupContent>
                      {groupTags.length === 0 ? (
                        <EmptyGroupState small>
                          <EmptyText small>Belum ada tag dalam grup ini</EmptyText>
                        </EmptyGroupState>
                      ) : (
                        <TagsGrid>
                          {groupTags.map(tag => (
                            <TagItem key={tag.id}>
                              <TagName>{tag.name}</TagName>
                              <TagActions>
                                <IconButton
                                  small
                                  onClick={() => handleEditTag(tag)}
                                  title="Edit tag"
                                >
                                  ✏️
                                </IconButton>
                                <IconButton
                                  small
                                  danger
                                  onClick={() => handleDeleteTag(tag.id)}
                                  title="Hapus tag"
                                >
                                  🗑️
                                </IconButton>
                              </TagActions>
                            </TagItem>
                          ))}
                        </TagsGrid>
                      )}
                    </GroupContent>
                  )}
                </GroupCard>
              )
            })}
          </GroupsContainer>
        )}
      </Content>

      <TagGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSuccess={handleGroupModalSuccess}
      />

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSuccess={handleTagModalSuccess}
        groupType={selectedGroup}
        tag={selectedTag}
      />
    </Container>
  )
}

export default Tags
