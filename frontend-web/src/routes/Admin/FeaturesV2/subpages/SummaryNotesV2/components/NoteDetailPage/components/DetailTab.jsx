import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import { FormSection, Label, StatusToggle, StatusOption, SaveRow } from '../NoteDetailPage.styles'

function DetailTab({ form, isLoading, isSaving }) {
  if (isLoading) {
    return <p style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem' }}>Memuat...</p>
  }

  return (
    <>
      <FormSection>
        <TextInput
          label="Judul"
          required
          value={form.values.title}
          onChange={e => form.setFieldValue('title', e.target.value)}
          placeholder="Masukkan judul ringkasan"
          error={form.errors.title}
        />
      </FormSection>

      <FormSection>
        <Textarea
          label="Deskripsi"
          value={form.values.description}
          onChange={e => form.setFieldValue('description', e.target.value)}
          placeholder="Deskripsi singkat tentang ringkasan ini"
          rows={3}
        />
      </FormSection>

      <FormSection>
        <Label>Status</Label>
        <StatusToggle>
          {['draft', 'testing', 'published'].map(s => (
            <StatusOption key={s} $checked={form.values.status === s}>
              <input
                type="radio"
                name="note-status"
                value={s}
                checked={form.values.status === s}
                onChange={() => form.setFieldValue('status', s)}
              />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </StatusOption>
          ))}
        </StatusToggle>
      </FormSection>

      <SaveRow>
        <Button variant="primary" onClick={form.handleSubmit} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Detail'}
        </Button>
      </SaveRow>
    </>
  )
}

export default DetailTab
