import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import { MultipleChoiceRoute } from '@routes/MultipleChoice/routes'
import {
  TagList,
  Tag,
  ResourceDescription,
  ResourceStats,
  StatItem,
  StatLabel,
  StatValue,
  ModeButtonContainer,
} from '../../Detail.styles'

function McqTopicCard({ topic }) {
  const navigate = useNavigate()

  const universityTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
  const semesterTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []
  const topicTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
  const departmentTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'department') || []

  return (
    <Card shadow hoverable>
      <CardHeader title={topic.title} divider={false} />

      <CardBody padding="0 1.25rem 1.25rem 1.25rem">
        <ResourceDescription>
          {topic.description || 'Tidak ada deskripsi'}
        </ResourceDescription>

        <div style={{ flex: 1 }}></div>

        {universityTags.length > 0 && (
          <TagList>
            {universityTags.map((tag) => (
              <Tag key={tag.id} university>🏛️ {tag.name}</Tag>
            ))}
          </TagList>
        )}

        {semesterTags.length > 0 && (
          <TagList>
            {semesterTags.map((tag) => (
              <Tag key={tag.id} semester>📚 {tag.name}</Tag>
            ))}
          </TagList>
        )}

        {topicTags.length > 0 && (
          <TagList>
            {topicTags.map((tag) => (
              <Tag key={tag.id} topic>📖 {tag.name}</Tag>
            ))}
          </TagList>
        )}

        {departmentTags.length > 0 && (
          <TagList>
            {departmentTags.map((tag) => (
              <Tag key={tag.id} department>🏥 {tag.name}</Tag>
            ))}
          </TagList>
        )}

        <ResourceStats>
          <StatItem>
            <StatLabel>Soal</StatLabel>
            <StatValue>{topic.questionCount || 0}</StatValue>
          </StatItem>
          {topic.quizTimeLimit > 0 && (
            <StatItem>
              <StatLabel>Waktu</StatLabel>
              <StatValue>{topic.quizTimeLimit} menit</StatValue>
            </StatItem>
          )}
          <StatItem>
            <StatLabel>Passing</StatLabel>
            <StatValue>{topic.passingScore}%</StatValue>
          </StatItem>
        </ResourceStats>

        <ModeButtonContainer>
          <Button
            variant="secondary"
            onClick={() => navigate(`${MultipleChoiceRoute.moduleRoute}/${topic.uniqueId}?mode=learning`)}
            style={{ flex: 1 }}
          >
            📖 Learning
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`${MultipleChoiceRoute.moduleRoute}/${topic.uniqueId}?mode=quiz`)}
            style={{ flex: 1 }}
          >
            ⏱️ Quiz
          </Button>
        </ModeButtonContainer>
      </CardBody>
    </Card>
  )
}

export default McqTopicCard
