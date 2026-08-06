import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, fetchFeatureNodeDetail, deleteFeatureNode, actions } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import ConfirmationModal from '@components/common/ConfirmationModal'
import TopicFormModal from './components/TopicFormModal'
import SubtopicListPage from './components/SubtopicListPage'
import ClassificationBadge from '@components/common/ClassificationBadge'
import { Container, Header, HeaderLeft, Title, SearchRow, IconPreview } from './MateriAdmin.styles'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

const CLASSIFICATION_COLORS = {
  sistem_blok: { bg: '#d1fae5', color: '#065f46' },
  ilmu_lintas_sistem: { bg: '#ede9fe', color: '#5b21b6' },
}

function MateriAdmin() {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)
  const [modal, setModal] = useState({ type: null, topic: null })
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [search, setSearch] = useState('')

  const load = () => {
    dispatch(actions.updateFilter({ key: 'layer', value: '1' }))
    dispatch(actions.updateFilter({ key: 'nodeType', value: 'topic' }))
    dispatch(actions.updateFilter({ key: 'visibility', value: 'general' }))
    dispatch(actions.updateFilter({ key: 'parentId', value: '' }))
    dispatch(actions.updateFilter({ key: 'search', value: search.trim() }))
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
        onBack={() => { setSelectedTopic(null); load() }}
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
      render: (topic) => (
        <ClassificationBadge value={topic.classification} labels={CLASSIFICATION_LABELS} colorMap={CLASSIFICATION_COLORS} />
      ),
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

      <SearchRow>
        <TextInput
          placeholder="Cari topik..."
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
        emptyText="Belum ada topik."
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
