import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import LoadMore from '@components/common/LoadMore'
import ConfirmationModal from '@components/common/ConfirmationModal'
import { useJournalsPage } from './hooks/useJournalsPage'
import {
  SectionTitle,
  HintText,
  SearchRow,
  CardGrid,
  EmptyCell,
  LoadMoreRow,
} from '../../ChatbotV2.styles'
import { AddRow, JournalCard, JournalName } from './JournalsPage.styles'

const JournalsPage = () => {
  const {
    search,
    setSearch,
    newJournal,
    setNewJournal,
    canAdd,
    handleAdd,
    handleLoadMore,
    pendingDeletion,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  } = useJournalsPage()

  const journals = useSelector(state => state.chatbotAdminV2.journals)
  const pagination = useSelector(state => state.chatbotAdminV2.journalPagination)
  const isFetching = useSelector(state => state.chatbotAdminV2.loading.isFetchingJournals)
  const isLoadingMore = useSelector(state => state.chatbotAdminV2.loading.isLoadingMoreJournals)
  const isSaving = useSelector(state => state.chatbotAdminV2.loading.isSavingJournal)

  const renderGrid = () => {
    if (isFetching && journals.length === 0) {
      return <EmptyCell>Memuat...</EmptyCell>
    }

    if (journals.length === 0) {
      return (
        <EmptyCell>
          {search
            ? `Tidak ada jurnal untuk "${search}"`
            : 'Belum ada jurnal. Tambahkan nama jurnal di atas.'}
        </EmptyCell>
      )
    }

    return journals.map((item) => (
      <JournalCard key={item.id} $inactive={!item.is_active}>
        <JournalName>{item.name}</JournalName>
        <Button variant="danger" size="small" type="button" onClick={() => requestDeletion(item)}>
          ✕
        </Button>
      </JournalCard>
    ))
  }

  return (
    <>
      <SectionTitle>Nama Jurnal</SectionTitle>
      <HintText>
        Daftar jurnal ilmiah yang dipakai sebagai filter Mode Research. Pengguna tutor dapat
        memilih jurnal tertentu dari daftar ini.
      </HintText>

      <AddRow>
        <TextInput
          placeholder="Nama jurnal (contoh: The Lancet)"
          value={newJournal}
          onChange={(e) => setNewJournal(e.target.value)}
        />
        <Button variant="primary" type="button" onClick={handleAdd} disabled={!canAdd || isSaving}>
          {isSaving ? 'Menyimpan...' : 'Tambah'}
        </Button>
      </AddRow>

      <SearchRow>
        <TextInput
          placeholder="Cari jurnal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchRow>

      <CardGrid $minCardWidth="280px">{renderGrid()}</CardGrid>

      <LoadMoreRow>
        <LoadMore
          isLastPage={pagination.isLastPage}
          isLoading={isFetching || isLoadingMore}
          itemCount={journals.length}
          onClick={handleLoadMore}
        />
      </LoadMoreRow>

      <ConfirmationModal
        isOpen={Boolean(pendingDeletion)}
        title="Hapus jurnal"
        message={`Jurnal "${pendingDeletion?.name}" akan dihapus dari daftar filter Mode Research.`}
        icon="🗑️"
        confirmText="Ya, hapus"
        cancelText="Batalkan"
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />
    </>
  )
}

export default JournalsPage
