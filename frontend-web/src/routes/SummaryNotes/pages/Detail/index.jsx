import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import { SummaryNoteDetailSkeleton } from '@components/common/SkeletonCard'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { fetchUserSummaryNoteDetail } from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
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
  ResourceDescription,
  ResourceStats,
  StatItem,
  StatLabel,
  StatValue,
  ModeButtonContainer
} from './Detail.styles'

const SummaryNotesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { detail: note, loading } = useSelector(state => state.summaryNotes)
  const [parsedContent, setParsedContent] = useState(null)
  const [activeResourceType, setActiveResourceType] = useState('flashcards') // 'flashcards' or 'mcq'

  useEffect(() => {
    if (id) {
      dispatch(fetchUserSummaryNoteDetail(id))
    }

    // Cleanup on unmount
    return () => {
      dispatch(actions.setDetail(null))
    }
  }, [id, dispatch])

  // Parse content when note changes
  useEffect(() => {
    async function parseContent() {
      if (note?.content) {
        try {
          const parsed = JSON.parse(note.content)
          if (Array.isArray(parsed)) {
            setParsedContent(parsed)
          }
        } catch {
          // If not JSON, convert markdown to blocks
          const blocks = await markdownToBlocks(note.content)
          setParsedContent(blocks)
        }
      }
    }
    parseContent()
  }, [note])

  const handleBack = () => {
    navigate(-1)
  }

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

            {/* University Tags */}
            {note.universityTags && note.universityTags.length > 0 && (
              <TagList>
                {note.universityTags.map((tag) => (
                  <Tag key={tag.id} university>
                    🏛️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Semester Tags */}
            {note.semesterTags && note.semesterTags.length > 0 && (
              <TagList>
                {note.semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>
                    📚 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Topic Tags */}
            {note.topicTags && note.topicTags.length > 0 && (
              <TagList>
                {note.topicTags.map((tag) => (
                  <Tag key={tag.id} topic>
                    🔬 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Department Tags */}
            {note.departmentTags && note.departmentTags.length > 0 && (
              <TagList>
                {note.departmentTags.map((tag) => (
                  <Tag key={tag.id} department>
                    🏥 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}
          </TopicInfo>
        </NoteHeader>

        <NoteContainer>
          {/* Content Section */}
          <ContentSection>
            <BlockNoteEditor
              initialContent={parsedContent}
              editable={false}
            />
          </ContentSection>

          {/* Reference Section */}
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

          {/* Linked Resources Section with Toggle */}
          {((note.flashcardDecks && note.flashcardDecks.length > 0) ||
            (note.mcqTopics && note.mcqTopics.length > 0)) && (
            <LinkedResourcesSection>
              <SectionTitle>
                📚 Sumber Belajar Terkait
              </SectionTitle>

              {/* Toggle Buttons */}
              <ToggleButtons>
                <ToggleButton
                  active={activeResourceType === 'flashcards'}
                  onClick={() => setActiveResourceType('flashcards')}
                  disabled={!note.flashcardDecks || note.flashcardDecks.length === 0}
                >
                  🃏 Flashcards ({note.flashcardDecks?.length || 0})
                </ToggleButton>
                <ToggleButton
                  active={activeResourceType === 'mcq'}
                  onClick={() => setActiveResourceType('mcq')}
                  disabled={!note.mcqTopics || note.mcqTopics.length === 0}
                >
                  📝 MCQ ({note.mcqTopics?.length || 0})
                </ToggleButton>
              </ToggleButtons>

              {/* Flashcards Grid */}
              {activeResourceType === 'flashcards' && note.flashcardDecks && note.flashcardDecks.length > 0 && (
                <ResourceGrid>
                  {note.flashcardDecks.map((deck) => {
                    const universityTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
                    const semesterTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

                    return (
                      <Card key={deck.id} shadow hoverable>
                        <CardHeader title={deck.title} divider={false} />

                        <CardBody padding="0 1.25rem 1.25rem 1.25rem">
                          <ResourceDescription>
                            {deck.description || 'Tidak ada deskripsi'}
                          </ResourceDescription>

                          {/* University Tags */}
                          {universityTags.length > 0 && (
                            <TagList>
                              {universityTags.map((tag) => (
                                <Tag key={tag.id} university>
                                  🏛️ {tag.name}
                                </Tag>
                              ))}
                            </TagList>
                          )}

                          {/* Semester Tags */}
                          {semesterTags.length > 0 && (
                            <TagList>
                              {semesterTags.map((tag) => (
                                <Tag key={tag.id} semester>
                                  📚 {tag.name}
                                </Tag>
                              ))}
                            </TagList>
                          )}

                          <ResourceStats>
                            <StatItem>
                              <StatLabel>Kartu</StatLabel>
                              <StatValue>{deck.cardCount || 0}</StatValue>
                            </StatItem>
                            <StatItem>
                              <StatLabel>Diperbarui</StatLabel>
                              <StatValue>
                                {deck.updatedAt ? new Date(deck.updatedAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                }) : '-'}
                              </StatValue>
                            </StatItem>
                          </ResourceStats>

                          <Button
                            variant="primary"
                            fullWidth
                            onClick={() => navigate(`/flashcards/${deck.uniqueId}`)}
                          >
                            Mulai Belajar
                          </Button>
                        </CardBody>
                      </Card>
                    )
                  })}
                </ResourceGrid>
              )}

              {/* MCQ Topics Grid */}
              {activeResourceType === 'mcq' && note.mcqTopics && note.mcqTopics.length > 0 && (
                <ResourceGrid>
                  {note.mcqTopics.map((topic) => {
                    const universityTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
                    const semesterTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

                    return (
                      <Card key={topic.id} shadow hoverable>
                        <CardHeader title={topic.title} divider={false} />

                        <CardBody padding="0 1.25rem 1.25rem 1.25rem">
                          <ResourceDescription>
                            {topic.description || 'Tidak ada deskripsi'}
                          </ResourceDescription>

                          <div style={{ flex: 1 }}></div>

                          {/* University Tags */}
                          {universityTags.length > 0 && (
                            <TagList>
                              {universityTags.map((tag) => (
                                <Tag key={tag.id} university>
                                  🏛️ {tag.name}
                                </Tag>
                              ))}
                            </TagList>
                          )}

                          {/* Semester Tags */}
                          {semesterTags.length > 0 && (
                            <TagList>
                              {semesterTags.map((tag) => (
                                <Tag key={tag.id} semester>
                                  📚 {tag.name}
                                </Tag>
                              ))}
                            </TagList>
                          )}

                          <ResourceStats>
                            <StatItem>
                              <StatLabel>Soal</StatLabel>
                              <StatValue>{topic.questionCount || 0}</StatValue>
                            </StatItem>
                            {topic.quizTimeLimit > 0 && (
                              <StatItem>
                                <StatLabel>Waktu</StatLabel>
                                <StatValue>{topic.quizTimeLimit} menit</StatValue>
                              </StatItem>
                            )}
                            <StatItem>
                              <StatLabel>Passing</StatLabel>
                              <StatValue>{topic.passingScore}%</StatValue>
                            </StatItem>
                          </ResourceStats>

                          <ModeButtonContainer>
                            <Button
                              variant="secondary"
                              onClick={() => navigate(`/multiple-choice/${topic.uniqueId}?mode=learning`)}
                              style={{ flex: 1 }}
                            >
                              📖 Learning
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => navigate(`/multiple-choice/${topic.uniqueId}?mode=quiz`)}
                              style={{ flex: 1 }}
                            >
                              ⏱️ Quiz
                            </Button>
                          </ModeButtonContainer>
                        </CardBody>
                      </Card>
                    )
                  })}
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
