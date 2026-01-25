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
  RequiredMark,
  Input,
  GroupDisplay,
  HintText,
  ErrorText,
  ModalFooter,
  LoadingSpinner,
  EmptyState
} from './TagModal.styles'
import Button from '@components/common/Button'

function TagModal({ isOpen, mode, isLoading, formik, onClose, onSubmit }) {
  const { tagGroups, loading } = useSelector(state => state.tagGroups)

  if (!isOpen) return null

  const isCreateMode = mode === "create"
  const hasTagGroups = tagGroups && tagGroups.length > 0

  const tagGroupOptions = tagGroups.map(group => ({
    value: JSON.stringify({ name: group.name }),
    label: group.name.toUpperCase()
  }))

  const nameError = formik.touched.name && formik.errors.name
  const tagGroupError = formik.touched.tagGroup && formik.errors.tagGroup
  console.log(formik.values)

  return (
    <Overlay onClick={!isLoading ? onClose : undefined}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {isCreateMode ? 'Tambah Tag' : 'Edit Tag'}
          </ModalTitle>
          <CloseButton onClick={onClose} disabled={isLoading}>
            ×
          </CloseButton>
        </ModalHeader>

        <form onSubmit={onSubmit}>
          <ModalBody>
            <FormGroup>
              <Label>
                Grup Tag <RequiredMark>*</RequiredMark>
              </Label>

              {isCreateMode ? (
                <>
                  {loading.isGetListTagGroupsLoading ? (
                    <GroupDisplay>
                      <LoadingSpinner small />
                      <span>Memuat...</span>
                    </GroupDisplay>
                  ) : !hasTagGroups ? (
                    <EmptyState>
                      Tidak ada grup tag tersedia
                    </EmptyState>
                  ) : (
                    <Dropdown
                      options={tagGroupOptions}
                      value={formik.values.tagGroup}
                      onChange={(option) => {
                        formik.setFieldValue('tagGroup', option)
                        formik.setFieldTouched('tagGroup', true)
                      }}
                      placeholder="Pilih grup tag"
                      disabled={true}
                      hasError={!!tagGroupError}
                    />
                  )}
                </>
              ) : (
                <GroupDisplay>
                  {formik.values.tagGroup
                    ? JSON.parse(formik.values.tagGroup.value).name.toUpperCase()
                    : 'N/A'}
                </GroupDisplay>
              )}

              {tagGroupError && <ErrorText>{tagGroupError}</ErrorText>}
              {!tagGroupError && (
                <HintText>
                  {isCreateMode
                    ? 'Pilih grup untuk mengelompokkan tag'
                    : 'Grup tag tidak dapat diubah'}
                </HintText>
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                Nama Tag <RequiredMark>*</RequiredMark>
              </Label>
              <Input
                type="text"
                name="name"
                value={formik.values.name || ''}
                onChange={(e) => {
                  formik.handleChange(e)
                  formik.setFieldTouched('name', true)
                }}
                onBlur={formik.handleBlur}
                placeholder="Contoh: UI, SEMESTER 1, KARDIO"
                disabled={isLoading || !hasTagGroups}
                autoFocus={isCreateMode && hasTagGroups}
                hasError={!!nameError}
              />
              {nameError && <ErrorText>{nameError}</ErrorText>}
              {!nameError && (
                <HintText>
                  Nama tag akan dikonversi ke huruf besar
                </HintText>
              )}
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !hasTagGroups || !formik.values.name?.trim()}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  {isCreateMode ? 'Menambahkan...' : 'Menyimpan...'}
                </>
              ) : (
                isCreateMode ? 'Tambah' : 'Simpan'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  )
}

export default TagModal
