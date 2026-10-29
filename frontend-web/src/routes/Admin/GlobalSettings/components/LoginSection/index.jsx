import { useSelector } from 'react-redux'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { SectionCard, SectionTitle, SectionHint, FormRow, FormGroup } from '../../GlobalSettings.styles'
import RepeatingList from '../RepeatingList'

// Tagline and the slide list below used to sit under "Hero" because the old
// landing page shared them with its hero. The rebuilt landing page reads
// neither — only the login page does — so they belong here.
function LoginSection({
  tagline,
  signinTitle,
  signinSubtitle,
  onTextChange,
  items,
  onChange,
  onAdd,
  onRemove,
}) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <SectionCard>
      <SectionTitle>Halaman Login</SectionTitle>
      <SectionHint>
        Hanya halaman login yang membaca bagian ini — tidak ada satu pun yang
        tampil di landing page. Deskripsi panel kirinya memakai Subjudul dari
        bagian Hero.
      </SectionHint>

      <FormGroup>
        <TextInput
          label="Tagline Panel Kiri"
          placeholder="Platform Belajar Kedokteran Berbasis AI"
          value={tagline}
          onChange={(e) => onTextChange('home_hero_badge', e.target.value)}
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Sign In"
          placeholder="Selamat Datang Kembali"
          value={signinTitle}
          onChange={(e) => onTextChange('login_signin_title', e.target.value)}
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Subjudul Sign In"
          placeholder="Masuk untuk mengakses platform pembelajaran kedokteran berbasis AI"
          value={signinSubtitle}
          onChange={(e) => onTextChange('login_signin_subtitle', e.target.value)}
          disabled={loading}
          rows={3}
        />
      </FormGroup>

      <RepeatingList
        items={items}
        label="Slide"
        addLabel="Tambah Slide"
        onAdd={onAdd}
        onRemove={onRemove}
      >
        {(item, index) => (
          <>
            <FormRow $cols="80px 1fr">
              <FormGroup>
                <TextInput
                  label="Icon"
                  placeholder="📝"
                  value={item.icon}
                  onChange={(e) => onChange(index, 'icon', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <TextInput
                  label="Label"
                  placeholder="Bank Soal"
                  value={item.label}
                  onChange={(e) => onChange(index, 'label', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <TextInput
                label="Judul"
                placeholder="20.000+ Soal Preklinik"
                value={item.title}
                onChange={(e) => onChange(index, 'title', e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Textarea
                label="Deskripsi"
                placeholder="Deskripsi singkat slide."
                value={item.desc}
                onChange={(e) => onChange(index, 'desc', e.target.value)}
                disabled={loading}
                rows={3}
              />
            </FormGroup>
          </>
        )}
      </RepeatingList>
    </SectionCard>
  )
}

export default LoginSection
