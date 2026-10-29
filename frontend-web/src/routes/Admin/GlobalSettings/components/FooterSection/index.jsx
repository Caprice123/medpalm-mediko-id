import { useSelector } from 'react-redux'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import { SectionCard, SectionTitle, SectionHint, FormRow, FormGroup } from '../../GlobalSettings.styles'
import RepeatingList from '../RepeatingList'

// These are the only types the footer has an icon and colour for; a value
// outside the list falls back to the Instagram styling.
const SOCIAL_TYPE_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
]

function FooterSection({ items, onChange, onAdd, onRemove }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <SectionCard>
      <SectionTitle>Footer — Sosial Media</SectionTitle>
      <SectionHint>
        Dipakai di footer landing page dan di modal share halaman challenge, yang
        mengambil handle Instagram dari daftar ini.
      </SectionHint>

      <RepeatingList
        items={items}
        label="Platform"
        addLabel="Tambah Platform"
        onAdd={onAdd}
        onRemove={onRemove}
      >
        {(item, index) => (
          <>
            <FormRow>
              <FormGroup>
                <TextInput
                  label="Nama Platform"
                  placeholder="Instagram"
                  value={item.platform}
                  onChange={(e) => onChange(index, 'platform', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <Dropdown
                  label="Tipe Icon"
                  options={SOCIAL_TYPE_OPTIONS}
                  value={SOCIAL_TYPE_OPTIONS.find((option) => option.value === item.type) || null}
                  onChange={(option) => onChange(index, 'type', option?.value || 'instagram')}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <TextInput
                  label="Handle"
                  placeholder="@medpal.id"
                  value={item.handle}
                  onChange={(e) => onChange(index, 'handle', e.target.value)}
                  disabled={loading}
                  hint="Dipakai modal share challenge, dan jadi teks kartu kalau Deskripsi kosong."
                />
              </FormGroup>
              <FormGroup>
                <TextInput
                  label="Deskripsi"
                  placeholder="Tips & Edukasi Medis"
                  value={item.desc}
                  onChange={(e) => onChange(index, 'desc', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <TextInput
                label="URL"
                placeholder="https://instagram.com/medpal.id"
                value={item.url}
                onChange={(e) => onChange(index, 'url', e.target.value)}
                disabled={loading}
              />
            </FormGroup>
          </>
        )}
      </RepeatingList>
    </SectionCard>
  )
}

export default FooterSection
