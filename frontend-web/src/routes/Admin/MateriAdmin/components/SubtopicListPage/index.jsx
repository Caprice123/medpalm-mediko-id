import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, fetchFeatureNodeDetail, deleteFeatureNode, actions } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import ConfirmationModal from '@components/common/ConfirmationModal'
import SubtopicFormModal from '../SubtopicFormModal'
import { Header, HeaderLeft, Title, SearchRow, ClassificationBadge, IconPreview } from '../../MateriAdmin.styles'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function SubtopicListPage({ topic, onBack }) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)
  const [modal, setModal] = useState({ type: null, subtopic: null })
  const [search, setSearch] = useState('')

  const load = () => {
    dispatch(actions.updateFilter({ key: 'layer', value: '2' }))
    dispatch(actions.updateFilter({ key: 'parentId', value: String(topic.id) }))
    dispatch(actions.updateFilter({ key: 'visibility', value: 'general' }))
    dispatch(actions.updateFilter({ key: 'search', value: search.trim() }))
    dispatch(fetchFeatureNodes())
  }

  useEffect(() => {
    load()
    // No cleanup-driven resetFilter here — MateriAdmin's onBack already
    // re-establishes the layer-1 filter and refetches when returning.
  }, [topic.id])

  const handleEdit = async (sub) => {
    const detail = await dispatch(fetchFeatureNodeDetail(sub.id))
    if (detail) setModal({ type: 'edit', subtopic: detail })
  }

  const handleDelete = (sub) => setModal({ type: 'delete', subtopic: sub })
  const handleConfirmDelete = () => {
    dispatch(deleteFeatureNode(modal.subtopic.id, () => {
      setModal({ type: null, subtopic: null })
      load()
    }))
  }

  const columns = [
    {
      header: 'Nama Sub-topik',
      render: (sub) => <span style={{ fontWeight: 500, color: '#111827' }}>{sub.name}</span>,
    },
    {
      header: 'Aksi',
      width: '160px',
      align: 'right',
      render: (sub) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => handleEdit(sub)} disabled={loading.isFetchingDetail}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(sub)}>Hapus</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Topik</Button>
          {topic.icon && <IconPreview>{topic.icon}</IconPreview>}
          <Title>{topic.name}</Title>
          {topic.classification && (
            <ClassificationBadge $type={topic.classification}>
              {CLASSIFICATION_LABELS[topic.classification] ?? topic.classification}
            </ClassificationBadge>
          )}
        </HeaderLeft>
        <Button variant="primary" onClick={() => setModal({ type: 'create', subtopic: null })}>
          + Sub-topik
        </Button>
      </Header>

      <SearchRow>
        <TextInput
          placeholder="Cari sub-topik..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
        />
        <Button variant="secondary" onClick={load}>Cari</Button>
      </SearchRow>

      <Table
        columns={columns}
        data={nodes}
        loading={loading.isFetchingNodes}
        emptyText="Belum ada sub-topik."
      />

      {(modal.type === 'create' || modal.type === 'edit') && (
        <SubtopicFormModal
          subtopic={modal.subtopic}
          parentTopic={topic}
          onClose={() => setModal({ type: null, subtopic: null })}
          onSuccess={() => { setModal({ type: null, subtopic: null }); load() }}
        />
      )}

      {modal.type === 'delete' && (
        <ConfirmationModal
          isOpen
          title="Hapus Sub-topik"
          message={`Yakin ingin menghapus sub-topik "${modal.subtopic?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal({ type: null, subtopic: null })}
          isLoading={loading.isDeleting}
        />
      )}
    </>
  )
}

export default SubtopicListPage
