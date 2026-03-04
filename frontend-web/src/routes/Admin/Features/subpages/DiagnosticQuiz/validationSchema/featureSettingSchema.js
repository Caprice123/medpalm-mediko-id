import * as Yup from 'yup'

export const featureSettingSchema = Yup.object({
    diagnostic_feature_title: Yup.string().required("Judul fitur diagnostik harus diisi"),
    diagnostic_feature_description: Yup.string().required("Deskripsi fitur diagnostik harus diisi"),
    diagnostic_is_active: Yup.boolean().required("Status fitur diagnostik harus diisi"),
    diagnostic_access_type: Yup.string().required("Tipe akses fitur diagnostik harus diisi"),
    diagnostic_credit_cost: Yup.number().when("diagnostic_access_type", {
        is: "credit",
        then: Yup.number().required("Biaya kredit fitur diagnostik harus diisi"),
    }),
})