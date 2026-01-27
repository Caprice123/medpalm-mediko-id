import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import BlockNoteEditor from '@components/BlockNoteEditor'
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
  LoadingSpinner
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
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat ringkasan...</p>
          </div>
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
            <h2>📝 {note.title}</h2>
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
        </NoteContainer>
      </Content>
    </Container>
  )
}

export default SummaryNotesDetail
