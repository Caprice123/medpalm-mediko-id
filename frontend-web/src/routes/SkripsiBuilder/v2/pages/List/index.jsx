import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaPlus } from 'react-icons/fa'
import Button from '@components/common/Button'
import LoadMore from '@components/common/LoadMore'
import ConfirmationModal from '@components/common/ConfirmationModal'
import SetFilter from './components/SetFilter'
import SetsGrid from './components/SetsGrid'
import CreateSetModal from './components/CreateSetModal'
import { useSetList } from './hooks/useSetList'
import { Container, ContentWrapper, Header, LoadMoreRow } from './List.styles'

const SkripsiList = () => {
  const {
    handleLoadMore,
    pendingDeletion,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  } = useSetList()

  // Modal visibility is the one piece of state that stays local by convention.
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const setCount = useSelector(state => state.skripsiV2.sets.length)
  const pagination = useSelector(state => state.skripsiV2.pagination)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingSets)
  const isLoadingMore = useSelector(state => state.skripsiV2.loading.isLoadingMoreSets)
  const isDeleting = useSelector(state => state.skripsiV2.loading.isDeletingSet)

  return (
    <Container>
      <ContentWrapper>
        <SetFilter />

        <Header>
          <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
            <FaPlus /> Buat Set Baru
          </Button>
        </Header>

        <SetsGrid onDelete={requestDeletion} />

        <LoadMoreRow>
          <LoadMore
            isLastPage={pagination.isLastPage}
            isLoading={isFetching || isLoadingMore}
            itemCount={setCount}
            onClick={handleLoadMore}
          />
        </LoadMoreRow>
      </ContentWrapper>

      <CreateSetModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <ConfirmationModal
        isOpen={Boolean(pendingDeletion)}
        title="Hapus set"
        message={`Set "${pendingDeletion?.title || 'tanpa judul'}" akan dihapus beserta seluruh tab dan percakapannya. Tindakan ini tidak dapat dibatalkan.`}
        icon="🗑️"
        confirmText={isDeleting ? 'Menghapus...' : 'Ya, hapus'}
        cancelText="Batalkan"
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />
    </Container>
  )
}

export default SkripsiList
