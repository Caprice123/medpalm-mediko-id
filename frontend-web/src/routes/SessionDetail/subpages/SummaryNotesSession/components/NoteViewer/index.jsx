import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import BlockNoteEditor from '@components/BlockNoteEditor'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import {
  Container,
  Header,
  BackButton,
  TitleSection,
  Title,
  MetaInfo,
  TagsContainer,
  Tag,
  ContentContainer,
  MarkdownContent
} from './NoteViewer.styles'

function NoteViewer({ session }) {
  const navigate = useNavigate()
  const { summaryNote } = session || {}
  const [parsedContent, setParsedContent] = useState(null)

  // Parse content - handle both JSON blocks and markdown (legacy)
  useEffect(() => {
    if (!summaryNote?.content) {
      setParsedContent(null)
      return
    }

    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(summaryNote.content)
      if (Array.isArray(parsed)) {
        setParsedContent(parsed)
      } else {
        setParsedContent(null)
      }
    } catch (e) {
      // If not JSON, convert markdown to blocks
      const blocks = markdownToBlocks(summaryNote.content)
      setParsedContent(blocks)
    }
  }, [summaryNote])

  const handleBack = () => {
    navigate(-1)
  }

  if (!summaryNote) {
    return (
      <Container>
        <Header>
          <BackButton onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </BackButton>
          <div>
            <Title>Ringkasan tidak ditemukan</Title>
          </div>
        </Header>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </BackButton>
        <TitleSection>
          <Title>{summaryNote.title}</Title>
          {summaryNote.description && (
            <MetaInfo>{summaryNote.description}</MetaInfo>
          )}
        </TitleSection>
      </Header>

      {summaryNote.tags && summaryNote.tags.length > 0 && (
        <TagsContainer>
          {summaryNote.tags.map(tag => (
            <Tag key={tag.id} type={tag.type}>
              {tag.name}
            </Tag>
          ))}
        </TagsContainer>
      )}

      <ContentContainer>
        <BlockNoteEditor
          initialContent={parsedContent}
          editable={false}
        />
      </ContentContainer>
    </Container>
  )
}

export default NoteViewer
