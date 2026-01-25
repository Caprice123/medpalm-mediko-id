import { useDispatch } from 'react-redux'
import { useExerciseSection } from './hooks/useExerciseSection'
import { fetchExerciseTopic, fetchAdminExerciseTopics } from '@store/exercise/adminAction'
import CreateTopicModal from './components/CreateTopicModal'
import UpdateTopicModal from './components/UpdateTopicModal'
import ExerciseSettingsModal from './components/ExerciseSettingsModal'
import ExerciseList from './components/ExerciseList'
import { Filter } from './components/Filter'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
} from './Exercise.styles'
import Button from "@components/common/Button"

function LatihanSoal({ onBack }) {
  const dispatch = useDispatch()

  const {
    uiState,
    setUiState,
  } = useExerciseSection()

  const handleEditTopic = async (topic) => {
    try {
      const fullTopic = await dispatch(fetchExerciseTopic(topic.id))
      setUiState({
        ...uiState,
        isTopicModalOpen: true,
        mode: "update",
        selectedTopic: fullTopic
      })
    } catch (error) {
      console.error('Failed to fetch topic details:', error)
      alert('Failed to load topic details')
    }
  }

  const handleTopicClose = () => {
    dispatch(fetchAdminExerciseTopics())
    setUiState({
      ...uiState,
      isTopicModalOpen: false,
      mode: null,
      selectedTopic: null
    })
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Latihan Soal</Title>
          </TitleSection>
          <Actions>
            <Button
              variant="secondary"
              onClick={() => setUiState({ ...uiState, isFeatureSettingOpen: true })}
            >
              Pengaturan
            </Button>
            <Button
              variant="primary"
              onClick={() => setUiState({
                ...uiState,
                isTopicModalOpen: true,
                mode: "create",
                selectedTopic: null
              })}
            >
              + Tambah Topik Baru
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <ExerciseList
        onEdit={handleEditTopic}
        onDelete={(id) => {
          // Handle delete
        }}
        onCreateFirst={() => setUiState({
          ...uiState,
          isTopicModalOpen: true,
          mode: "create",
          selectedTopic: null
        })}
      />

      {uiState.isTopicModalOpen && uiState.mode === "create" && (
        <CreateTopicModal
          onClose={handleTopicClose}
        />
      )}

      {uiState.isTopicModalOpen && uiState.mode === "update" && (
        <UpdateTopicModal
          topicToEdit={uiState.selectedTopic}
          onClose={handleTopicClose}
        />
      )}

      {uiState.isFeatureSettingOpen && (
        <ExerciseSettingsModal
          onClose={() => setUiState({ ...uiState, isFeatureSettingOpen: false })}
        />
      )}
    </Container>
  )
}

export default LatihanSoal
