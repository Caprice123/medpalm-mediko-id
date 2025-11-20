import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
        <MarkdownContent>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {summaryNote.content}
          </ReactMarkdown>
        </MarkdownContent>
      </ContentContainer>
    </Container>
  )
}

export default NoteViewer
