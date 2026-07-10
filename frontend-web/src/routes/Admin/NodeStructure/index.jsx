import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, deleteFeatureNode } from '@store/featureNodes'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import NodeTree from './components/NodeTree'
import CreateNodeModal from './components/CreateNodeModal'
import UpdateNodeModal from './components/UpdateNodeModal'
import {
  Container, Header, TitleSection, Title, Subtitle,
  SearchRow, TreeWrapper, EmptyText,
} from './NodeStructure.styles'

function NodeStructure() {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(state => state.featureNodes)

  const [search, setSearch] = useState('')
  const [modal, setModal] = useState({ type: null, data: null })

  useEffect(() => {
    dispatch(fetchFeatureNodes())
  }, [dispatch])

  const handleSearch = () => {
    dispatch(fetchFeatureNodes({ search: search.trim() || undefined }))
  }

  const handleDelete = (node) => {
    if (nodes.some(n => n.parentId === node.id)) {
      alert(`"${node.name}" masih memiliki sub-node. Hapus sub-node terlebih dahulu.`)
      return
    }
    if (!window.confirm(`Hapus node "${node.name}"?`)) return
    dispatch(deleteFeatureNode(node.id, () => dispatch(fetchFeatureNodes())))
  }

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>Struktur Folder</Title>
          <Subtitle>Kelola hierarki departemen, topik, dan sub-topik yang digunakan di semua fitur</Subtitle>
        </TitleSection>
        <Button variant="primary" onClick={() => setModal({ type: 'create', data: null })}>
          + Root Node
        </Button>
      </Header>

      <SearchRow>
        <TextInput
          placeholder="Cari nama atau slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      <TreeWrapper>
        {loading.isFetchingNodes ? (
          <EmptyText>Memuat struktur folder...</EmptyText>
        ) : nodes.length === 0 ? (
          <EmptyText>Belum ada node. Klik "+ Root Node" untuk memulai.</EmptyText>
        ) : (
          <NodeTree
            nodes={nodes}
            onEdit={node => setModal({ type: 'update', data: node })}
            onAddChild={node => setModal({ type: 'create', data: node })}
            onDelete={handleDelete}
          />
        )}
      </TreeWrapper>

      {modal.type === 'create' && (
        <CreateNodeModal
          defaultParent={modal.data}
          onClose={() => setModal({ type: null, data: null })}
        />
      )}

      {modal.type === 'update' && (
        <UpdateNodeModal
          node={modal.data}
          onClose={() => setModal({ type: null, data: null })}
        />
      )}
    </Container>
  )
}

export default NodeStructure
