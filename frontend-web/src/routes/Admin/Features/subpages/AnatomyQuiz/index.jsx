import { useSelector, useDispatch } from 'react-redux'
import { useAnatomyQuizSection } from './hooks/useAnatomyQuizSection'
import { actions } from '@store/anatomy/reducer'
import { fetchAdminAnatomyQuizzes } from '@store/anatomy/action'
import CreateQuizModal from './components/CreateQuizModal'
import AnatomySettingsModal from './components/AnatomySettingsModal'
import QuizList from './components/QuizList'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  ActionButton
} from './AnatomyQuiz.styles'
import { Filter } from './components/Filter'

function AnatomyQuiz({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.anatomy)

  const {
    uiState,
    setUiState,
    useFeatureSetting,
    useCreateQuiz,
    useUpdateQuiz,
  } = useAnatomyQuizSection()

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminAnatomyQuizzes())
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>← Back</BackButton>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Quiz Anatomi</Title>
          </TitleSection>
          <Actions>
            <ActionButton secondary onClick={() => setUiState({ ...uiState, setIsFeatureSettingModalOpen: true })}>
              Pengaturan
            </ActionButton>
            <ActionButton onClick={() => setUiState({ ...uiState, isCalculatorModalOpen: true, mode: "create" })}>
              + Tambah Quiz Baru
            </ActionButton>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <QuizList
        onEdit={(quiz) => setUiState({ ...uiState, isCalculatorModalOpen: true, mode: "update", selectedQuiz: quiz })}
        onDelete={(id) => {
          // Handle delete
        }}
        onCreateFirst={() => setUiState({ ...uiState, isCalculatorModalOpen: true, mode: "create", selectedQuiz: null })}
      />

      <Pagination
        currentPage={pagination.page}
        isLastPage={pagination.isLastPage}
        onPageChange={handlePageChange}
        isLoading={loading.isQuizzesLoading}
        variant="admin"
        language="id"
      />

      <CreateQuizModal
        isOpen={uiState.isCalculatorModalOpen}
        mode={uiState.mode}
        handler={useCreateQuiz}
        onClose={() => setUiState({ ...uiState, isCalculatorModalOpen: false, mode: null, selectedQuiz: null })}
      />

      <AnatomySettingsModal
        isOpen={uiState.setIsFeatureSettingModalOpen}
        form={useFeatureSetting.form}
        onClose={useFeatureSetting.onClose}
      />
    </Container>
  )
}

export default AnatomyQuiz
