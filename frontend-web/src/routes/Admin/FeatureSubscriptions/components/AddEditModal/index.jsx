import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createFeatureSubscription, updateFeatureSubscription } from '@store/featureSubscriptions/action'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import styled from 'styled-components'


const statusOptions = [
  { value: true, label: 'Aktif' },
  { value: false, label: 'Tidak Aktif' },
]

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const ReadOnlyField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const FieldLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
`

const FieldValue = styled.div`
  font-size: 0.875rem;
  color: #111827;
  padding: 0.5rem 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`

const UserResultList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  max-height: 180px;
  overflow-y: auto;
  background: white;
`

const UserResultItem = styled.div`
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  background: ${({ $selected }) => $selected ? 'rgba(107,185,232,0.12)' : 'white'};

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(107,185,232,0.08); }
`

const UserName = styled.div`
  font-weight: 500;
  color: #111827;
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`

export function AddEditModal({ isOpen, onClose, editRecord }) {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.featureSubscriptions.loading)
  const appFeatures = useSelector(state => state.feature.features)
  const featureOptions = appFeatures.map(f => ({
    value: ({ skripsi_builder: 'skripsi', osce_practice: 'oscePractice', summary_notes: 'summaryNotes' }[f.sessionType] || f.sessionType),
    label: f.name,
  }))

  const isEdit = !!editRecord

  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    if (isEdit) {
      setSelectedStatus(editRecord.isActive ? statusOptions[0] : statusOptions[1])
    } else {
      setUserSearch('')
      setUserResults([])
      setSelectedUser(null)
      setSelectedFeature(null)
      setSelectedStatus(statusOptions[0])
    }
  }, [isOpen, isEdit, editRecord])

  const searchUsers = useCallback(async (search) => {
    if (!search || search.length < 2) { setUserResults([]); return }
    setIsSearching(true)
    try {
      const response = await getWithToken(Endpoints.admin.users, { name: search, perPage: 10 })
      setUserResults(response.data?.data?.users || response.data?.data || [])
    } catch {
      setUserResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (isEdit) return
    const timer = setTimeout(() => searchUsers(userSearch), 400)
    return () => clearTimeout(timer)
  }, [userSearch, isEdit, searchUsers])

  const handleSubmit = () => {
    if (isEdit) {
      dispatch(updateFeatureSubscription(editRecord.id, { isActive: selectedStatus.value }, onClose))
    } else {
      if (!selectedUser || !selectedFeature) return
      dispatch(createFeatureSubscription({
        userId: selectedUser.id,
        feature: selectedFeature.value,
        isActive: selectedStatus.value,
      }, onClose))
    }
  }

  const canSubmit = isEdit
    ? true
    : selectedUser && selectedFeature

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Langganan Fitur' : 'Tambah Langganan Fitur'}
    >
      <FieldGroup>
        {isEdit ? (
          <>
            <ReadOnlyField>
              <FieldLabel>User</FieldLabel>
              <FieldValue>
                <div style={{ fontWeight: 500 }}>{editRecord?.user?.name || '-'}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{editRecord?.user?.email || '-'}</div>
              </FieldValue>
            </ReadOnlyField>
            <ReadOnlyField>
              <FieldLabel>Fitur</FieldLabel>
              <FieldValue>{FEATURE_LABELS[editRecord?.feature] || editRecord?.feature}</FieldValue>
            </ReadOnlyField>
          </>
        ) : (
          <>
            <div>
              <FieldLabel style={{ display: 'block', marginBottom: '0.4rem' }}>Cari User</FieldLabel>
              <TextInput
                placeholder="Ketik nama atau email..."
                value={userSearch}
                onChange={e => { setUserSearch(e.target.value); setSelectedUser(null) }}
              />
              {(userResults.length > 0 || isSearching) && (
                <UserResultList>
                  {isSearching && (
                    <UserResultItem style={{ color: '#9ca3af', cursor: 'default' }}>Mencari...</UserResultItem>
                  )}
                  {!isSearching && userResults.map(u => (
                    <UserResultItem
                      key={u.id}
                      $selected={selectedUser?.id === u.id}
                      onClick={() => { setSelectedUser(u); setUserSearch(u.name || u.email); setUserResults([]) }}
                    >
                      <UserName>{u.name || '(no name)'}</UserName>
                      <UserEmail>{u.email}</UserEmail>
                    </UserResultItem>
                  ))}
                  {!isSearching && userResults.length === 0 && userSearch.length >= 2 && (
                    <UserResultItem style={{ color: '#9ca3af', cursor: 'default' }}>User tidak ditemukan</UserResultItem>
                  )}
                </UserResultList>
              )}
            </div>
            <Dropdown
              label="Fitur"
              options={featureOptions}
              value={selectedFeature}
              onChange={setSelectedFeature}
              placeholder="Pilih fitur..."
              usePortal
            />
          </>
        )}
        <Dropdown
          label="Status"
          options={statusOptions}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Pilih status..."
          usePortal
        />
      </FieldGroup>
      <FooterRow>
        <Button variant="secondary" onClick={onClose}>Batal</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!canSubmit || loading.isCreateLoading || loading.isUpdateLoading}
        >
          {loading.isCreateLoading || loading.isUpdateLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </FooterRow>
    </Modal>
  )
}
