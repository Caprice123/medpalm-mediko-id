import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { fetchSets, createSet } from '@store/skripsi/action'
import { FaPlus } from 'react-icons/fa'
import Modal from '@components/common/Modal'
import { Filter } from './components/Filter'
import SetsList from './components/SetsList'
import Pagination from '@components/Pagination'
import {
  Container,
  ContentWrapper,
  Header,
  HeaderLeft,
  Title,
  Subtitle,
  CreateButton
} from './List.styles'

const SkripsiList = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { loading, pagination } = useAppSelector((state) => state.skripsi)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })

  // Fetch sets on mount
  useEffect(() => {
    dispatch(fetchSets())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(fetchSets(page))
  }

  const handleCreateSet = async () => {
    if (!formData.title.trim()) {
      alert('Judul set tidak boleh kosong')
      return
    }

    try {
      const newSet = await dispatch(createSet(formData.title, formData.description))
      setShowCreateModal(false)
      setFormData({ title: '', description: '' })
      // Navigate to the new set
      navigate(`/skripsi/sets/${newSet.id}`)
    } catch (error) {
      console.error('Failed to create set:', error)
      alert('Gagal membuat set baru')
    }
  }

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <HeaderLeft>
            <Title>Skripsi Builder</Title>
            <Subtitle>Kelola dan buat konten skripsi Anda dengan bantuan AI</Subtitle>
          </HeaderLeft>
          <CreateButton onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Buat Set Baru
          </CreateButton>
        </Header>

        <Filter />

        <SetsList />

        <Pagination
          currentPage={pagination.page}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading.isSetsLoading}
          variant="admin"
          language="id"
        />
      </ContentWrapper>

      {/* Create Set Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          setFormData({ title: '', description: '' })
        }}
        title="Buat Set Baru"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setShowCreateModal(false)
                setFormData({ title: '', description: '' })
              }}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              onClick={handleCreateSet}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: '#06b6d4',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Buat Set
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1f2937' }}>
              Judul Set <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul set skripsi"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1f2937' }}>
              Deskripsi (Opsional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tambahkan deskripsi singkat"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>
      </Modal>
    </Container>
  )
}

export default SkripsiList
