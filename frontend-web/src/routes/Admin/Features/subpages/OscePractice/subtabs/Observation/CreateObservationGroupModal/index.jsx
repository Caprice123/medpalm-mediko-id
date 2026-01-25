import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import Modal from '@components/common/Modal'
import { createObservationGroup } from '@store/oscePractice/adminAction'
import {
  FormSection,
  Label,
  Input,
  HelpText,
  ErrorText,
} from './CreateObservationGroupModal.styles'
import Button from '@components/common/Button'
import { validationSchema } from './validationSchema'


function CreateObservationGroupModal({ onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.oscePractice)

  const form = useFormik({
    initialValues: {
      name: '',
      order: 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        order: parseInt(values.order)
      }

      dispatch(createObservationGroup(payload, () => {
        onClose()
      }))
    }
  })

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Buat Observation Group Baru"
      size="medium"
    >
      <form onSubmit={form.handleSubmit}>
        <FormSection>
          <Label>Nama Group *</Label>
          <Input
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="e.g., LABORATORIUM, ANAMNESIS"
          />
          {form.touched.name && form.errors.name && (
            <ErrorText>{form.errors.name}</ErrorText>
          )}
          <HelpText>
            Nama grup observasi, misalnya: LABORATORIUM, ANAMNESIS, PEMERIKSAAN FISIK
          </HelpText>
        </FormSection>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading.isCreatingTopic}
          >
            {loading.isCreatingTopic ? 'Membuat...' : 'Buat Group'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateObservationGroupModal
