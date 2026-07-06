import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '@store/profile/action'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import {
  PageWrapper,
  Card,
  IconWrapper,
  Title,
  Subtitle,
  FieldGroup,
  FieldLabel,
} from './Setup.styles'

function ProfileSetup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(state => state.profile.loading.isUpdateLoading)
  const existingProfile = useSelector(state => state.pricing.userStatus.profile)
  const isProfileComplete = useSelector(state => state.pricing.userStatus.isProfileComplete)

  const [phoneNumber, setPhoneNumber] = useState('')
  const [university, setUniversity] = useState('')
  const [errors, setErrors] = useState({})

  // Pre-fill when navigating here to edit an existing profile
  useEffect(() => {
    if (existingProfile) {
      setPhoneNumber(existingProfile.phoneNumber || '')
      setUniversity(existingProfile.university || '')
    }
  }, [existingProfile])

  const validate = () => {
    const errs = {}
    if (!phoneNumber.trim()) errs.phoneNumber = 'Nomor HP wajib diisi'
    if (!university.trim()) errs.university = 'Nama universitas wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(updateProfile(
      { phoneNumber: phoneNumber.trim(), university: university.trim() },
      () => navigate('/dashboard')
    ))
  }

  const isEditing = isProfileComplete === true

  return (
    <PageWrapper>
      <Card>
        <IconWrapper>🎓</IconWrapper>
        <Title>{isEditing ? 'Edit Profil' : 'Lengkapi Profil Kamu'}</Title>
        <Subtitle>
          {isEditing
            ? 'Perbarui informasi kontakmu di sini.'
            : 'Sebelum mulai belajar, kami butuh beberapa info agar layanan bisa disesuaikan untukmu.'}
        </Subtitle>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div>
              <FieldLabel>Nomor HP (WhatsApp)</FieldLabel>
              <TextInput
                placeholder="Contoh: 08123456789"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                error={errors.phoneNumber}
              />
            </div>
            <div>
              <FieldLabel>Universitas / Institusi</FieldLabel>
              <TextInput
                placeholder="Contoh: Universitas Indonesia"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                error={errors.university}
              />
            </div>
          </FieldGroup>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan & Mulai Belajar'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" fullWidth onClick={() => navigate(-1)}>
                Batal
              </Button>
            )}
          </div>
        </form>
      </Card>
    </PageWrapper>
  )
}

export default ProfileSetup
