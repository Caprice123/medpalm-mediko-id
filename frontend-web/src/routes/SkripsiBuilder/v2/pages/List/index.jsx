import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import Button from '@components/common/Button'
import LoadMore from '@components/common/LoadMore'
import ConfirmationModal from '@components/common/ConfirmationModal'
import SetFilter from './components/SetFilter'
import SetsGrid from './components/SetsGrid'
import { useSetList } from './hooks/useSetList'
import { PblBuilderRoute } from '../../../routes'
import { Container, ContentWrapper, Header, LoadMoreRow } from './List.styles'

const SkripsiList = () => {
  const {
    handleLoadMore,
    pendingDeletion,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  } = useSetList()

  const navigate = useNavigate()

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
          {/* Creating a report is a page of its own now: a template has to be
              picked before the set exists, which is more than a modal holds. */}
          <Button variant="primary" onClick={() => navigate(PblBuilderRoute.createRoute)}>
            <FaPlus /> Buat Laporan Baru
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
