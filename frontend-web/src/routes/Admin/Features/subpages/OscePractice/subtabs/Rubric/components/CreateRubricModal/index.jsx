import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import { createOsceRubric } from '@store/oscePractice/adminAction'
import { FormSection } from './CreateRubricModal.styles'

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nama rubrik wajib diisi')
    .min(3, 'Nama rubrik minimal 3 karakter'),
  content: Yup.string()
    .required('Konten rubrik wajib diisi')
    .min(10, 'Konten rubrik minimal 10 karakter'),
})

function CreateRubricModal({ onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.oscePractice)

  const form = useFormik({
    initialValues: {
      name: '',
      content: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(createOsceRubric(values, () => {
        onClose()
      }))
    },
  })

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Buat Rubrik Baru"
      size="large"
    >
      <form onSubmit={form.handleSubmit}>
        <FormSection>
          <TextInput
            label="Nama Rubrik"
            required
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="e.g., Rubrik OSCE Kardiovaskular"
            error={form.touched.name && form.errors.name}
            hint="Nama unik untuk rubrik evaluasi ini"
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Konten Rubrik"
            required
            name="content"
            value={form.values.content}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="Masukkan kriteria evaluasi, bobot penilaian, dan panduan rubrik..."
            rows={20}
            error={form.touched.content && form.errors.content}
            hint="Konten lengkap rubrik yang akan digunakan untuk evaluasi OSCE. Sertakan kriteria penilaian, bobot, dan panduan detail."
            style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
        </FormSection>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading.isCreatingRubric}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading.isCreatingRubric || !form.isValid}
          >
            {loading.isCreatingRubric ? 'Menyimpan...' : 'Simpan Rubrik'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateRubricModal
