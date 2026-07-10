import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createV2Deck, updateV2Deck } from '@store/flashcard/v2/adminAction'
import { createNodeRecord, deleteNodeRecord } from '@store/featureNodes'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import styled from 'styled-components'

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`

const NodeList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-height: 220px;
  overflow-y: auto;
`

const NodeOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.875rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background: ${p => p.$selected ? '#f5f3ff' : 'white'};
  color: ${p => p.$selected ? '#6d28d9' : '#374151'};
  font-size: 0.875rem;
  transition: background 0.1s;

  &:last-child { border-bottom: none; }
  &:hover { background: ${p => p.$selected ? '#ede9fe' : '#f9fafb'}; }
`

const NodeOptionDot = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${p => p.$selected ? '#7c3aed' : '#d1d5db'};
  background: ${p => p.$selected ? '#7c3aed' : 'white'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    display: ${p => p.$selected ? 'block' : 'none'};
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
  }
`

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
]

export default function DeckFormModal({ mode, onClose }) {
  const dispatch = useDispatch()
  const { detail, loading } = useSelector(state => state.flashcard)

  const [form, setForm] = useState({ title: '', description: '', status: 'draft' })
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [topicNodes, setTopicNodes] = useState([])
  const [loadingTopics, setLoadingTopics] = useState(false)

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true)
      try {
        const res = await getWithToken(Endpoints.admin.featureNodes, { nodeType: 'topic' })
        setTopicNodes(res.data.data || [])
      } finally {
        setLoadingTopics(false)
      }
    }
    fetchTopics()
  }, [])

  useEffect(() => {
    if (mode === 'edit' && detail) {
      setForm({
        title: detail.title || '',
        description: detail.description || '',
        status: detail.status || 'draft',
      })
      setSelectedNodeId(detail.nodes?.[0]?.nodeId ?? null)
    }
  }, [mode, detail])

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert('Judul wajib diisi')
      return
    }

    const metaPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    if (mode === 'create') {
      let createdDeck = null
      await dispatch(createV2Deck({ ...metaPayload, cards: [] }, (deck) => { createdDeck = deck }))
      if (createdDeck?.id && selectedNodeId) {
        await dispatch(createNodeRecord({ nodeId: selectedNodeId, recordType: 'flashcard_deck', recordId: createdDeck.id }))
      }
      onClose()
    } else {
      await dispatch(updateV2Deck(detail.uniqueId, metaPayload))

      const existingNodes = detail.nodes || []
      const existingNodeId = existingNodes[0]?.nodeId ?? null

      if (selectedNodeId !== existingNodeId) {
        await Promise.all(existingNodes.map(r => dispatch(deleteNodeRecord(r.id))))
        if (selectedNodeId) {
          await dispatch(createNodeRecord({ nodeId: selectedNodeId, recordType: 'flashcard_deck', recordId: detail.id }))
        }
      }

      onClose()
    }
  }

  const isSaving = mode === 'create' ? loading.isCreatingDeck : loading.isUpdatingDeck

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Deck Baru' : 'Edit Deck'}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : mode === 'create' ? 'Buat Deck' : 'Simpan'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Judul *</Label>
        <TextInput
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Contoh: Sistem Kardiovaskular"
        />
      </FormSection>

      <FormSection>
        <Label>Deskripsi</Label>
        <Textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Deskripsi singkat tentang deck ini"
          rows={2}
        />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <Dropdown
          options={STATUS_OPTIONS}
          value={STATUS_OPTIONS.find(o => o.value === form.status) || null}
          onChange={opt => set('status', opt?.value || 'draft')}
        />
      </FormSection>

      <FormSection>
        <Label>Topik</Label>
        <NodeList>
          {loadingTopics ? (
            <NodeOption style={{ cursor: 'default', color: '#9ca3af' }}>Memuat...</NodeOption>
          ) : topicNodes.length === 0 ? (
            <NodeOption style={{ cursor: 'default', color: '#9ca3af' }}>Belum ada topik.</NodeOption>
          ) : topicNodes.map(node => {
            const isSelected = selectedNodeId === node.id
            return (
              <NodeOption
                key={node.id}
                $selected={isSelected}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
              >
                <NodeOptionDot $selected={isSelected} />
                <span style={{ flex: 1 }}>
                  {node.name}
                  {node.parentName && (
                    <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', color: '#9ca3af' }}>
                      ({node.parentName})
                    </span>
                  )}
                </span>
              </NodeOption>
            )
          })}
        </NodeList>
      </FormSection>
    </Modal>
  )
}
