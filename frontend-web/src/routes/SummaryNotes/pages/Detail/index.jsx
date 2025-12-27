import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Button from '@components/common/Button'
import BlockNoteEditor from '@components/BlockNoteEditor'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import {
  Container,
  Content,
  NoteContainer,
  NoteHeader,
  NoteTitle,
  NoteDescription,
  TagList,
  Tag,
  ContentSection,
  LoadingSpinner
} from './Detail.styles'

const SummaryNotesDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [parsedContent, setParsedContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const contentRef = useRef(null)
  const [imageList, setImageList] = useState([])

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true)
        const response = await getWithToken(`${Endpoints.summaryNotes.list}/${id}`)
        const noteData = response.data.data
        setNote(noteData)

        // Parse content - handle both JSON blocks and markdown (legacy)
        if (noteData?.content) {
          try {
            const parsed = JSON.parse(noteData.content)
            if (Array.isArray(parsed)) {
              setParsedContent(parsed)
            }
          } catch (e) {
            // If not JSON, convert markdown to blocks
            const blocks = markdownToBlocks(noteData.content)
            setParsedContent(blocks)
          }
        }
      } catch (error) {
        console.error('Failed to fetch note:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  if (loading || !note) {
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
        <NoteContainer>
          <NoteHeader>
            <Button
              variant="outline"
              onClick={handleBack}
              style={{ minWidth: '44px', padding: '0.5rem 1rem' }}
            >
              ← Back
            </Button>
            <div style={{ flex: 1, marginLeft: '1rem' }}>
              <NoteTitle>{note.title}</NoteTitle>
              {note.description && (
                <NoteDescription>{note.description}</NoteDescription>
              )}
            </div>
          </NoteHeader>

          {/* Tags Section */}
          {((note.universityTags && note.universityTags.length > 0) ||
            (note.semesterTags && note.semesterTags.length > 0)) && (
            <TagList>
              {note.universityTags?.map((tag) => (
                <Tag key={tag.id} university>
                  🏛️ {tag.name}
                </Tag>
              ))}
              {note.semesterTags?.map((tag) => (
                <Tag key={tag.id} semester>
                  📚 {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

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
