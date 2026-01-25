import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@store/constant/reducer"

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      // Basic Information
      skripsi_feature_title: 'Skripsi Builder',
      skripsi_feature_description: 'Multi-tab AI assistant untuk membantu mahasiswa menyusun skripsi dengan berbagai mode bantuan',
      skripsi_access_type: 'subscription',
      skripsi_is_active: true,

      // AI Researcher
      skripsi_ai_researcher_enabled: true,
      skripsi_ai_researcher_count: '3',
      skripsi_ai_researcher_model: 'gemini-2.0-flash-exp',
      skripsi_ai_researcher_cost: '0',
      skripsi_ai_researcher_context_messages: '10',
      skripsi_ai_researcher_prompt: 'Kamu adalah asisten peneliti AI yang membantu mahasiswa dalam menyusun skripsi.',
      skripsi_ai_researcher_trusted_domains: '',
      skripsi_ai_researcher_domain_filter_enabled: false,
      skripsi_ai_researcher_recency_filter: 'month',
      skripsi_ai_researcher_time_filter_type: 'recency',
      skripsi_ai_researcher_published_after: '',
      skripsi_ai_researcher_published_before: '',
      skripsi_ai_researcher_updated_after: '',
      skripsi_ai_researcher_updated_before: '',

      // Paraphraser
      skripsi_paraphraser_enabled: true,
      skripsi_paraphraser_model: 'gemini-2.0-flash-exp',
      skripsi_paraphraser_cost: '0',
      skripsi_paraphraser_context_messages: '10',
      skripsi_paraphraser_prompt: 'Kamu adalah asisten parafrase akademis yang membantu menulis ulang teks dengan gaya bahasa akademis.',

      // Diagram Builder
      skripsi_diagram_builder_enabled: true,
      skripsi_diagram_builder_model: 'gemini-2.0-flash-exp',
      skripsi_diagram_builder_cost: '0',
      skripsi_diagram_builder_context_messages: '10',
      skripsi_diagram_builder_prompt: 'Kamu adalah asisten visualisasi yang membantu membuat diagram dan visualisasi untuk skripsi.'
    },
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          skripsi_is_active: String(values.skripsi_is_active),
          skripsi_ai_researcher_enabled: String(values.skripsi_ai_researcher_enabled),
          skripsi_ai_researcher_domain_filter_enabled: String(values.skripsi_ai_researcher_domain_filter_enabled),
          skripsi_paraphraser_enabled: String(values.skripsi_paraphraser_enabled),
          skripsi_diagram_builder_enabled: String(values.skripsi_diagram_builder_enabled)
        }
        await dispatch(updateConstants(constantsToSave))
        onClose()
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    }
  })

  useEffect(() => {
    const onLoad = async () => {
      const keys = [
        'skripsi_feature_title',
        'skripsi_feature_description',
        'skripsi_access_type',
        'skripsi_is_active',
        'skripsi_ai_researcher_enabled',
        'skripsi_ai_researcher_count',
        'skripsi_ai_researcher_model',
        'skripsi_ai_researcher_cost',
        'skripsi_ai_researcher_context_messages',
        'skripsi_ai_researcher_prompt',
        'skripsi_ai_researcher_trusted_domains',
        'skripsi_ai_researcher_domain_filter_enabled',
        'skripsi_ai_researcher_recency_filter',
        'skripsi_ai_researcher_time_filter_type',
        'skripsi_ai_researcher_published_after',
        'skripsi_ai_researcher_published_before',
        'skripsi_ai_researcher_updated_after',
        'skripsi_ai_researcher_updated_before',
        'skripsi_paraphraser_enabled',
        'skripsi_paraphraser_model',
        'skripsi_paraphraser_cost',
        'skripsi_paraphraser_context_messages',
        'skripsi_paraphraser_prompt',
        'skripsi_diagram_builder_enabled',
        'skripsi_diagram_builder_model',
        'skripsi_diagram_builder_cost',
        'skripsi_diagram_builder_context_messages',
        'skripsi_diagram_builder_prompt'
      ]

      try {
        dispatch(actions.updateFilter({ key: "keys", value: keys }))
        const constants = await dispatch(fetchConstants(keys))

        // Convert string boolean to actual boolean for toggle switches
        const formattedConstants = {
          ...constants,
          skripsi_is_active: constants.skripsi_is_active === 'true',
          skripsi_ai_researcher_enabled: constants.skripsi_ai_researcher_enabled === 'true',
          skripsi_ai_researcher_domain_filter_enabled: constants.skripsi_ai_researcher_domain_filter_enabled === 'true',
          skripsi_paraphraser_enabled: constants.skripsi_paraphraser_enabled === 'true',
          skripsi_diagram_builder_enabled: constants.skripsi_diagram_builder_enabled === 'true'
        }

        form.setValues(formattedConstants)
      } catch (error) {
        console.error('Failed to load skripsi constants:', error)
      }
    }
    onLoad()
  }, [])

  return {
    form,
  }
}
