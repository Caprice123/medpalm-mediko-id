import { useSelector } from 'react-redux'
import { useAnatomyQuizSection } from './hooks/useAnatomyQuizSection'
import CreateQuizModal from './components/CreateQuizModal'
import AnatomySettingsModal from './components/AnatomySettingsModal'
import QuizList from './components/QuizList'
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
  const {
    uiState,
    setUiState,
    useFeatureSetting,
    useCreateQuiz,
    useUpdateQuiz,
  } = useAnatomyQuizSection()

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
