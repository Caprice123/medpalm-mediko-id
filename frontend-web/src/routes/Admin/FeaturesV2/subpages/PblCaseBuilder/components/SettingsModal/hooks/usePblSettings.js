import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { fetchConstants, updateConstants } from '@store/constant/action'
import { actions } from '@store/constant/reducer'

// The feature's own title, description, switch and billing stay on the keys the
// Skripsi Builder has always used — one setting, one key, however many versions
// read it. Everything below them is V2's own.
const FEATURE_KEYS = [
  'skripsi_is_active',
  'skripsi_feature_title',
  'skripsi_feature_description',
  'skripsi_access_type',
]

const PBL_KEYS = [
  'pbl_ai_chat_enabled',
  'pbl_ai_chat_cost',
  'pbl_ai_chat_model',
  'pbl_ai_chat_prompt',
  'pbl_ai_edit_enabled',
  'pbl_ai_edit_cost',
  'pbl_ai_edit_model',
  'pbl_ai_edit_rewrite_prompt',
  'pbl_ai_edit_draft_prompt',
  'pbl_searcher_enabled',
  'pbl_searcher_cost',
  'pbl_searcher_max_results',
  'pbl_diagram_enabled',
  'pbl_diagram_cost',
  'pbl_diagram_image_model',
  'pbl_diagram_prompt',
]

const ALL_KEYS = [...FEATURE_KEYS, ...PBL_KEYS]

// Constants are stored as strings, so the three switches are converted on the
// way in and back on the way out.
const BOOLEAN_KEYS = [
  'skripsi_is_active',
  'pbl_ai_chat_enabled',
  'pbl_ai_edit_enabled',
  'pbl_searcher_enabled',
  'pbl_diagram_enabled',
]

const toBooleans = (constants) => Object.fromEntries(
  BOOLEAN_KEYS.map(key => [key, constants[key] === 'true'])
)

const toStrings = (values) => Object.fromEntries(
  BOOLEAN_KEYS.map(key => [key, String(values[key])])
)

export const usePblSettings = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      skripsi_is_active: true,
      skripsi_feature_title: '',
      skripsi_feature_description: '',
      skripsi_access_type: 'subscription_and_credits',
      pbl_ai_chat_enabled: true,
      pbl_ai_chat_cost: '0',
      pbl_ai_chat_model: 'gemini-2.5-flash',
      pbl_ai_chat_prompt: '',
      pbl_ai_edit_enabled: true,
      pbl_ai_edit_cost: '0',
      pbl_ai_edit_model: 'gemini-2.5-flash',
      pbl_ai_edit_rewrite_prompt: '',
      pbl_ai_edit_draft_prompt: '',
      pbl_searcher_enabled: true,
      pbl_searcher_cost: '0',
      pbl_searcher_max_results: '10',
      pbl_diagram_enabled: true,
      pbl_diagram_cost: '0',
      pbl_diagram_image_model: 'gemini-2.5-flash-image',
      pbl_diagram_prompt: '',
    },
    onSubmit: async (values) => {
      await dispatch(updateConstants({ ...values, ...toStrings(values) }, onClose))
    },
  })

  useEffect(() => {
    const load = async () => {
      dispatch(actions.updateFilter({ key: 'keys', value: ALL_KEYS }))
      const constants = await dispatch(fetchConstants())

      form.setValues({ ...form.values, ...constants, ...toBooleans(constants) })
    }

    load()
    // Re-running on every keystroke would throw away what is being typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return { form }
}
