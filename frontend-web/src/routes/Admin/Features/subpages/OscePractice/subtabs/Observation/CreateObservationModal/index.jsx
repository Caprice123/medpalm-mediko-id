import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import Modal from '@components/common/Modal'
import { createObservation } from '@store/oscePractice/adminAction'
import {
  FormSection,
  Label,
  Input,
  Select,
  HelpText,
  ErrorText,
} from './CreateObservationModal.styles'
import Button from "@components/common/Button"
import Dropdown from '@components/common/Dropdown'
import { fetchAdminOsceObservations } from '@store/oscePractice/adminAction'
import { validationSchema } from './validationSchema'


function CreateObservationModal({ onClose }) {
  const dispatch = useDispatch()
  const { observations, loading } = useSelector(state => state.oscePractice)

  const form = useFormik({
    initialValues: {
      groupId: '',
      name: '',
      order: 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = {
        groupId: parseInt(values.groupId),
        name: values.name,
        order: parseInt(values.order)
      }

      dispatch(createObservation(payload, () => {
        dispatch(fetchAdminOsceObservations())
        onClose()
      }))
    }
  })

  const availableObservations = observations.map(group => ({
    value: group.id,
    label: group.name
  }))

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Buat Observasi Baru"
      size="medium"
    >
      <form onSubmit={form.handleSubmit}>
        <FormSection>
          <Label>Grup Observasi *</Label>
          <Dropdown
            options={availableObservations}
            placeholder="Pilih Grup..."
            value={form.values.groupId ? availableObservations.find(opt => opt.value === form.values.groupId) : null}
            onChange={(opt) => form.setFieldValue('groupId', opt?.value)}
          />
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
          <Button onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading.isCreatingTopic}>
            {loading.isCreatingTopic ? 'Membuat...' : 'Buat Observasi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateObservationModal
