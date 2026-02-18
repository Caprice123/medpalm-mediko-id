import Button from '@components/common/Button'
import {
  FormHeader,
  HeaderTop,
  TopicInfo,
  TagList,
  Tag,
} from '../pages/Detail/Detail.styles'

function QuizHeader({ quiz, onBack }) {
  const universityTags = (quiz?.tags || []).filter(tag => tag.tagGroupId === 4)
  const semesterTags = (quiz?.tags || []).filter(tag => tag.tagGroupId === 5)

  return (
    <FormHeader>
      <HeaderTop>
        <Button onClick={onBack}>← Kembali</Button>
      </HeaderTop>

      <TopicInfo>
        <h2>{quiz.title}</h2>
        {quiz.description && <p>{quiz.description}</p>}

        {universityTags.length > 0 && (
          <TagList>
            {universityTags.map(tag => (
              <Tag key={tag.id} university>{tag.name}</Tag>
            ))}
          </TagList>
        )}

        {semesterTags.length > 0 && (
          <TagList>
            {semesterTags.map(tag => (
              <Tag key={tag.id} semester>{tag.name}</Tag>
            ))}
          </TagList>
        )}
      </TopicInfo>
    </FormHeader>
  )
}

export default QuizHeader
