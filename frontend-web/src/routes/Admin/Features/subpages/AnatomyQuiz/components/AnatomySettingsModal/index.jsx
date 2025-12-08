import { useSelector } from 'react-redux'
import Dropdown from '@components/common/Dropdown'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  Input,
  HintText,
  ToggleSwitch,
  ToggleSlider,
  ModalFooter,
  Button,
  LoadingSpinner
} from './AnatomySettingsModal.styles'

function AnatomySettingsModal({ isOpen, form, onClose }) {
    const { loading } = useSelector(state => state.anatomy)

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pengaturan Fitur Quiz Anatomi</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading.isConstantsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>Memuat pengaturan...</div>
            </div>
          ) : (
            <>
              <FormGroup>
                <Label>Status Fitur</Label>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={form.values.anatomy_is_active}
                    onChange={(e) => form.setFieldValue('anatomy_is_active', e.target.checked)}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
                <HintText>Aktifkan atau nonaktifkan fitur quiz anatomi</HintText>
              </FormGroup>

              <FormGroup>
                <Label>Judul Fitur</Label>
                <Input
                  type="text"
                  placeholder="Quiz Anatomi"
                  value={form.values.anatomy_feature_title}
                  onChange={(e) => form.setFieldValue('anatomy_feature_title', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi Fitur</Label>
                <Input
                  type="text"
                  placeholder="Deskripsi singkat"
                  value={form.values.anatomy_feature_description}
                  onChange={(e) => form.setFieldValue('anatomy_feature_description', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Tipe Akses</Label>
                <Dropdown
                  options={[
                    { value: 'free', label: 'Gratis' },
                    { value: 'credits', label: 'Credits' },
                    { value: 'subscription', label: 'Subscription' },
                    { value: 'subscription_and_credits', label: 'Subscription & Credits' }
                  ]}
                  value={{
                    value: form.values.anatomy_access_type,
                    label: form.values.anatomy_access_type === 'free' ? 'Gratis' :
                           form.values.anatomy_access_type === 'credits' ? 'Credits' :
                           form.values.anatomy_access_type === 'subscription' ? 'Subscription' :
                           'Subscription & Credits'
                  }}
                  onChange={(option) => form.setFieldValue('anatomy_access_type', option.value)}
                />
              </FormGroup>

              {(form.values.anatomy_access_type === 'credits' || form.values.anatomy_access_type === 'subscription_and_credits') && (
                <FormGroup>
                  <Label>Kredit per Quiz</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.values.anatomy_credit_cost}
                    onChange={(e) => form.setFieldValue('anatomy_credit_cost', e.target.value)}
                  />
                </FormGroup>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={form.isUpdatingConstants}>
            Batal
          </Button>
          <Button variant="primary" onClick={form.handleSubmit} disabled={loading || form.isUpdatingConstants}>
            {form.isUpdatingConstants ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default AnatomySettingsModal
