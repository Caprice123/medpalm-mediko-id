import { useSelector } from 'react-redux'
import { PiMedal } from 'react-icons/pi'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import ClassificationIcon from '../ClassificationIcon'
import { classificationLabel, classificationType, DIFFICULTY_LABELS } from '../../utils/classification'
import { FilterRow, TagRow, ClassificationTag, ArrowIcon } from '../../TopicDetail.styles'
import { useQuizzesPanel } from './hooks/useQuizzesPanel'
import {
  QuizSection, QuizSectionHeader, QuizSectionTitle, QuizSectionSubtitle,
  QuizGrid, QuizCard, QuizCardTop, QuizIconBox, QuizTitle, QuizModuleName, QuizCardDivider, QuizCardBottom, QuizMeta,
  DifficultyTag,
} from './QuizzesPanel.styles'

export default function QuizzesPanel({
  onQuizModuleFilterChange, onLoadMoreQuizzes, onQuizClick,
}) {
  const quizzesPagination = useSelector(s => s.atlasQuiz.quizzesPagination)
  const moduleOptions = useSelector(s => s.atlasQuiz.moduleOptions)
  const isLoadingQuizzes = useSelector(s => s.atlasQuiz.loading.isFetchingAnatomyQuizzes)
  const { searchQuiz, setSearchQuiz, filteredQuizzes } = useQuizzesPanel()

  return (
    <QuizSection>
      <QuizSectionHeader>
        <QuizSectionTitle>
          <PiMedal size={20} /> Quiz 3D Anatomi Terkait
        </QuizSectionTitle>
        <QuizSectionSubtitle>
          Latihan berbasis model 3D — identifikasi struktur langsung pada model, bukan pilihan ganda.
        </QuizSectionSubtitle>
      </QuizSectionHeader>

      <FilterRow>
        <div style={{ flex: 1 }}>
          <TextInput
            placeholder="Cari quiz..."
            value={searchQuiz}
            onChange={e => setSearchQuiz(e.target.value)}
          />
        </div>
        <div style={{ width: '200px', flexShrink: 0 }}>
          <Dropdown
            options={moduleOptions.map(m => ({ value: m.name, label: m.name }))}
            onChange={onQuizModuleFilterChange}
            placeholder="Semua modul"
            isClearable
          />
        </div>
      </FilterRow>

      {isLoadingQuizzes ? (
        <Loading />
      ) : filteredQuizzes.length === 0 ? (
        <EmptyState icon="📝" title="Belum ada quiz tersedia" />
      ) : (
        <QuizGrid>
          {filteredQuizzes.map(quiz => (
            <QuizCard key={quiz.uniqueId} onClick={() => onQuizClick(quiz)}>
              <QuizCardTop>
                <QuizIconBox><PiMedal size={18} /></QuizIconBox>
                <div>
                  <QuizTitle>{quiz.title}</QuizTitle>
                  <QuizModuleName>Model: {quiz.module.name}</QuizModuleName>
                </div>
              </QuizCardTop>
              <QuizCardDivider />
              <QuizCardBottom>
                <TagRow>
                  {quiz.module.classification && (
                    <ClassificationTag $type={classificationType(quiz.module.classification)}>
                      <ClassificationIcon type={classificationType(quiz.module.classification)} /> {classificationLabel(quiz.module.classification)}
                    </ClassificationTag>
                  )}
                  {quiz.difficulty && (
                    <DifficultyTag $level={quiz.difficulty}>
                      {DIFFICULTY_LABELS[quiz.difficulty] ?? quiz.difficulty}
                    </DifficultyTag>
                  )}
                  {quiz.questionCount > 0 && (
                    <QuizMeta>{quiz.questionCount} struktur</QuizMeta>
                  )}
                  {quiz.estimatedMinutes > 0 && (
                    <QuizMeta>⏱ {quiz.estimatedMinutes}m</QuizMeta>
                  )}
                </TagRow>
                <ArrowIcon>→</ArrowIcon>
              </QuizCardBottom>
            </QuizCard>
          ))}
        </QuizGrid>
      )}

      {!quizzesPagination.isLastPage && (
        <Button
          onClick={onLoadMoreQuizzes}
          disabled={isLoadingQuizzes}
          variant="secondary"
          style={{ margin: '1rem auto 0', display: 'block' }}
        >
          {isLoadingQuizzes ? 'Memuat...' : 'Muat Lebih Banyak'}
        </Button>
      )}
    </QuizSection>
  )
}
