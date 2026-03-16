import { useState, useEffect } from 'react'
import { useResearchDomains } from '../../hooks/useResearchDomains'
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
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  align-items: flex-end;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.5rem;
  min-height: 120px;
`

const DomainCard = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 0.8125rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: start;
`

const DomainRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const DomainName = styled.span`
  flex: 1;
  word-break: break-all;
  color: #111827;
  font-family: monospace;
`

const JournalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const JournalInput = styled.input`
  flex: 1;
  padding: 0.3rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #374151;
  outline: none;
  &:focus { border-color: #3b82f6; }
  &::placeholder { color: #9ca3af; }
`

const JournalLabel = styled.span`
  font-size: 0.7rem;
  color: #6b7280;
  white-space: nowrap;
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

function DomainCardItem({ item, onUpdateJournalName, onRemove }) {
  const [journalInput, setJournalInput] = useState(item.journal_name || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleJournalBlur = async () => {
    if (journalInput.trim() === (item.journal_name || '').trim()) return
    if (!journalInput.trim()) {
      setError('Nama jurnal wajib diisi')
      setJournalInput(item.journal_name || '')
      return
    }
    setError('')
    setSaving(true)
    try {
      await onUpdateJournalName(item.id, journalInput.trim())
    } finally {
      setSaving(false)
    }
  }

  return (
    <DomainCard>
      <DomainRow>
        <DomainName>{item.domain}</DomainName>
        <Button variant="danger" size="small" type="button" onClick={() => onRemove(item.id)}>
          ✕
        </Button>
      </DomainRow>
      <JournalRow>
        <JournalLabel>Jurnal:</JournalLabel>
        <JournalInput
          placeholder="Nama jurnal (contoh: The Lancet)"
          value={journalInput}
          onChange={e => { setJournalInput(e.target.value); setError('') }}
          onBlur={handleJournalBlur}
          disabled={saving}
          style={error ? { borderColor: '#ef4444' } : undefined}
          title="Nama jurnal wajib diisi. Tekan Tab atau klik di luar untuk menyimpan."
        />
      </JournalRow>
      {error && <span style={{ fontSize: '0.7rem', color: '#ef4444' }}>{error}</span>}
    </DomainCard>
  )
}

function DomainsTab() {
  const {
    domains, pagination, search, loading,
    initialize, handleSearchChange, handlePageChange,
    addDomain, updateJournalName, removeDomain
  } = useResearchDomains()

  const [newDomain, setNewDomain] = useState('')
  const [newJournal, setNewJournal] = useState('')

  useEffect(() => {
    initialize()
  }, [])

  const handleAdd = async () => {
    const d = newDomain.trim()
    const j = newJournal.trim()
    if (!d || !j) return
    await addDomain(d, j)
    setNewDomain('')
    setNewJournal('')
  }

  return (
    <Wrapper>
      <SectionTitle>Domain Terpercaya</SectionTitle>
      <HintText>
        Masukkan domain URL dan nama jurnal. Domain digunakan untuk filter Perplexity,
        nama jurnal digunakan untuk filter OpenAlex (Research Mode V3).
      </HintText>

      <AddRow>
        <TextInput
          placeholder="Domain URL (contoh: thelancet.com)"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          style={{ fontFamily: 'monospace', fontSize: '13px' }}
        />
        <TextInput
          placeholder="Nama jurnal (contoh: The Lancet)"
          value={newJournal}
          onChange={e => setNewJournal(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          style={{ fontSize: '13px' }}
        />
        <Button variant="primary" type="button" onClick={handleAdd} disabled={!newDomain.trim() || !newJournal.trim()}>
          Tambah
        </Button>
      </AddRow>

      <TopBar>
        <SearchInput
          placeholder="Cari domain..."
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
          {domains.length === 0 ? (
            <EmptyState>
              {search ? `Tidak ada domain untuk "${search}"` : 'Belum ada domain. Tambahkan domain di atas.'}
            </EmptyState>
          ) : (
            domains.map(item => (
              <DomainCardItem
                key={item.id}
                item={item}
                onUpdateJournalName={updateJournalName}
                onRemove={removeDomain}
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

export default DomainsTab
