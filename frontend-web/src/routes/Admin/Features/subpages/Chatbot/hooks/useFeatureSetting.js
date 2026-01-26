import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchConstants, updateConstants } from "@/store/constant/action"
import { actions } from "@store/constant/reducer"

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      // Basic Settings
      chatbot_feature_title: 'Chat Assistant',
      chatbot_feature_description: 'Multi-mode AI chatbot dengan percakapan bertopik',
      chatbot_access_type: 'subscription',
      chatbot_is_active: true,

      // Normal Mode
      chatbot_normal_enabled: true,
      chatbot_normal_model: 'gemini-2.5-flash',
      chatbot_normal_cost: '5',
      chatbot_normal_last_message_count: '10',
      chatbot_normal_prompt: 'Kamu adalah asisten AI medis yang membantu mahasiswa kedokteran dan profesional kesehatan. Berikan jawaban yang informatif, akurat, dan mudah dipahami.',
      chatbot_normal_message_count: '0',
      
      // Validated Search Mode
      chatbot_validated_enabled: true,
      chatbot_validated_model: 'gemini-2.5-flash',
      chatbot_validated_embedding_model: "gemini-embedding-001",
      chatbot_validated_cost: '8',
      chatbot_validated_last_message_count: '10',
      chatbot_validated_system_prompt: 'Kamu harus HANYA menggunakan informasi dari summary notes yang diberikan sebagai konteks. Selalu sertakan sitasi [1], [2] dll untuk sumber yang kamu gunakan. Jika informasi tidak ada di konteks, katakan bahwa kamu tidak memiliki informasi tersebut.',
      chatbot_validated_search_count: '5',
      chatbot_validated_threshold: '0.3',
      chatbot_validated_message_count: '0',
      chatbot_validated_rewrite_enabled: true,
      chatbot_validated_rewrite_prompt: 'Kamu adalah asisten yang membantu mereformulasi pertanyaan pengguna agar lebih jelas dan spesifik untuk pencarian informasi. Tulis ulang pertanyaan dengan menambahkan konteks dari riwayat percakapan jika pertanyaan tidak jelas atau menggunakan kata ganti.',

      // Research Mode
      chatbot_research_enabled: true,
      chatbot_research_model: 'sonar',
      chatbot_research_cost: '15',
      chatbot_research_last_message_count: '10',
      chatbot_research_api_key: '',
      chatbot_research_system_prompt: 'Berikan jawaban berbasis riset medis dengan sitasi dari sumber terpercaya. Prioritaskan jurnal ilmiah dan guidelines medis terbaru.',
      chatbot_research_max_sources: '5',
      chatbot_research_message_count: '0',
      chatbot_research_trusted_domains: 'pubmed.ncbi.nlm.nih.gov,sciencedirect.com,thelancet.com,nejm.org,bmj.com,who.int,cdc.gov,nih.gov,nature.com,science.org',
      chatbot_research_domain_filter_enabled: true,
      chatbot_research_recency_filter: 'month',
      chatbot_research_time_filter_type: 'recency',
      chatbot_research_published_after: '',
      chatbot_research_published_before: '',
      chatbot_research_updated_after: '',
      chatbot_research_updated_before: ''
    },
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          chatbot_is_active: String(values.chatbot_is_active),
          chatbot_normal_enabled: String(values.chatbot_normal_enabled),
          chatbot_validated_enabled: String(values.chatbot_validated_enabled),
          chatbot_validated_rewrite_enabled: String(values.chatbot_validated_rewrite_enabled),
          chatbot_research_enabled: String(values.chatbot_research_enabled),
          chatbot_research_domain_filter_enabled: String(values.chatbot_research_domain_filter_enabled)
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
        'chatbot_feature_title',
        'chatbot_feature_description',
        'chatbot_access_type',
        'chatbot_is_active',
        'chatbot_normal_enabled',
        'chatbot_normal_model',
        'chatbot_normal_cost',
        'chatbot_normal_last_message_count',
        'chatbot_normal_prompt',
        'chatbot_normal_message_count',
        'chatbot_validated_enabled',
        'chatbot_validated_model',
        'chatbot_validated_embedding_model',
        'chatbot_validated_cost',
        'chatbot_validated_last_message_count',
        'chatbot_validated_system_prompt',
        'chatbot_validated_search_count',
        'chatbot_validated_threshold',
        'chatbot_validated_message_count',
        'chatbot_validated_rewrite_enabled',
        'chatbot_validated_rewrite_prompt',
        'chatbot_research_enabled',
        'chatbot_research_model',
        'chatbot_research_cost',
        'chatbot_research_last_message_count',
        'chatbot_research_api_key',
        'chatbot_research_system_prompt',
        'chatbot_research_max_sources',
        'chatbot_research_message_count',
        'chatbot_research_trusted_domains',
        'chatbot_research_domain_filter_enabled',
        'chatbot_research_recency_filter',
        'chatbot_research_time_filter_type',
        'chatbot_research_published_after',
        'chatbot_research_published_before',
        'chatbot_research_updated_after',
        'chatbot_research_updated_before'
      ]

      try {
        dispatch(actions.updateFilter({ key: "keys", value: keys }))
        const constants = await dispatch(fetchConstants(keys))

        // Convert string boolean to actual boolean for toggle switches
        const formattedConstants = {
          ...constants,
          chatbot_is_active: constants.chatbot_is_active === 'true',
          chatbot_normal_enabled: constants.chatbot_normal_enabled === 'true',
          chatbot_validated_enabled: constants.chatbot_validated_enabled === 'true',
          chatbot_validated_rewrite_enabled: constants.chatbot_validated_rewrite_enabled === 'true',
          chatbot_research_enabled: constants.chatbot_research_enabled === 'true',
          chatbot_research_domain_filter_enabled: constants.chatbot_research_domain_filter_enabled === 'true'
        }

        form.setValues(formattedConstants)
      } catch (error) {
        console.error('Failed to load chatbot constants:', error)
      }
    }
    onLoad()
  }, [])

  return {
    form,
  }
}
