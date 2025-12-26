import { useFormik } from "formik"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchConstants, updateConstants } from "@/store/constant/action"

export const useFeatureSetting = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      // Basic Information
      skripsi_builder_title: 'Skripsi Builder',
      skripsi_builder_description: 'AI-powered skripsi writing assistant dengan multiple tabs untuk research, paraphrasing, dan diagram building',

      // AI Researcher
      ai_researcher_enabled: true,
      ai_researcher_max_tabs: '3',
      ai_researcher_model: 'gemini-2.5-flash',
      ai_researcher_credits: '1',
      ai_researcher_system_prompt: 'Kamu adalah AI Research Assistant yang membantu mahasiswa dalam menulis skripsi. Tugasmu adalah melakukan research mendalam, memberikan informasi yang akurat dan terstruktur, serta menyertakan referensi yang relevan. Selalu gunakan bahasa Indonesia yang baik dan formal.',

      // Paraphraser
      paraphraser_enabled: true,
      paraphraser_model: 'gemini-2.5-flash',
      paraphraser_credits: '1',
      paraphraser_system_prompt: 'Kamu adalah AI Paraphraser yang membantu mahasiswa menulis ulang teks dengan bahasa yang berbeda namun tetap mempertahankan makna asli. Gunakan bahasa Indonesia yang baik, formal, dan akademis. Pastikan hasil paraphrase bebas dari plagiarisme.',

      // Diagram Builder
      diagram_builder_enabled: true,
      diagram_builder_model: 'gemini-2.5-flash',
      diagram_builder_credits: '1',
      diagram_builder_system_prompt: 'Kamu adalah AI Diagram Builder yang membantu mahasiswa membuat diagram dan visualisasi untuk skripsi mereka. Buatlah diagram yang jelas, informatif, dan mudah dipahami. Gunakan format yang sesuai dengan standar akademis.'
    },
    onSubmit: async (values) => {
      try {
        // Convert boolean to string for backend
        const constantsToSave = {
          ...values,
          ai_researcher_enabled: String(values.ai_researcher_enabled),
          paraphraser_enabled: String(values.paraphraser_enabled),
          diagram_builder_enabled: String(values.diagram_builder_enabled)
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
        'skripsi_builder_title',
        'skripsi_builder_description',
        'ai_researcher_enabled',
        'ai_researcher_max_tabs',
        'ai_researcher_model',
        'ai_researcher_credits',
        'ai_researcher_system_prompt',
        'paraphraser_enabled',
        'paraphraser_model',
        'paraphraser_credits',
        'paraphraser_system_prompt',
        'diagram_builder_enabled',
        'diagram_builder_model',
        'diagram_builder_credits',
        'diagram_builder_system_prompt'
      ]

      try {
        const constants = await dispatch(fetchConstants(keys))

        // Convert string boolean to actual boolean for toggle switches
        const formattedConstants = {
          ...constants,
          ai_researcher_enabled: constants.ai_researcher_enabled === 'true',
          paraphraser_enabled: constants.paraphraser_enabled === 'true',
          diagram_builder_enabled: constants.diagram_builder_enabled === 'true'
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
