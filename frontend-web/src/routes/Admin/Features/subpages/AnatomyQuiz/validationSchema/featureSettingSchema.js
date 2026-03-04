import * as Yup from 'yup'

export const featureSettingSchema = Yup.object({
    anatomy_feature_title: Yup.string().required("Judul fitur diagnostik harus diisi"),
    anatomy_feature_description: Yup.string().required("Deskripsi fitur diagnostik harus diisi"),
    anatomy_is_active: Yup.boolean().required("Status fitur diagnostik harus diisi"),
    anatomy_access_type: Yup.string().required("Tipe akses fitur diagnostik harus diisi"),
    anatomy_credit_cost: Yup.number().when("anatomy_access_type", {
        is: "credit",
        then: Yup.number().required("Biaya kredit fitur diagnostik harus diisi"),
    }),
})