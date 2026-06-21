import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminChallenges, fetchAdminBadges, createBadge, updateBadge, deleteBadge } from '@store/challenge/adminAction'
import { upload } from '@store/common/action'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Dropdown from '@components/common/Dropdown'
import FileUpload from '@components/common/FileUpload'
import Loading from '@components/common/Loading'
import {
  SubHeader, SubTitle, Table, Th, Td, Tr, ActionCell,
  EmptyRow, FormGroup, FormGrid, Label, BadgeImagePreview
} from '../../Challenge.styles'

const defaultForm = { name: '', description: '', minRank: 1, maxRank: 10, imageBlobId: null, imagePreviewUrl: null }

export default function BadgesTab() {
  const dispatch = useDispatch()
  const { challenges, badges, loading } = useSelector(state => state.challenge)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [modal, setModal] = useState({ open: false, mode: 'create', target: null })
  const [form, setForm] = useState(defaultForm)

  useEffect(() => { dispatch(fetchAdminChallenges()) }, [dispatch])

  useEffect(() => {
    if (selectedChallenge) dispatch(fetchAdminBadges(selectedChallenge.value))
  }, [selectedChallenge, dispatch])

  const challengeOptions = challenges.map(c => ({ label: c.title, value: c.uniqueId }))

  const openCreate = () => { setForm(defaultForm); setModal({ open: true, mode: 'create', target: null }) }
  const openEdit = (b) => {
    setForm({
      name: b.name, description: b.description || '',
      minRank: b.minRank, maxRank: b.maxRank,
      imageBlobId: null, imagePreviewUrl: b.image?.url || null,
    })
    setModal({ open: true, mode: 'edit', target: b })
  }

  const handleImageSelect = async (file) => {
    const result = await dispatch(upload(file, 'challenge-badges'))
    setForm(prev => ({ ...prev, imageBlobId: result.blobId, imagePreviewUrl: result.url }))
  }

  const handleSave = async () => {
    const payload = {
      name: form.name, description: form.description,
      minRank: parseInt(form.minRank), maxRank: parseInt(form.maxRank),
      imageBlobId: form.imageBlobId,
    }
    const onSuccess = () => {
      setModal({ open: false, mode: 'create', target: null })
      dispatch(fetchAdminBadges(selectedChallenge.value))
    }
    if (modal.mode === 'create') {
      await dispatch(createBadge(selectedChallenge.value, payload, onSuccess))
    } else {
      await dispatch(updateBadge(selectedChallenge.value, modal.target.uniqueId, payload, onSuccess))
    }
  }

  const handleDelete = async (b) => {
    if (!window.confirm(`Hapus badge "${b.name}"?`)) return
    await dispatch(deleteBadge(selectedChallenge.value, b.uniqueId, () => dispatch(fetchAdminBadges(selectedChallenge.value))))
  }

  const set = (key) => (val) => setForm(prev => ({ ...prev, [key]: val?.target?.value ?? val?.value ?? val }))

  return (
    <>
      <SubHeader>
        <SubTitle>Kelola Badge</SubTitle>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ minWidth: 280 }}>
            <Dropdown
              options={challengeOptions}
              value={selectedChallenge}
              onChange={setSelectedChallenge}
              placeholder="Pilih challenge..."
            />
          </div>
          {selectedChallenge && (
            <Button variant="primary" onClick={openCreate}>+ Tambah Badge</Button>
          )}
        </div>
      </SubHeader>

      {!selectedChallenge && <EmptyRow>Pilih challenge untuk mengelola badge.</EmptyRow>}

      {selectedChallenge && loading.isGetBadgesLoading && <Loading />}

      {selectedChallenge && !loading.isGetBadgesLoading && badges.length === 0 && (
        <EmptyRow>Belum ada badge. Klik "+ Tambah Badge" untuk memulai.</EmptyRow>
      )}

      {selectedChallenge && !loading.isGetBadgesLoading && badges.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>Gambar</Th>
              <Th>Nama Badge</Th>
              <Th>Deskripsi</Th>
              <Th>Rank</Th>
              <Th>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {badges.map(b => (
              <Tr key={b.uniqueId}>
                <Td>
                  {b.image?.url
                    ? <BadgeImagePreview src={b.image.url} alt={b.name} />
                    : <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Tidak ada</span>
                  }
                </Td>
                <Td>{b.name}</Td>
                <Td>{b.description || '-'}</Td>
                <Td>Rank {b.minRank} – {b.maxRank}</Td>
                <Td>
                  <ActionCell>
                    <Button onClick={() => openEdit(b)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDelete(b)}>Hapus</Button>
                  </ActionCell>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {modal.open && (
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: 'create', target: null })}
          title={modal.mode === 'create' ? 'Tambah Badge' : 'Edit Badge'}
          onConfirm={handleSave}
          confirmText={loading.isBadgeMutating ? 'Menyimpan...' : 'Simpan'}
        >
          <FormGrid>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Nama Badge *</Label>
              <TextInput value={form.name} onChange={set('name')} placeholder="Contoh: Gold Badge" />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Deskripsi</Label>
              <Textarea value={form.description} onChange={set('description')} placeholder="Deskripsi badge..." rows={2} />
            </FormGroup>
            <FormGroup>
              <Label>Rank Minimum *</Label>
              <TextInput type="number" min="1" value={form.minRank} onChange={set('minRank')} />
            </FormGroup>
            <FormGroup>
              <Label>Rank Maksimum *</Label>
              <TextInput type="number" min="1" value={form.maxRank} onChange={set('maxRank')} />
            </FormGroup>
            <FormGroup style={{ gridColumn: '1 / -1' }}>
              <Label>Gambar Badge</Label>
              {form.imagePreviewUrl && (
                <BadgeImagePreview src={form.imagePreviewUrl} alt="preview" style={{ marginBottom: '0.5rem' }} />
              )}
              <FileUpload onFileSelect={handleImageSelect} accept="image/*" />
            </FormGroup>
          </FormGrid>
        </Modal>
      )}
    </>
  )
}
