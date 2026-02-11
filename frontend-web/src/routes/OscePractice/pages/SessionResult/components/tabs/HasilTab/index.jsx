import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import { EmptyState } from '../../../styles/shared'
import {
  Container,
  SectionCard,
  SectionTitle,
  SectionIcon,
  InfoGrid,
  InfoCard,
  InfoIcon,
  InfoLabel,
  InfoValue,
  MetricsGrid,
  MetricCard,
  MetricLabel,
  MetricValue,
  StatusBadge,
  StatusLabel,
  MinimumText,
  ScoreCircle,
  ScorePercentage,
  AnalysisGrid,
  CategoryCard,
  CategoryTitle,
  ProgressBarContainer,
  ProgressBar,
  CategoryScore,
  FormulaText,
  FeedbackText,
  ReasonLabel,
  ReasonText,
  TotalScoreCard,
  TotalScoreLabel,
  TotalScoreValue,
  AnswerKeySection,
  AnswerKeyContent,
} from './styles'

function HasilTab({ session }) {
  if (!session) {
    return (
      <Container>
        <EmptyState>
          Sesi ini belum dievaluasi atau belum selesai.
        </EmptyState>
      </Container>
    )
  }

  const { result, topic, topicTitle, topicBatch, startedAt, timeTaken } = session

  // Parse aiFeedback if it's a JSON string
  let scoreBreakdown = []
  if (result?.aiFeedback) {
    try {
      const feedbackData = typeof result.aiFeedback === 'string'
        ? JSON.parse(result.aiFeedback)
        : result.aiFeedback

      scoreBreakdown = feedbackData.criteria || feedbackData || []
    } catch (error) {
      console.error('Error parsing aiFeedback:', error)
    }
  }

  // Get answer key from topic
  const answerKey = topic?.answerKey || session.answerKey

  const totalScore = result?.totalScore || 0
  const maxScore = result?.maxScore || 100
  const percentage = totalScore && maxScore ? Math.round((totalScore / maxScore) * 100) : 0
  const isPassing = percentage >= 60

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatTimeTaken = (seconds) => {
    if (!seconds && seconds !== 0) return '-'

    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = (seconds % 3600) % 60

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Calculate total scores from categories
  const categories = scoreBreakdown
  const totalPossibleScore = categories.reduce((sum, cat) => sum + ((cat.maxScore || 0) / (cat.maxScore || 1) * (cat.weight || 1)), 0)
  const totalEarnedScore = categories.reduce((sum, cat) => sum + ((cat.score || 0) / (cat.maxScore || 1) * (cat.weight || 1)), 0)

  
  const topicTags = session.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
  const batchTags = session.tags?.filter(tag => tag.tagGroup?.name === 'batch') || []
  console.log(topicTags)

  return (
    <Container>
      {/* Ringkasan Section */}
      <SectionCard>
        <SectionTitle>
          <SectionIcon>📊</SectionIcon>
          Ringkasan
        </SectionTitle>

        <InfoGrid>
          <InfoCard>
            <InfoIcon>💬</InfoIcon>
            <div>
              <InfoLabel>JUDUL</InfoLabel>
              <InfoValue>{topic?.title || topicTitle || 'Pasien 1'}</InfoValue>
            </div>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📅</InfoIcon>
            <div>
              <InfoLabel>MULAI PADA</InfoLabel>
              <InfoValue>{formatDate(startedAt)}</InfoValue>
            </div>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📚</InfoIcon>
            <div>
              <InfoLabel>TOPIK</InfoLabel>
              <InfoValue>{topicTags.map((tag) => tag.name).join(",") || 'N/A'}</InfoValue>
            </div>
          </InfoCard>

          <InfoCard>
            <InfoIcon>🎓</InfoIcon>
            <div>
              <InfoLabel>BATCH</InfoLabel>
              <InfoValue>{batchTags.map((tag) => tag.name).join(",") || topicBatch || 'N/A'}</InfoValue>
            </div>
          </InfoCard>
        </InfoGrid>

        <MetricsGrid>
          <MetricCard>
            <MetricLabel>WAKTU DIGUNAKAN</MetricLabel>
            <MetricValue>{formatTimeTaken(timeTaken || result?.timeTaken)}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricLabel>STATUS</MetricLabel>
            <StatusBadge passing={isPassing}>
              <StatusLabel passing={isPassing}>
                {isPassing ? '✓ PASS' : '✗ FAIL'}
              </StatusLabel>
              <MinimumText>Minimum: 60%</MinimumText>
            </StatusBadge>
          </MetricCard>

          <MetricCard>
            <MetricLabel>SKOR</MetricLabel>
            <ScoreCircle passing={isPassing}>
              <ScorePercentage>{percentage}%</ScorePercentage>
            </ScoreCircle>
          </MetricCard>
        </MetricsGrid>
      </SectionCard>

      {/* Analisis Section */}
      {categories.length > 0 && (
        <SectionCard>
          <SectionTitle>
            <SectionIcon>🔍</SectionIcon>
            Analisis
          </SectionTitle>

          <AnalysisGrid>
            {categories.map((category, index) => {
            const catPercentage = category.maxScore ? Math.round((category.score / category.maxScore) * 100) : 0
            const weightedScore = (category.score || 0) / (category.maxScore || 1) * (category.weight || 1)
            return (
              <CategoryCard key={index}>
                <CategoryTitle>{category.type || category.name || category.category}</CategoryTitle>

                <ProgressBarContainer>
                  <ProgressBar width={catPercentage} />
                </ProgressBarContainer>

                <CategoryScore>
                  {category.score || 0}/{category.maxScore || 0} ({catPercentage}%)
                </CategoryScore>

                <FormulaText>
                  Perhitungan: {category.score || 0}/{category.maxScore || 0} x {category.weight || 1} = {weightedScore}
                </FormulaText>

                {category.comment && (
                  <FeedbackText>{category.comment}</FeedbackText>
                )}

                {category.scoreReason && (
                  <>
                    <ReasonLabel>ALASAN:</ReasonLabel>
                    <ReasonText>{category.scoreReason}</ReasonText>
                  </>
                )}
              </CategoryCard>
            )
          })}
        </AnalysisGrid>
        </SectionCard>
      )}

      {/* Total Score */}
      {categories.length > 0 && (
        <>
          <TotalScoreCard>
            <TotalScoreLabel>Total Score:</TotalScoreLabel>
            <TotalScoreValue>
              {totalEarnedScore}/{totalPossibleScore} ({percentage}%)
            </TotalScoreValue>
          </TotalScoreCard>
          <FormulaText style={{ marginTop: '-1rem', marginBottom: '2rem', textAlign: 'center' }}>
            Perhitungan: Total Poin / Total Bobot = {totalEarnedScore}/{totalPossibleScore}
          </FormulaText>
        </>
      )}

      {/* Kunci Jawaban Section */}
      {answerKey && (
        <SectionCard>
          <SectionTitle>
            <SectionIcon>❓</SectionIcon>
            Kunci Jawaban
          </SectionTitle>

          <AnswerKeySection>
            <AnswerKeyContent>
              <CustomMarkdownRenderer item={answerKey} />
            </AnswerKeyContent>
          </AnswerKeySection>
        </SectionCard>
      )}
    </Container>
  )
}

export default HasilTab
