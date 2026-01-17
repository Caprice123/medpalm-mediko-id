
import * as Yup from 'yup'
export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Nama grup observasi harus diisi')
    .min(3, 'Nama grup harus minimal 3 karakter'),
  order: Yup.number()
    .integer('Urutan harus berupa angka')
    .min(0, 'Urutan tidak boleh negatif')
})