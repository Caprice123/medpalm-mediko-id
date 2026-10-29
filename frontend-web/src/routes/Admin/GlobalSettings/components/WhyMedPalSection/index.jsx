import { useSelector } from 'react-redux'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { SectionCard, SectionTitle, SectionHint, FormGroup } from '../../GlobalSettings.styles'
import RepeatingList from '../RepeatingList'

function WhyMedPalSection({ heading, subtitle, onTextChange, items, onChange, onAdd, onRemove }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <SectionCard>
      <SectionTitle>Kenapa MedPal.id?</SectionTitle>
      <SectionHint>
        Nomor 01, 02, dan seterusnya di setiap kartu dihitung dari urutannya,
        jadi kartu bisa ditambah, dihapus, atau diurutkan ulang tanpa bikin
        nomornya bolong. Desain memakai 4 kartu.
      </SectionHint>

      <FormGroup>
        <TextInput
          label="Judul Section"
          placeholder="Kenapa MedPal.id?"
          value={heading}
          onChange={(e) => onTextChange('home_why_heading', e.target.value)}
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Subjudul"
          placeholder="Satu platform untuk mendukung perjalanan belajarmu di kedokteran."
          value={subtitle}
          onChange={(e) => onTextChange('home_why_subtitle', e.target.value)}
          disabled={loading}
          rows={2}
        />
      </FormGroup>

      <RepeatingList
        items={items}
        label="Kartu"
        addLabel="Tambah Kartu"
        onAdd={onAdd}
        onRemove={onRemove}
      >
        {(item, index) => (
          <>
            <FormGroup>
              <TextInput
                label="Judul"
                placeholder="Materi yang Terarah"
                value={item.title}
                onChange={(e) => onChange(index, 'title', e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Textarea
                label="Deskripsi"
                placeholder="Materi tersusun sistematis sesuai kurikulum"
                value={item.description}
                onChange={(e) => onChange(index, 'description', e.target.value)}
                disabled={loading}
                rows={2}
              />
            </FormGroup>
          </>
        )}
      </RepeatingList>
    </SectionCard>
  )
}

export default WhyMedPalSection
