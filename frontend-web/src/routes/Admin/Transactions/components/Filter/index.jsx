import { useState } from 'react'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/credit/reducer'
import { fetchAllTransactions, exportTransactions } from '@store/credit/action'

const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
]

const rowStyle = {
  display: 'grid',
  gap: '1rem',
  marginBottom: '1rem',
}

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '0.375rem',
  display: 'block',
}

export const Filter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.credit)
  const [exporting, setExporting] = useState(false)

  const onSearch = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchAllTransactions())
  }

  const onChangeFilter = (key, value) => {
    dispatch(actions.setFilters({ [key]: value }))
  }

  const onExport = async () => {
    setExporting(true)
    try {
      await dispatch(exportTransactions())
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <form onSubmit={e => { e.preventDefault(); onSearch() }}>
        {/* Row 1: ID, Email, Code, Status */}
        <div style={{ ...rowStyle, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div>
            <label style={labelStyle}>ID</label>
            <TextInput
              placeholder="Cari berdasarkan ID..."
              value={filters.id || ''}
              onChange={(e) => onChangeFilter('id', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Email Customer</label>
            <TextInput
              placeholder="Cari berdasarkan email..."
              value={filters.email || ''}
              onChange={(e) => onChangeFilter('email', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Kode Plan</label>
            <TextInput
              placeholder="Cari berdasarkan kode..."
              value={filters.code || ''}
              onChange={(e) => onChangeFilter('code', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <Dropdown
              options={statusOptions}
              value={statusOptions.find(o => o.value === (filters.status || '')) || statusOptions[0]}
              onChange={(option) => onChangeFilter('status', option?.value || '')}
              placeholder="Filter berdasarkan status..."
            />
          </div>
        </div>

        {/* Row 2: Start Date, End Date */}
        <div style={{ ...rowStyle, gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 0 }}>
          <div>
            <label style={labelStyle}>Tanggal Mulai</label>
            <TextInput
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onChangeFilter('startDate', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Tanggal Akhir</label>
            <TextInput
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onChangeFilter('endDate', e.target.value)}
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          marginTop: '1rem'
        }}>
          <Button variant="secondary" type="button" onClick={onExport} disabled={exporting}>
            {exporting ? 'Mengunduh...' : 'Export Excel'}
          </Button>
          <Button variant="primary" type="submit">
            Cari
          </Button>
        </div>
      </form>
    </div>
  )
}
