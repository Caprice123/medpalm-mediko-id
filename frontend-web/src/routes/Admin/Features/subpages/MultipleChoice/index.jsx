import { useSelector, useDispatch } from 'react-redux'
import { useMcqSection } from './hooks/useMcqSection'
import { actions } from '@store/mcq/reducer'
import { fetchAdminMcqTopics, fetchMcqTopicDetail, deleteMcqTopic } from '@store/mcq/action'
import CreateTopicModal from './components/CreateTopicModal'
import UpdateTopicModal from './components/UpdateTopicModal'
import McqSettingsModal from './components/McqSettingsModal'
import TopicList from './components/TopicList'
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
} from './MultipleChoice.styles'
import { Filter } from './components/Filter'
import Button from '@components/common/Button'

function MultipleChoice({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.mcq)

  const {
    uiState,
    setUiState,
  } = useMcqSection()

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminMcqTopics())
  }

  const handleEditTopic = async (topic) => {
    await dispatch(fetchMcqTopicDetail(topic.uniqueId, () => {
      setUiState({
        ...uiState,
        isTopicModalOpen: true,
        mode: "update",
      })
    }))
  }

  const handleDeleteTopic = async (topic) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${topic.title}"?`)) {
      return
    }

    try {
      await dispatch(deleteMcqTopic(topic.uniqueId))
      await dispatch(fetchAdminMcqTopics())
    } catch (error) {
      console.error('Failed to delete topic:', error)
    }
  }

  return (
    <Container>
      <Header>
        <Button onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Multiple Choice Quiz</Title>
          </TitleSection>
          <Actions>
            <Button onClick={() => setUiState({ ...uiState, isFeatureSettingModalOpen: true })}>
              Pengaturan
            </Button>
            <Button variant="primary" onClick={() => setUiState({ ...uiState, isTopicModalOpen: true, mode: "create" })}>
              + Tambah Topik Baru
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <TopicList
        onEdit={handleEditTopic}
        onDelete={handleDeleteTopic}
        onCreateFirst={() => setUiState({ ...uiState, isTopicModalOpen: true, mode: "create", selectedTopic: null })}
      />

      <Pagination
        currentPage={pagination.page}
        isLastPage={pagination.isLastPage}
        onPageChange={handlePageChange}
        isLoading={loading.isTopicsLoading}
        variant="admin"
        language="id"
      />

      { uiState.isTopicModalOpen && uiState.mode === "create" && (
        <CreateTopicModal onClose={() => setUiState({ ...uiState, isTopicModalOpen: false, mode: null, selectedTopic: null })} />
      )}

      { uiState.isTopicModalOpen && uiState.mode === "update" && (
        <UpdateTopicModal onClose={() => setUiState({ ...uiState, isTopicModalOpen: false, mode: null, selectedTopic: null })} />
      )}

      { uiState.isFeatureSettingModalOpen && (
        <McqSettingsModal onClose={() => setUiState(prev => ({ ...prev, isFeatureSettingModalOpen: false }))}/>
      )}
    </Container>
  )
}

export default MultipleChoice
