import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import Modal from '@components/common/Modal'
import { updateObservationGroup } from '@store/oscePractice/adminAction'
import {
  FormSection,
  Label,
  Input,
  Button,
  HelpText,
  ErrorText,
} from './UpdateObservationGroupModal.styles'
import { validationSchema } from './validationSchema'


function UpdateObservationGroupModal({ group, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.oscePractice)

  const form = useFormik({
    initialValues: {
      name: group?.name || '',
      order: group?.order || 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        order: parseInt(values.order)
      }

      dispatch(updateObservationGroup(group.id, payload, () => {
        onClose()
      }))
    }
  })

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Observation Group"
      size="medium"
    >
      <form onSubmit={form.handleSubmit}>
        <FormSection>
          <Label>Nama Group *</Label>
          <Input
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
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
            disabled={loading.isUpdatingTopic}
          >
            {loading.isUpdatingTopic ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default UpdateObservationGroupModal
