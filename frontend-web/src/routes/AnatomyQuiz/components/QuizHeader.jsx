import Button from '@components/common/Button'
import {
  FormHeader,
  HeaderTop,
  TopicInfo,
} from '../pages/Detail/Detail.styles'
import QuizTagList from './QuizTagList'

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
        <QuizTagList tags={anatomyTopicTags} type="anatomy_topic" />
      </TopicInfo>
    </FormHeader>
  )
}

export default QuizHeader
