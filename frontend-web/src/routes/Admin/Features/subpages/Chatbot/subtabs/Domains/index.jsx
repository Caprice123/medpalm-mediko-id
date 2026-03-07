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
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  align-items: flex-end;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
  min-height: 120px;
`

const DomainCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 0.8125rem;
  font-family: monospace;
  gap: 0.5rem;
  align-self: start;
`

const DomainName = styled.span`
  flex: 1;
  word-break: break-all;
  color: #111827;
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
  margin: 0 0 1.25rem 0;
`

function DomainsTab() {
  const {
    domains, pagination, search, loading,
    initialize, handleSearchChange, handlePageChange,
    addDomain, removeDomain
  } = useResearchDomains()

  const [newDomain, setNewDomain] = useState('')

  useEffect(() => {
    initialize()
  }, [])

  const handleAdd = async () => {
    const d = newDomain.trim()
    if (!d) return
    await addDomain(d)
    setNewDomain('')
  }

  return (
    <Wrapper>
      <SectionTitle>Domain Terpercaya</SectionTitle>

      <AddRow>
        <div style={{ flex: 1 }}>
          <TextInput
            placeholder="pubmed.ncbi.nlm.nih.gov"
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            style={{ fontFamily: 'monospace', fontSize: '13px' }}
          />
        </div>
        <Button variant="primary" type="button" onClick={handleAdd} disabled={!newDomain.trim()}>
          Tambah Domain
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
              <DomainCard key={item.id}>
                <DomainName>{item.domain}</DomainName>
                <Button
                  variant="danger"
                  size="small"
                  type="button"
                  onClick={() => removeDomain(item.id)}
                >
                  ✕
                </Button>
              </DomainCard>
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
