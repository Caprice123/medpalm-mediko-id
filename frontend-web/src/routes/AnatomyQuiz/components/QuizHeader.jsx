import Button from '@components/common/Button'
import {
  FormHeader,
  HeaderTop,
  TopicInfo,
  TagList,
  Tag,
} from '../pages/Detail/Detail.styles'

function QuizHeader({ quiz, onBack }) {
  const anatomyTopicTags = (quiz?.tags || []).filter(tag => tag.tagGroupName === 'anatomy_topic')

  return (
    <FormHeader>
      <HeaderTop>
        <Button onClick={onBack}>← Kembali</Button>
      </HeaderTop>

      <TopicInfo>
        <h2>{quiz.title}</h2>
        {quiz.description && <p>{quiz.description}</p>}

        {anatomyTopicTags.length > 0 && (
          <TagList>
            {anatomyTopicTags.map(tag => (
              <Tag key={tag.id}>🫀 {tag.name}</Tag>
            ))}
          </TagList>
        )}
      </TopicInfo>
    </FormHeader>
  )
}

export default QuizHeader
