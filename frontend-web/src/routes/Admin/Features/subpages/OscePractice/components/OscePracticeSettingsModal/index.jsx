import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Dropdown from '@components/common/Dropdown'
import ModelDropdown from '@components/common/ModelDropdown'
import Modal from '@components/common/Modal'
import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { FormGroup, HintText, Label, ToggleSlider, ToggleSwitch } from './OscePracticeSettingsModal.styles'
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@/store/constant/reducer"

function OscePracticeSettingsModal({ onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.oscePractice)

  const form = useFormik({
    initialValues: {
      osce_practice_is_active: 'true',
      osce_practice_feature_title: 'OSCE Practice',
      osce_practice_feature_description: 'Practice clinical scenarios with AI assessment',
      osce_practice_access_type: 'credits',
      osce_practice_credit_cost: '5',
      osce_practice_default_model: 'gemini-1.5-pro',
      osce_practice_chat_completion_prompt: '',
      osce_practice_chunk_analysis_prompt: '',
      osce_practice_evaluation_prompt: ''
    },
    onSubmit: async (values) => {
      const constantsToSave = {
          ...values,
          osce_practice_is_active: String(values.osce_practice_is_active)
      }
      await dispatch(updateConstants(constantsToSave))
      onClose()
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      const keys = [
        "osce_practice_feature_title",
        "osce_practice_feature_description",
        "osce_practice_access_type",
        "osce_practice_credit_cost",
        "osce_practice_is_active",
        "osce_practice_default_model",
        "osce_practice_chat_completion_prompt",
        "osce_practice_chunk_analysis_prompt",
        "osce_practice_evaluation_prompt"
      ]
      dispatch(actions.updateFilter({ key: "keys", value: keys }))
      const constants = await dispatch(fetchConstants())

      // Convert string boolean to actual boolean for toggle switch
      const formattedConstants = {
        ...constants,
        osce_practice_is_active: constants.osce_practice_is_active === 'true'
      }

      form.setValues(formattedConstants)
    }
    onLoad()
  }, [])

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="OSCE Practice - Feature Settings"
      size="large"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isUpdatingTopic}
          >
            {loading.isUpdatingTopic ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </>
      }
    >
      <FormGroup>
        <Label>Status Fitur</Label>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={String(form.values.osce_practice_is_active) === 'true'}
            onChange={(e) => form.setFieldValue('osce_practice_is_active', e.target.checked ? 'true' : 'false')}
          />
          <ToggleSlider />
        </ToggleSwitch>
        <HintText>Aktifkan atau nonaktifkan fitur OSCE Practice</HintText>
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Judul Fitur"
          placeholder="OSCE Practice"
          value={form.values.osce_practice_feature_title}
          onChange={(e) => form.setFieldValue('osce_practice_feature_title', e.target.value)}
          error={form.errors.osce_practice_feature_title}
        />
      </FormGroup>

      <FormGroup>
        <TextInput
          label="Deskripsi Fitur"
          placeholder="Practice clinical scenarios with AI assessment"
          value={form.values.osce_practice_feature_description}
          onChange={(e) => form.setFieldValue('osce_practice_feature_description', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Dropdown
          label="Tipe Akses"
          options={[
            { value: 'free', label: 'Gratis' },
            { value: 'credits', label: 'Credits' },
            { value: 'subscription', label: 'Subscription' },
            { value: 'subscription_and_credits', label: 'Subscription & Credits' }
          ]}
          value={{
            value: form.values.osce_practice_access_type,
            label: form.values.osce_practice_access_type === 'free' ? 'Gratis' :
                    form.values.osce_practice_access_type === 'credits' ? 'Credits' :
                    form.values.osce_practice_access_type === 'subscription' ? 'Subscription' :
                    'Subscription & Credits'
          }}
          onChange={(option) => form.setFieldValue('osce_practice_access_type', option.value)}
        />
      </FormGroup>

      {(form.values.osce_practice_access_type === 'credits' || form.values.osce_practice_access_type === 'subscription_and_credits') && (
        <FormGroup>
          <TextInput
            label="Kredit per Praktek"
            placeholder="5"
            type="number"
            value={form.values.osce_practice_credit_cost}
            onChange={(e) => form.setFieldValue('osce_practice_credit_cost', e.target.value)}
            error={form.errors.osce_practice_credit_cost}
          />
          <HintText>Jumlah kredit yang dibutuhkan per sesi praktek OSCE</HintText>
        </FormGroup>
      )}
      
      <FormGroup>
        <Textarea
          label="Prompt untuk Chat Completion"
          placeholder="Masukkan Prompt untuk Chat Completion"
          value={form.values.osce_practice_chat_completion_prompt}
          onChange={(e) => form.setFieldValue('osce_practice_chat_completion_prompt', e.target.value)}
          style={{ minHeight: '200px' }}
        />
      </FormGroup>

      
      <FormGroup>
        <Textarea
          label="Prompt untuk Chunk Analyser"
          placeholder="Masukkan Prompt untuk Chunk Analyser"
          value={form.values.osce_practice_chunk_analysis_prompt}
          onChange={(e) => form.setFieldValue('osce_practice_chunk_analysis_prompt', e.target.value)}
          style={{ minHeight: '200px' }}
        />
      </FormGroup>

      
      <FormGroup>
        <Textarea
          label="Prompt untuk Final Analyser"
          placeholder="Masukkan Prompt untuk Final Analyser"
          value={form.values.osce_practice_evaluation_prompt}
          onChange={(e) => form.setFieldValue('osce_practice_evaluation_prompt', e.target.value)}
          style={{ minHeight: '200px' }}
        />
      </FormGroup>
    </Modal>
  )
}

export default OscePracticeSettingsModal
