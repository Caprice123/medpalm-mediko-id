import { useSelector } from 'react-redux'
import {
  Container,
  Header,
  HeaderContent,
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
  EmptyText,
  LoadingState
} from './Tags.styles'
import TagModal from './components/TagModal'
import { useTagSection } from './hooks/useTagSection'
import Button from '@components/common/Button'

function Tags({ onBack }) {
  const { tags, loading } = useSelector(state => state.tags)
  const {
    uiState,
    expandedGroups,
    toggleGroup,
    useCreateTag,
    useUpdateTag,
  } = useTagSection()

  const modeHandler = uiState.mode === "create" ? useCreateTag : useUpdateTag

  return (
    <Container>
      <Header>
        {onBack && <Button variant="secondary" onClick={onBack}>←</Button>}
        <HeaderContent>
          {/* No create tag group button since we don't allow creation from frontend */}
        </HeaderContent>
      </Header>

      <Content>
        {loading.isGetListTagsLoading ? (
          <LoadingState>
            <div>Memuat tag...</div>
          </LoadingState>
        ) : tags.length === 0 ? (
          <EmptyGroupState>
            <EmptyText>Belum ada grup tag.</EmptyText>
          </EmptyGroupState>
        ) : (
          <GroupsContainer>
            {tags.map(tagGroup => {
              const isExpanded = expandedGroups[tagGroup.name]

              return (
                <GroupCard key={tagGroup.name} isExpanded={isExpanded}>
                  <GroupHeader onClick={() => toggleGroup(tagGroup.name)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <CollapseIcon isExpanded={isExpanded}>
                        ▶
                      </CollapseIcon>
                      <GroupTitle>{tagGroup.name}</GroupTitle>
                      <GroupBadge>{tagGroup.tags?.length || 0} tag</GroupBadge>
                    </div>
                    <GroupActions onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        onClick={() => useCreateTag.onOpen(tagGroup.name)}
                        title="Tambah tag ke grup ini"
                      >
                        +
                      </IconButton>
                    </GroupActions>
                  </GroupHeader>

                  {isExpanded && (
                    <GroupContent>
                      {!tagGroup.tags || tagGroup.tags.length === 0 ? (
                        <EmptyGroupState small>
                          <EmptyText small>Belum ada tag dalam grup ini</EmptyText>
                        </EmptyGroupState>
                      ) : (
                        <TagsGrid>
                          {tagGroup.tags.map(tag => (
                            <TagItem key={tag.id}>
                              <TagName>{tag.name}</TagName>
                              <TagActions>
                                <IconButton
                                  small
                                  onClick={() => useUpdateTag.onOpen(tag, tagGroup.name)}
                                  title="Edit tag"
                                >
                                  Edit
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

      <TagModal
        isOpen={uiState.isTagModalOpen}
        mode={uiState.mode}
        isLoading={loading.isCreateTagLoading || loading.isUpdateTagLoading}
        formik={modeHandler.formik}
        onClose={modeHandler.onHide}
        onSubmit={modeHandler.formik.handleSubmit}
      />
    </Container>
  )
}

export default Tags
