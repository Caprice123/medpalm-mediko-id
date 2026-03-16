import { useState, useEffect } from 'react'
import { useJournalNames } from '../../hooks/useJournalNames'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Pagination from '@components/Pagination'
import styled from 'styled-components'

const Wrapper = styled.div``

const TopBar = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: flex-end;
`

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
  &::placeholder { color: #9ca3af; }
`

const AddRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  align-items: flex-end;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.5rem;
  min-height: 120px;
`

const JournalCard = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: start;
  opacity: ${({ $inactive }) => $inactive ? 0.5 : 1};
`

const JournalName = styled.span`
  flex: 1;
  word-break: break-word;
  color: #111827;
  font-weight: 500;
`

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
`

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
`

const HintText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 1.25rem 0;
`

const StatusBadge = styled.span`
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: ${({ $active }) => $active ? '#dcfce7' : '#f3f4f6'};
  color: ${({ $active }) => $active ? '#166534' : '#6b7280'};
  white-space: nowrap;
`

function JournalCardItem({ item, onToggle, onRemove }) {
  return (
    <JournalCard $inactive={!item.is_active}>
      <JournalName>{item.name}</JournalName>
      <StatusBadge $active={item.is_active}>{item.is_active ? 'Aktif' : 'Nonaktif'}</StatusBadge>
      <Button
        variant="secondary"
        size="small"
        type="button"
        onClick={() => onToggle(item.id, !item.is_active)}
        title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
      >
        {item.is_active ? 'Off' : 'On'}
      </Button>
      <Button variant="danger" size="small" type="button" onClick={() => onRemove(item.id)}>
        ✕
      </Button>
    </JournalCard>
  )
}

function JournalsTab() {
  const {
    journals, pagination, search, loading,
    initialize, handleSearchChange, handlePageChange,
    addJournal, toggleJournal, removeJournal
  } = useJournalNames()

  const [newJournal, setNewJournal] = useState('')

  useEffect(() => {
    initialize()
  }, [])

  const handleAdd = async () => {
    const name = newJournal.trim()
    if (!name) return
    await addJournal(name)
    setNewJournal('')
  }

  return (
    <Wrapper>
      <SectionTitle>Nama Jurnal</SectionTitle>
      <HintText>
        Daftar nama jurnal ilmiah yang digunakan untuk filter OpenAlex pada Research Mode V3.
        Pengguna tutor dapat memilih jurnal tertentu dari daftar ini.
      </HintText>

      <AddRow>
        <TextInput
          placeholder="Nama jurnal (contoh: The Lancet)"
          value={newJournal}
          onChange={e => setNewJournal(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          style={{ fontSize: '13px' }}
        />
        <Button variant="primary" type="button" onClick={handleAdd} disabled={!newJournal.trim()}>
          Tambah
        </Button>
      </AddRow>

      <TopBar>
        <SearchInput
          placeholder="Cari jurnal..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
      </TopBar>

      {loading ? (
        <CardGrid>
          <EmptyState>Memuat...</EmptyState>
        </CardGrid>
      ) : (
        <CardGrid>
          {journals.length === 0 ? (
            <EmptyState>
              {search ? `Tidak ada jurnal untuk "${search}"` : 'Belum ada jurnal. Tambahkan nama jurnal di atas.'}
            </EmptyState>
          ) : (
            journals.map(item => (
              <JournalCardItem
                key={item.id}
                item={item}
                onToggle={toggleJournal}
                onRemove={removeJournal}
              />
            ))
          )}
        </CardGrid>
      )}

      {(pagination.page > 1 || !pagination.isLastPage) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading}
          variant="admin"
          language="id"
        />
      )}
    </Wrapper>
  )
}

export default JournalsTab
