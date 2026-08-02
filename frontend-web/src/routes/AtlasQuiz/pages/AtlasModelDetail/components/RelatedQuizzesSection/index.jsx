import { PiMedal } from 'react-icons/pi'
import { DIFFICULTY_LABELS } from '../../utils/labels'
import {
  SectionCard, SectionHeader, SectionTitle, SectionSubtitle,
  QuizGrid, QuizCard, QuizCardTop, QuizIconBox, QuizTitle, QuizCardBottom, TagPill,
} from './RelatedQuizzesSection.styles'

export default function RelatedQuizzesSection({ quizzes, onQuizClick }) {
  if (quizzes.length === 0) return null

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitle><PiMedal size={18} /> Quiz Anatomi Terkait</SectionTitle>
        <SectionSubtitle>Latihan identifikasi struktur berbasis model 3D.</SectionSubtitle>
      </SectionHeader>
      <QuizGrid>
        {quizzes.map(quiz => (
          <QuizCard key={quiz.uniqueId} onClick={() => onQuizClick(quiz)}>
            <QuizCardTop>
              <QuizIconBox><PiMedal size={16} /></QuizIconBox>
              <QuizTitle>{quiz.title}</QuizTitle>
            </QuizCardTop>
            <QuizCardBottom>
              {quiz.difficulty && (
                <TagPill $variant={quiz.difficulty}>
                  {DIFFICULTY_LABELS[quiz.difficulty] ?? quiz.difficulty}
                </TagPill>
              )}
              {quiz.questionCount > 0 && (
                <TagPill $variant="meta">{quiz.questionCount} struktur</TagPill>
              )}
              {quiz.estimatedMinutes > 0 && (
                <TagPill $variant="meta">⏱ {quiz.estimatedMinutes}m</TagPill>
              )}
            </QuizCardBottom>
          </QuizCard>
        ))}
      </QuizGrid>
    </SectionCard>
  )
}
