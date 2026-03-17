import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAdminSets, deleteAdminSet } from '@store/skripsi/adminAction'
import SettingsModal from './components/SettingsModal'
import SetsList from './components/SetsList'
import SetDetailModal from './components/SetDetailModal'
import DomainsTab from './subtabs/Domains'
import JournalsTab from './subtabs/Journals'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  TabsContainer,
  Tab,
} from './SkripsiBuilder.styles'
import Button from '@components/common/Button'
import { Filter } from './components/Filter'
import { getUserData } from '@utils/authToken'

const ALLOWED_EMAIL = 'kelvinpalem@gmail.com'

const SkripsiBuilderAdmin = ({ onBack }) => {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.skripsi)
  const currentUser = getUserData()
  const isAllowed = currentUser?.email === ALLOWED_EMAIL

  const [activeTab, setActiveTab] = useState('sets')
  const [uiState, setUiState] = useState({
    isSettingsModalOpen: false,
    isDetailModalOpen: false,
    selectedSet: null
  })
  
  useEffect(() => {
    if (isAllowed) {
      dispatch(fetchAdminSets({}, 1, 20))
    }
  }, [dispatch, isAllowed])

  const handlePageChange = (page) => {
    dispatch(fetchAdminSets({}, page, 20))
  }

  const handleViewSet = (set) => {
    setUiState({
      ...uiState,
      isDetailModalOpen: true,
      selectedSet: set
    })
  }

  const handleDeleteSet = async (set) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus set "${set.title}"?`)) {
      return
    }

    try {
      await dispatch(deleteAdminSet(set.uniqueId))
      await dispatch(fetchAdminSets({}, pagination.page, 20))
    } catch (error) {
      console.error('Failed to delete set:', error)
    }
  }

  const handleCloseDetailModal = () => {
    setUiState(prev => ({
      ...prev,
      isDetailModalOpen: false,
      selectedSet: null
    }))
  }

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>← Kembali</Button>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Skripsi Builder</Title>
          </TitleSection>
          <Actions>
            <Button variant="secondary" onClick={() => setUiState({ ...uiState, isSettingsModalOpen: true })}>
              Pengaturan Fitur
            </Button>
          </Actions>
        </HeaderContent>
      </Header>

      <TabsContainer>
        <Tab active={activeTab === 'sets'} onClick={() => setActiveTab('sets')}>
          Set Riset
        </Tab>
        <Tab active={activeTab === 'domains'} onClick={() => setActiveTab('domains')}>
          Domain
        </Tab>
        <Tab active={activeTab === 'journals'} onClick={() => setActiveTab('journals')}>
          Jurnal
        </Tab>
      </TabsContainer>

      {activeTab === 'sets' && isAllowed && (
        <>
          <Filter />

          <SetsList
            onView={handleViewSet}
            onDelete={handleDeleteSet}
          />

          {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
            <Pagination
              currentPage={pagination.page}
              isLastPage={pagination.isLastPage}
              onPageChange={handlePageChange}
              isLoading={loading.isSetsLoading}
              variant="admin"
              language="id"
            />
          )}

          {uiState.isDetailModalOpen && uiState.selectedSet && (
            <SetDetailModal
              set={uiState.selectedSet}
              isOpen={uiState.isDetailModalOpen}
              onClose={handleCloseDetailModal}
            />
          )}
        </>
      )}

      {activeTab === 'domains' && <DomainsTab />}

      {activeTab === 'journals' && <JournalsTab />}

      {uiState.isSettingsModalOpen && (
        <SettingsModal
          isOpen={uiState.isSettingsModalOpen}
          onClose={() => setUiState(prev => ({ ...prev, isSettingsModalOpen: false }))}
        />
      )}
    </Container>
  )
}

export default SkripsiBuilderAdmin
