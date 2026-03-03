import { useSelector, useDispatch } from 'react-redux'
import { useAtlasSection } from './hooks/useAtlasSection'
import { actions } from '@store/atlas/reducer'
import { fetchAdminAtlasModels, fetchAdminAtlasModel, deleteAtlasModel } from '@store/atlas/adminAction'
import CreateAtlasModal from './components/CreateAtlasModal'
import UpdateAtlasModal from './components/UpdateAtlasModal'
import AtlasSettingsModal from './components/AtlasSettingsModal'
import AtlasList from './components/AtlasList'
import { Filter } from './components/Filter'
import Button from '@components/common/Button'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
} from './Atlas.styles'

function Atlas({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.atlas)

  const { uiState, setUiState } = useAtlasSection()

  const handlePageChange = (page) => {
    dispatch(actions.setPagination({ ...pagination, page }))
    dispatch(fetchAdminAtlasModels())
  }

  const handleDeleteModel = async (model) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${model.title}"?`)) return
    try {
      await dispatch(deleteAtlasModel(model.uniqueId))
      await dispatch(fetchAdminAtlasModels())
    } catch (error) {
      console.error('Failed to delete atlas model:', error)
    }
  }

  const handleEditModel = async (model) => {
    await dispatch(fetchAdminAtlasModel(model.uniqueId, () => {
      setUiState({ ...uiState, isModalOpen: true, mode: 'update' })
    }))
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Atlas 3D</Title>
          </TitleSection>
          <Actions>
            <Button
              variant="secondary"
              onClick={() => setUiState({ ...uiState, isSettingsModalOpen: true })}
            >
              Pengaturan
            </Button>
            <Button
              variant="primary"
              onClick={() => setUiState({ ...uiState, isModalOpen: true, mode: 'create' })}
            >
              + Tambah Model Baru
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <AtlasList
        onEdit={handleEditModel}
        onDelete={handleDeleteModel}
        onCreateFirst={() => setUiState({ ...uiState, isModalOpen: true, mode: 'create' })}
      />

      {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isGetListAtlasLoading}
          variant="admin"
          language="id"
        />
      )}

      {uiState.isModalOpen && uiState.mode === 'create' && (
        <CreateAtlasModal
          onClose={() => setUiState({ ...uiState, isModalOpen: false, mode: null })}
        />
      )}

      {uiState.isModalOpen && uiState.mode === 'update' && (
        <UpdateAtlasModal
          onClose={() => setUiState({ ...uiState, isModalOpen: false, mode: null })}
        />
      )}

      {uiState.isSettingsModalOpen && (
        <AtlasSettingsModal
          onClose={() => setUiState({ ...uiState, isSettingsModalOpen: false })}
        />
      )}
    </Container>
  )
}

export default Atlas
