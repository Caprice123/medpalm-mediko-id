import { CLASSIFICATION_LABELS, DIFFICULTY_LABELS } from '../../utils/labels'
import { ModelCard, ModelMeta, MetaTag, ModelTitle, ModelDescription } from './QuizInfoCard.styles'

export default function QuizInfoCard({ mod, quiz }) {
  return (
    <ModelCard>
      {mod && (
        <ModelMeta>
          <MetaTag $type="module">{mod.name}</MetaTag>
          {mod.classification && (
            <MetaTag $type={mod.classification}>
              {CLASSIFICATION_LABELS[mod.classification] ?? mod.classification}
            </MetaTag>
          )}
          {quiz.difficulty && (
            <MetaTag $type={quiz.difficulty}>
              {DIFFICULTY_LABELS[quiz.difficulty] ?? quiz.difficulty}
            </MetaTag>
          )}
          {quiz.questionCount > 0 && (
            <MetaTag $type="meta">{quiz.questionCount} struktur</MetaTag>
          )}
          {quiz.estimatedMinutes > 0 && (
            <MetaTag $type="meta">⏱ {quiz.estimatedMinutes}m</MetaTag>
          )}
        </ModelMeta>
      )}
      <ModelTitle>{quiz.title}</ModelTitle>
      {quiz.description && <ModelDescription>{quiz.description}</ModelDescription>}
    </ModelCard>
  )
}
