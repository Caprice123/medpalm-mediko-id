import styled from 'styled-components'

const TAG_CONFIG = {
  anatomy_topic: {
    emoji: '🫀',
    background: '#ede9fe',
    color: '#5b21b6',
  },
  media_3d: {
    emoji: '🔗',
    label: '3D Interactive',
    background: '#ede9fe',
    color: '#6d28d9',
  },
  media_2d: {
    emoji: '🖼️',
    label: '2D Image',
    background: '#e0f2fe',
    color: '#0369a1',
  },
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

const TagItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: ${props => props.$bg};
  color: ${props => props.$color};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`

function QuizTagList({ tags, type }) {
  const config = TAG_CONFIG[type]

  if (!config) return null

  // Static badge (no tags array needed)
  if (config.label) {
    return (
      <Wrapper>
        <TagItem $bg={config.background} $color={config.color}>
          {config.emoji} {config.label}
        </TagItem>
      </Wrapper>
    )
  }

  if (!tags || tags.length === 0) return null

  return (
    <Wrapper>
      {tags.map(tag => (
        <TagItem key={tag.id} $bg={config.background} $color={config.color}>
          {config.emoji} {tag.name}
        </TagItem>
      ))}
    </Wrapper>
  )
}

export default QuizTagList
