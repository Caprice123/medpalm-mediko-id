import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import LoadMore from '@components/common/LoadMore'
import ConfirmationModal from '@components/common/ConfirmationModal'
import DomainCard from './components/DomainCard'
import { useDomainsPage } from './hooks/useDomainsPage'
import {
  SectionTitle,
  HintText,
  SearchRow,
  CardGrid,
  EmptyCell,
  LoadMoreRow,
} from '../../ChatbotV2.styles'
import { AddRow } from './DomainsPage.styles'

const DomainsPage = () => {
  const {
    search,
    setSearch,
    newDomain,
    setNewDomain,
    newJournal,
    setNewJournal,
    canAdd,
    handleAdd,
    handleLoadMore,
    updateJournalName,
    pendingDeletion,
    requestDeletion,
    cancelDeletion,
    confirmDeletion,
  } = useDomainsPage()

  const domains = useSelector(state => state.chatbotAdminV2.domains)
  const pagination = useSelector(state => state.chatbotAdminV2.domainPagination)
  const isFetching = useSelector(state => state.chatbotAdminV2.loading.isFetchingDomains)
  const isLoadingMore = useSelector(state => state.chatbotAdminV2.loading.isLoadingMoreDomains)
  const isSaving = useSelector(state => state.chatbotAdminV2.loading.isSavingDomain)

  const renderGrid = () => {
    if (isFetching && domains.length === 0) {
      return <EmptyCell>Memuat...</EmptyCell>
    }

    if (domains.length === 0) {
      return (
        <EmptyCell>
          {search
            ? `Tidak ada domain untuk "${search}"`
            : 'Belum ada domain. Tambahkan domain di atas.'}
        </EmptyCell>
      )
    }

    return domains.map((item) => (
      <DomainCard
        key={item.id}
        item={item}
        isSaving={isSaving}
        onUpdateJournalName={updateJournalName}
        onRemove={requestDeletion}
      />
    ))
  }

  return (
    <>
      <SectionTitle>Domain Terpercaya</SectionTitle>
      <HintText>
        Domain URL membatasi pencarian web, sedangkan nama jurnal dipakai oleh retriever
        Mode Research untuk menyaring artikel. Keduanya wajib diisi.
      </HintText>

      <AddRow>
        <TextInput
          placeholder="Domain URL (contoh: thelancet.com)"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
        />
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
          placeholder="Cari domain..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchRow>

      <CardGrid $minCardWidth="320px">{renderGrid()}</CardGrid>

      <LoadMoreRow>
        <LoadMore
          isLastPage={pagination.isLastPage}
          isLoading={isFetching || isLoadingMore}
          itemCount={domains.length}
          onClick={handleLoadMore}
        />
      </LoadMoreRow>

      <ConfirmationModal
        isOpen={Boolean(pendingDeletion)}
        title="Hapus domain"
        message={`Domain "${pendingDeletion?.domain}" akan dihapus dari daftar terpercaya.`}
        icon="🗑️"
        confirmText="Ya, hapus"
        cancelText="Batalkan"
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />
    </>
  )
}

export default DomainsPage
