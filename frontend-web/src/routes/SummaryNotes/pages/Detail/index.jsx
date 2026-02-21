import Button from '@components/common/Button'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
import { SummaryNoteDetailSkeleton } from '@components/common/SkeletonCard'
import FlashcardDeckCard from './components/FlashcardDeckCard'
import McqTopicCard from './components/McqTopicCard'
import {
  Container,
  Content,
  NoteContainer,
  NoteHeader,
  HeaderTop,
  TopicInfo,
  TagList,
  Tag,
  ContentSection,
  ReferenceSection,
  ReferenceTitle,
  LinkedResourcesSection,
  SectionTitle,
  ToggleButtons,
  ToggleButton,
  ResourceGrid,
} from './Detail.styles'
import { useSummaryNotesDetail } from './hooks/useSummaryNotesDetail'

const SummaryNotesDetail = () => {
  const {
    note, loading,
    parsedContent,
    activeResourceType, setActiveResourceType,
    handleBack,
  } = useSummaryNotesDetail()

  if (loading.isNoteDetailLoading || !note) {
    return (
      <Container>
        <Content>
          <SummaryNoteDetailSkeleton />
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <Content>
        <NoteHeader>
          <HeaderTop>
            <Button variant="secondary" onClick={handleBack}>
              ← Kembali
            </Button>
          </HeaderTop>

          <TopicInfo>
            <h2>{note.title}</h2>
            {note.description && (
              <p>{note.description}</p>
            )}

            {note.universityTags?.length > 0 && (
              <TagList>
                {note.universityTags.map((tag) => (
                  <Tag key={tag.id} university>🏛️ {tag.name}</Tag>
                ))}
              </TagList>
            )}

            {note.semesterTags?.length > 0 && (
              <TagList>
                {note.semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>📚 {tag.name}</Tag>
                ))}
              </TagList>
            )}

            {note.topicTags?.length > 0 && (
              <TagList>
                {note.topicTags.map((tag) => (
                  <Tag key={tag.id} topic>🔬 {tag.name}</Tag>
                ))}
              </TagList>
            )}

            {note.departmentTags?.length > 0 && (
              <TagList>
                {note.departmentTags.map((tag) => (
                  <Tag key={tag.id} department>🏥 {tag.name}</Tag>
                ))}
              </TagList>
            )}
          </TopicInfo>
        </NoteHeader>

        <NoteContainer>
          <ContentSection>
            <BlockNoteEditor
              initialContent={parsedContent}
              editable={false}
            />
          </ContentSection>

          {note.sourceDocument && (
            <ReferenceSection>
              <ReferenceTitle>
                📚 Referensi
              </ReferenceTitle>
              <FileUpload
                file={{
                  name: note.sourceDocument.filename,
                  type: note.sourceDocument.contentType,
                  size: note.sourceDocument.byteSize
                }}
                actions={
                  <Button
                    variant="primary"
                    size="small"
                    as="a"
                    href={note.sourceDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lihat Dokumen
                  </Button>
                }
              />
            </ReferenceSection>
          )}

          {((note.flashcardDecks?.length > 0) || (note.mcqTopics?.length > 0)) && (
            <LinkedResourcesSection>
              <SectionTitle>
                📚 Sumber Belajar Terkait
              </SectionTitle>

              <ToggleButtons>
                <ToggleButton
                  active={activeResourceType === 'flashcards'}
                  onClick={() => setActiveResourceType('flashcards')}
                  disabled={!note.flashcardDecks?.length}
                >
                  🃏 Flashcards ({note.flashcardDecks?.length || 0})
                </ToggleButton>
                <ToggleButton
                  active={activeResourceType === 'mcq'}
                  onClick={() => setActiveResourceType('mcq')}
                  disabled={!note.mcqTopics?.length}
                >
                  📝 MCQ ({note.mcqTopics?.length || 0})
                </ToggleButton>
              </ToggleButtons>

              {activeResourceType === 'flashcards' && note.flashcardDecks?.length > 0 && (
                <ResourceGrid>
                  {note.flashcardDecks.map((deck) => (
                    <FlashcardDeckCard key={deck.id} deck={deck} />
                  ))}
                </ResourceGrid>
              )}

              {activeResourceType === 'mcq' && note.mcqTopics?.length > 0 && (
                <ResourceGrid>
                  {note.mcqTopics.map((topic) => (
                    <McqTopicCard key={topic.id} topic={topic} />
                  ))}
                </ResourceGrid>
              )}
            </LinkedResourcesSection>
          )}
        </NoteContainer>
      </Content>
    </Container>
  )
}

export default SummaryNotesDetail
