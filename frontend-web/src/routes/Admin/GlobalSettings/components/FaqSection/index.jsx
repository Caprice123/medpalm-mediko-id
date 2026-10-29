import { useSelector } from 'react-redux'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { SectionCard, SectionTitle, SectionHint, FormGroup } from '../../GlobalSettings.styles'
import RepeatingList from '../RepeatingList'

function FaqSection({ items, onChange, onAdd, onRemove }) {
  const loading = useSelector((state) => state.constant.loading.isGetListConstantsLoading)

  return (
    <SectionCard>
      <SectionTitle>FAQ</SectionTitle>
      <SectionHint>
        Pertanyaan pertama terbuka secara default di landing page. Kalau daftarnya
        kosong, FAQ default yang dipakai.
      </SectionHint>

      <RepeatingList
        items={items}
        label="FAQ"
        addLabel="Tambah FAQ"
        onAdd={onAdd}
        onRemove={onRemove}
      >
        {(item, index) => (
          <>
            <FormGroup>
              <TextInput
                label="Pertanyaan"
                placeholder="Apakah MedPal bisa dipakai gratis?"
                value={item.question}
                onChange={(e) => onChange(index, 'question', e.target.value)}
                disabled={loading}
              />
            </FormGroup>

            <FormGroup>
              <Textarea
                label="Jawaban"
                placeholder="Jawaban lengkap untuk pertanyaan di atas."
                value={item.answer}
                onChange={(e) => onChange(index, 'answer', e.target.value)}
                disabled={loading}
                rows={4}
              />
            </FormGroup>
          </>
        )}
      </RepeatingList>
    </SectionCard>
  )
}

export default FaqSection
