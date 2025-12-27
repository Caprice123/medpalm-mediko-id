import * as Yup from 'yup'

export const exerciseFeatureSettingSchema = Yup.object({
    exercise_feature_title: Yup.string().required("Judul fitur harus diisi"),
    exercise_feature_description: Yup.string().required("Deskripsi fitur harus diisi"),
    exercise_is_active: Yup.boolean().required("Status fitur harus diisi"),
    exercise_access_type: Yup.string().required("Tipe akses fitur harus diisi"),
    exercise_credit_cost: Yup.number().when("exercise_access_type", {
        is: "credit",
        then: Yup.number().required("Biaya kredit fitur harus diisi"),
    }),
    exercise_generation_model: Yup.string().required("Jenis model AI harus diisi"),
    exercise_generation_prompt_text_based: Yup.string().required("Prompt AI (dengan text) untuk generate harus diisi"),
    exercise_generation_prompt_document_based: Yup.string().required("Prompt AI (dengan dokumen) untuk generate harus diisi")
})
