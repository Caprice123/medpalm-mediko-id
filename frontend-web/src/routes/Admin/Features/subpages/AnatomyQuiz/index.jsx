import { useSelector, useDispatch } from 'react-redux'
import { useAnatomyQuizSection } from './hooks/useAnatomyQuizSection'
import { actions } from '@store/anatomy/reducer'
import { fetchAdminAnatomyQuizzes, fetchAdminAnatomyQuiz } from '@store/anatomy/adminAction'
import CreateQuizModal from './components/CreateQuizModal'
import AnatomySettingsModal from './components/AnatomySettingsModal'
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
} from './AnatomyQuiz.styles'
import { Filter } from './components/Filter'
import UpdateQuizModal from './components/UpdateQuizModal'

function AnatomyQuiz({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.anatomy)

  const {
    uiState,
    setUiState,
  } = useAnatomyQuizSection()

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminAnatomyQuizzes())
  }

  const handleEditQuiz = async (quiz) => {
    // Fetch full quiz details including questions
    await dispatch(fetchAdminAnatomyQuiz(quiz.id, () => {
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
            <Title>Kelola Quiz Anatomi</Title>
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
        onDelete={(id) => {
          // Handle delete
        }}
        onCreateFirst={() => setUiState({ ...uiState, isCalculatorModalOpen: true, mode: "create", selectedQuiz: null })}
      />

      {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetListAnatomyQuizLoading}
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
        <AnatomySettingsModal onClose={() => setUiState(prev => ({ ...prev, setIsFeatureSettingModalOpen: false }))}/>
      )}
    </Container>
  )
}

export default AnatomyQuiz
