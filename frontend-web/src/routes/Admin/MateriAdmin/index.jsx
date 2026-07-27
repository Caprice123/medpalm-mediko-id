import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, fetchFeatureNodeDetail, deleteFeatureNode, actions } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import ConfirmationModal from '@components/common/ConfirmationModal'
import TopicFormModal from './components/TopicFormModal'
import SubtopicListPage from './components/SubtopicListPage'
import { Container, Header, HeaderLeft, Title, ClassificationBadge, IconPreview } from './MateriAdmin.styles'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function MateriAdmin() {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)
  const [modal, setModal] = useState({ type: null, topic: null })
  const [selectedTopic, setSelectedTopic] = useState(null)

  const load = () => {
    dispatch(actions.updateFilter({ key: 'layer', value: '1' }))
    dispatch(actions.updateFilter({ key: 'visibility', value: 'general' }))
    dispatch(fetchFeatureNodes())
  }

  useEffect(() => {
    load()
    return () => { dispatch(actions.resetFilter()) }
  }, [])

  const handleEdit = async (topic) => {
    const detail = await dispatch(fetchFeatureNodeDetail(topic.id))
    if (detail) setModal({ type: 'edit', topic: detail })
  }

  const handleDelete = (topic) => setModal({ type: 'delete', topic })
  const handleConfirmDelete = () => {
    dispatch(deleteFeatureNode(modal.topic.id, () => {
      setModal({ type: null, topic: null })
      load()
    }))
  }

  if (selectedTopic) {
    return (
      <SubtopicListPage
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    )
  }

  const columns = [
    {
      header: 'Topik',
      render: (topic) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          {topic.icon && <IconPreview>{topic.icon}</IconPreview>}
          <span style={{ fontWeight: 500, color: '#111827' }}>{topic.name}</span>
        </div>
      ),
    },
    {
      header: 'Klasifikasi',
      render: (topic) => topic.classification ? (
        <ClassificationBadge $type={topic.classification}>
          {CLASSIFICATION_LABELS[topic.classification] ?? topic.classification}
        </ClassificationBadge>
      ) : <span style={{ color: '#9ca3af', fontSize: '0.8125rem' }}>—</span>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (topic) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Button size="small" variant="secondary" onClick={() => setSelectedTopic(topic)}>Detail</Button>
          <Button size="small" onClick={() => handleEdit(topic)} disabled={loading.isFetchingDetail}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(topic)}>Hapus</Button>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>Materi</Title>
        </HeaderLeft>
        <Button variant="primary" onClick={() => setModal({ type: 'create', topic: null })}>
          + Topik
        </Button>
      </Header>

      <Table
        columns={columns}
        data={nodes}
        isLoading={loading.isFetchingNodes}
        emptyMessage="Belum ada topik."
      />

      {(modal.type === 'create' || modal.type === 'edit') && (
        <TopicFormModal
          topic={modal.topic}
          onClose={() => setModal({ type: null, topic: null })}
          onSuccess={() => { setModal({ type: null, topic: null }); load() }}
        />
      )}

      {modal.type === 'delete' && (
        <ConfirmationModal
          isOpen
          title="Hapus Topik"
          message={`Yakin ingin menghapus topik "${modal.topic?.name}"? Semua sub-topik di dalamnya juga akan terhapus.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModal({ type: null, topic: null })}
          isLoading={loading.isDeleting}
        />
      )}
    </Container>
  )
}

export default MateriAdmin
