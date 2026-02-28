import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchAtlasModel } from '@store/atlas/userAction'
import Button from '@components/common/Button'
import {
  Container,
  Content,
  FormHeader,
  HeaderTop,
  TopicInfo,
  TagList,
  Tag,
  EmbedWrapper,
  EmbedFrame,
  LoadingSpinner
} from './Detail.styles'

function AtlasDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uniqueId } = useParams()
  const { detail: model, loading } = useSelector(state => state.atlas)

  useEffect(() => {
    if (uniqueId) {
      dispatch(fetchAtlasModel(uniqueId))
    }
  }, [dispatch, uniqueId])

  if (loading?.isGetDetailAtlasLoading || !model) {
    return (
      <Container>
        <Content>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat atlas...</p>
          </div>
        </Content>
      </Container>
    )
  }

  const topicTags = (model.tags || []).filter(t => t.tagGroupName === 'atlas_topic')
  const subtopicTags = (model.tags || []).filter(t => t.tagGroupName === 'atlas_subtopic')

  return (
    <Container>
      <Content>
        <FormHeader>
          <HeaderTop>
            <Button onClick={() => navigate(-1)}>← Kembali</Button>
          </HeaderTop>

          <TopicInfo>
            <h2>{model.title}</h2>
            {model.description && <p>{model.description}</p>}

            {topicTags.length > 0 && (
              <TagList>
                {topicTags.map(tag => (
                  <Tag key={tag.id} topic>{tag.name}</Tag>
                ))}
              </TagList>
            )}

            {subtopicTags.length > 0 && (
              <TagList>
                {subtopicTags.map(tag => (
                  <Tag key={tag.id} subtopic>{tag.name}</Tag>
                ))}
              </TagList>
            )}
          </TopicInfo>
        </FormHeader>

        <EmbedWrapper>
          <EmbedFrame
            src={model.embedUrl}
            title={model.title}
            allowFullScreen
            allow="fullscreen"
          />
        </EmbedWrapper>
      </Content>
    </Container>
  )
}

export default AtlasDetailPage
