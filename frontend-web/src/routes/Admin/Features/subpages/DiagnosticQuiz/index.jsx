import { useSelector, useDispatch } from 'react-redux'
import { useDiagnosticQuizSection } from './hooks/useDiagnosticQuizSection'
import { actions } from '@store/diagnostic/reducer'
import { fetchAdminDiagnosticQuizzes, fetchAdminDiagnosticQuiz, deleteDiagnosticQuiz } from '@store/diagnostic/adminAction'
import CreateQuizModal from './components/CreateQuizModal'
import DiagnosticSettingsModal from './components/DiagnosticSettingsModal'
import QuizList from './components/QuizList'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
} from './DiagnosticQuiz.styles'
import { Filter } from './components/Filter'
import UpdateQuizModal from './components/UpdateQuizModal'

function DiagnosticQuiz({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.diagnostic)

  const {
    uiState,
    setUiState,
  } = useDiagnosticQuizSection()

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminDiagnosticQuizzes())
  }

  const handleDeleteQuiz = async (quiz) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${quiz.title}"?`)) return
    try {
      await dispatch(deleteDiagnosticQuiz(quiz.uniqueId))
      await dispatch(fetchAdminDiagnosticQuizzes())
    } catch (error) {
      console.error('Failed to delete quiz:', error)
    }
  }

  const handleEditQuiz = async (quiz) => {
    // Fetch full quiz details including questions
    await dispatch(fetchAdminDiagnosticQuiz(quiz.uniqueId, () => {
        setUiState({
          ...uiState,
          isCalculatorModalOpen: true,
          mode: "update",
        })
    }))
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Quiz Diagnostik</Title>
          </TitleSection>
          <Actions>
            <Button variant="secondary" secondary onClick={() => setUiState({ ...uiState, setIsFeatureSettingModalOpen: true })}>
              Pengaturan
            </Button>
            <Button variant="primary" onClick={() => setUiState({ ...uiState, isCalculatorModalOpen: true, mode: "create" })}>
              + Tambah Quiz Baru
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <QuizList
        onEdit={handleEditQuiz}
        onDelete={handleDeleteQuiz}
        onCreateFirst={() => setUiState({ ...uiState, isCalculatorModalOpen: true, mode: "create", selectedQuiz: null })}
      />

      {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetListDiagnosticQuizLoading}
          variant="admin"
          language="id"
        />
      )}

      { uiState.isCalculatorModalOpen && uiState.mode == "create" && (
        <CreateQuizModal onClose={() => setUiState({ ...uiState, isCalculatorModalOpen: false, mode: null, selectedQuiz: null })} />
      )}

      { uiState.isCalculatorModalOpen && uiState.mode == "update" && (
        <UpdateQuizModal onClose={() => setUiState({ ...uiState, isCalculatorModalOpen: false, mode: null, selectedQuiz: null })} />
      )}

      { uiState.setIsFeatureSettingModalOpen && (
        <DiagnosticSettingsModal onClose={() => setUiState(prev => ({ ...prev, setIsFeatureSettingModalOpen: false }))}/>
      )}
    </Container>
  )
}

export default DiagnosticQuiz
