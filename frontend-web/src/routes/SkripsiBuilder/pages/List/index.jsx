import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@store/store'
import { fetchSets, createSet } from '@store/skripsi/action'
import { FaPlus } from 'react-icons/fa'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
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

        <Filter />
        <Header>
          <div></div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Buat Set Baru
          </Button>
        </Header>

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
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false)
                setFormData({ title: '', description: '' })
              }}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSet}
            >
              Buat Set
            </Button>
          </>
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
