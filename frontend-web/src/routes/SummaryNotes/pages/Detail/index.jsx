import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import BlockNoteEditor from '@components/BlockNoteEditor'
import FileUpload from '@components/common/FileUpload'
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
  ReferenceTitle
} from './Detail.styles'

const SummaryNotesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { detail: note, loading } = useSelector(state => state.summaryNotes)
  const [parsedContent, setParsedContent] = useState(null)

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
        </NoteContainer>
      </Content>
    </Container>
  )
}

export default SummaryNotesDetail
