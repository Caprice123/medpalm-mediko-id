import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/featureSubscriptions/reducer'
import { fetchFeatureSubscriptions, deleteFeatureSubscription } from '@store/featureSubscriptions/action'
import Table from '@components/common/Table'
import Button from '@components/common/Button'
import Pagination from '@components/common/Pagination'
import ConfirmationModal from '@components/common/ConfirmationModal'
import { ActiveBadge } from '../../FeatureSubscriptions.styles'
import { AddEditModal } from '../AddEditModal'

export function FeatureSubscriptionsTable() {
  const dispatch = useDispatch()
  const items = useSelector(state => state.featureSubscriptions.items)
  const loading = useSelector(state => state.featureSubscriptions.loading)
  const appFeatures = useSelector(state => state.feature.features)
  const FEATURE_LABELS = Object.fromEntries(appFeatures.map(f => [
    ({ skripsi_builder: 'skripsi', osce_practice: 'oscePractice', summary_notes: 'summaryNotes' }[f.sessionType] || f.sessionType), f.name
  ]))
  const pagination = useSelector(state => state.featureSubscriptions.pagination)

  const [editRecord, setEditRecord] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchFeatureSubscriptions())
  }

  const handleDelete = () => {
    dispatch(deleteFeatureSubscription(deleteTarget.id, () => setDeleteTarget(null)))
  }

  const columns = [
    {
      key: 'id',
      header: 'ID',
      width: '60px',
      render: (id) => `#${id}`,
    },
    {
      key: 'user',
      header: 'User',
      render: (user) => user ? (
        <div style={{ fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 500, color: '#111827' }}>{user.name || '(no name)'}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user.email}</div>
        </div>
      ) : '-',
    },
    {
      key: 'feature',
      header: 'Fitur',
      width: '160px',
      render: (feature) => (
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {FEATURE_LABELS[feature] || feature}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      width: '110px',
      align: 'center',
      render: (isActive) => (
        <ActiveBadge $active={isActive}>{isActive ? 'Aktif' : 'Tidak Aktif'}</ActiveBadge>
      ),
    },
    {
      key: '',
      header: 'Aksi',
      width: '160px',
      align: 'center',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <Button size="small" variant="secondary" onClick={() => setEditRecord(row)}>
            Edit
          </Button>
          <Button size="small" variant="danger" onClick={() => setDeleteTarget(row)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Table
        loading={loading.isFetchLoading}
        emptyText="Tidak ada langganan fitur."
        emptySubtext="Coba ubah filter pencarian"
        data={items}
        columns={columns}
        hoverable
        striped
      />

      {((pagination.page === 1 && pagination.isLastPage) || pagination.page > 1) && (
        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isFetchLoading}
          variant="admin"
          language="id"
        />
      )}

      <AddEditModal
        isOpen={!!editRecord}
        onClose={() => setEditRecord(null)}
        editRecord={editRecord}
      />

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Langganan Fitur"
        message={deleteTarget
          ? `Hapus akses fitur "${FEATURE_LABELS[deleteTarget.feature] || deleteTarget.feature}" untuk user ${deleteTarget.user?.email || deleteTarget.userId}?`
          : ''}
        confirmText="Hapus"
        isLoading={loading.isDeleteLoading}
      />
    </>
  )
}
