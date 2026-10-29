import { useSelector } from 'react-redux'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { SectionCard, SectionTitle, SectionHint, FormRow, FormGroup } from '../../GlobalSettings.styles'
import RepeatingList from '../RepeatingList'

function TestimonialSection({ items, onChange, onAdd, onRemove }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <SectionCard>
      <SectionTitle>Testimoni</SectionTitle>
      <SectionHint>
        Kosong berarti section-nya menampilkan status "belum ada testimoni" —
        testimoni placeholder tidak pernah ditampilkan ke pengunjung.
      </SectionHint>

      <RepeatingList
        items={items}
        label="Testimoni"
        addLabel="Tambah Testimoni"
        onAdd={onAdd}
        onRemove={onRemove}
      >
        {(item, index) => (
          <>
            <FormGroup>
              <Textarea
                label="Kutipan"
                placeholder="Materinya ringkas dan langsung kepakai buat ujian blok."
                value={item.quote}
                onChange={(e) => onChange(index, 'quote', e.target.value)}
                disabled={loading}
                rows={3}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <TextInput
                  label="Nama"
                  placeholder="Nama Pengguna"
                  value={item.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
              <FormGroup>
                <TextInput
                  label="Keterangan"
                  placeholder="Mahasiswa Kedokteran"
                  value={item.detail}
                  onChange={(e) => onChange(index, 'detail', e.target.value)}
                  disabled={loading}
                />
              </FormGroup>
            </FormRow>
          </>
        )}
      </RepeatingList>
    </SectionCard>
  )
}

export default TestimonialSection
