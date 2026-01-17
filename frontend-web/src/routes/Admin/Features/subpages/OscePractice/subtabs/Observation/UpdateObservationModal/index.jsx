import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Modal from '@components/common/Modal'
import { updateObservation } from '@store/oscePractice/adminAction'
import {
  FormSection,
  Label,
  Input,
  Select,
  Button,
  HelpText,
  ErrorText,
} from './UpdateObservationModal.styles'
import { validationSchema } from './validationSchema'

function UpdateObservationModal({ observation, onClose }) {
  const dispatch = useDispatch()
  const { observations, loading } = useSelector(state => state.oscePractice)

  const form = useFormik({
    initialValues: {
      groupId: observation?.groupId || '',
      name: observation?.name || '',
      order: observation?.order || 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        groupId: parseInt(values.groupId),
        name: values.name,
        order: parseInt(values.order)
      }

      dispatch(updateObservation(observation.id, payload, () => {
        onClose()
      }))
    }
  })

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Observasi"
      size="medium"
    >
      <form onSubmit={form.handleSubmit}>
        <FormSection>
          <Label>Grup Observasi *</Label>
          <Select
            name="groupId"
            value={form.values.groupId}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          >
            <option value="">Pilih Grup...</option>
            {observations && observations.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </Select>
          {form.touched.groupId && form.errors.groupId && (
            <ErrorText>{form.errors.groupId}</ErrorText>
          )}
          <HelpText>
            Pilih grup di mana observasi ini akan ditambahkan
          </HelpText>
        </FormSection>

        <FormSection>
          <Label>Nama Observasi *</Label>
          <Input
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="e.g., ASTO, Analisis LCS"
          />
          {form.touched.name && form.errors.name && (
            <ErrorText>{form.errors.name}</ErrorText>
          )}
          <HelpText>
            Nama observasi yang akan muncul dalam daftar
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

export default UpdateObservationModal
